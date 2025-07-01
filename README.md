# VIDWA - AI Customer Support Chat

A modern, responsive AI-powered customer support chat application built with the MERN stack (MongoDB, Express, React, Node.js) and integrated with Azure OpenAI. Features a beautiful dark/light theme interface and comprehensive chat management.

## Features

- **Responsive Chat UI**: Modern, mobile-first design with collapsible sidebar
- **AI-Powered Responses**: Integrates with Azure OpenAI (GPT-3.5/GPT-4) for intelligent answers
- **FAQ Integration**: Bot searches uploaded FAQ documents before querying AI
- **Chat History**: Complete conversation management with delete functionality
- **Admin Panel**: Interface for uploading FAQ documents (PDF or text)
- **Dark/Light Theme**: Automatic system theme detection with manual toggle
- **Real-time Updates**: Page visibility change detection for conversation refresh
- **Typing Indicator**: Visual feedback when bot is preparing responses
- **File Upload Support**: Handle document uploads for FAQ processing
- **Modern UI**: Built with Tailwind CSS, React Icons, and smooth animations

## Tech Stack

### Frontend

- **React 18**: Modern React with hooks and concurrent features
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing and navigation
- **MobX**: Reactive state management
- **Tailwind CSS**: Utility-first CSS framework
- **React Icons**: Comprehensive icon library

### Backend

- **Node.js**: JavaScript runtime environment
- **Express.js**: Fast, unopinionated web framework
- **MongoDB**: NoSQL database for data persistence
- **Multer**: Middleware for handling file uploads
- **CORS**: Cross-origin resource sharing

### AI & Processing

- **Azure OpenAI**: GPT-3.5/GPT-4 integration
- **pdf-parse**: PDF document processing

## Prerequisites

- Node.js and npm
- MongoDB instance (local or cloud)
- Azure account with access to Azure OpenAI

## Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/your-repository-name.git
    cd client-chat
    ```

2.  **Install server dependencies:**

    ```bash
    cd server
    npm install
    ```

3.  **Install client dependencies:**

    ```bash
    cd ../client
    npm install
    ```

4.  **Configure environment variables:**

    Create a `.env` file in the `server` directory:

    ```env
    MONGO_URI=your_mongodb_connection_string
    AZURE_OPENAI_ENDPOINT=your_azure_openai_endpoint
    AZURE_OPENAI_KEY=your_azure_openai_api_key
    AZURE_OPENAI_DEPLOYMENT=your_azure_openai_deployment_name
    ```

    Create a `.env` file in the `client` directory:

    ```env
    VITE_API_URL=http://localhost:5000
    ```

## Running the Application

1.  **Start the backend server:**

    ```bash
    cd server
    npm start
    ```

2.  **Start the frontend development server:**

    ```bash
    cd ../client
    npm run dev
    ```

The application will be available at `http://localhost:5173`.

## API Endpoints

### Chat Routes

- `POST /api/chat`: Send a message to the chat bot
- `GET /api/chat/conversations`: Get all conversations
- `GET /api/chat/:id`: Retrieve a conversation by its ID
- `DELETE /api/chat/conversation/:id`: Delete a specific conversation

### Upload Routes

- `POST /api/upload/faq`: Upload FAQ documents for processing

## 🚀 Deployment

This project is configured for deployment with **Vercel** (frontend) and **Railway** (backend).

### Prerequisites for Deployment

- GitHub account with your repository
- MongoDB Atlas account (for cloud database)
- Azure OpenAI API access
- Vercel account (for frontend)
- Railway account (for backend)

### Frontend Deployment (Vercel)

1. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com) and sign in with GitHub
   - Import your repository
   - Set the **Root Directory** to `client`
   - Vercel will automatically detect it's a Vite project

2. **Configure Environment Variables in Vercel**:
   ```env
   VITE_API_URL=your_railway_backend_url
   ```

3. **Deploy**: Vercel will automatically build and deploy your frontend

### Backend Deployment (Railway)

1. **Connect to Railway**:
   - Go to [railway.app](https://railway.app) and sign in with GitHub
   - Create a new project and connect your repository
   - Set the **Root Directory** to `server`
   - Railway will automatically detect the Node.js application

2. **Configure Environment Variables in Railway**:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_atlas_connection_string
   AZURE_OPENAI_ENDPOINT=your_azure_openai_endpoint
   AZURE_OPENAI_KEY=your_azure_openai_api_key
   AZURE_OPENAI_DEPLOYMENT=your_azure_openai_deployment_name
   NODE_ENV=production
   ```

3. **Deploy**: Railway will automatically build and deploy your backend

### Environment Variables Setup

**Backend (.env in server directory):**
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_KEY=your_azure_openai_api_key
AZURE_OPENAI_DEPLOYMENT=your_deployment_name
NODE_ENV=production
```

**Frontend (.env in client directory):**
```env
VITE_API_URL=https://your-backend-url.railway.app
```

## 📁 Project Structure

```
Client Chat/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Admin.jsx     # Admin panel component
│   │   │   ├── Chat.jsx      # Main chat interface
│   │   │   └── ConversationHistory.jsx
│   │   ├── stores/
│   │   │   └── chatStore.js  # MobX state management
│   │   ├── assets/           # Static assets
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # React entry point
│   │   └── index.css         # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── server/                    # Node.js backend
│   ├── controllers/
│   │   ├── chatController.js
│   │   └── uploadController.js
│   ├── models/
│   │   ├── conversation.js
│   │   └── faq.js
│   ├── routes/
│   │   ├── chat.js
│   │   └── upload.js
│   ├── uploads/              # File upload directory
│   ├── package.json
│   └── server.js
├── .gitignore
└── README.md
```

## 🎨 Customization

### Themes

- Automatic dark/light theme detection based on system preferences
- Manual theme toggle with smooth transitions
- Customizable in `client/src/index.css` and `client/tailwind.config.js`

### Styling

- Tailwind CSS utility classes for rapid development
- Custom fonts: Audiowide for headers, Ubuntu for body text
- Responsive design with mobile-first approach
- Smooth animations and transitions

## 📱 VS Code Tasks

The project includes VS Code tasks for easy development:

- **Start Server**: `Ctrl+Shift+P` → "Tasks: Run Task" → "Start Server"
- **Start Client Dev Server**: `Ctrl+Shift+P` → "Tasks: Run Task" → "Start Client Dev Server"

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for utility-first styling
- MobX for reactive state management
- Azure OpenAI for AI capabilities
- All open-source contributors

---

**Built with ❤️ by the VIDWA team**
