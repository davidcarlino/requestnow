import {
  Button,
  Card,
  CardBody,
  Input,
  Label,
  Pagination,
  Select,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
} from "@windmill/react-ui";
import { useContext, useState } from "react";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import exportFromJSON from "export-from-json";
import { FiPlus } from "react-icons/fi";

//internal import
import { notifyError } from "@/utils/toast";
import useAsync from "@/hooks/useAsync";
import useFilter from "@/hooks/useFilter";
import EventServices from "@/services/EventServices";
import NotFound from "@/components/table/NotFound";
import PageTitle from "@/components/Typography/PageTitle";
import { SidebarContext } from "@/context/SidebarContext";
import EventTable from "@/components/event/EventTable";
import TableLoading from "@/components/preloader/TableLoading";
import spinnerLoadingImage from "@/assets/img/spinner.gif";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import AnimatedContent from "@/components/common/AnimatedContent";
import MainDrawer from "@/components/drawer/MainDrawer";
import EventDrawer from "@/components/drawer/EventDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import CheckBox from "@/components/form/others/CheckBox";

const Events = () => {
  const {
    endDate,
    setEndDate,
    startDate,
    setStartDate,
    searchText,
    setSearchText,
    searchRef,
    currentPage,
    handleChangePage,
    handleSubmitForAll,
    resultsPerPage,
    toggleDrawer
  } = useContext(SidebarContext);

  const { t } = useTranslation();

  const [loadingExport, setLoadingExport] = useState(false);

  const { data, loading, error } = useAsync(() =>
    EventServices.getAllEvents({
      endTime: endDate,
      startTime: startDate,
      name: searchText,
      page: currentPage,
      limit: resultsPerPage,
    })
  );
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  const { allId, serviceId } = useToggleDrawer();
  
  const { dataTable, serviceData } = useFilter(data?.events);
  console.log("datatable", dataTable)
  const handleSelectAll = () => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(data?.events?.map((li) => li._id));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };

  // const handleDownloadOrders = async () => {
  //   try {
  //     setLoadingExport(true);
  //     const res = await OrderServices.getAllOrders({
  //       page: 1,
  //       day: time,
  //       method: method,
  //       status: status,
  //       endDate: endDate,
  //       download: true,
  //       startDate: startDate,
  //       limit: data?.totalDoc,
  //       customerName: searchText,
  //     });

  //     // console.log("handleDownloadOrders", res);
  //     const exportData = res?.orders?.map((order) => {
  //       return {
  //         _id: order._id,
  //         invoice: order.invoice,
  //         subTotal: getNumberTwo(order.subTotal),
  //         shippingCost: getNumberTwo(order.shippingCost),
  //         discount: getNumberTwo(order?.discount),
  //         total: getNumberTwo(order.total),
  //         paymentMethod: order.paymentMethod,
  //         status: order.status,
  //         user_info: order?.user_info?.name,
  //         createdAt: order.createdAt,
  //         updatedAt: order.updatedAt,
  //       };
  //     });
  //     // console.log("exportData", exportData);

  //     exportFromJSON({
  //       data: exportData,
  //       fileName: "orders",
  //       exportType: exportFromJSON.types.csv,
  //     });
  //     setLoadingExport(false);
  //   } catch (err) {
  //     setLoadingExport(false);
  //     // console.log("err on orders download", err);
  //     notifyError(err?.response?.data?.message || err?.message);
  //   }
  // };

  // handle reset field
  const handleResetField = () => {
    setEndDate("");
    setStartDate("");
    setSearchText("");
    searchRef.current.value = "";
  };

  return (
    <>
      <PageTitle>{t("My Invoices")}</PageTitle>

      <DeleteModal
        ids={allId}
        setIsCheck={setIsCheck}
        title="Selected Coupon"
      />

      <MainDrawer>
        <EventDrawer id={serviceId} />
      </MainDrawer>

      <AnimatedContent>
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <CardBody>
            <form onSubmit={handleSubmitForAll}>
              <div className="grid gap-4 lg:gap-4 xl:gap-6 md:gap-2 md:grid-cols-3 py-2">
                <div>
                  <Input
                    ref={searchRef}
                    type="search"
                    name="search"
                    placeholder="Search Invoice"
                  />
                </div>
                <div>
                  {loadingExport ? (
                    <Button
                      disabled={true}
                      type="button"
                      className="h-12 w-full"
                    >
                      <img
                        src={spinnerLoadingImage}
                        alt="Loading"
                        width={20}
                        height={10}
                      />{" "}
                      <span className="font-serif ml-2 font-light">
                        Processing
                      </span>
                    </Button>
                  ) : (
                    <button
                      // onClick={handleDownloadOrders}
                      disabled={data?.orders?.length <= 0 || loadingExport}
                      type="button"
                      className={`${
                        (data?.orders?.length <= 0 || loadingExport) &&
                        "opacity-50 cursor-not-allowed bg-blue-600"
                      } flex items-center justify-center text-sm leading-5 h-12 w-full text-center transition-colors duration-150 font-medium px-6 py-2 rounded-md text-white bg-blue-500 border border-transparent active:bg-blue-600 hover:bg-blue-600 `}
                    >
                      Download All Invoices
                      <span className="ml-2 text-base">
                        <IoCloudDownloadOutline />
                      </span>
                    </button>
                  )}
                </div>
                <div>
                  <Button
                    onClick={toggleDrawer}
                    className="w-full rounded-md h-12"
                  >
                    <span className="mr-2">
                     
                    </span>
                    {t("Create New Invoice ")}
                    <FiPlus />
                  </Button>
                </div>
              </div>
              <br></br><Label style={{ textAlign: 'center', fontSize: '14px', color: 'white' }}>
  Or Search By: 
</Label>
              <div className="grid gap-4 lg:gap-6 xl:gap-6 lg:grid-cols-3 xl:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 py-2">
                <div>
                  <Label>Date Created</Label>
                  <Input
                    type="date"
                    name="startDate"
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Date Due</Label>
                  <Input
                    type="date"
                    name="startDate"
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div className="mt-2 md:mt-0 flex items-center xl:gap-x-4 gap-x-1 flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                  <div className="w-full mx-1">
                    <Label style={{ visibility: "hidden" }}>Filter</Label>
                    <Button
                      type="submit"
                      className="h-12 w-full bg-blue-700"
                    >
                      Filter
                    </Button>
                  </div>

                  <div className="w-full">
                    <Label style={{ visibility: "hidden" }}>Reset</Label>
                    <Button
                      layout="outline"
                      onClick={handleResetField}
                      type="reset"
                      className="px-4 md:py-1 py-3 text-sm dark:bg-gray-700"
                    >
                      <span className="text-black dark:text-gray-200">
                        Reset
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CardBody>
        </Card>
      </AnimatedContent>

      {loading ? (
        <TableLoading row={12} col={7} width={160} height={20} />
      ) : error ? (
        <span className="text-center mx-auto text-red-500">{error}</span>
      ) : serviceData?.length !== 0 ? (
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
                <TableCell>{t("evntName")}</TableCell>
                <TableCell>{t("evntDescription")}</TableCell>
                <TableCell>{t("evntStartTime")}</TableCell>
                <TableCell>{t("evntEndTime")}</TableCell>
                <TableCell>{t("evntAddress")}</TableCell>
                <TableCell className="text-right">{t("evntAction")}</TableCell>
              </tr>
            </TableHeader>

            <EventTable events={dataTable} isCheck={isCheck} setIsCheck={setIsCheck}/>
          </Table>

          <TableFooter>
            <Pagination
              totalResults={data?.totalDoc}
              resultsPerPage={resultsPerPage}
              onChange={handleChangePage}
              label="Table navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Sorry, There are no Invoices created. Let's start making money!" />
      )}
    </>
  );
};

export default Events;





















// import {
//   Button,
//   Card,
//   CardBody,
//   Input,
//   Label,
//   Pagination,
//   Select,
//   Table,
//   TableCell,
//   TableContainer,
//   TableFooter,
//   TableHeader,
// } from "@windmill/react-ui";
// import { useContext, useState } from "react";
// import { IoCloudDownloadOutline } from "react-icons/io5";
// import { useTranslation } from "react-i18next";
// import exportFromJSON from "export-from-json";
// import { FiPlus } from "react-icons/fi";

// //internal import
// import { notifyError } from "@/utils/toast";
// import useAsync from "@/hooks/useAsync";
// import useFilter from "@/hooks/useFilter";
// import EventServices from "@/services/EventServices";
// import NotFound from "@/components/table/NotFound";
// import PageTitle from "@/components/Typography/PageTitle";
// import { SidebarContext } from "@/context/SidebarContext";
// import EventTable from "@/components/event/EventTable";
// import TableLoading from "@/components/preloader/TableLoading";
// import spinnerLoadingImage from "@/assets/img/spinner.gif";
// import useUtilsFunction from "@/hooks/useUtilsFunction";
// import AnimatedContent from "@/components/common/AnimatedContent";
// import MainDrawer from "@/components/drawer/MainDrawer";
// import EventDrawer from "@/components/drawer/EventDrawer";
// import useToggleDrawer from "@/hooks/useToggleDrawer";
// import CheckBox from "@/components/form/others/CheckBox";

// const Events = () => {
//   const { title, allId, serviceId, handleDeleteMany, handleUpdateMany } =
//     useToggleDrawer();
//   const {
//     toggleDrawer,
//     name,
//     description,
//     startTime,
//     endTime,
//     setTime,
//     setStatus,
//     setEndDate,
//     searchRef,
//     setMethod,
//     setStartDate,
//     setSearchText,
//     handleChangePage,
//     handleSubmitForAll,
//     resultsPerPage,
//   } = useContext(SidebarContext);

//   const { t } = useTranslation();

//   const [loadingExport, setLoadingExport] = useState(false);

//   const { data, loading, error } = useAsync(() =>
//     EventServices.getAllEvents({
//       name: name,
//       description: description,
//       startTime: startTime,
//       endTime: endTime
//     })
//   );
  
//   const { currency, getNumber, getNumberTwo } = useUtilsFunction();

//   const { dataTable, serviceData } = useFilter(data);
  
//   // handle reset field
//   const handleResetField = () => {
//     setTime("");
//     setMethod("");
//     setStatus("");
//     setEndDate("");
//     setStartDate("");
//     setSearchText("");
//     searchRef.current.value = "";
//   };
//   console.log("data in orders page", data);

//   return (
//     <>
//       <PageTitle>{t("My Events")}</PageTitle>
//       <MainDrawer>
//         <EventDrawer id={serviceId} />
//       </MainDrawer>
//       <AnimatedContent>
//         <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
//           <CardBody className="">
//             <form
//               onSubmit={handleSubmitForAll}
//               className="py-3  grid gap-4 lg:gap-6 xl:gap-6  xl:flex"
//             >
//               <div className="lg:flex  md:flex xl:justify-end xl:w-1/2  md:w-full md:justify-end flex-grow-0">
//                 <div className="w-full md:w-48 lg:w-48 xl:w-48">
//                   <Button
//                     onClick={toggleDrawer}
//                     className="w-full rounded-md h-12"
//                   >
//                     <span className="mr-2">
//                       <FiPlus />
//                     </span>
//                     {t("CreateEvent")}
//                   </Button>
//                 </div>
//               </div>
//             </form>
//           </CardBody>
//         </Card>
//         <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
//           <CardBody>
//             <form onSubmit={handleSubmitForAll}>
//               <div className="grid gap-4 lg:gap-4 xl:gap-6 md:gap-2 md:grid-cols-5 py-2">
//                 <div>
//                   <Input
//                     ref={searchRef}
//                     type="search"
//                     name="search"
//                     placeholder="Search by Customer Name"
//                   />
//                 </div>

//                 <div>
//                   <Select onChange={(e) => setStatus(e.target.value)}>
//                     <option value="Status" defaultValue hidden>
//                       {t("Event Status")}
//                     </option>
//                     <option value="Delivered">{t("PageOrderDelivered")}</option>
//                     <option value="Pending">{t("PageOrderPending")}</option>
//                     <option value="Processing">
//                       {t("PageOrderProcessing")}
//                     </option>
//                     <option value="Cancel">{t("OrderCancel")}</option>
//                   </Select>
//                 </div>

//                 <div>
//                   <Select onChange={(e) => setTime(e.target.value)}>
//                     <option value="Order limits" defaultValue hidden>
//                       {t("Orderlimits")}
//                     </option>
//                     <option value="5">{t("DaysOrders5")}</option>
//                     <option value="7">{t("DaysOrders7")}</option>
//                     <option value="15">{t("DaysOrders15")}</option>
//                     <option value="30">{t("DaysOrders30")}</option>
//                   </Select>
//                 </div>
//                 <div>
//                   <Select onChange={(e) => setMethod(e.target.value)}>
//                     <option value="Method" defaultValue hidden>
//                       {t("Payment Method")}
//                     </option>

//                     <option value="Cash">{t("Cash")}</option>
//                     <option value="Card">{t("Card")}</option>
//                     <option value="Credit">{t("Credit")}</option>
//                   </Select>
//                 </div>
//                 <div>
//                   {loadingExport ? (
//                     <Button
//                       disabled={true}
//                       type="button"
//                       className="h-12 w-full"
//                     >
//                       <img
//                         src={spinnerLoadingImage}
//                         alt="Loading"
//                         width={20}
//                         height={10}
//                       />{" "}
//                       <span className="font-serif ml-2 font-light">
//                         Processing
//                       </span>
//                     </Button>
//                   ) : (
//                     <button
//                       // onClick={handleDownloadOrders}
//                       disabled={data?.orders?.length <= 0 || loadingExport}
//                       type="button"
//                       className={`${
//                         (data?.orders?.length <= 0 || loadingExport) &&
//                         "opacity-50 cursor-not-allowed bg-blue-600"
//                       } flex items-center justify-center text-sm leading-5 h-12 w-full text-center transition-colors duration-150 font-medium px-6 py-2 rounded-md text-white bg-blue-500 border border-transparent active:bg-blue-600 hover:bg-blue-600 `}
//                     >
//                       Download All Events
//                       <span className="ml-2 text-base">
//                         <IoCloudDownloadOutline />
//                       </span>
//                     </button>
//                   )}
//                 </div>
//               </div>

//               <div className="grid gap-4 lg:gap-6 xl:gap-6 lg:grid-cols-3 xl:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 py-2">
//                 <div>
//                   <Label>Start Date</Label>
//                   <Input
//                     type="date"
//                     name="startDate"
//                     onChange={(e) => setStartDate(e.target.value)}
//                   />
//                 </div>

//                 <div>
//                   <Label>End Date</Label>
//                   <Input
//                     type="date"
//                     name="startDate"
//                     onChange={(e) => setEndDate(e.target.value)}
//                   />
//                 </div>
//                 <div className="mt-2 md:mt-0 flex items-center xl:gap-x-4 gap-x-1 flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
//                   <div className="w-full mx-1">
//                     <Label style={{ visibility: "hidden" }}>Filter</Label>
//                     <Button
//                       type="submit"
//                       className="h-12 w-full bg-blue-700"
//                     >
//                       Filter
//                     </Button>
//                   </div>

//                   <div className="w-full">
//                     <Label style={{ visibility: "hidden" }}>Reset</Label>
//                     <Button
//                       layout="outline"
//                       onClick={handleResetField}
//                       type="reset"
//                       className="px-4 md:py-1 py-3 text-sm dark:bg-gray-700"
//                     >
//                       <span className="text-black dark:text-gray-200">
//                         Reset
//                       </span>
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </form>
//           </CardBody>
//         </Card>
//       </AnimatedContent>
//       {data?.methodTotals?.length > 0 && (
//         <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 rounded-t-lg rounded-0 mb-4">
//           <CardBody>
//             <div className="flex gap-1">
//               {data?.methodTotals?.map((el, i) => (
//                 <div key={i + 1} className="dark:text-gray-300">
//                   {el?.method && (
//                     <>
//                       <span className="font-medium"> {el.method}</span> :{" "}
//                       <span className="font-semibold mr-2">
//                         {currency}
//                         {getNumber(el.total)}
//                       </span>
//                     </>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </CardBody>
//         </Card>
//       )}

//       {loading ? (
//         <TableLoading row={12} col={7} width={160} height={20} />
//       ) : error ? (
//         <span className="text-center mx-auto text-red-500">{error}</span>
//       ) : serviceData?.length !== 0 ? (
//         <TableContainer className="mb-8 dark:bg-gray-900">
//           <Table>
//             <TableHeader>
//               <tr>
//                 <TableCell>
//                   <CheckBox
//                     type="checkbox"
//                     name="selectAll"
//                     id="selectAll"
//                     // handleClick={handleSelectAll}
//                     // isChecked={isCheckAll}
//                   />
//                 </TableCell>
//                 <TableCell>{t("evntName")}</TableCell>
//                 <TableCell>{t("evntDescription")}</TableCell>
//                 <TableCell>{t("evntStartTime")}</TableCell>
//                 <TableCell>{t("evntEndTime")}</TableCell>
//                 <TableCell>{t("evntLocation")}</TableCell>
//                 <TableCell className="text-right">
//                   {t("evntAction")}
//                 </TableCell>
//                 {/* <TableCell>{t("InvoiceNo")}</TableCell>
//                 <TableCell>{t("TimeTbl")}</TableCell>
//                 <TableCell>{t("CustomerName")}</TableCell>
//                 <TableCell>{t("MethodTbl")}</TableCell>
//                 <TableCell>{t("AmountTbl")}</TableCell>
//                 <TableCell>{t("OderStatusTbl")}</TableCell>
//                 <TableCell>{t("ActionTbl")}</TableCell>
//                 <TableCell className="text-right">{t("InvoiceTbl")}</TableCell> */}
//               </tr>
//             </TableHeader>

//             <EventTable events={dataTable} />
//           </Table>

//           <TableFooter>
//             <Pagination
//               totalResults={data?.totalDoc}
//               resultsPerPage={resultsPerPage}
//               onChange={handleChangePage}
//               label="Table navigation"
//             />
//           </TableFooter>
//         </TableContainer>
//       ) : (
//         <NotFound title="Sorry, There are no events right now." />
//       )}
//     </>
//   );
// };

// export default Events;
