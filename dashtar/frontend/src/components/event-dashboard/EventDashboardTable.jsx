import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Button,
  Table,
  TableCell,
  TableContainer,
  TableHeader,
  TableBody,
  TableRow,
  Card,
  CardBody
} from "@windmill/react-ui";
import { Link } from "react-router-dom";

import useUtilsFunction from "@/hooks/useUtilsFunction";
import SongRequest from "@/pages/SongRequest";
import SongServices from '@/services/SongRequestServices';
import EventServices from "@/services/EventServices";
import Invoice from "@/pages/Invoice";

const API_URL = import.meta.env.VITE_APP_API_BASE_URL.replace('/api', '');

const EventDahboardTable = (props) => {
  console.log("props", props);
  const {songs, eventCode, refreshSongs, invoices} = props
  const [activeSection, setActiveSection] = useState('songRequests');
  const [showSearch, setShowSearch] = useState(false);
  const { showDateFormat } = useUtilsFunction();
  const [songRequests, setSongRequests] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);

  useEffect(() => {
    if (props?.files && Array.isArray(props.files)) {
      setExistingFiles(props.files);
    }
  }, [props.files]);

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

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    setSelectedFiles(prevFiles => [...prevFiles, ...droppedFiles]);
  }, []);

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedFiles(prevFiles => [...prevFiles, ...files]);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });
      
      const response = await EventServices.uploadFiles(eventCode, formData);
      
      setExistingFiles(response.files);
      setSelectedFiles([]);
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return (
        <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    } else if (fileType.includes('pdf')) {
      return (
        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    }
    return (
      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDeleteFile = async (fileId) => {
    try {
      await EventServices.deleteFile(eventCode, fileId);
      setExistingFiles(prevFiles => prevFiles.filter(file => file._id !== fileId));
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const renderFiles = () => (
    <div className="w-full mb-8">
      <Card 
        className={`hover:shadow-lg transition-shadow duration-200 w-full mb-6
          ${isDragging ? 'border-2 border-blue-500 bg-blue-50 dark:bg-gray-800' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardBody className="p-8">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            onChange={handleFileInput}
          />
          <div className="flex flex-col items-center justify-center text-center">
            <svg 
              className="w-16 h-16 mb-4 text-blue-600 dark:text-blue-500"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="mb-2 text-xl font-medium text-gray-600 dark:text-gray-400">
              {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
            </p>
          </div>
        </CardBody>
      </Card>

      {selectedFiles.length > 0 && (
        <div className="mt-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 dark:text-gray-300">Selected Files</h3>
          <div className="grid gap-4">
            {selectedFiles.map((file, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {file.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => removeSelectedFile(index)}
                    className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <Button 
              onClick={handleUpload} 
              disabled={uploading}
              className="px-6"
            >
              {uploading ? 'Uploading...' : 'Upload Selected Files'}
            </Button>
          </div>
        </div>
      )}

      {existingFiles.length > 0 && (
        <Card className="mt-6 dark:bg-gray-800">
          <CardBody>
            <h3 className="text-lg font-semibold mb-4 dark:text-gray-300">Event Files</h3>
            <div className="grid gap-4">
              {existingFiles.map((file, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-600 rounded flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <a
                        href={`${API_URL}/uploads/${file.path.split('uploads/')[1]}`}
                        download={file.name}
                        className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </a>

                      <button 
                        onClick={() => handleDeleteFile(file._id)}
                        className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );

  const renderActiveSection = () => {
    if (activeSection === 'songRequests') {
      return renderSongRequests();
    } else if (activeSection === 'Files') {
      return renderFiles();
    } else if (activeSection === 'invoices') {
      return <Invoice invoices={invoices} eventCode={eventCode}/>;
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