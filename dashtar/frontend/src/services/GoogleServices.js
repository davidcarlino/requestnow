import requests from './httpService';

export const GoogleServices = {
  initiateGoogleLogin: async () => {
    try {
      const response = await requests.get('/auth/google/url');
      console.log("response", response)
      return response;
    } catch (error) {
      console.error('Error initiating Google login:', error);
      throw error;
    }
  },
};
