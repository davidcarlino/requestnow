import { useForm } from "react-hook-form";
import { useContext, useEffect, useState } from "react";

//internal import
import { notifyError, notifySuccess } from "@/utils/toast";
import LeadsServices from "@/services/LeadsServices";
import { SidebarContext } from "@/context/SidebarContext";
import useUtilsFunction from "./useUtilsFunction";

const useLeadSubmit = (id) => {
  const { isDrawerOpen, closeDrawer, setIsUpdate, lang } = useContext(SidebarContext);
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
  
  const onSubmit = async (data) => {
    console.log("data", data);
    try {
      setIsSubmitting(true);
      const leadData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        service: data.service,
        rating: data.rating,
      };
      
      if (id) {
        const res = await LeadsServices.updateLead(id, leadData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
      } else {
        const res = await LeadsServices.addLead(leadData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
      }
    } catch (err) {
      notifyError(err ? err?.response?.data?.message : err?.message);
      setIsSubmitting(false);
    }
  };
  const getLeadData = async () => {
    try {
      const res = await LeadsServices.getLeadById(id);
      if (res) {
        console.log("Lead data:", res);
        setResData(res);
        setValue("firstName", res.firstName);
        setValue("lastName", res.lastName);
        setValue("email", res.email);
        setValue("phone", res.phone);
        setValue("service", res.service);
        setValue("rating", res.rating);
      }
    } catch (err) {
      notifyError(err ? err?.response?.data?.message : err?.message);
    }
  };

  const handleSelectLanguage = (lang) => {
    setLanguage(lang);

    if (Object.keys(resData).length > 0) {
      setValue("firstName", resData.firstName[lang ? lang : "en"]);
      setValue("lastName", resData.lastName[lang ? lang : "en"]);
    }
  };
  useEffect(() => {
    if (!isDrawerOpen) {
      setResData({});
      setValue("firstName");
      setValue("lastName");
      setValue("email");
      setValue("phone");
      setValue("service");
      setValue("rating");
      clearErrors("firstName");
      clearErrors("lastName");
      clearErrors("email");
      clearErrors("phone");
      clearErrors("service");
      clearErrors("rating");
      setLanguage(lang);
      setValue("language", language);
      return;
    }
    if (id) {
      getLeadData();
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
export default useLeadSubmit;