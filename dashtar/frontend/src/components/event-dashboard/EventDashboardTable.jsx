import React, { useState } from "react";
import {
  Button,
  Card,
  Table,
  TableCell,
  TableContainer,
  TableHeader,
  TableBody,
  TableRow
} from "@windmill/react-ui";

const dashboardStyle = {
  padding: '20px',
  fontFamily: 'Arial, sans-serif',
  color: 'white',
};
const buttonStyle = {
  backgroundColor: '#f5f5f5',
  color: 'black',
  border: 'none',
  padding: '10px 15px',
  cursor: 'pointer',
  borderRadius: '5px',
  marginRight: '10px',
};

const activeButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#3b82f6',
};

const cardStyle = {
  padding: '20px',
  borderRadius: '8px',
};

const EventDahboardTable = (props) => {
  const {songs} = props
  const [activeSection, setActiveSection] = useState('songRequests');
    
  const renderSongRequests = () => (
    <TableContainer className="mb-8 dark:bg-gray-900">
      <Table>
        <TableHeader>
          <tr>
            <TableCell>{"Song Title"}</TableCell>
            <TableCell>{"Artist"}</TableCell>
            <TableCell>{"Album"}</TableCell>
            <TableCell>{"Year"}</TableCell>
          </tr>
        </TableHeader>
        <TableBody className="dark:bg-gray-900">
          {songs?.map((song, i) => (
            <TableRow key={i + 1}>
              <TableCell>
                <span className="text-sm">
                  {song?.name}
                </span>
              </TableCell>

              <TableCell>
                <span className="text-sm">
                  {song?.artist}
                </span>
              </TableCell>

              <TableCell>
                <span className="text-sm">
                  {song?.album}
                </span>
              </TableCell>

              <TableCell>
                <span className="text-sm">
                  {song?.year}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderPlaylists = () => (
    <TableContainer className="mb-8 dark:bg-gray-900">
      <Table>
        <TableHeader>
          <tr>
          </tr>
        </TableHeader>
      </Table>
    </TableContainer>
  );

  const renderInvoices = () => (
    <TableContainer className="mb-8 dark:bg-gray-900">
      <Table>
        <TableHeader>
          <tr>
          </tr>
        </TableHeader>
      </Table>
    </TableContainer>
  );
  const renderActiveSection = () => {
    if (activeSection === 'songRequests') {
      return renderSongRequests();
    } else if (activeSection === 'playlists') {
      return renderPlaylists();
    } else if (activeSection === 'invoices') {
      return renderInvoices();
    }
  };

  return (
    <>
    <div style={dashboardStyle}>
      {/* Button group to switch between sections */}
      <div className="grid gap-4 lg:gap-4 xl:gap-6 md:gap-2 md:grid-cols-3 py-2">
        <Button
          style={activeSection === 'songRequests' ? activeButtonStyle : buttonStyle}
          onClick={() => setActiveSection('songRequests')}
        >
          {"Song Requests"}
        </Button>
        <Button
          style={activeSection === 'playlists' ? activeButtonStyle : buttonStyle}
          onClick={() => setActiveSection('playlists')}
        >
          {"Playlists"}
        </Button>
        <Button
          style={activeSection === 'invoices' ? activeButtonStyle : buttonStyle}
          onClick={() => setActiveSection('invoices')}
        >
          {"Invoices"}
        </Button>
      </div>

      {/* Card that displays the active table */}
      <Card style={cardStyle}>
        {renderActiveSection()}
      </Card>
    </div>
    </>
  )

}

export default EventDahboardTable