import { TableBody, TableCell, TableRow } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";

//internal import

import useToggleDrawer from "@/hooks/useToggleDrawer";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import CheckBox from "@/components/form/others/CheckBox";
import DeleteModal from "@/components/modal/DeleteModal";
import MainDrawer from "@/components/drawer/MainDrawer";
import VenueDrawer from "../drawer/VenueDrawer";

const VenueTable = ({ isCheck, venues, setIsCheck }) => {
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
          <VenueDrawer id={serviceId} />
        </MainDrawer>
      )}

      <TableBody className="dark:bg-gray-900">
        {venues?.map((venue, i) => (
          <TableRow key={i + 1}>

            <TableCell>
              <CheckBox
                type="checkbox"
                name={venue?.name}
                id={venue._id}
                handleClick={handleClick}
                isChecked={isCheck?.includes(venue._id)}
              />
            </TableCell>

            <TableCell className="text-xs">
              <span>{venue?.name}</span>
            </TableCell>

            <TableCell>
              <span className="text-sm">
                {venue?.address}
              </span>
            </TableCell>

            <TableCell>
              <span className="text-sm">
                {venue?.contactInfo}
              </span>
            </TableCell>

            <TableCell>
              <span className="text-sm">
                {venue?.capacity}
              </span>
            </TableCell>

            <TableCell>
              <span className="text-sm">
                {venue?.type}
              </span>
            </TableCell>

            <TableCell className="text-right flex justify-end">
              <EditDeleteButton
                id={venue?._id}
                isCheck={isCheck}
                handleUpdate={handleUpdate}
                handleModalOpen={handleModalOpen}
                title={showingTranslateValue(venue?.name)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default VenueTable;
