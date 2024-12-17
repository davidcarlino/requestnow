import React, { useContext, useState, useEffect } from 'react';
import { Textarea, Button, Card, CardBody } from '@windmill/react-ui';
import { useTranslation } from 'react-i18next';
import { SidebarContext } from '@/context/SidebarContext';
import EventServices from '@/services/EventServices';
import { Scrollbars } from "react-custom-scrollbars-2";
import { FiTrash2 } from 'react-icons/fi';
import { notifySuccess, notifyError } from '@/utils/toast';

const NotesDrawer = ({ id }) => {
  const { t } = useTranslation();
  const { closeDrawer } = useContext(SidebarContext);
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, [id]);

  const fetchNotes = async () => {
    try {
      const event = await EventServices.getEventById(id);
      setNotes(event.notes || []);
    } catch (error) {
      console.error('Error fetching event notes:', error);
      notifyError('Failed to fetch notes');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      const response = await EventServices.addNote(id, { content: newNote });
      console.log("response", response);
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
      const response = await EventServices.deleteNote(id, noteId);
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
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        <h2>{t("Event Notes")}</h2>
      </div>
      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <Card className="overflow-y-scroll flex-grow scrollbar-hide w-full max-h-full">
          <CardBody>
            <div className="p-6 flex-grow scrollbar-hide w-full max-h-full pb-20">
              <form onSubmit={handleSubmit}>
                <div className="px-6 pt-8 flex-grow scrollbar-hide w-full max-h-full pb-20">
                  <Textarea
                    className="mb-4"
                    rows="4"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder={t("Enter new note...")}
                  />
                  <Button type="submit" className="w-full mb-6">
                    {t("Add Note")}
                  </Button>
                </div>
              </form>

              <div className="space-y-4">
                {notes.length > 0 && (
                  <h3 className="text-lg font-semibold mb-3 dark:text-gray-300">
                    {t("Previous Notes")}
                  </h3>
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
            </div>
          </CardBody>
        </Card>
      </Scrollbars>
    </>
  );
};

export default NotesDrawer; 