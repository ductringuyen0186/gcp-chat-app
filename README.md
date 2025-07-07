# Discord Clone Chat Application

A Discord-like chat application built with Node.js/Express backend and React frontend, using Firebase for authentication and real-time features.

## 🚀 Quick Start

1. **Clone and Install**:
   ```powershell
   git clone [repository-url]
   cd gcp-chat-app
   npm run install:all
   ```

2. **Start Development**:
   ```powershell
   npm run dev
   ```

3. **Run Tests**:
   ```powershell
   npm test
   ```

## 📁 Project Structure

```
gcp-chat-app/
├── frontend/                # React frontend application
├── backend/                 # Node.js/Express API server
├── config/                  # Configuration files
├── scripts/                 # Build and utility scripts
├── docs/                    # Documentation
│   ├── setup/              # Setup and installation guides
│   ├── testing/            # Testing documentation
│   └── development/        # Development guides
├── .vscode/                # VS Code configuration
├── public/                 # Static files
└── firebase/               # Firebase configuration
```

## 📚 Documentation

### � Setup & Installation
- [Quick Start Guide](docs/setup/QUICK_START.md) - Get up and running quickly
- [Complete GCP Setup](docs/setup/GCP_DISCORD_CLONE_GUIDE.md) - Full Google Cloud Platform setup
- [Frontend Setup](docs/setup/FRONTEND_SETUP_GUIDE.md) - React frontend configuration
- [Setup Complete](docs/setup/SETUP_COMPLETE.md) - Post-installation verification

### 🧪 Testing
- [Testing Guide](docs/testing/TESTING_GUIDE.md) - Complete testing documentation
- [Test Commands Reference](docs/testing/TEST_COMMANDS_REFERENCE.md) - Quick command reference
- [Testing Checklist](docs/testing/TESTING_CHECKLIST.md) - Pre-commit testing checklist
- [Complete Testing Guide](docs/testing/COMPLETE_TESTING_GUIDE.md) - Comprehensive testing workflows

### 👩‍💻 Development
- [Copilot Instructions](docs/development/COPILOT_INSTRUCTIONS.md) - GitHub Copilot development guidelines
- [Copilot Auto-Approval](docs/development/COPILOT_AUTO_APPROVAL_GUIDE.md) - VS Code auto-approval setup
- [Chat Functionality Status](docs/development/CHAT_FUNCTIONALITY_STATUS.md) - Current implementation status

## 🛠️ Available Scripts

### Root Level Commands
```powershell
npm run dev              # Start both frontend and backend
npm test                 # Run all tests
npm run test:frontend    # Run frontend tests only
npm run test:backend     # Run backend tests only
npm run test:coverage    # Run tests with coverage
npm run build           # Build frontend for production
npm run install:all     # Install all dependencies
```

### Quick Development Commands
```powershell
npm run start:frontend  # Start React dev server
npm run start:backend   # Start Node.js server
npm run lint           # Run ESLint
npm run lint:fix       # Fix linting issues
```

## 🔧 Configuration Files

- `config/cors.json` - CORS configuration
- `config/firestore.rules` - Firestore security rules
- `config/firestore.indexes.json` - Firestore indexes
- `firebase.json` - Firebase configuration
- `.vscode/` - VS Code workspace settings and tasks

## 🚀 Features

- **Real-time Chat** - Firebase Firestore real-time listeners
- **Authentication** - Firebase Authentication
- **Channel Management** - Create, join, and manage channels
- **Message System** - Real-time messaging with typing indicators
- **Mock Data System** - Comprehensive mock data for development
- **Responsive Design** - Mobile-friendly interface
- **Testing Suite** - Comprehensive automated testing

## 🧪 Testing

This project emphasizes **test-driven development**:

- **Frontend Tests** - React Testing Library + Jest
- **Backend Tests** - Node.js test suites
- **Pre-commit Hooks** - Automated testing before commits
- **VS Code Integration** - Test tasks and shortcuts
- **Coverage Reports** - Detailed test coverage analysis

**Always run tests after making changes:**
```powershell
npm test
```

## 🔒 Security

- Firebase Authentication integration
- Firestore security rules
- CORS configuration
- Input validation and sanitization
- Error handling and logging

## 📱 Technology Stack

### Frontend
- **React** - UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Firebase SDK** - Authentication and real-time features

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Firebase Admin SDK** - Server-side Firebase operations
- **Google Cloud Platform** - Hosting and services

### Development
- **Jest** - Testing framework
- **React Testing Library** - React component testing
- **ESLint** - Code linting
- **GitHub Copilot** - AI-assisted development

## 🤝 Contributing

1. Follow the [Copilot Instructions](docs/development/COPILOT_INSTRUCTIONS.md)
2. Run tests before committing: `npm test`
3. Follow the testing guidelines in [Testing Guide](docs/testing/TESTING_GUIDE.md)
4. Use proper PowerShell syntax (no `&&` - use `;` instead)

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- Check the [documentation](docs/) for common issues
- Review the [testing guides](docs/testing/) for test-related problems
- Follow the [setup guides](docs/setup/) for installation issues
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
├── firebase/                # Firebase configuration
│   ├── firestore.rules
│   ├── firestore.indexes.json
│   └── firebase.json
├── GCP_DISCORD_CLONE_GUIDE.md  # Complete setup guide
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/profile` - Create/update user profile
- `GET /api/auth/me` - Get current user
- `PATCH /api/auth/status` - Update user status

### Messages
- `GET /api/messages/channel/:channelId` - Get channel messages
- `POST /api/messages/channel/:channelId` - Send message
- `PATCH /api/messages/:messageId` - Edit message
- `DELETE /api/messages/:messageId` - Delete message

### Channels
- `GET /api/channels` - Get all channels
- `POST /api/channels` - Create channel

### Users
- `GET /api/users/:userId` - Get user profile

## 🌐 Deployment

Deploy to Cloud Run:
```bash
gcloud run deploy discord-clone-api --source . --region us-central1
```

## 💰 Cost Optimization

This setup is designed to stay within GCP free tier limits:
- Cloud Run: 2M requests/month
- Firestore: 50K reads, 20K writes/day
- Cloud Storage: 5GB storage
- Firebase Auth: Unlimited users

## 📚 Next Steps

1. Build a frontend (React/Vue.js) with Firebase Auth
2. Implement real-time messaging with WebSockets
3. Add file upload functionality
4. Implement server/guild management
5. Add voice chat capabilities

## 🔗 Resources

- [Complete Setup Guide](./GCP_DISCORD_CLONE_GUIDE.md)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Firebase Console](https://console.firebase.google.com/)

## 📄 License

MIT License - see LICENSE file for details
