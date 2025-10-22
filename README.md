# AI Studio

A modern AI-powered image generation web application built with React, TypeScript, Node.js, and SQLite.

## 🚀 Features

- **User Authentication**: JWT-based signup/login
- **Image Upload**: Drag & drop with compression
- **AI Generation**: Simulated image generation
- **Dark Mode**: Light/dark theme toggle
- **Generation History**: View and restore previous generations
- **Download Support**: Download generated images

## 🛠️ Tech Stack

**Frontend**: React 18, TypeScript, Tailwind CSS, React Router
**Backend**: Node.js, TypeScript, Jai-Server, SQLite, JWT
**DevOps**: GitHub Actions, ESLint, Jest

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 8+

### Local Development

```bash
# Clone repository
git clone <repository-url>
cd AI-Studio

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install --legacy-peer-deps

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start development servers
# Terminal 1: cd backend && npm run dev
# Terminal 2: cd frontend && npm start
```

## 📋 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/docs

## 📋 Scripts

### Backend
```bash
npm run dev      # Development server
npm run build    # Build TypeScript
npm test         # Run tests
npm run lint     # Run ESLint
```

### Frontend
```bash
npm start        # Development server
npm run build    # Production build
npm test         # Run tests
npm run lint     # Run ESLint
```

## 🔧 Configuration

### Backend (.env)
```env
NODE_ENV=development
JWT_SECRET=your-secret-key
PORT=3001
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3001
```

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

## 🚨 Troubleshooting

### Peer Dependencies
```bash
# Frontend - Use legacy peer deps
npm install --legacy-peer-deps
```

### Port Conflicts
```bash
# Check port usage
lsof -i :3000
lsof -i :3001
```

### Database Issues
```bash
# Reset SQLite database
rm backend/data/ai_studio.db
cd backend && npm run dev
```

## 📚 API Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/generations` - Create image generation
- `GET /api/generations` - Get user generations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

---

**Happy Coding! 🚀**