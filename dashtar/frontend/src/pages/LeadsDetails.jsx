import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Dropdown,
  DropdownItem,
  Textarea,
} from "@windmill/react-ui";
import { useParams } from "react-router";;
import { useTranslation } from 'react-i18next'; // Add this line
import { FiCheck, FiRefreshCw, FiShoppingCart, FiTruck, FiTrash2, FiPaperclip } from "react-icons/fi";
import { notifySuccess, notifyError } from '@/utils/toast';

//internal import
import useAsync from "@/hooks/useAsync";
import PageTitle from "@/components/Typography/PageTitle";
import AnimatedContent from "@/components/common/AnimatedContent";
import LeadsServices from "@/services/LeadsServices";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import { SidebarContext } from "@/context/SidebarContext";
import MainDrawer from "@/components/drawer/MainDrawer";
import LeadsDrawer from "@/components/drawer/MyLeadsDrawer";

const LeadsDetails = () => {
  const { t } = useTranslation(); // Add this line
  const {  toggleDrawer } = useContext(SidebarContext);
  const { id } = useParams();
  const { data, loading } = useAsync(() => LeadsServices.getLeadById(id));
  const { showTimeFormat, showDateFormat, showingTranslateValue } = useUtilsFunction();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [noteAttachments, setNoteAttachments] = useState([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState([]);
  const API_URL = import.meta.env.VITE_APP_API_BASE_URL.replace('/api', '');
  console.log("envv", import.meta.env.VITE_APP_API_BASE_URL)
  console.log("urrrrlrlrl", `${API_URL}/uploads/`)
  console.log('API URL for images:', API_URL);
  useEffect(() => {
    if (data?.notes) {
      setNotes(data.notes);
    }
  }, [data]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handlePrintEventDetails = () => {
    console.log("Printing event details");
  };

  const handlePrintQRCode = () => {
    console.log("Printing QR code");
  };

  const handlePrintInvoice = () => {
    console.log("Printing invoice");
  };

  const handleDrawerChange = (drawer) => {
    setActiveDrawer(drawer);
    toggleDrawer();
  };

  const getRatingDisplay = (rating) => {
    const colors = {
      hot: 'bg-red-500',
      warm: 'bg-yellow-500',
      cold: 'bg-blue-500',
      not_qualified: 'bg-gray-500'
    };

    const displayText = rating
      ?.split('_')
      .map(word => word.toUpperCase())
      .join(' ');

    return (
      <div className="flex items-center gap-2">
        <div 
          className={`w-3 h-3 rounded-full ${colors[rating] || 'bg-gray-300'}`} 
        />
        <span className="text-sm">
          {displayText || 'N/A'}
        </span>
      </div>
    );
  };

  const getServiceDisplay = (service) => {
    return service?.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleSubmitNote = async (e) => {
    e.preventDefault();
    
    // Only proceed if there's either text content or attachments
    if (!newNote.trim() && noteAttachments.length === 0) return;

    const formData = new FormData();
    if (newNote.trim()) {
      formData.append('content', newNote.trim());
    }
    
    // Append multiple files
    noteAttachments.forEach((file, index) => {
      formData.append('files', file);
    });

    try {
      console.log('Submitting note with attachments...'); 
      const response = await LeadsServices.addNote(id, formData);
      setNotes(response.notes);
      setNewNote('');
      setNoteAttachments([]); // Clear attachments
      setAttachmentPreviews([]); // Clear previews
      notifySuccess('Note added successfully!');
    } catch (error) {
      console.error('Error adding note:', error);
      notifyError(error.message || 'Failed to add note');
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const response = await LeadsServices.deleteNote(id, noteId);
      console.log("response", response)
      setNotes(response.notes);
      notifySuccess('Note deleted successfully!');
    } catch (error) {
      console.error('Error deleting note:', error);
      notifyError('Failed to delete note');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const handleAttachmentChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setNoteAttachments(prevAttachments => [...prevAttachments, ...files]);
      
      // Create previews for images
      const newPreviews = files.map(file => {
        if (file.type.startsWith('image/')) {
          return URL.createObjectURL(file);
        }
        return null;
      });
      setAttachmentPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    }
  };

  const removeAttachment = (index) => {
    setNoteAttachments(prev => prev.filter((_, i) => i !== index));
    setAttachmentPreviews(prev => prev.filter((_, i) => i !== index));
  };
  console.log("urrrrlrlrl", `${import.meta.env.VITE_APP_API_URL}/uploads/`)
  return (
    <>
      <MainDrawer>
        <LeadsDrawer id={id} />
      </MainDrawer>
      <PageTitle>{t("Leads Dashboard")}</PageTitle>
      <AnimatedContent>
        <Card className="mb-8">
          <CardBody>
            <div className="mb-8">
              <h2 className="text-heading text-lg md:text-xl lg:text-2xl uppercase font-serif font-semibold dark:text-[aliceblue] mb-4">
                {data?.firstName + " " + data?.lastName}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="font-medium w-16 dark:text-gray-400">Email:</span>
                    <span className="dark:text-gray-300">{data?.email}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="font-medium w-16 dark:text-gray-400">Phone:</span>
                    <span className="dark:text-gray-300">{data?.phone}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="font-medium w-16 dark:text-gray-400">Rating:</span>
                    <span className="dark:text-gray-300">{getRatingDisplay(data?.rating)}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="font-medium w-16 dark:text-gray-400">Service:</span>
                    <span className="dark:text-gray-300">{getServiceDisplay(data?.service)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
        <div className="grid gap-3 lg:gap-3 xl:gap-6 md:gap-2 md:grid-cols-3 py-2 mt-6">
          <Button className="h-12 w-full" onClick={toggleDrawer}>
            {t("Edit Lead")}
          </Button>
          <Button layout="outline" style={{ color: '#000000' }} className="h-12 w-full" >
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
        <Card className="mt-6">
          <CardBody>
            <h3 className="text-lg font-semibold mb-4 dark:text-gray-300">
              {t("Notes")}
            </h3>
            
            <form onSubmit={handleSubmitNote}>
              <div className="relative mb-4">
                <Textarea
                  // className="pl-12 pb-10"
                  rows="4"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder={t("Enter new note...")}
                />
                <div className="absolute left-1 bottom-1 flex items-center gap-2">
                  <label className="cursor-pointer hover:opacity-80 transition-opacity">
                    <input
                      id="noteAttachment"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleAttachmentChange}
                    />
                    <FiPaperclip 
                      className="w-5 h-5 text-gray-500 hover:text-gray-700 transition-colors dark:text-gray-300" 
                    />
                  </label>
                  {noteAttachments.length > 0 && (
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                      {noteAttachments.length} files selected
                    </span>
                  )}
                </div>
              </div>

              {noteAttachments.length > 0 && (
                <div className="mb-4 space-y-2">
                  {noteAttachments.map((file, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {attachmentPreviews[index] ? (
                        <img 
                          src={attachmentPreviews[index]} 
                          alt="Preview" 
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                          <FiPaperclip className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <span className="text-sm text-dark-500 dark:text-gray-300">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <Button type="submit" className="mb-6">
                {t("Add Note")}
              </Button>
            </form>

            <div className="space-y-4">
              {notes.length > 0 && (
                <h4 className="text-md font-semibold mb-3 dark:text-gray-300">
                  {t("Previous Notes")}
                </h4>
              )}
              {notes
                .slice()
                .reverse()
                .map((note) => (
                  <div 
                    key={note._id} 
                    className="p-4 border rounded-lg dark:border-gray-600 relative"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-grow">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          {formatDate(note.createdAt)}
                        </div>
                        <p className="dark:text-gray-300">{note.content}</p>
                        
                        {/* Display attachments */}
                        {note.attachments && note.attachments.length > 0 && (
                          <div className="mt-3">
                            <div className="flex flex-row flex-wrap gap-3">
                              {note.attachments.map((attachment, index) => {
                                const imageUrl = `${API_URL}/uploads/${attachment.fileName}`;
                                console.log('Image URL:', imageUrl);

                                return (
                                  <div key={index} className="flex-shrink-0">
                                    {attachment.mimeType.startsWith('image/') ? (
                                      <div className="relative">
                                        <img 
                                          src={imageUrl}
                                          alt={attachment.originalName} 
                                          crossOrigin="anonymous"
                                          className="rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                          style={{ 
                                            width: '150px',
                                            height: '150px',
                                            objectFit: 'cover'
                                          }}
                                          onClick={() => window.open(imageUrl, '_blank')}
                                          onError={(e) => {
                                            console.error('Image load error:', imageUrl);
                                            e.target.onerror = null;
                                            e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
                                          }}
                                        />
                                      </div>
                                    ) : (
                                      <a 
                                        href={imageUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:text-blue-700 flex items-center gap-2 p-2 border rounded"
                                      >
                                        <FiPaperclip />
                                        <span className="truncate max-w-[140px]">{attachment.originalName}</span>
                                      </a>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteNote(note._id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </CardBody>
        </Card>
      </AnimatedContent>
    </>
  );
}

export default LeadsDetails;