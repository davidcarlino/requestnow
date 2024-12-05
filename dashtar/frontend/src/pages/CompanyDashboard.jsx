import React, { useContext, useEffect } from "react";
import { Button, Card, CardBody } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import { notifySuccess, notifyError } from '@/utils/toast';

//internal import
import { AdminContext } from "@/context/AdminContext";
import useCompanySubmit from "@/hooks/useCompanySubmit";
import PageTitle from "@/components/Typography/PageTitle";
import LabelArea from "@/components/form/selectOption/LabelArea";
import Uploader from "@/components/image-uploader/Uploader";
import InputArea from "@/components/form/input/InputArea";
import Error from "@/components/form/others/Error";
import SelectRole from "@/components/form/selectOption/SelectRole";
import AnimatedContent from "@/components/common/AnimatedContent";

const CompanyDashboard = () => {
  const { t } = useTranslation();
  const {
    state: { adminInfo },
  } = useContext(AdminContext);

  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    imageUrl,
    setImageUrl,
    isLoading,
    getCompanyData,
    companyExists,
    companyId,
  } = useCompanySubmit(adminInfo);
  console.log("adminInfo", adminInfo)
  useEffect(() => {
    if (adminInfo?._id) {
      getCompanyData();
    }
  }, [adminInfo]);

  return (
    <>
      <PageTitle> {t("CompanyDashboard")} </PageTitle>
      <AnimatedContent>
        <div className="container p-6 mx-auto bg-white  dark:bg-gray-800 dark:text-gray-200 rounded-lg">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit((data) => onSubmit(data, companyId))}>
              <div className="p-6 flex-grow scrollbar-hide w-full max-h-full">
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label={t("CompanyLogo")} />
                  <div className="col-span-8 sm:col-span-4">
                    <Uploader
                      imageUrl={imageUrl}
                      setImageUrl={setImageUrl}
                      folder="customer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label={t("Companyname")} />
                  <div className="col-span-8 sm:col-span-4">
                    <InputArea
                      required={true}
                      register={register}
                      label="Name"
                      name="name"
                      type="text"
                      placeholder="Company Name"
                    />
                    <Error errorName={errors.name} />
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label={t("CompanyEmail")} />
                  <div className="col-span-8 sm:col-span-4">
                    <InputArea
                      required={true}
                      register={register}
                      label="Email"
                      name="email"
                      type="text"
                      placeholder="Email"
                    />
                    <Error errorName={errors.email} />
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label={t("CompanyContactNumber")} />
                  <div className="col-span-8 sm:col-span-4">
                    <InputArea
                      required={true}
                      register={register}
                      label="Contact Number"
                      name="phone"
                      type="text"
                      placeholder="Contact Number"
                    />
                    <Error errorName={errors.phone} />
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label={"Services"} />
                  <div className="col-span-8 sm:col-span-4">
                  <select
                    className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-gray-700 border-transparent focus:bg-white focus:border-gray-500 dark:focus:border-gray-500 focus:ring-0 rounded-md"
                    name="services"
                    {...register('services', {
                      required: 'Services is required!',
                    })}
                  >
                      <option value="">Select Services</option>
                      <option value="DJ Service">DJ Service</option>
                    </select>
                    <Error errorName={errors.services} />
                  </div>
                </div>
              </div>

              <div className="flex flex-row-reverse pr-6 pb-6">
                <Button type="submit" className="h-12 px-6">
                  {companyExists ? "Company Update" : "Create Company"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </AnimatedContent>
    </>
  );
};

export default CompanyDashboard;
