import requests from "./httpService";

const UserServices = {
  addUser: async (body) => {
    return requests.post("/user/add", body);
  },
  getAllUsers: async (body) => {
    return requests.get("/user", body);
  },
  getUserById: async (id, body) => {
    return requests.get(`/user/${id}`, body);
  },
  updateUser: async (id, body) => {
    return requests.put(`/user/${id}`, body);
  },
};

export default UserServices;
