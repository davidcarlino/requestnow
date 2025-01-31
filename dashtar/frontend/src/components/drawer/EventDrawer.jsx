import React, { useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Card, CardBody, Input, Textarea } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";

//internal import
import Title from "@/components/form/others/Title";
import InputArea from "@/components/form/input/InputArea";
import LabelArea from "@/components/form/selectOption/LabelArea";
import useEventSubmit from "@/hooks/useEventSubmit";
import DrawerButton from "@/components/form/button/DrawerButton";
import MapComponent from "@/components/googleMap/googleMap"
import Error from "@/components/form/others/Error";

const EventDrawer = ({ id }) => {
  const {
    register,
    handleSubmit,
    resData,
    errors,
    setValue,
    watch,
    onSubmit,
    handleSelectLanguage,
    } = useEventSubmit(id);
  const { t } = useTranslation();

  const startTime = watch("startTime");

  useEffect(() => {
    if (resData) {
      const formatDateTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
      };

      setValue('startTime', formatDateTime(resData.startTime));
      setValue('endTime', formatDateTime(resData.endTime));
    }
  }, [resData, setValue]);


  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title
            register={register}
            handleSelectLanguage={handleSelectLanguage}
            title={t("Update Your Event")}
            description={t("UpdateEventdescription")}
          />
        ) : (
          <Title
            register={register}
            handleSelectLanguage={handleSelectLanguage}
            title={t("AddEventTitle")}
            description={t("AddEventdescription")}
          />
        )}        
      </div>
      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <Card className="overflow-y-scroll flex-grow scrollbar-hide w-full max-h-full">
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="px-6 pt-8 flex-grow scrollbar-hide w-full max-h-full pb-40">
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Event Name" />
                    <div className="col-span-8 sm:col-span-4">
                      <InputArea
                          required={true}
                          register={register}
                          label="Event Name"
                          name="name"
                          type="text"
                          // autoComplete="username"
                          placeholder="Event name"
                      />
                      <Error errorName={errors.name} />
                    </div>
                </div>
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Event Description" />
                    <div className="col-span-8 sm:col-span-4">
                      <Textarea
                          className="border text-sm  block w-full bg-gray-100 border-gray-200"
                          {...register("description", {
                          required: false,
                          })}
                          name="description"
                          placeholder="EventDescription"
                          rows="4"
                          spellCheck="false"
                      />
                      <Error errorName={errors.description} />
                    </div>
                </div>
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label={"Event Start Time"} />
                    <div className="col-span-8 sm:col-span-4">
                      <Input
                        {...register(`startTime`, {
                          required: "Event Start Time",
                        })}
                        label="event Start Time"
                        name="startTime"
                        type="datetime-local"
                        placeholder={"EventStartTime"}
                      />
                      <Error errorName={errors.startTime} />
                    </div>
                </div>
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label={"Event End Time"} />
                    <div className="col-span-8 sm:col-span-4">
                      <Input
                        {...register(`endTime`, {
                          required: "Event End Time",
                          validate: (value) => {
                            if (!startTime) return true;
                            const start = new Date(startTime);
                            const end = new Date(value);
                            return end > start || "End time must be after to start time";
                          }
                        })}
                        label="event end Time"
                        name="endTime"
                        type="datetime-local"
                        min={startTime}
                        disabled={!startTime}
                        className={`${
                          !startTime 
                            ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700' 
                            : 'bg-gray-50 dark:bg-gray-700'
                        } border text-sm focus:ring-2 focus:ring-blue-500 block w-full`}
                      />
                      <Error errorName={errors.endTime} />
                    </div>
                </div>
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label={"Location"} />
                    <div className="col-span-8 sm:col-span-4">
                      <MapComponent register={register} setValue={setValue} resData={resData} errors={errors} label ="eventDrawer"/>
                    </div>
                </div>  
              </div>
              <DrawerButton id={id} title="Event" />
            </form>
          </CardBody>
        </Card>
      </Scrollbars>
    </>
  )
}

export default React.memo(EventDrawer);