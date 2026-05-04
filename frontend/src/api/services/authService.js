import api from "../axiosInstance";

const authService = {
  login: (username, password) =>
    api
      .post("/auth/login", { username, password })
      .then((response) => response.data),
};

export default authService;
