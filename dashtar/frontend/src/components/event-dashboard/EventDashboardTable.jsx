import React, { useEffect, useState } from "react";
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
import SongRequest from "@/pages/SongRequest";
import SongServices from '@/services/SongRequestServices';

const EventDahboardTable = (props) => {
  const {songs, eventCode, refreshSongs} = props
  const [activeSection, setActiveSection] = useState('songRequests');
  const [showSearch, setShowSearch] = useState(false);
  const { showDateFormat } = useUtilsFunction();
  const [songRequests, setSongRequests] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  console.log("activeSection", activeSection);
  const renderSongRequests = () => (
    <TableContainer className="mb-8 dark:bg-gray-900">
      {isRefreshing ? (
        <div className="text-center py-4">Refreshing...</div>
      ) : (
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
      )}
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
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshSongs();
    setIsRefreshing(false);
  };
  
  return (
    <>
      <div className="grid gap-4 lg:gap-4 xl:gap-6 md:gap-2 md:grid-cols-3 py-2">
        <Button
          layout={activeSection === 'songRequests' ? 'primary' : 'outline'}
          style={{ color: activeSection === 'songRequests' ? 'white' : '#000000' }}
          onClick={() => setActiveSection('songRequests')}
        >
          {"Song Requests"}
        </Button>
        <Button
          layout={activeSection === 'Files' ? 'primary' : 'outline'}
          style={{ color: activeSection === 'Files' ? 'white' : '#000000' }}
          onClick={() => setActiveSection('Files')}
        >
          {"Files"}
        </Button>
        <Button
          layout={activeSection === 'invoices' ? 'primary' : 'outline'}
          style={{ color: activeSection === 'invoices' ? 'white' : '#000000' }}
          onClick={() => setActiveSection('invoices')}
        >
          {"Invoices"}
        </Button>
      </div>
      {activeSection === 'songRequests' &&
        <div className="flex flex-col gap-4 justify-center items-center mt-2 mb-4">
          <Button onClick={() => setShowSearch(!showSearch)}>
            {"Search A Song"}
          </Button>
          
          {showSearch && (
            <div className="w-full">
              <SongRequest 
                eventId={eventCode} 
                showSearch={showSearch}
                setShowSearch={setShowSearch}
                onSongSubmitted={handleRefresh}
              />
            </div>
          )}
        </div>
      }
      
      {renderActiveSection()}
    </>
  )

}

export default EventDahboardTable