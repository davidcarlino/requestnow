import { TableBody, TableCell, TableRow } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

//internal import
import useToggleDrawer from "@/hooks/useToggleDrawer";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import CheckBox from "@/components/form/others/CheckBox";
import DeleteModal from "@/components/modal/DeleteModal";
import MainDrawer from "@/components/drawer/MainDrawer";
import LeadsDrawer from "@/components/drawer/MyLeadsDrawer";
import Tooltip from "@/components/tooltip/Tooltip";

const LeadsTable = ({ isCheck, leads, setIsCheck }) => {
  const { t } = useTranslation();
  const { showDateTimeFormat, showingTranslateValue } = useUtilsFunction();

  const { title, serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();

  const handleClick = (e) => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };

  const formatName = (firstName, lastName) => {
    const formatWord = (word) => {
      return word ? word.charAt(0).toUpperCase() + word.toLowerCase().slice(1) : '';
    };
    
    return `${formatWord(firstName)} ${formatWord(lastName)}`;
  };

  const getRatingDisplay = (rating) => {
    const colors = {
      hot: 'bg-red-500',
      warm: 'bg-yellow-500',
      cold: 'bg-blue-500',
      not_qualified: 'bg-gray-500'
    };

    const displayText = rating
      ?.split('_')
      .map(word => word.toUpperCase())
      .join(' ');

    return (
      <div className="flex items-center gap-2">
        <div 
          className={`w-3 h-3 rounded-full ${colors[rating] || 'bg-gray-300'}`} 
        />
        <span className="text-sm">
          {displayText || 'N/A'}
        </span>
      </div>
    );
  };

  const getServiceDisplay = (service) => {
    return service?.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <>
      <DeleteModal id={serviceId} title={title} />

      {isCheck.length < 2 && (
        <MainDrawer>
          <LeadsDrawer id={serviceId} />
        </MainDrawer>
      )}

      <TableBody className="dark:bg-gray-900">
        {leads?.map((lead, i) => (
          <TableRow key={i + 1}>
            <TableCell>
              <CheckBox
                type="checkbox"
                name={lead?.name}
                id={lead._id}
                handleClick={handleClick}
                isChecked={isCheck?.includes(lead._id)}
              />
            </TableCell>

            <TableCell className="text-xs">
              <span className="text-sm font-semibold dark:text-[aliceblue]">
                {formatName(lead?.firstName, lead?.lastName)}
              </span>
            </TableCell>

            <TableCell>
              <span className="text-sm">
                {lead?.email}
              </span>
            </TableCell>

            <TableCell>
              <span className="text-sm">
                {getServiceDisplay(lead?.service)}
              </span>
            </TableCell>

            <TableCell>
              <span className="text-sm">
                {lead?.phone}
              </span>
            </TableCell>

            <TableCell>
              {getRatingDisplay(lead?.rating)}
            </TableCell>

            <TableCell className="text-right flex justify-end">
              <EditDeleteButton
                id={lead?._id}
                isCheck={isCheck}
                handleUpdate={handleUpdate}
                handleModalOpen={handleModalOpen}
                title={showingTranslateValue(formatName(lead?.firstName, lead?.lastName))}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default LeadsTable;
