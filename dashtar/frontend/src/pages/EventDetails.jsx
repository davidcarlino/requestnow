import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  CardBody,
} from "@windmill/react-ui";
import { useParams } from "react-router";
import GoogleMapReact from 'google-map-react';

//internal import
import useAsync from "@/hooks/useAsync";
import PageTitle from "@/components/Typography/PageTitle";
import AnimatedContent from "@/components/common/AnimatedContent";
import EventServices from "@/services/EventServices";
import useUtilsFunction from "@/hooks/useUtilsFunction";

const EventDetails = () => {
  const { id } = useParams();
  const { data, loading } = useAsync(() => EventServices.getEventById(id));
  const {showTimeFormat,showDateFormat, showingTranslateValue } = useUtilsFunction();
  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627
    },
    zoom: 11
  };
  return(
    <>
      <PageTitle>{"Event Dashboard"}</PageTitle>
      <AnimatedContent>
        <div className="grid gap-4 md:grid-cols-2 my-8">
          <Card >
            <CardBody>
              <div className="inline-block overflow-y-auto h-full align-middle transition-all transform">
                <div className="flex flex-col lg:flex-row md:flex-row w-full overflow-hidden">
                  <div className="w-full flex flex-col p-5 md:p-8 text-left">
                    <div className="mb-5 block ">
                      <h2 className="text-heading text-lg md:text-xl lg:text-2xl uppercase font-serif font-semibold font-serif dark:text-gray-400">
                        {data?.name}
                      </h2>
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
                          {showTimeFormat(data?.startTime, "h:mm A")} - {showTimeFormat(data?.endTime,  "h:mm A")}
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
            </CardBody>
          </Card>
          <Card >
            <CardBody>
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <div className="col-span-8 sm:col-span-4">
                  <div style={{ height: '50vh', width: '100%' }}>
                    <GoogleMapReact
                      bootstrapURLKeys={{ key: "" }}
                      yesIWantToUseGoogleMapApiInternals = {true}
                      defaultCenter={defaultProps.center}
                      defaultZoom={defaultProps.zoom}
                      options={{
                        zoomControl: false,
                        fullscreenControl: false
                      }}
                    >
                    </GoogleMapReact>
                  </div>
                </div>
              </div> 
              <div className="font-serif font-bold dark:text-gray-400">
                <p className="font-medium p-1 text-gray-500 dark:text-gray-400 text-sm">
                  {"Location"} :{" "}
                  <span className="font-bold text-gray-500 dark:text-gray-500">
                    {data?.location}
                  </span>
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </AnimatedContent>
    </>
      
  )
}

export default EventDetails;