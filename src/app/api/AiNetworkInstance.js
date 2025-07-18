import axios from "axios";

const AiNetworkInstance = () => {
  return axios.create({
    baseURL: "https://noir-ai-api.onrender.com/",
  });
};

export default AiNetworkInstance;
