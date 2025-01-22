import React, { useState, useRef, useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Card, CardBody, Input, Textarea } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import { BiCloudUpload, BiDownload } from "react-icons/bi";
import { FiFileText, FiX, FiDownload } from "react-icons/fi";

//internal import
import Title from "@/components/form/others/Title";
import InputArea from "@/components/form/input/InputArea";
import LabelArea from "@/components/form/selectOption/LabelArea";
import DrawerButton from "@/components/form/button/DrawerButton";
import Error from "@/components/form/others/Error";
import useInvoiceSubmit from "@/hooks/useInvoiceSubmit";

const InvoiceDrawer = ({ id, selectedFile, eventCode }) => {
  console.log("selectedFile", selectedFile, eventCode);
  const { t } = useTranslation();
  const API_URL = import.meta.env.VITE_APP_API_BASE_URL.replace('/api', '');

  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    handleSelectLanguage,
    companyServices,
    resData,
  } = useInvoiceSubmit(id, eventCode);
  console.log("resData", resData)
  const [isDragging, setIsDragging] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    console.log("resData", resData)
    console.log("selectedFile", selectedFile)
    if (selectedFile) {
      selectedFile.isExisting = false
      setAttachedFiles([selectedFile]);
    } else if (id && resData?.files?.length > 0) {
      const existingFiles = resData.files.map(file => ({
        name: file.name,
        path: file.path,
        type: file.type,
        size: file.size,
        isExisting: true
      }));
      setAttachedFiles(existingFiles);
    }
  }, [selectedFile, id, resData]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).map(file => ({
      file,
      name: file.name,
      type: file.type,
      isNew: true
    }));
    setAttachedFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files).map(file => ({
      file,
      name: file.name,
      type: file.type,
      isNew: true
    }));
    setAttachedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };
  console.log("attachedFiles", attachedFiles);

  const handleFormSubmit = (data) => {
    const newFiles = attachedFiles
      .filter(file => file.isNew)
      .map(file => file.file);
    
    const existingFiles = attachedFiles
      .filter(file => file.isExisting);

    onSubmit(data, newFiles, existingFiles);
  };

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title
            register={register}
            handleSelectLanguage={handleSelectLanguage}
            title={t("Update Invoice")}
            description={t("Update your invoice information")}
          />
        ) : (
          <Title
            register={register}
            handleSelectLanguage={handleSelectLanguage}
            title={t("Create Invoice")}
            description={t("Add your invoice information")}
          />
        )}
      </div>

      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <Card className="overflow-y-scroll flex-grow scrollbar-hide w-full max-h-full">
          <CardBody>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <div className="px-6 pt-8 flex-grow scrollbar-hide w-full max-h-full pb-40">
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Invoice Reference" />
                  <div className="col-span-8 sm:col-span-4">
                    <InputArea
                      required={true}
                      register={register}
                      label="Invoice Reference"
                      name="reference"
                      type="text"
                      placeholder="Invoice Reference"
                    />
                    <Error errorName={errors?.reference} />
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Description" />
                  <div className="col-span-8 sm:col-span-4">
                    <Textarea
                      required={true}
                      {...register("description", {
                        required: "Description is required!",
                      })}
                      name="description"
                      placeholder="Invoice description"
                      className="border text-sm focus:ring-2 focus:ring-blue-500 block w-full bg-gray-100 dark:bg-gray-700"
                    />
                    <Error errorName={errors?.description} />
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Services" />
                  <div className="col-span-8 sm:col-span-4">
                    <div className="border rounded-lg p-2 bg-gray-100 dark:bg-gray-700">
                      {companyServices.map((service, index) => (
                        <div key={index} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id={`service-${index}`}
                            value={service.value || service.toLowerCase().replace(/\s+/g, '_')}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            {...register('services', {
                              required: 'At least one service must be selected',
                            })}
                          />
                          <label
                            htmlFor={`service-${index}`}
                            className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                          >
                            {service.label || service}
                          </label>
                        </div>
                      ))}
                    </div>
                    <Error errorName={errors?.services} />
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Amount" />
                  <div className="col-span-8 sm:col-span-4">
                    <InputArea
                      required={true}
                      register={register}
                      label="Amount"
                      name="amount"
                      type="number"
                      placeholder="0.00"
                    />
                    <Error errorName={errors?.amount} />
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Created Date" />
                  <div className="col-span-8 sm:col-span-4">
                    <Input
                      {...register('createdDate', {
                        required: "Created date is required",
                      })}
                      label="Created Date"
                      name="createdDate"
                      type="date"
                      min={today}
                      className="border text-sm focus:ring-2 focus:ring-blue-500 block w-full bg-gray-50 dark:bg-gray-700"
                    />
                    <Error errorName={errors?.createdDate} />
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Due Date" />
                  <div className="col-span-8 sm:col-span-4">
                    <Input
                      {...register('dueDate', {
                        required: "Due Date is required",
                      })}
                      label="Due Date"
                      name="dueDate"
                      type="date"
                      min={today}
                    />
                    <Error errorName={errors?.dueDate} />
                  </div>
                </div>

                {/* File Upload Section */}
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Attachments" />
                  <div className="col-span-8 sm:col-span-4">
                    <div className="mb-4">
                      {attachedFiles.length === 0 ? (
                        <div
                          className={`border-2 border-dashed rounded-lg p-4 ${
                            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                          }`}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            multiple
                            onChange={handleFileInput}
                            accept="image/*,application/pdf"
                          />
                          <div className="text-center">
                            <BiCloudUpload className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-1">Drag & drop files here or click to select</p>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          {attachedFiles.map((file, index) => (
                            <div 
                              key={index}
                              className="relative group rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700"
                            >
                              {file.isExisting ? (
                                <a
                                  href={`${API_URL}/uploads/${file.path.split('uploads/')[1]}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block w-full h-32 cursor-pointer"
                                >
                                  {file.type.includes('image') ? (
                                    <img 
                                      src={`/${file.path}`}
                                      alt={file.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center">
                                      <FiFileText className="w-8 h-8 text-gray-400" />
                                      <span className="mt-2 text-sm text-gray-500">
                                        {file.name}
                                      </span>
                                    </div>
                                  )}
                                </a>
                              ) : (
                                <div className="w-full h-32">
                                  {file.type.includes('image') ? (
                                    <img 
                                      src={URL.createObjectURL(file)}
                                      alt={file.name}
                                      className="w-full h-32 object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-32 flex flex-col items-center justify-center">
                                      <FiFileText className="w-8 h-8 text-gray-400" />
                                      <span className="mt-2 text-sm text-gray-500">
                                        {file.name}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="absolute top-0 right-0 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <FiX className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <DrawerButton id={id} title="Invoice" />
            </form>
          </CardBody>
        </Card>
      </Scrollbars>
    </>
  );
};

export default React.memo(InvoiceDrawer);
