import { useForm } from "react-hook-form";
import { useContext, useEffect, useState } from "react";

//internal import
import { notifyError, notifySuccess } from "@/utils/toast";
import { SidebarContext } from "@/context/SidebarContext";
import SongServices from "@/services/SongRequestServices";

const useSongRequestSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resData, setResData] = useState({});
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      console.log("datat", data)
      setIsSubmitting(true);
      const songData = data.song.map((song) => ({
        name: song.name,
        album: song.album,
        artist: song.artist,
        year: song.year
      }));
      const res = await SongServices.addSong(songData, data.eventCode);
      console.log("res", res)
      notifySuccess(res.message);
      setIsUpdate(true);
      setIsSubmitting(false);
      
    } catch (err) {
      notifyError(err ? err?.response?.data?.message : err?.message);
      setIsSubmitting(false);
      // closeDrawer();
    }
  }
  return {
    register,
    handleSubmit,
    setValue,
    onSubmit,
  }
}
export default useSongRequestSubmit;