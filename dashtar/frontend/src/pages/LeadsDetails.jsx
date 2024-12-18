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
import { FiCheck, FiRefreshCw, FiShoppingCart, FiTruck, FiTrash2 } from "react-icons/fi";
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
    if (!newNote.trim()) return;

    try {
      const response = await LeadsServices.addNote(id, { content: newNote });
      setNotes(response.notes);
      setNewNote('');
      notifySuccess('Note added successfully!');
    } catch (error) {
      console.error('Error adding note:', error);
      notifyError('Failed to add note');
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
              <Textarea
                className="mb-4"
                rows="4"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder={t("Enter new note...")}
              />
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
                    className="p-4 border rounded-lg dark:border-gray-600 relative flex justify-between items-start gap-2"
                  >
                    <div className="flex-grow">
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {formatDate(note.createdAt)}
                      </div>
                      <p className="dark:text-gray-300">{note.content}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      className="text-red-500 hover:text-red-700 flex-shrink-0 p-1"
                    >
                      <FiTrash2 />
                    </button>
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