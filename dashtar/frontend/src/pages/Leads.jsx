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
  Select,
} from "@windmill/react-ui";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiPlus } from "react-icons/fi";

//internal import
import useAsync from "@/hooks/useAsync";
import useFilter from "@/hooks/useFilter";
import LeadsServices from "@/services/LeadsServices";
import NotFound from "@/components/table/NotFound";
import PageTitle from "@/components/Typography/PageTitle";
import { SidebarContext } from "@/context/SidebarContext";
import LeadsTable from "@/components/leads/LeadsTable";
import TableLoading from "@/components/preloader/TableLoading";
import AnimatedContent from "@/components/common/AnimatedContent";
import MainDrawer from "@/components/drawer/MainDrawer";
import LeadsDrawer from "@/components/drawer/MyLeadsDrawer";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import CheckBox from "@/components/form/others/CheckBox";

const Leads = () => {
  const {
    setEndDate,
    setStartDate,
    setSearchText,
    searchRef,
    handleChangePage,
    handleSubmitForAll,
    resultsPerPage,
    toggleDrawer
  } = useContext(SidebarContext);

  const { t } = useTranslation();
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  const { data, loading, error } = useAsync(() =>
    LeadsServices.getAllLeads()
  );
  console.log("data", data);
  const { allId, serviceId } = useToggleDrawer();
  const { dataTable, serviceData } = useFilter(data?.leads);

  const handleSelectAll = () => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(data?.leads?.map((li) => li._id));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };

  // handle reset field
  const handleResetField = () => {
    setEndDate("");
    setStartDate("");
    setSearchText("");
    searchRef.current.value = "";
  };

  return (
    <>
      <PageTitle>{t("My Leads")}</PageTitle>

      <MainDrawer>
        <LeadsDrawer id={serviceId} />
      </MainDrawer>

      <AnimatedContent>
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <CardBody>
            <form
              onSubmit={handleSubmitForAll}
              className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
            >
              <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <Input
                  ref={searchRef}
                  type="search"
                  name="search"
                  placeholder={t("StaffSearchBy")}
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 mt-5 mr-1"
                ></button>
              </div>
              <div className="mt-2 md:mt-0 flex items-center xl:gap-x-4 gap-x-1 flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <div className="w-full mx-1">
                  <Button type="submit" className="h-12 w-full bg-emerald-700">
                    Filter
                  </Button>
                </div>

                <div className="w-full">
                  <Button
                    layout="outline"
                    onClick={handleResetField}
                    type="reset"
                    className="px-4 md:py-1 py-3 text-sm dark:bg-gray-700"
                  >
                    <span className="text-black dark:text-gray-200">Reset</span>
                  </Button>
                </div>
              </div>
              
              <div className="w-full md:w-56 lg:w-56 xl:w-56">
                <Button
                  onClick={toggleDrawer}
                  className="w-full rounded-md h-12"
                >
                  <span className="mr-3">
                    <FiPlus />  
                  </span>
                  {t("Add Lead")}
                </Button>
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
                <TableCell>{t("Name")}</TableCell>
                <TableCell>{t("Email")}</TableCell>
                <TableCell>{t("Service")}</TableCell>
                <TableCell>{t("Contact Number")}</TableCell>
                <TableCell>{t("Rating")}</TableCell>
                <TableCell className="text-right">{t("Actions")}</TableCell>
              </tr>
            </TableHeader>
            <LeadsTable 
              leads={dataTable} 
              isCheck={isCheck} 
              setIsCheck={setIsCheck}
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
        <NotFound title="Sorry, There are no leads right now." />
      )}
    </>
  );
};

export default Leads;
