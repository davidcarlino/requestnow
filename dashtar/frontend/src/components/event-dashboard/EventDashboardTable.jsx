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
import { Link } from "react-router-dom";

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
  color: "white"
};

const EventDahboardTable = (props) => {
  const {songs, eventCode} = props
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
    <div className="p-5 font-sans text-black">
      {/* Button group to switch between sections */}
      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
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
      </Card>
      {activeSection === 'songRequests' &&
        <div className="flex justify-center items-center">
          <Link to={`/scan/${eventCode}`}>
            <Button>
              {"Create Song Requests+"}
            </Button>
          </Link>
        </div>
      }
      {/* Card that displays the active table */}
      <Card className="p-5 rounded-lg">
        {renderActiveSection()}
      </Card>
    </div>
    </>
  )

}

export default EventDahboardTable