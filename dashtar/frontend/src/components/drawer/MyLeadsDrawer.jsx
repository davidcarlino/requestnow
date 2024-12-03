import React, { useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Card, CardBody, Input, Textarea } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";

//internal import
import Title from "@/components/form/others/Title";
import InputArea from "@/components/form/input/InputArea";
import LabelArea from "@/components/form/selectOption/LabelArea";
import useLeadSubmit from "@/hooks/useLeadSubmit";
import DrawerButton from "@/components/form/button/DrawerButton";
import Error from "@/components/form/others/Error";

const MyLeadsDrawer = ({ id }) => {
  const {
    register,
    handleSubmit,
    resData,
    errors,
    setValue,
    onSubmit,
    handleSelectLanguage,
  } = useLeadSubmit(id);
  const { t } = useTranslation();

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title
            register={register}
            handleSelectLanguage={handleSelectLanguage}
            title={t("Update Your Lead")}
            description={t("UpdateLeaddescription")}
          />
        ) : (
          <Title
            register={register}
            handleSelectLanguage={handleSelectLanguage}
            title={t("AddLeadTitle")}
            description={t("AddLeaddescription")}
          />
        )}        
      </div>
      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <Card className="overflow-y-scroll flex-grow scrollbar-hide w-full max-h-full">
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="px-6 pt-8 flex-grow scrollbar-hide w-full max-h-full pb-40">
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="First Name" />
                    <div className="col-span-8 sm:col-span-4">
                      <InputArea
                          required={true}
                          register={register}
                          label="First Name"
                          name="firstName"
                          type="text"
                          // autoComplete="username"
                          placeholder="First Name"
                      />
                      <Error errorName={errors.firstName} />
                    </div>
                </div>
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Last Name" />
                    <div className="col-span-8 sm:col-span-4">
                      <InputArea
                          // className="border text-sm  block w-full bg-gray-100 border-gray-200"
                          // {...register("description", {
                          // required: false,
                          // })}
                          required={true}
                          register={register}
                          name="lastName"
                          placeholder="Last Name"
                          type="text"
                      />
                      <Error errorName={errors.lastName} />
                    </div>
                </div>
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Service" />
                  <div className="col-span-8 sm:col-span-4">
                    <select
                      className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-gray-700 border-transparent focus:bg-white focus:border-gray-500 dark:focus:border-gray-500 focus:ring-0 rounded-md"
                      name="service"
                      {...register('service', {
                        required: 'Service selection is required!',
                      })}
                    >
                      <option value="">Select a Service</option>
                      <option value="wedding_dj">Wedding DJ</option>
                      <option value="corporate_events">Corporate Events DJ</option>
                      <option value="birthday_party">Birthday Party DJ</option>
                      <option value="club_dj">Club DJ</option>
                      <option value="private_events">Private Events DJ</option>
                      <option value="concert_dj">Concert DJ</option>
                    </select>
                    <Error errorName={errors.service} />
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Email" />
                  <div className="col-span-8 sm:col-span-4">
                    <InputArea
                      required={true}
                      register={register}
                      label="Email"
                      name="email"
                      type="email"
                      autoComplete="off"
                      pattern={/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/}
                      placeholder="Email"
                    />
                    <Error errorName={errors.email} />
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Contact Number" />
                  <div className="col-span-8 sm:col-span-4">
                    <InputArea
                      // required={true}
                      register={register}
                      label="Contact Number"
                      name="phone"
                      pattern={/^[+]?\d*$/}
                      minLength={6}
                      maxLength={15}
                      type="text"
                      placeholder="Contact Number"
                    />
                    <Error errorName={errors.phone} />
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Lead Rating" />
                  <div className="col-span-8 sm:col-span-4">
                    <select
                      className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-gray-700 border-transparent focus:bg-white focus:border-gray-500 dark:focus:border-gray-500 focus:ring-0 rounded-md"
                      name="rating"
                      {...register('rating', {
                        required: 'Rating is required!',
                      })}
                    >
                      <option value="">Select Rating</option>
                      <option value="hot">Hot Lead</option>
                      <option value="warm">Warm Lead</option>
                      <option value="cold">Cold Lead</option>
                      <option value="not_qualified">Not Qualified</option>
                    </select>
                    <Error errorName={errors.rating} />
                  </div>
                </div>
              </div>
              <DrawerButton id={id} title="Lead" />
            </form>
          </CardBody>
        </Card>
      </Scrollbars>
    </>
  )
}

export default React.memo(MyLeadsDrawer);
