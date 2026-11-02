# Wedding Registry (frontend)

A React app where a couple manages their wedding: gift registry, guest invites with RSVP, and wishes from guests. Guests use public links to send wishes, book gifts and RSVP, without an account.

- **Stack:** Create React App, React 19, react-router-dom v7, plain CSS (no UI library)
- **Backend:** `../wedding_registry_backend` (Express + MongoDB)

## Setup

```bash
npm install
npm start          # http://localhost:3000
```

The API URL comes from `REACT_APP_BACKEND_URL` (default `http://localhost:5000`). Put it in a `.env` file in this folder if the backend runs elsewhere.

## Routes

| Path | Who | What |
|---|---|---|
| `/`, `/login` | Couple | Log in |
| `/signup` | Couple | Create an account (optional wedding date and gift list) |
| `/dashboard` | Couple (needs login) | Tabbed dashboard; `?tab=` keeps the open tab |
| `/wedding/:weddingId` | Guests | Wedding page: details, wishes, gift registry |
| `/invite/:inviteCode` | Guests | Personal RSVP page |

## Features

### Couple
- **Signup:** couple name, email, password (at least 6 characters), optional wedding date and gifts. Logs in straight away and opens the dashboard.
- **Login:** shows the server's error message. The token and user (with `weddingId`) are kept in localStorage.
- **Session handling:** `/dashboard` redirects to `/login` without a token. Any 401 from a logged-in API call clears the session and redirects to `/login`.
- **Dashboard tabs:**
  1. **Overview:** stat cards (gifts booked out of total, wishes received, invites by RSVP status, guests attending out of guests invited) and a share box for the wedding page link (Copy, WhatsApp, Open).
  2. **Wedding details:** edit title, date, venue and description.
  3. **Gifts:** table with name, price, link, status, booked by and booked at. Add, edit (popup), release a booked gift, and delete. Delete is disabled on booked gifts ("Release it first").
  4. **Invites:** add a guest (name, email, phone, relation, 1–20 guests, private note). Each row has Copy invite link, WhatsApp, Email (when there's an email), Set RSVP by hand, Edit and Delete. Filter chips (All / Pending / Attending / Declined) and an "X of Y guests attending" summary.
  5. **Wishes:** wishes received from guests.
  6. **Account:** change couple name and email; change password (with confirmation).
- The dashboard reloads its data when the browser tab becomes visible again, so new RSVPs, bookings and wishes appear without a manual refresh. Stats are counted in the browser from the loaded lists, using the same formula as the backend.

### Guests
- **Wedding page:** header with couple name, title, date, venue and description. Send a wish (up to 1000 characters). Book a gift by entering a name; if someone else booked it first, the guest sees "Gift already booked" and the gift shows as booked. An unknown or malformed link shows "Wedding not found".
- **RSVP page:** "Hi {name}, you're invited!" with the wedding details. Choose **Attending** (with how many will come, when the invite is for more than one guest) or **Can't make it**, then see a thank-you message. The answer can be changed later. Links to the wedding page. An invalid link shows "This invite link is not valid."

### Across the app
- Every button that calls the API shows a loading state and can't be submitted twice.
- Errors and confirmations appear inline or as toasts (no `alert()`).
- Forms check the same rules as the backend (required fields, password length, links starting with http/https, 1–20 guests, wish length) and still show the server's 400 message.
- A 429 shows "Too many attempts, please wait a few minutes and try again."
- Tables scroll sideways on narrow screens.

## Project structure

```
src/
  apis/service.js        request() helper: auth header, JSON errors, 401 redirect; session helpers
  utils/helpers.js       date/price formatting, share links, clipboard, changed-field diff
  pages/                 login, signup, coupleDashboard, weddingPage, invitePage
  components/            dashboard tabs (dashboardOverview, -Wedding, -Gifts, -Invites,
                         -Wishes, -Account), public pieces (giftList, giftItem, wishForm,
                         wishList), shared UI (toast, modal + useConfirm, copyButton,
                         requireAuth, notFound)
  styles/                common/, coupleDashboard/, login/, publicDashboard/, invite/
```

API helpers: `apiGET`, `apiPOST`, `apiPUT`, `apiDELETE` send the token; `publicGET` and `publicPOST` never do. All of them throw an `Error` with `message` (from the backend) and `status` when the response isn't 2xx.

## Progress

**Done:**
- Rewrote the API layer (`service.js`): every logged-in call sends the token, and failed responses are thrown as errors instead of being returned as data. This fixes the bug where a 409 from gift booking replaced the gift in the list with an error object.
- Updated signup and login for the new backend responses (`token` on signup, `weddingId` on login, `coupleId` rename).
- Couple dashboard with all six tabs, including gift management and the new invites feature.
- Public RSVP page (`/invite/:inviteCode`) and the new wedding page header.
- Removed `alert()` calls, `console.log` calls and commented-out code from the updated files.
- Tests: `src/apis/service.test.js` (auth header, error handling, 429 message, 401 redirect, session storage) and `src/App.test.js` (wedding page header, "Wedding not found", the "Gift already booked" case). `package.json` maps react-router for Jest and `setupTests.js` adds `TextEncoder`, both needed for react-router v7 under CRA's Jest.
- `npm run build` passes with no lint warnings and `npm test` passes (10 tests).

**Still to do:**
- End-to-end check against the updated backend (restart it so it runs the new code): signup without gifts, create an invite and RSVP from its link, book the same gift from two browsers, and an expired token returning to `/login`.

---

# Create React App reference

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
