import { useForm } from "react-hook-form";
import { useContext, useEffect, useState } from "react";

//internal import
import { notifyError, notifySuccess } from "@/utils/toast";
import EventServices from "@/services/EventServices";
import { SidebarContext } from "@/context/SidebarContext";


const useEventSubmit = (id) => {
  const { isDrawerOpen, closeDrawer, setIsUpdate, lang } =
    useContext(SidebarContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
      register,
      handleSubmit,
      // setValue,
      // clearErrors,
      // formState: { errors },
    } = useForm();

  const handleRemoveEmptyKey = (obj) => {
    for (const key in obj) {
      if (obj[key].trim() === "") {
        delete obj[key];
      }
    }
    // console.log("obj", obj);
    return obj;
  };
  
  const onSubmit = async (data) => {
    console.log("data", data)
      try {
        setIsSubmitting(true);
        const eventData = {
          // name: handleRemoveEmptyKey({
          //   [language]: data.name,
          //   // ...nameTranslates,
          // }),
          name: data.name,
          description: data.description,
          startTime: data.startTime,
          endTime: data.endTime

        }
        console.log("eventdata", eventData)
        
      if (id) {
        const res = await EventServices.updateEvents(id, eventData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
        reset();
      } else {
        const res = await EventServices.addEvent(eventData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
      }
      } catch (err) {
        notifyError(err ? err?.response?.data?.message : err?.message);
        setIsSubmitting(false);
        // closeDrawer();
      }
  }
  
  return {
      register,
      handleSubmit,
      onSubmit
  }

}
export default useEventSubmit;