import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const instance = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// ===== Token Handling =====
function setToken(token) {
  if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common["Authorization"];
  }
}

// ===== Interceptors =====

// Request interceptor (future-proofing)
instance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor (central error handling)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.statusText ||
      "Network error";

    return Promise.reject(new Error(message));
  }
);

// ===== API Wrapper =====
const Api = {
  setToken,

  get(path, config) {
    return instance.get(path, config).then((r) => r.data);
  },

  post(path, body, config) {
    return instance.post(path, body, config).then((r) => r.data);
  },

  put(path, body, config) {
    return instance.put(path, body, config).then((r) => r.data);
  },

  delete(path, config) {
    return instance.delete(path, config).then((r) => r.data);
  },
};

export default Api;
