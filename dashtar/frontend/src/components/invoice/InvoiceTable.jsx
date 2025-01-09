import React from 'react';
import { TableBody, TableCell, TableRow } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import { FiZoomIn } from "react-icons/fi";
import { Link } from "react-router-dom";

//internal import
import useToggleDrawer from "@/hooks/useToggleDrawer";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import CheckBox from "@/components/form/others/CheckBox";
import DeleteModal from "@/components/modal/DeleteModal";
import MainDrawer from "@/components/drawer/MainDrawer";
import InvoiceDrawer from "@/components/drawer/InvoiceDrawer";
import Tooltip from "@/components/tooltip/Tooltip";

const InvoiceTable = ({ isCheck, invoices, setIsCheck, eventCode }) => {
  const { t } = useTranslation();
  const { showDateFormat, showingTranslateValue, currency } = useUtilsFunction();
  const { title, serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();
  console.log("tableserviceId", serviceId)
  const handleClick = (e) => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };

  const formatServices = (services) => {
    if (!services) return '';
    if (typeof services === 'string') return services;
    if (Array.isArray(services)) {
      return services.length === 1 ? services[0] : services.join(', ');
    }
    return '';
  };
  console.log("window", window.location)
  return (
    <>
      <DeleteModal id={serviceId} title={title} />
      {isCheck.length < 2 && (
        <MainDrawer>
          <InvoiceDrawer id={serviceId} eventCode={eventCode} />
        </MainDrawer>
      )}
      <TableBody className="dark:bg-gray-900">
        {invoices?.map((invoice, i) => (
          <TableRow key={i + 1}>
            <TableCell className="w-8">
              <CheckBox
                type="checkbox"
                name={invoice?.reference}
                id={invoice._id}
                handleClick={handleClick}
                isChecked={isCheck?.includes(invoice._id)}
              />
            </TableCell>

            <TableCell className="w-40">
              <span className="text-sm font-semibold dark:text-gray-200">
                <Link to={`${window.location.pathname}/invoice/${invoice?._id}`}>
                  {invoice?.reference}
                </Link>
              </span>
            </TableCell>

            <TableCell className="w-48">
              <div className="flex flex-col">
                <span className="text-sm dark:text-gray-200">
                  {formatServices(invoice?.services)}
                </span>
              </div>
            </TableCell>

            <TableCell className="w-32">
              <span className="text-sm dark:text-gray-200">
                {showDateFormat(invoice?.createdAt)}
              </span>
            </TableCell>

            <TableCell className="w-32">
              <span className="text-sm dark:text-gray-200">
                {showDateFormat(invoice?.dueDate)}
              </span>
            </TableCell>

            <TableCell className="w-24">
              <span className="text-sm font-medium dark:text-gray-200">
                {currency} {invoice?.amount}
              </span>
            </TableCell>

            <TableCell className="w-24">
              <div className="flex justify-end">
                <EditDeleteButton
                  id={invoice?._id}
                  isCheck={isCheck}
                  handleUpdate={handleUpdate}
                  handleModalOpen={handleModalOpen}
                  title={showingTranslateValue(invoice?.name)}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default InvoiceTable;
