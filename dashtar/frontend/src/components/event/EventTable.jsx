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

const EventTable = ({ isCheck, events, setIsCheck }) => {
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
  console.log("isCheck", isCheck, serviceId)
  return (
    <>
      <DeleteModal id={serviceId} title={title} />

      {isCheck.length < 2 && (
        <MainDrawer>
          <EventDrawer id={serviceId} />
        </MainDrawer>
      )}

      <TableBody className="dark:bg-gray-900">
        {events?.map((event, i) => (
          <TableRow key={i + 1}>

            <TableCell>
              <CheckBox
                type="checkbox"
                name={event?.name}
                id={event._id}
                handleClick={handleClick}
                isChecked={isCheck?.includes(event._id)}
              />
            </TableCell>

            <TableCell className="text-xs">
            <Link
                to={`/event/${event._id}/dashboard`}
              >
              <span className="text-sm font-semibold">{event?.name}</span>
            </Link>
            </TableCell>

            <TableCell>
              <span className="text-sm">
                {event?.description}
              </span>
            </TableCell>

            <TableCell>
              {showDateTimeFormat(event?.startTime)}
            </TableCell>

            <TableCell>
              {showDateTimeFormat(event?.endTime)}
            </TableCell>

            <TableCell>
              <span className="text-sm">
                {event.venue?.address}
              </span>
            </TableCell>

            <TableCell className="text-right flex justify-end">
              <EditDeleteButton
                id={event?._id}
                isCheck={isCheck}
                handleUpdate={handleUpdate}
                handleModalOpen={handleModalOpen}
                title={showingTranslateValue(event?.name)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default EventTable;
