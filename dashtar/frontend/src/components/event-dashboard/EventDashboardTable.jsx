import React, { useState } from "react";
import {
  Button,
  Table,
  TableCell,
  TableContainer,
  TableHeader,
  TableBody,
  TableRow
} from "@windmill/react-ui";
import { Link } from "react-router-dom";

import useUtilsFunction from "@/hooks/useUtilsFunction";

const EventDahboardTable = (props) => {
  const {songs, eventCode} = props
  const [activeSection, setActiveSection] = useState('songRequests');
  const { showDateFormat } = useUtilsFunction();
  const renderSongRequests = () => (
    <TableContainer className="mb-8 dark:bg-gray-900">
      <Table>
        <TableHeader>
          <tr>
            <TableCell>{"Image"}</TableCell>
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
                <img
                  src={song.image}
                  alt={song.name}
                  className="w-10 h-10 mr-2"
                />
              </TableCell>
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
                  {showDateFormat(song?.releaseDate)}
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
      <div className="grid gap-4 lg:gap-4 xl:gap-6 md:gap-2 md:grid-cols-3 py-2">
        <Button
          onClick={() => setActiveSection('songRequests')}
        >
          {"Song Requests"}
        </Button>
        <Button
          layout="outline"
          onClick={() => setActiveSection('playlists')}
        >
          {"Playlists"}
        </Button>
        <Button
          layout="outline"
          onClick={() => setActiveSection('invoices')}
        >
          {"Invoices"}
        </Button>
      </div>
      {activeSection === 'songRequests' &&
        <div className="flex justify-center items-center mt-2 mb-4">
          <Link to={`/scan/${eventCode}`}>
            <Button>
              {"Create Song Requests+"}
            </Button>
          </Link>
        </div>
      }
      
      {renderActiveSection()}
    </>
  )

}

export default EventDahboardTable