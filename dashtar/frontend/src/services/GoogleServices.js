import requests from './httpService';

export const GoogleServices = {
  initiateGoogleLogin: async () => {
    try {
      const response = await requests.get('/auth/google/url');
      return response;
    } catch (error) {
      console.error('Error initiating Google login:', error);
      throw error;
    }
  },

  handleGoogleCallback: async (code) => {
    try {
      const response = await requests.get(`/auth/google/callback?code=${code}`);
      return response;
    } catch (error) {
      console.error('Error handling Google callback:', error);
      throw error;
    }
  },
};
