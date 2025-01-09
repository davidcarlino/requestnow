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
import InvoiceServices from "@/services/InvoiceServices";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import { SidebarContext } from "@/context/SidebarContext";
import MainDrawer from "@/components/drawer/MainDrawer";
import InvoiceDrawer from "@/components/drawer/InvoiceDrawer";

const InvoiceDetails = () => {
  const { t } = useTranslation(); // Add this line
  const {  toggleDrawer } = useContext(SidebarContext);
  const { id } = useParams();
  const { data, loading } = useAsync(() => InvoiceServices.getInvoiceById(id));
  const { showDateFormat, currency } = useUtilsFunction();
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [noteAttachments, setNoteAttachments] = useState([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState([]);
  const API_URL = import.meta.env.VITE_APP_API_BASE_URL.replace('/api', '');

  useEffect(() => {
    if (data?.notes) {
      setNotes(data.notes);
    }
  }, [data]);

  const getPaymentStatusDisplay = (amount, paidAmount = 0) => {
    const colors = {
      paid: 'bg-green-500',
      partial: 'bg-yellow-500',
      unpaid: 'bg-red-500'
    };

    let status = 'unpaid';
    let displayText = 'NOT PAID';

    if (paidAmount >= amount) {
      status = 'paid';
      displayText = 'PAID';
    } else if (paidAmount > 0) {
      status = 'partial';
      displayText = 'PARTIALLY PAID';
    }

    return (
      <div className="flex items-center gap-2">
        <div 
          className={`w-3 h-3 rounded-full ${colors[status]}`} 
        />
        <span className="text-sm">
          {displayText}
        </span>
      </div>
    );
  };

  const handleSubmitNote = async (e) => {
    e.preventDefault();
    
    if (!newNote.trim() && noteAttachments.length === 0) return;

    const formData = new FormData();
    if (newNote.trim()) {
      formData.append('content', newNote.trim());
    }
    
    noteAttachments.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await InvoiceServices.addNote(id, formData);
      setNotes(response.notes);
      setNewNote('');
      setNoteAttachments([]);
      setAttachmentPreviews([]);
      notifySuccess('Note added successfully!');
    } catch (error) {
      console.error('Error adding note:', error);
      notifyError(error.message || 'Failed to add note');
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const response = await InvoiceServices.deleteNote(id, noteId);
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

	const formatServices = (services) => {
    if (!services) return '';
    if (typeof services === 'string') return services;
    if (Array.isArray(services)) {
      return services.length === 1 ? services[0] : services.join(', ');
    }
    return '';
  };

  return (
    <>
			<MainDrawer>
				<InvoiceDrawer id={id} />
			</MainDrawer>
      <PageTitle>{t("Invoice")}: {data?.reference}</PageTitle>
      <AnimatedContent>
        <div className="grid gap-3 lg:gap-3 xl:gap-6 md:gap-2 md:grid-cols-3 py-2">
          <Button className="h-12 w-full" onClick={toggleDrawer}>
            {t("Edit Invoice")}
          </Button>
          <Button layout="outline" style={{ color: '#000000' }} className="h-12 w-full" >
            {t("Export/Print")}
          </Button>
          <div className="relative">
            <Button
              className="h-12 w-full"
            >
              {t("Send Invoice")}
            </Button>
          </div>
        </div>
        <Card className="mb-8 mt-6">
          <CardBody>
            <div className="mb-8">
              <h2 className="text-heading text-lg md:text-xl lg:text-2xl uppercase font-serif font-semibold dark:text-[aliceblue] mb-4">
                {data?.description}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="font-medium w-24 dark:text-gray-400">Service:</span>
                    <span className="w-full dark:text-gray-300">{formatServices(data?.services)}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="font-medium w-24 dark:text-gray-400">Due Date:</span>
                    <span className="w-full dark:text-gray-300">{showDateFormat(data?.dueDate)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="font-medium w-24 dark:text-gray-400">Amount:</span>
                    <span className="w-full dark:text-gray-300">{currency} {data?.amount}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="font-medium w-24 dark:text-gray-400">Status:</span>
                    <span className="w-full dark:text-gray-300">{getPaymentStatusDisplay(data?.amount, data?.paidAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
        
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
                                const imageUrl = `${API_URL}/uploads/invoices/${id}/${attachment.fileName}`;
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

export default InvoiceDetails;