import React, { useState, useEffect } from 'react';
import { Modal } from '@windmill/react-ui';
import { Input, Button } from '@windmill/react-ui';
import { useTranslation } from 'react-i18next';
import html2pdf from 'html2pdf.js';
import EventQrCode from '../qr-code/qrCode';
import LogoDark from "@/assets/img/logo/logo-dark.png";

const QRCodePrintPopup = ({ isOpen, onClose, event }) => {
  const { t } = useTranslation();
  const [customTitle, setCustomTitle] = useState('');
  const [companyName, setCompanyName] = useState('');  // Default company name

  // Update customTitle when event changes
  useEffect(() => {
    if (event?.name) {
      setCustomTitle(event.name);
    }
  }, [event]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('qr-print-content');
    
    try {
      // Store original styles
      const originalStyles = {
        width: element.style.width,
        padding: element.style.padding
      };
      
      const opt = {
        margin: [0.5, 0.5],
        filename: `${customTitle || 'QR-Code'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          windowWidth: 1200,
          useCORS: true, // Handle cross-origin images
          logging: false // Reduce console noise
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'portrait'
        },
        pagebreak: { mode: 'avoid-all' }
      };

      // Generate PDF from the original element
      await html2pdf().set(opt).from(element).save();

      // Restore original styles
      element.style.width = originalStyles.width;
      element.style.padding = originalStyles.padding;
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      // Restore original styles even if PDF generation fails
      element.style.width = originalStyles.width;
      element.style.padding = originalStyles.padding;
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      className="fixed top-[50vh] left-[50vw] -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white dark:bg-gray-800 z-[9999] overflow-visible"
    >
      <div className="flex flex-col p-4 bg-white dark:bg-gray-800">
        <div className="flex justify-between mb-6">
          <div className="w-1/2 pr-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
              {t("Print QR Code")}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("Custom Title")}
                </label>
                <Input 
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full"
                  placeholder="Enter event title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("Company Name")}
                </label>
                <Input 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full"
                  placeholder="Enter company name"
                />
              </div>
              <div className="flex space-x-3 mt-6">
                <Button onClick={handlePrint} className="bg-blue-500 hover:bg-blue-600">
                  {t("Print")}
                </Button>
                <Button 
                  onClick={handleDownloadPDF} 
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {t("Download PDF")}
                </Button>
              </div>
            </div>
          </div>
          
          <div 
            id="qr-print-content" 
            className="w-1/2 p-6 border rounded-lg bg-white shadow-md print:w-full print:p-16 print:shadow-none print:border-none"
            style={{
              maxWidth: '100%',
              margin: '0 auto',
              boxSizing: 'border-box',
            }}
          >
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-4xl md:text-5xl print:text-7xl font-bold text-center mb-8 text-gray-800 w-full">
                {customTitle}
              </h1>
              <p className="mb-8 text-2xl md:text-3xl print:text-5xl text-center text-gray-600 font-medium w-full">
                <span className="font-bold text-gray-800">{companyName}</span>
              </p>
              <h2 className="text-3xl md:text-4xl print:text-6xl font-bold text-center mb-10 text-gray-700 w-full">
                Request a Song Below
              </h2>
              <div className="flex justify-center mb-10 transform print:scale-175">
                <div className="w-48 h-48 md:w-64 md:h-64 print:w-96 print:h-96">
                  <EventQrCode event={event} />
                </div>
              </div>
              <p className="text-3xl md:text-4xl print:text-6xl text-center text-gray-600 mb-10 w-full">
                <span className="font-bold text-gray-800">{event?.eventCode}</span>
              </p>
              <div className="mb-4 text-center w-full">
                <img
                  src={LogoDark}
                  alt="Logo"
                  className="h-16 md:h-20 print:h-32 mx-auto mb-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default QRCodePrintPopup; 