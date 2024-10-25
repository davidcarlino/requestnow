import { GoogleServices } from '@/services/GoogleServices';
import { useContext } from 'react';
import { SidebarContext } from '@/context/SidebarContext';
import { useHistory } from 'react-router-dom';

const useGoogleAuth = () => {
  const { setIsAuthenticated } = useContext(SidebarContext);
  const history = useHistory();

  const handleGoogleLogin = async () => {
    try {
      const response = await GoogleServices.initiateGoogleLogin();
      console.log("response", response)
      if (response.url) {
        window.location.href = response.url;
      } else {
        console.error('Google login failed: No URL returned');
      }
    } catch (error) {
      console.error('Error during Google login:', error);
    }
  };

  const handleGoogleCallback = (token) => {
    if (token) {
      localStorage.setItem('adminInfo', JSON.stringify({ token }));
      setIsAuthenticated(true);
      history.push('/dashboard', { replace: true });
    }
  };

  return { handleGoogleLogin, handleGoogleCallback };
};

export default useGoogleAuth;
