# SkillSync Hub - Collaborative Talent & Portfolio Sharing Platform

A full-stack web application that serves as an online group profile website and demonstrates collaborative talent sharing capabilities.

## 🚀 Project Overview

SkillSync Hub is a comprehensive platform designed to connect students and professionals through skill sharing, collaboration requests, and portfolio management. This project represents our final project submission for MIS-455, showcasing modern web development practices and full-stack implementation.

### Key Features

- **Modern UI/UX**: React-based frontend with Tailwind CSS and Framer Motion animations
- **Authentication**: JWT-based authentication with role-based access control
- **Database**: MongoDB with Mongoose ODM for data persistence
- **REST API**: Complete backend with Express.js and proper error handling
- **Admin Dashboard**: Protected admin interface for managing all platform data
- **Collaboration Module**: Talent request and collaboration management system
- **Contact System**: Integrated contact form with database storage
- **Responsive Design**: Mobile-first approach with cross-browser compatibility

## 🏗️ Architecture

### Frontend (React + Tailwind CSS)
```
client/
├── public/
│   ├── index.html
│   └── assets/           # Images and existing member profiles
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── LandingPage/
│   │   ├── MembersPage/
│   │   ├── ProjectPage/
│   │   ├── ContactPage/
│   │   ├── AdminDashboard/
│   │   └── CollaborationRequest/
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── utils/           # Utility functions
│   └── App.js          # Main application component
```

### Backend (Node.js + Express.js + MongoDB)
```
server/
├── index.js            # Main server file
├── routes/             # API route definitions
├── controllers/        # Route controllers
├── models/             # Mongoose data models
├── middleware/         # Authentication, error handling, security
├── config/             # Database and configuration
├── seed/               # Database seeding script
└── package.json        # Dependencies and scripts
```

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern JavaScript library for building user interfaces
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Framer Motion**: Production-ready motion library for animations
- **React Router**: Declarative routing for React applications
- **React Icons**: High-quality SVG icons

### Backend
- **Node.js**: JavaScript runtime for server-side development
- **Express.js**: Fast, unopinionated web framework for Node.js
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: Object Data Modeling (ODM) for MongoDB
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing for security
- **Helmet**: Security middleware for Express.js
- **CORS**: Cross-Origin Resource Sharing configuration

### Development & Testing
- **ESLint**: JavaScript linting utility
- **Prettier**: Code formatter
- **Jest**: JavaScript testing framework
- **Supertest**: HTTP assertion library for testing Node.js servers

## 📦 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager
- Git (for version control)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd skill-sync-hub
```

### Step 2: Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables:
```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/skillsync-hub

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d

# Server Configuration
PORT=5000
NODE_ENV=development

# Admin Credentials (for demo purposes)
ADMIN_EMAIL=admin@skillsynchub.com
ADMIN_PASSWORD=admin123
```

5. Start the backend server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend will be available at `http://localhost:5000`

### Step 3: Frontend Setup

1. Open a new terminal and navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

### Step 4: Database Seeding (Optional)

To populate your database with sample data:

1. Make sure your MongoDB server is running
2. Run the seed script:
```bash
cd server
npm run seed
```

This will create:
- Admin user (email: admin@skillsynchub.com, password: admin123)
- Sample members
- Project proposal
- Collaboration requests
- Contact messages

## 🚀 API Documentation

### Authentication Endpoints

#### POST /api/auth/login
- **Description**: Admin login to get JWT token
- **Request Body**:
```json
{
  "email": "admin@skillsynchub.com",
  "password": "admin123"
}
```
- **Response**:
```json
{
  "success": true,
  "token": "jwt-token-here"
}
```

### Members Endpoints

#### GET /api/members
- **Description**: Get all group members
- **Response**: Array of member objects

#### GET /api/members/:id
- **Description**: Get specific member by ID
- **Response**: Single member object

### Project Proposal Endpoints

#### GET /api/proposal
- **Description**: Get project proposal details
- **Response**: Proposal object

#### PUT /api/proposal
- **Description**: Update project proposal (admin only)
- **Request Body**: Updated proposal data
- **Response**: Updated proposal object

### Collaboration Request Endpoints

#### POST /api/collab
- **Description**: Submit new collaboration request
- **Request Body**: Collaboration request data
- **Response**: Created request object

#### GET /api/collab
- **Description**: Get all collaboration requests
- **Response**: Array of request objects

#### PUT /api/collab/:id
- **Description**: Update collaboration request status (admin only)
- **Request Body**: Status update data
- **Response**: Updated request object

#### DELETE /api/collab/:id
- **Description**: Delete collaboration request (admin only)
- **Response**: Success message

### Contact Endpoints

#### POST /api/contact
- **Description**: Submit contact form
- **Request Body**: Contact form data
- **Response**: Created contact message

#### GET /api/contact
- **Description**: Get all contact messages
- **Response**: Array of message objects

## 🔧 Environment Variables

### Server (.env)
```env
# Database
MONGO_URI=mongodb://localhost:27017/skillsynchub

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d

# Server
PORT=5000
NODE_ENV=development

# Admin
ADMIN_EMAIL=admin@skillsynchub.com
ADMIN_PASSWORD=admin123
```

### Client (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=SkillSync Hub
```

## 🧪 Testing

### Backend Tests

```bash
cd server
npm test
```

### Frontend Tests

```bash
cd client
npm test
```

## 📁 Project Structure

### Frontend Components

#### LandingPage
- Hero section with group name and motto
- Smooth animations and responsive design
- Navigation to other pages

#### MembersPage
- Interactive member cards with photos and intros
- Integration with existing HTML profiles
- Modal popups for detailed profiles

#### ProjectPage
- Modern card layout for project objectives
- Admin-only editing functionality
- Real-time updates via API

#### ContactPage
- Contact form with validation
- Database storage via backend API
- Recent messages display

#### AdminDashboard
- JWT-based authentication
- Role-based access control
- Data management interfaces

#### CollaborationRequest
- Form for submitting skill requests
- MongoDB storage with validation
- Status tracking and management

### Backend Models

#### User
- Authentication and authorization
- Role-based access control

#### Member
- Group member information
- Skills, experience, and contact details

#### Proposal
- Project proposal content
- Admin-editable objectives

#### CollabRequest
- Collaboration requests
- Status tracking

#### Contact
- Contact form submissions
- Message management

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: Comprehensive input sanitization
- **XSS Protection**: Cross-site scripting prevention
- **CORS Configuration**: Proper cross-origin resource sharing
- **Rate Limiting**: Protection against brute force attacks
- **Helmet.js**: Security headers for Express.js
- **MongoDB Sanitization**: NoSQL injection prevention

## 🎨 Design System

### Color Palette
- **Primary**: #667eea (Indigo)
- **Secondary**: #764ba2 (Purple)
- **Accent**: #f093fb (Pink)
- **Background**: #f8f9ff (Light blue)
- **Text**: #2c3e50 (Dark gray)

### Typography
- **Headings**: Inter, 800 weight
- **Body**: Inter, 400-600 weight
- **Monospace**: JetBrains Mono

### Animation Principles
- Smooth transitions: 0.3s ease
- Hover effects: translateY(-2px)
- Fade animations: opacity 0 → 1
- Scale effects: 1.05 on hover

## 🚀 Deployment

### Backend Deployment

1. **Build the application**:
```bash
cd server
npm run build
```

2. **Set production environment**:
```env
NODE_ENV=production
MONGO_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
PORT=process.env.PORT || 5000
```

3. **Start the server**:
```bash
npm start
```

### Frontend Deployment

1. **Build the application**:
```bash
cd client
npm run build
```

2. **Deploy the build folder** to your preferred hosting service (Vercel, Netlify, etc.)

### Environment-Specific Setup

#### Development
- Hot reloading enabled
- Detailed error messages
- CORS configured for localhost

#### Production
- Minified assets
- Optimized error handling
- Security headers enabled
- Proper CORS configuration

## 📊 Performance Optimization

### Frontend Optimization
- Code splitting and lazy loading
- Image optimization
- Component memoization
- Debounced API calls

### Backend Optimization
- Database indexing
- Connection pooling
- Response caching
- Compression middleware

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team Members

- **Jannatul Ferdous Suzane** - Web Developer
- **Md. Ashraful Haque** - SQA Engineer
- **Fatema Tug Juhora** - CSE Major | MIS Minor
- **Md Solaiman Shabab** - MIS Student

## 📞 Contact

For questions or support, please contact:
- **Email**: contact@skillsynchub.com
- **Project Repository**: [GitHub Repository Link]
- **Demo Admin**: admin@skillsynchub.com / admin123

## 🙏 Acknowledgments

- Independent University, Bangladesh (IUB)
- MIS-455 Course Faculty
- Open source libraries and frameworks used in this project
- MongoDB Atlas for database hosting (if used)

---

**Built with ❤️ by the SkillSync Hub Team**