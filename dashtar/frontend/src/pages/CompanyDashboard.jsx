import React, { useContext, useEffect, useState } from "react";
import { Button, Card, CardBody } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import { notifySuccess, notifyError } from '@/utils/toast';
import { FiPlusCircle, FiXCircle } from 'react-icons/fi';

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
    servicesList,
    setServicesList,
  } = useCompanySubmit(adminInfo);
  console.log("adminInfo", adminInfo)

  const [serviceInput, setServiceInput] = useState('');

  useEffect(() => {
    if (adminInfo?._id) {
      getCompanyData();
    }
  }, [adminInfo]);

  const handleAddService = () => {
    if (serviceInput.trim()) {
      const formattedService = serviceInput.trim()
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      setServicesList([...servicesList, formattedService]);
      setServiceInput('');
    }
  };

  const handleRemoveService = (index) => {
    setServicesList(servicesList.filter((_, i) => i !== index));
  };

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
                    <div className="flex flex-col gap-4">
                      <div className="flex gap-2">
                        <input
                          className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-gray-700 border-transparent focus:bg-white focus:border-gray-500 dark:focus:border-gray-500 focus:ring-0 rounded-md"
                          type="text"
                          value={serviceInput}
                          onChange={(e) => setServiceInput(e.target.value)}
                          placeholder="Enter a service"
                        />
                        <Button 
                          type="button"
                          onClick={handleAddService}
                          className="h-12 px-4 flex items-center whitespace-nowrap"
                        >
                          <FiPlusCircle className="w-5 h-5" />
                          <span className="ml-2">Add Service</span>
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {servicesList.map((service, index) => (
                          <div 
                            key={index}
                            className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-md"
                          >
                            <span className="normal-case">{service}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveService(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FiXCircle className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
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
