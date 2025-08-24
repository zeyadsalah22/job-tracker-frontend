# Job Tracker Frontend

A modern React-based job tracking and interview management system built with Vite, featuring AI-powered interviews, resume matching, and comprehensive application tracking.

## ✨ Features

### 🎯 **Core Functionality**
- **Job Application Tracking** - Complete lifecycle management
- **Company Database** - Comprehensive company information and contacts
- **Employee Network** - Contact management and relationship tracking
- **Interview System** - AI-powered interview scheduling and recording
- **Question Bank** - Reusable interview question management
- **Resume Matching** - ATS score calculation and optimization
- **User Profiles** - Personal information and CV management

### 🤖 **AI-Powered Features**
- **Interview Recording** - In-browser video and audio recording
- **Speech-to-Text** - Real-time transcription during interviews
- **AI Chatbot** - Contextual assistance with Lottie animations
- **Resume Analysis** - Automated skills gap identification

### 🎨 **Modern UI/UX**
- **shadcn/ui Components** - Consistent, accessible design system
- **Responsive Design** - Mobile-first, works on all devices
- **Dark Mode Support** - (Where applicable)
- **Smooth Animations** - Enhanced user experience
- **Interactive Elements** - Drag-and-drop, real-time updates

## 🚀 Quick Start

### Prerequisites
- Node.js 16.0 or higher
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd job-tracker-frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Architecture

### Tech Stack
- **Frontend Framework**: React 18 with Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand + React Query
- **Routing**: React Router DOM
- **Form Handling**: Formik + Yup
- **HTTP Client**: Axios with interceptors
- **Animations**: Framer Motion + Lottie

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── layout/         # Layout components
│   ├── {feature}/      # Feature-specific components
│   └── Table.jsx       # Enhanced table component
├── pages/              # Application pages
├── store/              # Zustand state stores
├── utils/              # Utility functions
├── lib/                # Shared libraries
└── schemas/            # Validation schemas
```

## 📱 Pages & Features

### 🏠 **Dashboard**
- Application statistics and charts
- Recent activity timeline
- Todo list management
- Quick access to key features

### 📋 **Applications Management**
- Create and track job applications
- Application status workflow
- Company and position details
- Interview scheduling integration

### 🏢 **Company Database**
- Comprehensive company profiles
- Industry categorization
- Contact information
- Application history

### 👥 **Employee Network**
- Contact management system
- Communication history
- Role and department tracking
- Company affiliations

### 🎤 **Interview System**
- **Scheduling**: Create and manage interviews
- **Recording Modal**: In-app recording with:
  - Live video feed
  - Real-time speech transcription
  - AI question management
  - Note-taking capabilities
  - Progress tracking
- **Question Bank**: Reusable question library

### 📄 **Resume Matching**
- Upload and test resumes
- ATS score calculation
- Job description matching
- Skills gap analysis
- Performance statistics

### 🏢 **User Companies**
- Personal company interest tracking
- Priority and status management
- Application pipeline

### 👤 **Profile Management**
- Personal information
- CV upload and management
- Account settings

## 🔌 API Integration

### Base Configuration
- **Base URL**: `/api`
- **Authentication**: JWT tokens with automatic refresh
- **Error Handling**: Centralized error management
- **Request Interceptors**: Token attachment and refresh

### Key Endpoints
```
/api/auth/*              # Authentication
/api/applications/*      # Job applications
/api/companies/*         # Company database
/api/employees/*         # Employee contacts
/api/mockinterview/*     # Interview sessions
/api/questions/*         # Question bank
/api/resumetest/*        # Resume testing
/api/user-companies/*    # User interests
/api/users/*             # User management
```

## 🎨 UI Components

### shadcn/ui Integration
- **Button** - Various sizes and variants
- **Card** - Content containers
- **Dialog** - Modal dialogs
- **Input** - Form inputs with validation
- **Select** - Dropdown selections
- **Table** - Data tables with sorting/pagination
- **Badge** - Status indicators
- **Checkbox** - Form checkboxes
- **Textarea** - Multi-line text input

### Custom Components
- **Table.jsx** - Enhanced table with search, pagination, sorting
- **FloatingChatBot** - AI assistant with Lottie animations
- **InterviewRecordingModal** - Complete interview recording system
- **AppLayout** - Main application layout

## 🔐 Authentication

### Flow
1. User login with email/password
2. JWT token received and stored
3. Automatic token refresh
4. Protected route access
5. Logout and token cleanup

### Route Protection
- **Public Routes**: Landing, Login, Register
- **Protected Routes**: All application features
- **Automatic Redirection**: Login required for protected content

## 📊 State Management

### Zustand Stores
- **User Store**: Authentication and user data
- **Chat Store**: AI chatbot state
- **SideNav Store**: Sidebar state

### React Query
- **Data Fetching**: All API calls
- **Caching**: Intelligent data caching
- **Optimistic Updates**: Better user experience
- **Background Sync**: Automatic data updates

## 🎯 Development Guidelines

### Code Standards
- **Functional Components**: React hooks pattern
- **Consistent Naming**: Clear, descriptive names
- **Feature Organization**: Grouped by functionality
- **Reusable Components**: DRY principles

### Component Patterns
```jsx
// Feature component structure
/components/{feature}/
├── AddModal.jsx      # Create new records
├── EditModal.jsx     # Edit existing records
├── ViewModal.jsx     # Display details
└── DeleteModal.jsx   # Confirmation dialogs
```

### Styling Guidelines
- **Tailwind CSS**: Utility-first approach
- **Responsive Design**: Mobile-first breakpoints
- **Consistent Spacing**: Tailwind spacing scale
- **Accessible Colors**: WCAG compliant palette

## 🧪 Testing

### Testing Strategy
- **Unit Tests**: Component logic
- **Integration Tests**: User workflows
- **API Mocking**: Controlled test environments

### Testing Tools
- **Jest**: Test runner
- **React Testing Library**: Component testing
- **MSW**: API mocking

## 🚀 Deployment

### Build Process
```bash
# Production build
npm run build

# Build analysis
npm run analyze

# Local preview
npm run preview
```

### Environment Variables
```env
VITE_API_BASE_URL=your_api_url
VITE_APP_ENV=production
```

## 📝 Contributing

### Getting Started
1. Fork the repository
2. Create a feature branch
3. Follow the coding standards
4. Write tests for new features
5. Submit a pull request

### Code Review Process
- Code style and standards compliance
- Functionality testing
- Performance considerations
- Accessibility compliance

## 📚 Documentation

- **[Architecture Guide](./ARCHITECTURE.md)** - Detailed system architecture
- **[Component Library](./COMPONENTS.md)** - UI component documentation
- **[API Documentation](./API.md)** - Backend integration guide

## 🤝 Support

For issues, feature requests, or questions:
1. Check existing issues
2. Create detailed bug reports
3. Provide reproduction steps
4. Include environment information

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ using React, Vite, and modern web technologies.
