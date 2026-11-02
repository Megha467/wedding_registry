const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const RATE_LIMIT_MESSAGE =
  "Too many attempts, please wait a few minutes and try again.";

// ---- Session (token + user in localStorage) ----

const getToken = () => localStorage.getItem("token");

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
};

// user is the backend's user object; weddingId is kept alongside it.
// With a token this starts a new session; without one it updates the stored user.
const saveSession = ({ token, user, weddingId }) => {
  if (token) localStorage.setItem("token", token);
  const stored = token ? {} : getStoredUser() || {};
  localStorage.setItem(
    "user",
    JSON.stringify({ ...stored, ...user, ...(weddingId ? { weddingId } : {}) })
  );
};

const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("coupleAuth");
};

// ---- Requests ----

const apiError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

// Throws an Error with .message (from the backend) and .status on any non-2xx.
const request = async (method, path, body, { auth = true } = {}) => {
  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const token = auth ? getToken() : null;
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE_URL}/${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw apiError("Could not reach the server. Please check your connection and try again.", 0);
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 401 && auth) {
      clearSession();
      window.location.assign("/login");
    }
    const message =
      res.status === 429
        ? RATE_LIMIT_MESSAGE
        : data?.message || `Request failed (${res.status})`;
    throw apiError(message, res.status);
  }

  return data;
};

// Authed (couple dashboard)
const apiGET = (path) => request("GET", path);
const apiPOST = (path, body) => request("POST", path, body);
const apiPUT = (path, body) => request("PUT", path, body);
const apiDELETE = (path) => request("DELETE", path);

// Public (guests, login, signup)
const publicGET = (path) => request("GET", path, undefined, { auth: false });
const publicPOST = (path, body) => request("POST", path, body, { auth: false });

export {
  request,
  apiGET,
  apiPOST,
  apiPUT,
  apiDELETE,
  publicGET,
  publicPOST,
  getToken,
  getStoredUser,
  saveSession,
  clearSession,
};
