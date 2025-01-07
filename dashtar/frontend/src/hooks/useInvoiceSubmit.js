import { useForm } from "react-hook-form";
import { useContext, useEffect, useState } from "react";

//internal import
import { notifyError, notifySuccess } from "@/utils/toast";
import InvoiceServices from "@/services/InvoiceServices";
import { SidebarContext } from "@/context/SidebarContext";
import LeadsServices from "@/services/LeadsServices";

const useInvoiceSubmit = (id, eventCode) => {
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
				console.log("response", response);
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

  const onSubmit = async (data) => {
    console.log("innnnfdata", data);
    try {
      setIsSubmitting(true);
      const invoiceData = {
        reference: data.reference,
        description: data.description,
        amount: parseFloat(data.amount),
        dueDate: data.dueDate,
        services: data.services,
        status: 'pending',
        files: data.files || []
      };

      if (id) {
        const res = await InvoiceServices.updateInvoice(id, invoiceData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
      } else {
        const res = await InvoiceServices.addInvoiceToEvent(eventCode, invoiceData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
      }
    } catch (err) {
      notifyError(err ? err?.response?.data?.message : err?.message);
      setIsSubmitting(false);
    }
  };

  const getInvoiceData = async () => {
    try {
      const res = await InvoiceServices.getInvoiceById(id);
      if (res) {
        setResData(res);
        setValue("reference", res.reference);
        setValue("description", res.description);
        setValue("amount", res.amount);
        setValue("dueDate", new Date(res.dueDate).toISOString().split('T')[0]);
        setValue("services", res.services);
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
      setValue("amount", "");
      setValue("dueDate", "");
      setValue("services", "");
      clearErrors("reference");
      clearErrors("description");
      clearErrors("amount");
      clearErrors("dueDate");
      clearErrors("services");
      setLanguage(lang);
      return;
    }
    if (id) {
      getInvoiceData();
    } else {
      // Set sequential invoice number for new invoices
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
