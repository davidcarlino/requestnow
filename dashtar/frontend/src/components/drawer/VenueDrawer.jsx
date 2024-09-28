import React from "react";
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
import InputValue from "@/components/form/input/InputValue";
import useVenueSubmit from "@/hooks/useVenueSubmit";

const VenueDrawer = ({ id }) => {
  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    handleSelectLanguage,
    } = useVenueSubmit(id);
  const { t } = useTranslation();
  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title
            register={register}
            handleSelectLanguage={handleSelectLanguage}
            title={"Update Your Venue"}
            description={"Edit Your Venue Details Below."}
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
                  <LabelArea label="Venue Name" />
                    <div className="col-span-8 sm:col-span-4">
                      <InputArea
                          required={true}
                          register={register}
                          label="Venue Name"
                          name="name"
                          type="text"
                          // autoComplete="username"
                          placeholder="Venue name"
                      />
                      <Error errorName={errors.name} />
                    </div>
                </div>
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Venue Address" />
                    <div className="col-span-8 sm:col-span-4">
                      <InputArea
                          // className="border text-sm  block w-full bg-gray-100 border-gray-200"
                          register={register}
                          name="address"
                          placeholder="Venue Address"
                          rows="4"
                          spellCheck="false"
                      />
                      <Error errorName={errors.address} />
                    </div>
                </div>
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label={"Contact Info"} />
                    <div className="col-span-8 sm:col-span-4">
                      <Input
                        // register={register}
                        {...register("contactInfo", {
                          required: "Contact number is required",
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Only numbers are allowed",
                          },
                          minLength: {
                            value: 10,
                            message: "Contact number must be at least 10 digits",
                          }
                        })}
                        label="Conatct Info"
                        name="contactInfo"
                        placeholder={"Contact Info"}
                        maxLength={15}
                        type="number"
                      />
                      <Error errorName={errors.contactInfo} />
                    </div>
                </div>
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label={"Capacity"} />
                    <div className="col-span-8 sm:col-span-4">
                      <InputValue
                        register={register}
                        label="Capacity"
                        name="capacity"
                        placeholder= "Capacity"
                        type="number"
                      />
                      <Error errorName={errors.capacity} />
                    </div>
                </div>
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label={"Type"} />
                    <div className="col-span-8 sm:col-span-4">
                      <InputArea
                        register={register}
                        label="Type"
                        name="type"
                        placeholder= "Type"
                      />
                      <Error errorName={errors.type} />
                    </div>
                </div>
              </div>
              <DrawerButton id={id} title="Venue" />
            </form>
          </CardBody>
        </Card>
      </Scrollbars>
    </>
  )
}

export default React.memo(VenueDrawer);