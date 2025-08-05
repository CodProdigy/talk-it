# Talk-it : Full Stack Realtime Chat App

![App Screenshot](/frontend/public/talkitimage.png)

A full-stack real-time chat application with modern UI and robust backend built using the **MERN** stack. This app features user authentication, instant messaging, online user tracking, image uploads, and is styled using TailwindCSS and DaisyUI.

---

## 🚀 Features

- 🌐 Full Stack App (MongoDB, Express, React, Node.js)
- 💬 Real-time messaging with **Socket.io**
- 🔐 JWT-based authentication and route protection
- 🟢 Online/Offline user status indicators
- 📸 Image upload support via **Cloudinary**
- 🎨 Beautiful UI with **TailwindCSS** and **DaisyUI**
- ⚙️ Global state management using **Zustand**
- ❗ Robust error handling (client and server)
- 🧑‍🤝‍🧑 Friend list and chat previews
- 📱 Responsive design for mobile & desktop
- 🛠️ Clean and modular codebase
- 🔄 Auto-refresh and state persistence
- 🚢 Easily deployable to platforms like Vercel & Render

---

**Cloning the Repository**

```bash
git clone https://github.com/CodProdigy/talk-it.git
cd talk-it
```

---
### Setup .env file

```js
MONGODB_URI=...
PORT=5001
JWT_SECRET=...

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

NODE_ENV=development
```

### Build the app

```shell
npm run build
```

### Start the app

```shell
npm start
```
