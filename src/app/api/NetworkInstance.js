import axios from "axios";

const NetworkInstance = () => {
  return axios.create({
    baseURL: "https://noir-api-pgco.onrender.com/api/",
  });
};

export default NetworkInstance;
