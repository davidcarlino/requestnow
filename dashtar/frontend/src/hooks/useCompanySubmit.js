import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { notifySuccess, notifyError } from '@/utils/toast';
import CompanyServices from '@/services/CompanyServices';

const useCompanySubmit = (adminInfo) => {
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [companyExists, setCompanyExists] = useState(false);
  const [companyId, setCompanyId] = useState(null);
  const [servicesList, setServicesList] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const getCompanyData = async () => {
    try {
      if (!adminInfo?._id) return;
      
      setIsLoading(true);
      const response = await CompanyServices.getCompany(adminInfo._id);
      
      if (response.exists) {
        setCompanyId(response._id);
        setCompanyExists(true);
        setImageUrl(response.logo);
        setServicesList(response.services || []);
        
        // Pre-fill form data
        setValue('name', response.name);
        setValue('email', response.email);
        setValue('phone', response.phone);
        setValue('services', response.services || []);
      } else {
        // Clear form if no company exists
        setCompanyExists(false);
        setCompanyId(null);
        setImageUrl('');
        setServicesList([]);
        setValue('name', '');
        setValue('email', '');
        setValue('phone', '');
        setValue('services', []);
      }
    } catch (error) {
      console.error('Error fetching company data:', error);
      // Don't show error notification for no company case
      if (error.response?.status !== 404) {
        notifyError(error.message || 'Error fetching company data');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data, id) => {
    try {
      if (!adminInfo?._id) {
        notifyError('User not authenticated');
        return;
      }

      setIsLoading(true);
      const companyData = {
        ...data,
        services: servicesList,
        logo: imageUrl,
        userId: adminInfo._id,
      };

      if (id) {
        await CompanyServices.updateCompany(id, companyData);
        notifySuccess('Company Updated Successfully!');
      } else {
        await CompanyServices.createCompany(companyData);
        notifySuccess('Company Created Successfully!');
        getCompanyData();
      }
    } catch (error) {
      notifyError(error.message || 'Something went wrong!');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    imageUrl,
    setImageUrl,
    isLoading,
    getCompanyData,
    companyExists,
    companyId,
    servicesList,
    setServicesList,
  };
};

export default useCompanySubmit;
