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
import EventDrawer from "@/components/drawer/EventDrawer";
import Tooltip from "@/components/tooltip/Tooltip";

const InvoiceTable = ({ isCheck, invoices, setIsCheck }) => {
  console.log("InvoiceTable", invoices)
  const { t } = useTranslation();
  const { showDateFormat, showingTranslateValue } = useUtilsFunction();

  const { title, serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();

  const handleClick = (e) => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };
  console.log("isCheck", isCheck, serviceId)

  const formatServices = (services) => {
    if (!services) return '';
    if (typeof services === 'string') return services;
    if (Array.isArray(services)) {
      return services.length === 1 ? services[0] : services.join(', ');
    }
    return '';
  };

  return (
    <>
      <DeleteModal id={serviceId} title={title} />

      {/* {isCheck.length < 2 && (
        <MainDrawer>
          <EventDrawer id={serviceId} />
        </MainDrawer>
      )} */}

      <TableBody className="dark:bg-gray-900">
        {invoices?.map((invoice, i) => (
          <TableRow key={i + 1}>

            <TableCell>
              <CheckBox
                type="checkbox"
                name={invoice?.reference}
                id={invoice._id}
                handleClick={handleClick}
                isChecked={isCheck?.includes(invoice._id)}
              />
            </TableCell>

            <TableCell className="text-xs">
              <span className="text-sm font-semibold dark:text-[aliceblue]">{invoice?.reference}</span>
            </TableCell>

            <TableCell>
              <span className="text-sm">
                {formatServices(invoice?.services)}
              </span>
            </TableCell>

            <TableCell>
              {showDateFormat(invoice?.createdAt)}
            </TableCell>

            <TableCell>
              {showDateFormat(invoice?.dueDate)}
            </TableCell>

            <TableCell>
              <span className="text-sm">
                {invoice?.amount}
              </span>
            </TableCell>

            <TableCell>
              <EditDeleteButton
                id={invoice?._id}
                isCheck={isCheck}
                handleUpdate={handleUpdate}
                handleModalOpen={handleModalOpen}
                title={showingTranslateValue(invoice?.name)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default InvoiceTable;
