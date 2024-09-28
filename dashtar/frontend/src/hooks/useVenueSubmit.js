import { useForm } from "react-hook-form";
import { useContext, useEffect, useState } from "react";

//internal import
import { notifyError, notifySuccess } from "@/utils/toast";
import VenueServices from "@/services/VenueServices";
import { SidebarContext } from "@/context/SidebarContext";


const useVenueSubmit = (id) => {
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
    return obj;
  };
  
  const onSubmit = async (data) => {
    console.log("daonSubmitta", data)
    try {
      setIsSubmitting(true);
      const venueData = {
        name: data.name,
        address: data.address,
        contactInfo: data.contactInfo,
        capacity: data.capacity,
        type: data.type
      }
      
      if (id) {
        const res = await VenueServices.updateVenues(id, venueData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
        // reset();
      } 
      // else {
      //   const res = await VenueServices.addEvent(venueData);
      //   setIsUpdate(true);
      //   setIsSubmitting(false);
      //   notifySuccess(res.message);
      //   closeDrawer();
      //   window.location.href = `/event/${res.event._id}/dashboard`
      // }
    } catch (err) {
      notifyError(err ? err?.response?.data?.message : err?.message);
      setIsSubmitting(false);
      // closeDrawer();
    }
  }

  const getVenueData = async () => {
    try {
      const res = await VenueServices.getVenueById(id);
      if (res) {
        setResData(res);
        setValue("name", res.name);
        setValue("address", res.address);
        setValue("contactInfo", res.contactInfo);
        setValue("capacity", res.capacity);
        setValue("type", res.type);
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
      setValue("address");
      setValue("contactInfo");
      setValue("capacity");
      setValue("type");
      clearErrors("name");
      clearErrors("address");
      clearErrors("contactInfo");
      clearErrors("capacity");
      clearErrors("type");
      setLanguage(lang);
      setValue("language", language);
      return;
    }
    if (id) {
      getVenueData();
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
      resData,
      setValue,
      handleSelectLanguage
  }

}
export default useVenueSubmit;