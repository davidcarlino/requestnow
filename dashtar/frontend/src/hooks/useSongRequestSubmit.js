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
    console.log("data", data)
    try {
      setIsSubmitting(true);
      let songData = {}
      data.song.map((song) => {
        Object.keys(song).map((value) =>{
          if (value !== "id" && value !== "albumImage"){
            songData[value] = song[value]
          }
          
        })
      })
      console.log("songss", songData)
      const res = await SongServices.addSong(songData, data.eventCode);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
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