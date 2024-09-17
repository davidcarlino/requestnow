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
  const [language, setLanguage] = useState(lang || "en");
  const [resData, setResData] = useState({});
  const {
      register,
      handleSubmit,
      setValue,
      clearErrors,
      formState: { errors },
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
        // console.log("eventdata", eventData)
        
      if (id) {
        const res = await EventServices.updateEvents(id, eventData);
        console.log("res", res)
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
        // reset();
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

  const getEventData = async () => {
    try {
      const res = await EventServices.getEventById(id);
      if (res) {
        setResData(res);
        setValue("name", res.name);
        setValue("description", res.description);
        setValue("startTime", res.startTime);
        setValue("endTime", res.endTime);
        // setValue("location", res.role);
      }
    } catch (err) {
      notifyError(err ? err?.response?.data?.message : err?.message);
    }
  };
  const handleSelectLanguage = (lang) => {
    setLanguage(lang);

    if (Object.keys(resData).length > 0) {
      setValue("name", resData.name[lang ? lang : "en"]);
    }
  };
  useEffect(() => {
    if (!isDrawerOpen) {
      setResData({});
      setValue("name");
      setValue("description");
      setValue("startTime");
      setValue("endTime");
      setValue("location");
      clearErrors("name");
      clearErrors("description");
      clearErrors("startTime");
      clearErrors("endTime");
      clearErrors("location");
      setLanguage(lang);
      setValue("language", language);
      return;
    }
    if (id) {
      getEventData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, setValue, isDrawerOpen, clearErrors]);
  
  return {
      register,
      handleSubmit,
      errors,
      language,
      isSubmitting,
      onSubmit,
      handleSelectLanguage
  }

}
export default useEventSubmit;