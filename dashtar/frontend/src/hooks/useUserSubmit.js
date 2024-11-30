import dayjs from "dayjs";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";

//internal import
import { AdminContext } from "@/context/AdminContext";
import { SidebarContext } from "@/context/SidebarContext";
import UserServices from "@/services/UserServices";
import { notifyError, notifySuccess } from "@/utils/toast";
// import useTranslationValue from "./useTranslationValue";

const useUserSubmit = (id) => {
  const { state } = useContext(AdminContext);
  const { adminInfo } = state;
  const { isDrawerOpen, closeDrawer, setIsUpdate, lang } =
    useContext(SidebarContext);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    dayjs(new Date()).format("YYYY-MM-DD")
  );
  const [language, setLanguage] = useState(lang || "en");
  const [resData, setResData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const location = useLocation();
  // const { handlerTextTranslateHandler } = useTranslationValue();

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
    try {
      setIsSubmitting(true);

      const userData = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        role: data.role,
        joiningDate: selectedDate
          ? selectedDate
          : dayjs(new Date()).format("YYYY-MM-DD"),
        image: imageUrl,
        lang: language,
      };
      if (id) {
        // console.log('id is ',id)
        const res = await UserServices.updateUser(id, userData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
      } else {
        console.log("userData", userData);
        const res = await UserServices.addUser(userData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
      }
    } catch (err) {
      notifyError(err ? err?.response?.data?.message : err?.message);
      setIsSubmitting(false);
      closeDrawer();
    }
  };

  const getStaffData = async () => {
    try {
      const res = await UserServices.getUserById(id, {
        email: adminInfo.email,
      });
      if (res) {
        setResData(res);
        setValue("name", res.name);
        setValue("email", res.email);
        setValue("password");
        setValue("phone", res.phone);
        setValue("role", res.role);
        setSelectedDate(dayjs(res.joiningData).format("YYYY-MM-DD"));
        setImageUrl(res.image);
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
      setValue("name", "");
      setValue("email", "");
      setValue("password", "");
      setValue("phone", "");
      setValue("role", "");
      setValue("joiningDate", "");
      setImageUrl("");
      clearErrors("name");
      clearErrors("email");
      clearErrors("password");
      clearErrors("phone");
      clearErrors("role");
      clearErrors("joiningDate");
      setLanguage(lang);
      setValue("language", language);
      return;
    }
    if (id) {
      getStaffData();
    } else {
      // Clear form when adding new staff
      setResData({});
      setValue("name", "");
      setValue("email", "");
      setValue("password", "");
      setValue("phone", "");
      setValue("role", "");
      setImageUrl("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, setValue, isDrawerOpen, adminInfo.email, clearErrors]);

  useEffect(() => {
    if (location.pathname === "/edit-profile" && Cookies.get("adminInfo")) {
      getStaffData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, setValue]);

  return {
    register,
    handleSubmit,
    onSubmit,
    language,
    errors,
    setImageUrl,
    imageUrl,
    selectedDate,
    setSelectedDate,
    isSubmitting,
    handleSelectLanguage,
  };
};

export default useUserSubmit;
