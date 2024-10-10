import React from "react";
import QRCode from "react-qr-code";

const EventQrCode = ({event}) =>{
  console.log("event", event)
  return (
    // <div style={{ height: "auto", margin: "0 auto", maxWidth: 125, width: "100%" }}>
      <QRCode
        size={300}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        // value={JSON.stringify({
        //   url: "http://localhost:4100/event/66fa4e747d3aa11d3dec8a40/dashboard",
        //   name: event.name,
        //   description: event.description,
        //   startTime: event.startTime,
        //   endTime: event.endTime,
        //   venue: event.venue ? event.venue.address : 'Not specified',
        // })}
        value={`https://gigmaster.co/request/index.php?code=${event.eventCode}`}
        viewBox={`0 0 256 256`}
      />
    // </div>
  )
}
export default EventQrCode