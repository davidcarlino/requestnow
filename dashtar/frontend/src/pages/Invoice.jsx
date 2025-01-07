import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardBody,
  Button,
  Table,
  TableCell,
  TableContainer,
  TableHeader,
} from '@windmill/react-ui';
import InvoiceDrawer from '../components/drawer/InvoiceDrawer';
import useToggleDrawer from '../hooks/useToggleDrawer';
import MainDrawer from '../components/drawer/MainDrawer';
import { SidebarContext } from '@/context/SidebarContext';
import { useContext } from 'react';
import { FiPlus, FiFileText } from 'react-icons/fi';
import InvoiceTable from '../components/invoice/InvoiceTable';
import { useTranslation } from 'react-i18next';
import CheckBox from '../components/form/others/CheckBox';

const Invoice = (props) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [selectedFileForDrawer, setSelectedFileForDrawer] = useState(null);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const { toggleDrawer, isDrawerOpen } = useContext(SidebarContext);
  const { serviceId } = useToggleDrawer();
  const { eventCode, invoices } = props;
  const { t } = useTranslation();

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
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    setSelectedFiles(prevFiles => [...prevFiles, ...droppedFiles]);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedFiles(prevFiles => [...prevFiles, ...files]);
    }
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleCardClick = (e) => {
    if (!e.target.closest('button')) {
      fileInputRef.current?.click();
    }
  };

  const getFilePreview = (file) => {
    if (file.type.includes('image')) {
      return URL.createObjectURL(file);
    } else if (file.type.includes('pdf')) {
      return '/pdf-icon.svg'; // You'll need to add this icon to your assets
    } else {
      return '/file-icon.svg'; // You'll need to add this icon to your assets
    }
  };

  const handleFileClick = (file) => {
    setSelectedFileForDrawer(file);
    toggleDrawer();
  };

  const handleSelectAll = () => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(invoices?.map((li) => li._id));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };

  // Reset selected file when drawer closes
  useEffect(() => {
    if (!isDrawerOpen) {
      setSelectedFileForDrawer(null);
    }
  }, [isDrawerOpen]);

  return (
    <>
      <MainDrawer>
        <InvoiceDrawer id={serviceId} selectedFile={selectedFileForDrawer} eventCode={eventCode} />
      </MainDrawer>

      <div className="container px-6 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Invoices
          </h2>
        </div>

        {invoices?.length > 0 && (
        <TableContainer className="mb-8 dark:bg-gray-900">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>
                  <CheckBox
                    type="checkbox"
                    name="selectAll"
                    id="selectAll"
                    handleClick={handleSelectAll}
                    isChecked={isCheckAll}
                  />
                </TableCell>
                <TableCell>{t("Reference")}</TableCell>
                <TableCell>{t("Services")}</TableCell>
                <TableCell>{t("Invoice Created")}</TableCell>
                <TableCell>{t("Due Date")}</TableCell>
                <TableCell>{t("Amount")}</TableCell>
                <TableCell className="text-right">{t("Action")}</TableCell>
              </tr>
            </TableHeader>

            <InvoiceTable invoices={invoices} isCheck={isCheck} setIsCheck={setIsCheck} eventCode={eventCode}/>
          </Table>
        </TableContainer>
      )}

        <Card 
          className={`hover:shadow-lg transition-shadow duration-200 w-full mb-6
            ${isDragging ? 'border-2 border-blue-500 bg-blue-50 dark:bg-gray-800' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CardBody className="p-8">
            <div className="flex">
              {/* Left Side - Drop Zone and Create Button */}
              <div className={`flex flex-col items-center justify-center text-center ${selectedFiles.length > 0 ? 'flex-1 pr-8 border-r border-gray-200 dark:border-gray-600' : 'w-full'}`}>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  multiple
                  onChange={handleFileInput}
                  accept="image/*,application/pdf"
                />
                <div 
                  className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                  onClick={handleCardClick}
                >
                  <svg 
                    className="w-16 h-16 mb-4 text-blue-600 dark:text-blue-500"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="mb-2 text-xl font-medium text-gray-600 dark:text-gray-400">
                    Drop your invoice files here
                  </p>
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDrawer();
                    }}
                    className="mt-4"
                  >
                    Create Invoice
                  </Button>
                </div>
              </div>

              {/* Right Side - File Preview Grid */}
              {selectedFiles.length > 0 && (
                <div className="flex-1 pl-8">
                  <div className="grid grid-cols-3 gap-4 max-h-[400px] overflow-y-auto relative">
                    {selectedFiles.map((file, index) => (
                      <div 
                        key={index} 
                        className="relative group"
                      >
                        <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                          {file.type.includes('image') ? (
                            <img 
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          ) : file.type === 'application/pdf' ? (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/20">
                              <FiFileText className="w-12 h-12 text-red-500" />
                              <span className="mt-2 text-sm text-red-600 dark:text-red-400">
                                PDF Document
                              </span>
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FiFileText className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                          
                          {/* Plus icon overlay */}
                          <div 
                            className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFileClick(file);
                            }}
                          >
                            <FiPlus className="w-8 h-8 text-white cursor-pointer" />
                          </div>
                        </div>

                        {/* File name tooltip */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-xs truncate opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {file.name}
                        </div>
                        
                        {/* Delete button */}
                        <button
                          onClick={() => removeSelectedFile(index)}
                          className="absolute top-0 right-0 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <svg 
                            className="w-4 h-4" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth="2" 
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
      
    </>
  );
};

export default Invoice;
