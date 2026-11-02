import { apiGET, apiPOST, publicPOST, saveSession, getStoredUser } from "./service";

const mockResponse = (status, body) =>
  Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  });

beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn();
  delete window.location;
  window.location = { assign: jest.fn(), origin: "http://localhost" };
});

test("authed calls send the bearer token", async () => {
  localStorage.setItem("token", "abc");
  fetch.mockReturnValue(mockResponse(200, { ok: 1 }));

  await apiPOST("api/dashboard/gifts", { name: "Lamp" });

  const [, options] = fetch.mock.calls[0];
  expect(options.headers.Authorization).toBe("Bearer abc");
  expect(options.body).toBe(JSON.stringify({ name: "Lamp" }));
});

test("public calls never send a token", async () => {
  localStorage.setItem("token", "abc");
  fetch.mockReturnValue(mockResponse(200, {}));

  await publicPOST("api/wedding/w1/gifts/g1/book", { bookedBy: "Ana" });

  expect(fetch.mock.calls[0][1].headers.Authorization).toBeUndefined();
});

test("non-2xx throws with the backend message and status", async () => {
  fetch.mockReturnValue(mockResponse(409, { message: "Gift already booked" }));

  await expect(publicPOST("api/x", {})).rejects.toMatchObject({
    message: "Gift already booked",
    status: 409,
  });
});

test("429 shows the friendly rate-limit message", async () => {
  fetch.mockReturnValue(mockResponse(429, { message: "Too many requests, please try again later" }));

  await expect(publicPOST("api/auth/login", {})).rejects.toMatchObject({
    message: "Too many attempts, please wait a few minutes and try again.",
    status: 429,
  });
});

test("401 on an authed call clears the session and redirects to /login", async () => {
  localStorage.setItem("token", "expired");
  localStorage.setItem("user", "{}");
  fetch.mockReturnValue(mockResponse(401, { message: "Invalid token" }));

  await expect(apiGET("api/dashboard")).rejects.toMatchObject({ status: 401 });

  expect(localStorage.getItem("token")).toBeNull();
  expect(localStorage.getItem("user")).toBeNull();
  expect(window.location.assign).toHaveBeenCalledWith("/login");
});

test("401 on login does not redirect", async () => {
  fetch.mockReturnValue(mockResponse(401, { message: "Invalid email or password" }));

  await expect(publicPOST("api/auth/login", {})).rejects.toMatchObject({
    message: "Invalid email or password",
  });
  expect(window.location.assign).not.toHaveBeenCalled();
});

test("saveSession stores weddingId with the user and keeps it on profile updates", () => {
  saveSession({ token: "t", user: { coupleId: "c1", coupleName: "A & B" }, weddingId: "w1" });
  saveSession({ user: { coupleName: "A & C" } });

  expect(localStorage.getItem("token")).toBe("t");
  expect(getStoredUser()).toEqual({ coupleId: "c1", coupleName: "A & C", weddingId: "w1" });
});
