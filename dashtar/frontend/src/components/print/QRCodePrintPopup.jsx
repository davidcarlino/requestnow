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
    
    if (!element) {
      console.error("QR print content element not found.");
      return;
    }
  
    try {
      // Clone the element to avoid modifying the original one
      const clone = element.cloneNode(true);
  
      // Add a temporary class for consistent styles to the cloned element
      clone.classList.add('pdf-render');
      
      // Wrap the clone in a container for rendering
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.top = '-9999px';
      container.style.left = '-9999px';
      container.appendChild(clone);
      document.body.appendChild(container);
  
      const opt = {
        margin: 0,
        filename: `${customTitle || 'QR-Code'}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: {
          scale: 3, // Increase scale for better quality
          useCORS: true,
        },
        jsPDF: {
          unit: 'pt',
          format: 'a4',
          orientation: 'portrait',
        },
      };
  
      // Generate PDF from the cloned element
      await html2pdf().set(opt).from(clone).save();
  
      // Clean up the cloned element and container
      document.body.removeChild(container);
    } catch (error) {
      console.error('PDF generation failed:', error);
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
            className="w-1/2 p-6 rounded-lg bg-white print:w-full print:min-h-[297mm] print:p-0 print:m-0"
            style={{
              maxWidth: '100%',
              margin: '0 auto',
              boxSizing: 'border-box',
            }}
          >
            <div className="flex flex-col items-center justify-between min-h-full py-8 print:py-16 print:px-8 print:min-h-[297mm]">
              <div className="print:mb-4">
                <h1 className="text-4xl md:text-5xl print:text-6xl font-bold text-center mb-4 print:mb-6 text-gray-800 w-full uppercase">
                  {customTitle}
                </h1>
                <h2 className="mb-4 text-2xl md:text-3xl print:text-4xl text-center text-gray-600 font-bold w-full print:mb-6">
                  <span className="font-bold text-gray-800">{companyName}</span>
                </h2>
              </div>
              <div className="print:mb-2">
                <h3 className="text-3xl md:text-4xl print:text-5xl font-bold text-center mb-6 print:mb-4 text-gray-700 w-full">
                  <span className="first-line">Request a</span>
                  <span className="second-line">Song Below</span>
                </h3>
              </div>
              <div className="flex justify-center print:mb-8 mb-8">
                <div className="w-48 h-48 md:w-64 md:h-64 print:w-[500px] print:h-[500px] qr-code-container">
                  <EventQrCode event={event} />
                </div>
              </div>

              <div className="print:mb-8">
                <h4 className="text-3xl md:text-4xl print:text-7xl text-center text-gray-600 mb-6 print:mb-8 w-full mt-2">
                  <span className="font-bold text-gray-800">{event?.eventCode}</span>
                </h4>
              </div>
              <div className="text-center w-full">
                <img
                  src={LogoDark}
                  alt="Logo"
                  className="h-16 md:h-20 print:h-28 mx-auto"
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