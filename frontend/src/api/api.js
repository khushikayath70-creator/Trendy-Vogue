import axios from "axios";

const API = axios.create({

  baseURL: "https://trendy-vogue.onrender.com/api",
});

export default API;