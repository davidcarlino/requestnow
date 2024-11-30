import { Avatar, TableBody, TableCell, TableRow } from "@windmill/react-ui";
import React from "react";

//internal import

import Status from "@/components/table/Status";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import MainDrawer from "@/components/drawer/MainDrawer";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import UserDrawer from "@/components/drawer/UserDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import ActiveInActiveButton from "@/components/table/ActiveInActiveButton";

const UserTable = ({ users, lang }) => {
  const {
    title,
    serviceId,
    handleModalOpen,
    handleUpdate,
    isSubmitting,
    handleResetPassword,
  } = useToggleDrawer();

  const { showDateFormat, showingTranslateValue } = useUtilsFunction();

  return (
    <>
      <DeleteModal id={serviceId} title={title} />

      <MainDrawer>
        <UserDrawer id={serviceId} />
      </MainDrawer>

      <TableBody>
        {users?.map((user) => (
          <TableRow key={user._id}>
            <TableCell>
              <div className="flex items-center">
                <Avatar
                  className="hidden mr-3 md:block bg-gray-50"
                  src={user.picture}
                  alt="user"
                />
                <div>
                  <h2 className="text-sm font-medium">
                    {showingTranslateValue(user?.name)}
                  </h2>
                </div>
              </div>
            </TableCell>

            <TableCell>
              <span className="text-sm">{user.email}</span>{" "}
            </TableCell>
            <TableCell>
              <span className="text-sm ">{user.phone}</span>
            </TableCell>

            <TableCell>
              <span className="text-sm">
                {/* {dayjs(staff.joiningData).format("DD/MM/YYYY")} */}
                {showDateFormat(user.joiningData)}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-sm font-semibold">{user?.role}</span>
            </TableCell>
            <TableCell className="text-center text-xs">
              <Status status={user.status} />
            </TableCell>

            <TableCell className="text-center">
              <ActiveInActiveButton
                id={user?._id}
                user={user}
                option="user"
                status={user.status}
              />
            </TableCell>

            <TableCell>
              <EditDeleteButton
                id={user._id}
                user={user}
                isSubmitting={isSubmitting}
                handleUpdate={handleUpdate}
                handleModalOpen={handleModalOpen}
                handleResetPassword={handleResetPassword}
                title={showingTranslateValue(user?.name)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default UserTable;
