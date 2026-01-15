
let BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
//const user = JSON.parse(localStorage.getItem("user"));

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
  let API_URL = `${BASE_URL}/${api}`;
  // pw7_mode
  const res = await fetch(API_URL, {
    headers: {
      "Content-Type": "application/json",
      //Authorization: "Bearer " + local_storage_data?.token,
    },
  });
  if (res?.ok) return await res.json();

  return res;
};

const apiGET_Tokenless = async (api) => {
  let API_URL = `${BASE_URL}/${api}`;
  const res = await fetch(API_URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
   // referrerPolicy: "no-referrer",
  });

  return await res.json();
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
