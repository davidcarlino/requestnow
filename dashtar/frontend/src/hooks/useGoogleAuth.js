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
      if (response.url) {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        window.location.href = response.url;
      } else {
        console.error('Google login failed: No URL returned');
      }
    } catch (error) {
      console.error('Error during Google login:', error);
    }
  };

  const handleGoogleCallback = async (code) => {
    try {
      const response = await GoogleServices.handleGoogleCallback(code);
      
      if (response.success && response.token) {
        localStorage.setItem('adminInfo', JSON.stringify({
          token: response.token,
          ...response.admin
        }));
        
        setIsAuthenticated(true);
        
        const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/dashboard';
        sessionStorage.removeItem('redirectAfterLogin');
        
        history.push(redirectPath, { replace: true });
      }
    } catch (error) {
      console.error('Error handling Google callback:', error);
      history.push('/login', { replace: true });
    }
  };

  return { handleGoogleLogin, handleGoogleCallback };
};

export default useGoogleAuth;
