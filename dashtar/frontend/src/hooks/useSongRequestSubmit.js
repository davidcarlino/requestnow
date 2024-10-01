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
    console.log("song Request", data)
    try{
      const searchSongs = await SongServices.searchSong(data)
    } catch (err) {

    }
  }
  return {
    register,
    handleSubmit,
    onSubmit,
  }
}
export default useSongRequestSubmit;