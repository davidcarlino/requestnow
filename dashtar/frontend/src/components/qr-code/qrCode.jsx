import React from "react";
import QRCode from "react-qr-code";

const EventQrCode = ({event}) =>{
  return (
    // <div style={{ height: "auto", margin: "0 auto", maxWidth: 125, width: "100%" }}>
      <QRCode
        size={300}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        value={`https://request.gigmaster.co/songs?code=${event.eventCode}`}
        viewBox={`0 0 256 256`}
      />
    // </div>
  )
}
export default EventQrCode