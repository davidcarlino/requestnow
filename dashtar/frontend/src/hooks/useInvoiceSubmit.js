import { useForm } from "react-hook-form";
import { useContext, useEffect, useState } from "react";

//internal import
import { notifyError, notifySuccess } from "@/utils/toast";
import InvoiceServices from "@/services/InvoiceServices";
import { SidebarContext } from "@/context/SidebarContext";
import LeadsServices from "@/services/LeadsServices";

const useInvoiceSubmit = (id, eventCode) => {
  console.log("id", id)
  const { isDrawerOpen, closeDrawer, setIsUpdate, lang } = useContext(SidebarContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [language, setLanguage] = useState(lang || "en");
  const [resData, setResData] = useState({});
	const [companyServices, setCompanyServices] = useState([]);
  const [lastInvoiceNumber, setLastInvoiceNumber] = useState(0);

  // Add companyServices state
  useEffect(() => {
		const fetchServices = async () => {
			try {
				const response = await LeadsServices.getCompanyServices();
				setCompanyServices(response.services);
			} catch (error) {
				console.error('Error fetching services:', error);
				setCompanyServices([]);
			}
		};
		
		fetchServices();
	}, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  // Function to get the last invoice number from existing invoices
  const getLastInvoiceNumber = async () => {
    try {
      const response = await InvoiceServices.getAllInvoices();
      const invoices = response.invoices || [];
      
      if (invoices.length > 0) {
        // Extract numbers from reference strings and find the highest one
        const numbers = invoices.map(invoice => {
          const match = invoice.reference.match(/INV-(\d+)/);
          return match ? parseInt(match[1]) : 0;
        });
        const maxNumber = Math.max(...numbers);
        setLastInvoiceNumber(maxNumber);
      }
    } catch (error) {
      console.error('Error fetching last invoice number:', error);
    }
  };

  // Modified generateInvoiceNumber to use sequential numbering
  const generateInvoiceNumber = () => {
    const nextNumber = (lastInvoiceNumber + 1).toString().padStart(6, '0');
    return `INV-${nextNumber}`;
  };

  // Fetch last invoice number when component mounts
  useEffect(() => {
    getLastInvoiceNumber();
  }, []);

  const onSubmit = async (data, attachedFiles) => {
    try {
      setIsSubmitting(true);
      
      // Create FormData object
      const formData = new FormData();
      
      // Append all form fields
      formData.append('reference', data.reference);
      formData.append('description', data.description);
      formData.append('amount', data.amount);
      formData.append('dueDate', data.dueDate);
      formData.append('eventCode', eventCode);
      
      // Handle multiple services
      if (Array.isArray(data.services)) {
        data.services.forEach(service => {
          formData.append('services', service);
        });
      } else {
        formData.append('services', data.services);
      }

      // Handle files from attachedFiles state
      if (attachedFiles && attachedFiles.length > 0) {
        attachedFiles.forEach(file => {
          formData.append('files', file);
        });
      }

      let res;
      if (id) {
        res = await InvoiceServices.updateInvoice(id, formData);
      } else {
        res = await InvoiceServices.addInvoiceToEvent(eventCode, formData);
      }

      setIsUpdate(true);
      setIsSubmitting(false);
      notifySuccess(res.message);
      closeDrawer();
    } catch (err) {
      console.error('Error submitting invoice:', err);
      notifyError(err ? err?.response?.data?.message : err?.message);
      setIsSubmitting(false);
    }
  };

  const getInvoiceData = async () => {
    try {
      const res = await InvoiceServices.getInvoiceById(id);
      console.log("res", res)
      if (res) {
        setResData(res);
        setValue("reference", res.reference);
        setValue("description", res.description);
        setValue("services", res.services);
        setValue("amount", res.amount);
        setValue("createdDate", new Date(res.createdAt).toISOString().split('T')[0]);
        setValue("dueDate", new Date(res.dueDate).toISOString().split('T')[0]);
      }
    } catch (err) {
      notifyError(err ? err?.response?.data?.message : err?.message);
    }
  };

  const handleSelectLanguage = (lang) => {
    setLanguage(lang);
  };

  useEffect(() => {
    if (!isDrawerOpen) {
      setResData({});
      setValue("reference", "");
      setValue("description", "");
      setValue("services", "");
      setValue("amount", "");
      setValue("createdDate", "");
      setValue("dueDate", "");
      clearErrors("reference");
      clearErrors("description");
      clearErrors("services");
      clearErrors("amount");
      clearErrors("createdDate");
      clearErrors("dueDate");
      setLanguage(lang);
      return;
    }
    if (id) {
      getInvoiceData();
    } else {
      // For new invoices, set current date as createdDate
      setValue("reference", generateInvoiceNumber());
    }
  }, [id, setValue, isDrawerOpen, clearErrors, lang, lastInvoiceNumber]);

  return {
    register,
    handleSubmit,
    watch,
    errors,
    language,
    isSubmitting,
    onSubmit,
    resData,
    setValue,
    handleSelectLanguage,
    companyServices,
  };
};

export default useInvoiceSubmit;
