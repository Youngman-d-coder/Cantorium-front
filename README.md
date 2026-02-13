# Cantorium - Choral AI Studio

[![CI](https://github.com/Youngman-d-coder/Cantorium-front/workflows/CI/badge.svg)](https://github.com/Youngman-d-coder/Cantorium-front/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A modern, industry-ready web application for choral music composition powered by AI. Built with React, TypeScript, and Vite.

## 🚀 Features

- **AI-Powered Composition**: Create choral music with AI assistance
- **Firebase Authentication**: Secure user accounts with email/password, Google, and GitHub sign-in
- **Cloud Database**: Store compositions, practice sessions, and user data in Firestore
- **Practice Studio**: Interactive practice sessions with voice-part isolation
- **Composition Library**: Organize and manage your musical works
- **Real-time Collaboration**: WebSocket-based live updates
- **Responsive Design**: Beautiful, modern UI with Tailwind CSS
- **Keyboard Shortcuts**: Efficient command palette and navigation
- **Type-Safe**: Full TypeScript support for enhanced developer experience

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Docker (optional, for containerized deployment)

## 🛠️ Installation

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/Youngman-d-coder/Cantorium-front.git
cd Cantorium-front
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and set your Firebase configuration. See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for detailed instructions on setting up Firebase.

**Required Firebase environment variables:**
```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

Run tests with UI:
```bash
npm run test:ui
```

## 🏗️ Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 🐳 Docker Deployment

Build and run with Docker:
```bash
docker build -t cantorium-front .
docker run -p 80:80 cantorium-front
```

## 📝 Code Quality

### Linting

Run ESLint:
```bash
npm run lint
```

### Type Checking

TypeScript type checking is run automatically during build. To check types manually:
```bash
npx tsc --noEmit
```

## 🔒 Security

- All dependencies are regularly audited using `npm audit`
- Security vulnerabilities are addressed promptly
- Environment variables are used for sensitive configuration
- Input validation and sanitization are implemented
- Regular security scans via CI/CD pipeline

## 🏛️ Architecture

### Project Structure

```
Cantorium-front/
├── .github/              # GitHub Actions workflows
├── public/               # Static assets
├── src/
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # React components
│   │   └── ui/         # Reusable UI components
│   ├── pages/          # Page components
│   ├── test/           # Test utilities and setup
│   ├── App.tsx         # Main application component
│   ├── auth.tsx        # Authentication context
│   ├── config.ts       # Configuration utilities
│   └── main.tsx        # Application entry point
├── .env                # Environment variables
├── Dockerfile          # Docker configuration
├── vitest.config.ts    # Test configuration
├── vite.config.ts      # Vite configuration
└── tsconfig.json       # TypeScript configuration
```

### Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Backend**: Firebase (Authentication & Firestore)
- **Styling**: Tailwind CSS 4
- **Routing**: React Router 7
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint 9 with TypeScript ESLint
- **Type Checking**: TypeScript 5.9

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write or update tests as needed
5. Ensure all tests pass (`npm test`)
6. Ensure linting passes (`npm run lint`)
7. Commit your changes (`git commit -m 'Add amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

### Code Style

- Follow the existing code style
- Use TypeScript for all new code
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📊 CI/CD

This project uses GitHub Actions for continuous integration and deployment:

- **CI Pipeline**: Runs on all PRs and pushes to main/develop
  - Linting
  - Type checking
  - Unit tests
  - Build verification
  - Security audits

- **CD Pipeline**: Deploys to production on pushes to main
  - Builds Docker image
  - Pushes to GitHub Container Registry
  - Can be extended for cloud deployment

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_FIREBASE_API_KEY` | Firebase API key | Yes |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | Yes |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | Yes |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | Yes |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | Yes |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | Yes |
| `VITE_API_BASE_URL` | Backend API URL (legacy) | No |
| `VITE_WS_BASE_URL` | WebSocket server URL (legacy) | No |

See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for complete setup instructions.

### TypeScript Configuration

The project uses strict TypeScript settings for maximum type safety. See `tsconfig.json` for details.

## 📱 Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Youngman-d-coder** - [GitHub](https://github.com/Youngman-d-coder)

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite team for the blazing-fast build tool
- All contributors and users of Cantorium

## 📞 Support

If you have any questions or need help:

- Open an issue on GitHub
- Check the documentation
- Join our community discussions

---

Made with ❤️ by the Cantorium team
