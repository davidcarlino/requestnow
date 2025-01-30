import { TableBody, TableCell, TableRow } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import { FiZoomIn } from "react-icons/fi";
import { Link } from "react-router-dom";
import { 
  FiClock, 
  FiSend, 
  FiPause, 
  FiDollarSign, 
  FiCheckCircle,
  FiChevronDown
} from "react-icons/fi";

//internal import

import useToggleDrawer from "@/hooks/useToggleDrawer";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import CheckBox from "@/components/form/others/CheckBox";
import DeleteModal from "@/components/modal/DeleteModal";
import MainDrawer from "@/components/drawer/MainDrawer";
import EventDrawer from "@/components/drawer/EventDrawer";
import Tooltip from "@/components/tooltip/Tooltip";
import EventServices from "@/services/EventServices";

const EventTable = ({ isCheck, events, setIsCheck, setEvents }) => {
  const { t } = useTranslation();
  const { showDateTimeFormat, showingTranslateValue } = useUtilsFunction();

  const { title, serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();

  const statusConfig = [
    { 
      value: 'To Quote',
      icon: <FiClock className="text-yellow-700 dark:text-yellow-100" />,
      color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100',
      iconColor: 'text-yellow-700 dark:text-yellow-100'
    },
    { 
      value: 'Quote Sent',
      icon: <FiSend className="text-blue-700 dark:text-blue-100" />,
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100',
      iconColor: 'text-blue-700 dark:text-blue-100'
    },
    { 
      value: 'On Hold',
      icon: <FiPause className="text-gray-700 dark:text-gray-100" />,
      color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100',
      iconColor: 'text-gray-700 dark:text-gray-100'
    },
    { 
      value: 'Awaiting Deposit',
      icon: <FiDollarSign className="text-purple-700 dark:text-purple-100" />,
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-700 dark:text-purple-100',
      iconColor: 'text-purple-700 dark:text-purple-100'
    },
    { 
      value: 'Booked',
      icon: <FiCheckCircle className="text-green-700 dark:text-green-100" />,
      color: 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100',
      iconColor: 'text-green-700 dark:text-green-100'
    }
  ];

  const handleStatusChange = async (eventId, newStatus) => {
    try {
      await EventServices.updateEvents(eventId, { status: newStatus });
      
      // Update the local state after successful API call
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event._id === eventId 
            ? { ...event, status: newStatus }
            : event
        )
      );
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleClick = (e) => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };

  const getStatusColor = (status) => {
    return statusConfig.find(s => s.value === status)?.color || statusConfig[0].color;
  };

  const getStatusIcon = (status) => {
    return statusConfig.find(s => s.value === status)?.icon || statusConfig[0].icon;
  };

  console.log("isCheck", events)
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
                <span className="text-sm font-semibold dark:text-[aliceblue]">{event?.name}</span>
              </Link>
            </TableCell>

            <TableCell>
              <div className="relative">
                <select 
                  className={`
                    ${getStatusColor(event.status)}
                    w-48
                    pl-9  
                    pr-10
                    py-2 
                    rounded-lg
                    font-semibold
                    text-sm
                    cursor-pointer
                    focus:outline-none
                    appearance-none
                  `}
                  value={event.status}
                  onChange={(e) => handleStatusChange(event._id, e.target.value)}
                >
                  {statusConfig.map(({ value }) => (
                    <option 
                      key={value} 
                      value={value}
                      className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                    >
                      {value}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute left-2.5 top-1/2 transform -translate-y-1/2">
                  {getStatusIcon(event.status)}
                </div>
                <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2">
                  <FiChevronDown className={`w-4 h-4 ${
                    statusConfig.find(s => s.value === event?.status)?.iconColor || statusConfig[0].iconColor
                  }`} />
                </div>
              </div>
            </TableCell>

           

            <TableCell>
              {showDateTimeFormat(event?.startTime)}
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
