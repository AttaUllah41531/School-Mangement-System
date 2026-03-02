# School Management System

A comprehensive web-based school management system built with modern technologies to streamline educational institution operations.

## 🏫 Overview

This School Management System provides a complete solution for managing students, teachers, academic records, attendance, examinations, and administrative tasks. It features role-based access control for administrators, teachers, students, and parents.

## 🚀 Tech Stack

### Frontend
- **React 19** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Lucide React** - Icon library
- **React Hook Form** - Form management
- **Recharts** - Data visualization

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **express-validator** - Input validation

## 📁 Project Structure

```
School Management System/
├── backend/                 # Node.js/Express API
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── database/           # Database schema
│   ├── middleware/         # Custom middleware
│   ├── routes/             # API routes
│   ├── scripts/            # Utility scripts
│   └── utils/              # Helper functions
├── frontend/               # React application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context providers
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   └── assets/         # Static resources
└── README.md              # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MySQL Server
- Git

### Database Setup
1. Create MySQL database:
```sql
CREATE DATABASE school_management;
```

2. Import the schema:
```bash
mysql -u root -p school_management < backend/database/schema.sql
```

### Backend Setup
1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup
1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Teachers
- `GET /api/teachers` - Get all teachers
- `POST /api/teachers` - Create new teacher
- `PUT /api/teachers/:id` - Update teacher
- `DELETE /api/teachers/:id` - Delete teacher

### Academic
- `GET /api/academic/classes` - Get all classes
- `GET /api/academic/subjects` - Get all subjects
- `POST /api/academic/allocate` - Allocate subjects to teachers

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance/mark` - Mark attendance
- `GET /api/attendance/report/:studentId` - Get attendance report

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 👥 User Roles & Permissions

### Admin
- Full system access
- User management
- System configuration
- Report generation

### Teacher
- Manage assigned classes
- Mark attendance
- Enter exam marks
- View student information

### Student
- View personal information
- Check attendance
- View exam results
- Access library resources

### Parent
- View child's information
- Monitor attendance
- Check academic performance
- Pay fees online

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS protection
- File upload security

## 📊 Features

### Core Modules
- **User Management** - Registration, authentication, profile management
- **Student Management** - Admission records, class assignments
- **Teacher Management** - Staff records, subject allocation
- **Academic Management** - Classes, sections, subjects
- **Attendance System** - Daily attendance tracking and reports
- **Examination System** - Exam scheduling, grading, report cards
- **Library Management** - Book catalog, issue/return tracking
- **Fee Management** - Fee structure, payment tracking
- **Dashboard** - Analytics and overview

### Additional Features
- Responsive design for all devices
- Real-time notifications
- Data export (PDF, Excel)
- Backup and restore
- Multi-language support (extensible)

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📦 Deployment

### Backend Deployment
1. Set production environment variables
2. Build the application
3. Deploy to your preferred hosting platform (Heroku, AWS, DigitalOcean)

### Frontend Deployment
1. Build the production version:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting service (Vercel, Netlify, AWS S3)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 📞 Support

For support and queries:
- Email: support@schoolmanagement.com
- Documentation: [Wiki](https://github.com/username/school-management/wiki)
- Issues: [GitHub Issues](https://github.com/username/school-management/issues)

## 🗺️ Roadmap

- [ ] Mobile app development
- [ ] SMS/Email notifications
- [ ] Advanced reporting
- [ ] Biometric attendance
- [ ] Online classes integration
- [ ] AI-powered analytics
- [ ] Multi-school support

---

**Built with ❤️ for educational institutions**
