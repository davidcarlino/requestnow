import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Dropdown,
  DropdownItem,
} from "@windmill/react-ui";
import { useParams } from "react-router";;
import { useTranslation } from 'react-i18next'; // Add this line
import { FiCheck, FiRefreshCw, FiShoppingCart, FiTruck } from "react-icons/fi";

//internal import
import useAsync from "@/hooks/useAsync";
import PageTitle from "@/components/Typography/PageTitle";
import AnimatedContent from "@/components/common/AnimatedContent";
import EventServices from "@/services/EventServices";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import { SidebarContext } from "@/context/SidebarContext";
import MapComponent from "@/components/googleMap/googleMap"
import MainDrawer from "@/components/drawer/MainDrawer";
import EventDrawer from "@/components/drawer/EventDrawer";
import EventQrCode from "@/components/qr-code/qrCode"; 
import EventDahboardTable from "@/components/event-dashboard/EventDashboardTable";
import NotesDrawer from "@/components/drawer/NotesDrawer";
import QRCodePrintPopup from '@/components/print/QRCodePrintPopup';

const EventDetails = () => {
  const { t } = useTranslation(); // Add this line
  const {  toggleDrawer } = useContext(SidebarContext);
  const { id } = useParams();
  const { data, loading } = useAsync(() => EventServices.getEventById(id));
  const { showTimeFormat, showDateFormat, showingTranslateValue } = useUtilsFunction();
  const [songRequests, setSongRequests] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState('event');
  const [isQRPrintPopupOpen, setIsQRPrintPopupOpen] = useState(false);

  useEffect(() => {
    if (data?.songRequests) {
      setSongRequests(data.songRequests);
    }
  }, [data]);

  const refreshSongs = async () => {
    try {
      const updatedEvent = await EventServices.getEventById(id);
      setSongRequests(updatedEvent.songRequests);
    } catch (error) {
      console.error('Error refreshing songs:', error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handlePrintEventDetails = () => {
    console.log("Printing event details");
  };

  const handlePrintQRCode = () => {
    if (!data?.eventCode) {
      notifyError('No event code available to print');
      return;
    }
    setIsQRPrintPopupOpen(true);
  };

  const handlePrintInvoice = () => {
    console.log("Printing invoice");
  };

  const handleDrawerChange = (drawer) => {
    setActiveDrawer(drawer);
    toggleDrawer();
  };

  const handleCloseQRPrintPopup = () => {
    setIsQRPrintPopupOpen(false);
  };

  return (
    <>
      <MainDrawer>
        {activeDrawer === 'event' ? (
          <EventDrawer id={id} />
        ) : (
          <NotesDrawer id={id} />
        )}
      </MainDrawer>
      <PageTitle>{"Event Dashboard"}</PageTitle>
      <AnimatedContent>
        <div className="grid gap-3 lg:gap-3 xl:gap-6 md:gap-2 md:grid-cols-3 py-2"> 
          <Button className="h-12 w-full" onClick={() => handleDrawerChange('event')}>
            {t("Edit Event")}
          </Button>
          <Button className="h-12 w-full" onClick={() => handleDrawerChange('notes')} >
            {t("Notes")}
          </Button>
          <div className="relative">
            <Button
              className="h-12 w-full"
              onClick={toggleDropdown}
            >
              {t("PrintButton")}
            </Button>
            {isDropdownOpen && (
              <Dropdown
                className="z-50"
                isOpen={isDropdownOpen}
                onClose={() => setIsDropdownOpen(false)}
              >
                <DropdownItem className="dark:text-gray-100" onClick={handlePrintEventDetails}>
                  {t("Print Event Details")}
                </DropdownItem>
                <DropdownItem className="dark:text-gray-100" onClick={handlePrintQRCode}>
                  {t("Print Song Request QR Code")}
                </DropdownItem>
                <DropdownItem className="dark:text-gray-100" onClick={handlePrintInvoice}>
                  {t("PrintInvoice")}
                </DropdownItem>
              </Dropdown>
            )}
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 my-8">
          <Card>
            <CardBody>
              <div className="inline-block overflow-y-auto h-full align-middle transition-all transform">
                <div className="flex flex-col lg:flex-row md:flex-row w-full overflow-hidden">
                  <div className="w-full flex flex-col p-5 md:p-8 text-left">
                    <div className="mb-5 block">
                      <h2 className="text-heading text-lg md:text-xl lg:text-2xl uppercase font-serif font-semibold font-serif dark:text-[aliceblue]">
                        {data?.name}
                      </h2>
                    </div>
                    <div className="font-serif font-bold dark:text-gray-400">
                      <p className="font-medium p-1 text-gray-500 dark:text-gray-400 text-sm">
                        {"Address"} :{" "}
                        <span className="font-bold text-gray-500 dark:text-gray-500">
                          {data.venue?.address}
                        </span>
                      </p>
                    </div>
                    <div className="font-serif font-bold dark:text-gray-400">
                      <p className="font-medium p-1 text-gray-500 dark:text-gray-400 text-sm">
                        {"Description"} :{" "}
                        <span className="font-bold text-gray-500 dark:text-gray-500">
                          {data?.description}
                        </span>
                      </p>
                    </div>
                    <div className="font-serif font-bold dark:text-gray-400">
                      <p className="font-medium p-1 text-gray-500 dark:text-gray-400 text-sm">
                        {"Date"} :{" "}
                        <span className="font-bold text-gray-500 dark:text-gray-500">
                          {showDateFormat(data?.startTime)} - {showDateFormat(data?.endTime)}
                        </span>
                      </p>
                    </div>
                    <div className="font-serif font-bold dark:text-gray-400">
                      <p className="font-medium p-1 text-gray-500 dark:text-gray-400 text-sm">
                        {"Time"} :{" "}
                        <span className="font-bold text-gray-500 dark:text-gray-500">
                          {showTimeFormat(data?.startTime, "h:mm A")} - {showTimeFormat(data?.endTime, "h:mm A")}
                        </span>
                      </p>
                    </div>
                    <div className="font-serif font-bold dark:text-gray-400">
                      <p className="font-medium p-1 text-gray-500 dark:text-gray-400 text-sm">
                        {"Category"} :{" "}
                        <span className="font-bold text-gray-500 dark:text-gray-500">
                          {data?.category}
                        </span>
                      </p>
                    </div>
                    <div className="font-serif font-bold dark:text-gray-400">
                      <p className="font-medium p-1 text-gray-500 dark:text-gray-400 text-sm">
                        {"Custom Category"} :{" "}
                        <span className="font-bold text-gray-500 dark:text-gray-500">
                          {data?.category}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid gap-1 md:grid-cols-1 xl:grid-cols-1">
                <Card className="flex h-full">
                  <CardBody className="border border-gray-200 dark:border-gray-800 w-full rounded-lg">
                    <div className="grid gap-4 lg:gap-4 xl:gap-6 md:gap-2 md:grid-cols-2 py-2">
                      <div className="flex flex-col items-center justify-center mb-5">
                        <div className="flex flex-col items-center">
                          <h2 className="leading-none font-medium text-gray-600 dark:text-gray-200 uppercase mb-4">
                            Event Code:
                          </h2>
                          <p className="text-2xl text-heading text-lg md:text-xl lg:text-2xl uppercase font-serif font-semibold dark:text-gray-400">
                            {data.eventCode !== "false" ? data.eventCode : ""}
                          </p>
                        </div>
                      </div>
                      <div id="event-qr-code">
                        <EventQrCode event={data}/> 
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div>
                <div>
                  <MapComponent register={() => {}} setValue={() => {}} resData={data} label ="eventDashboard"/>
                </div>
              </div>
              <div className="font-serif font-bold dark:text-gray-400 mt-4">
                <span className="font-bold text-gray-500 dark:text-gray-500">
                  {data.venue?.address}
                </span> 
              </div>
            </CardBody>
          </Card>
        </div>
        <EventDahboardTable 
          songs={songRequests} 
          eventCode={data?.eventCode}
          refreshSongs={refreshSongs}
          files={data?.files || []}
        />
      </AnimatedContent>
      <QRCodePrintPopup 
        isOpen={isQRPrintPopupOpen}
        onClose={handleCloseQRPrintPopup}
        event={data}
      />
    </>
  );
}

export default EventDetails;