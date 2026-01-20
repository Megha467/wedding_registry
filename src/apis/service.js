
let BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const apiPOST = async (api, body) => {
  try {
    const res = await fetch(`${BASE_URL}/${api}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return data;
  } catch (error) {
   console.log('error is', error)
  }
};

const apiGET = async (api) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/${api}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "API error");
    }

    return data;
  } catch (error) {
    console.error("apiGET error:", error.message);
    throw error;
  }
};

const apiGET_Tokenless = async (api) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/${api}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "API error");
    }

    return data;
  } catch (error) {
    console.error("apiGET error:", error.message);
    throw error;
  }
};

const apiPUT = async (api, body) => {
  
  const res = await fetch(`${BASE_URL}/${api}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      //Authorization: "Bearer " + local_storage_data?.token,
    },
    body: JSON.stringify(body),
  });

  if (res?.ok) return await res.json();
  return res;
};

const apiDELETE = async (api, body) => {
  const local_storage_data = JSON.parse(localStorage.getItem("user"));

  const res = await fetch(`${BASE_URL}/${api}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      //Authorization: "Bearer " + local_storage_data?.token,
    },
    body: JSON.stringify(body),
  });

  return await res.json();
};

const apiDELETETokenless = async (api, body) => {
  const res = await fetch(`${BASE_URL}/${api}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return await res.json();
};

export {
  apiPOST,
  apiGET,
  apiDELETE,
  apiPUT,
  apiGET_Tokenless,
  apiDELETETokenless,
};
