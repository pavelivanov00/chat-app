The app can be tested on the following address: https://chat-app-nine-psi-90.vercel.app/

**Technologies and Libraries Used:**

- Next.js
- TypeScript
- MongoDB (with Mongoose)
- WebSocket
- FontAwesome

**Communication:**

The communication between the front-end and back-end is handled using HTTP methods through API calls.

**Functionality:**

The app includes the following features:

- Create a new account
- Login
- Add a friend
- Show friends and pending friend requests (outgoing and incoming)
- Block and unblock users
- Change account username, password or email
- Upon clicking on a friend, the chat history will be queried. If both users are online, they can live chat through a WebSocket connection.