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
      setIsSubmitting(true);
      const songData = data.song.map((song) => ({
        name: song.name,
        album: song.album,
        artist: song.artist,
        year: song.year,
        releaseDate: song.releaseDate || song.year,
        image: song.albumImage
      }));
      
      const res = await SongServices.addSong(songData, data.eventCode);
      notifySuccess(res.message);
      // setIsUpdate(true);
      setIsSubmitting(false);
      
    } catch (err) {
      notifyError(err ? err.message : 'Something went wrong!');
      setIsSubmitting(false);
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