import {
  Button,
  Card,
  CardBody,
  Input,
  Label,
  Pagination,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
} from "@windmill/react-ui";
import { useContext, useState } from "react";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { FiPlus } from "react-icons/fi";

//internal import
import { notifyError } from "@/utils/toast";
import useAsync from "@/hooks/useAsync";
import useFilter from "@/hooks/useFilter";
import InvoiceServices from "@/services/InvoiceServices";
import NotFound from "@/components/table/NotFound";
import PageTitle from "@/components/Typography/PageTitle";
import { SidebarContext } from "@/context/SidebarContext";
import InvoiceTable from "@/components/invoice/InvoiceTable";
import TableLoading from "@/components/preloader/TableLoading";
import spinnerLoadingImage from "@/assets/img/spinner.gif";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import AnimatedContent from "@/components/common/AnimatedContent";
import MainDrawer from "@/components/drawer/MainDrawer";
import InvoiceDrawer from "@/components/drawer/InvoiceDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import CheckBox from "@/components/form/others/CheckBox";

const MyInvoices = () => {
  const {
    dueTime,
    setDueTime,
    createTime,
    setCreateTime,
    searchText,
    setSearchText,
    searchRef,
    currentPage,
    handleChangePage,
    handleSubmitForAll,
    resultsPerPage,
    toggleDrawer,
  } = useContext(SidebarContext);

  const { t } = useTranslation();

  const [loadingExport, setLoadingExport] = useState(false);

  const { data, loading, error } = useAsync(() =>
    InvoiceServices.getAllInvoices({
      dueTime: dueTime,
      createTime: createTime,
      name: searchText || "",
      page: currentPage,
      limit: resultsPerPage,
    })
  );
  console.log("data", data)
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  const { allId, serviceId } = useToggleDrawer();
  
  const { dataTable, serviceData } = useFilter(data?.invoices);
  console.log("datatable", dataTable)
  const handleSelectAll = () => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(data?.invoices?.map((li) => li._id));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };

  // handle reset field
  const handleResetField = () => {
    setDueTime("");
    setCreateTime("");
    setSearchText("");
    searchRef.current.value = "";
  };

  return (
    <>
      <PageTitle>{t("My Invoices")}</PageTitle>

      <DeleteModal
        ids={allId}
        setIsCheck={setIsCheck}
        title="Selected Invoice"
      />

      <MainDrawer>
        <InvoiceDrawer id={serviceId} />
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
              <br></br>
              <Label style={{ textAlign: 'center', fontSize: '14px', color: 'white' }}>
                Or Search By: 
              </Label>
              <div className="grid gap-4 lg:gap-6 xl:gap-6 lg:grid-cols-3 xl:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 py-2">
                <div>
                  <Label>Date Created</Label>
                  <Input
                    type="date"
                    name="startDate"
                    onChange={(e) => setCreateTime(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Date Due</Label>
                  <Input
                    type="date"
                    name="startDate"
                    onChange={(e) => setDueTime(e.target.value)}
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
                <TableCell>{t("Reference")}</TableCell>
                <TableCell>{t("Services")}</TableCell>
                <TableCell>{t("Invoice Created")}</TableCell>
                <TableCell>{t("Due Date")}</TableCell>
                <TableCell>{t("Amount")}</TableCell>
                <TableCell className="text-right">{t("Action")}</TableCell>
              </tr>
            </TableHeader>

            <InvoiceTable 
              invoices={dataTable} 
              isCheck={isCheck} 
              setIsCheck={setIsCheck}
              fromInvoices={true}
            />
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

export default MyInvoices;
