import { useForm } from "react-hook-form";
import { useContext, useEffect, useState } from "react";

//internal import
import { notifyError, notifySuccess } from "@/utils/toast";
import EventServices from "@/services/EventServices";
import { SidebarContext } from "@/context/SidebarContext";
import useUtilsFunction from "./useUtilsFunction";

const useEventSubmit = (id) => {
  const { isDrawerOpen, closeDrawer, setIsUpdate, lang } =
    useContext(SidebarContext);
  const {showDateTimeFormat} = useUtilsFunction
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [language, setLanguage] = useState(lang || "en");
  const [resData, setResData] = useState({});
  const [venueId, setVenueId] = useState(null);
  const {
      register,
      handleSubmit,
      watch,
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
    return obj;
  };

  const generateId = (length = 6) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    
    // Ensure exactly 2 letters and 4 numbers
    let result = '';
    
    // Generate 2 random letters
    for (let i = 0; i < 2; i++) {
        const randomIndex = Math.floor(Math.random() * letters.length);
        result += letters[randomIndex];
    }
    
    // Generate 4 random numbers
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * numbers.length);
        result += numbers[randomIndex];
    }
    
    // Shuffle the result to mix letters and numbers
    result = result.split('').sort(() => 0.5 - Math.random()).join('');
    
    return result;
}
  
  const onSubmit = async (data) => {
    console.log("data", data)
      try {
        setIsSubmitting(true);
        const eventData = {
          name: data.name,
          description: data.description,
          startTime: data.startTime,
          endTime: data.endTime,
          location: data.location,
          eventCode: generateId()
        }
        
        if (id) {
          const res = await EventServices.updateEvents(id, eventData, venueId);
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
          window.location.href = `/event/${res.event._id}/dashboard`
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
        setVenueId(res.venue?._id)
        setValue("name", res.name);
        setValue("description", res.description);
        setValue("startTime", new Date(res.startTime).toString().slice(0, 16));
        setValue("endTime", new Date(res.endTime).toISOString().slice(0, 16));
        setValue("location", res.location);
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
    watch,
    errors,
    language,
    isSubmitting,
    onSubmit,
    resData,
    setValue,
    handleSelectLanguage
  }

}
export default useEventSubmit;