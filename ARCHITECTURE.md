# Job Tracker Frontend - Architecture Documentation

## 🏗️ Project Overview

A modern React-based job tracking and interview management system built with Vite, featuring a clean architecture and modern UI components.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components (Button, Card, Dialog, etc.)
│   ├── layout/         # Layout components (AppLayout, AppSidebar, AppHeader)
│   ├── robot/          # AI assistant components (LottieRobot, FloatingChatBot)
│   ├── sections/       # Landing page sections (Hero, Features, etc.)
│   ├── applications/   # Application management components
│   ├── companies/      # Company management components
│   ├── employees/      # Employee management components
│   ├── interviews/     # Interview management components
│   ├── questions/      # Question management components
│   ├── resume-matching/ # Resume matching components
│   ├── user/           # User management components
│   ├── user-companies/ # User company relationship components
│   └── Table.jsx       # Enhanced table component with pagination/sorting
├── pages/              # Main application pages
│   ├── Landing.jsx     # Public landing page
│   ├── Login.jsx       # Authentication pages
│   ├── Register.jsx    
│   ├── Dashboard.jsx   # Main dashboard
│   ├── Applications.jsx # Job applications management
│   ├── Companies.jsx   # Company database
│   ├── Employees.jsx   # Employee contacts
│   ├── Interviews.jsx  # Interview scheduling
│   ├── Questions.jsx   # Interview questions bank
│   ├── ResumeMatching.jsx # ATS resume testing
│   ├── UserCompanies.jsx # User's company interests
│   └── Profile.jsx     # User profile management
├── store/              # Zustand state management
│   ├── user.store.js   # User authentication state
│   ├── chat.store.js   # Chatbot state
│   └── sidenav.store.js # Sidebar state
├── utils/              # Utility functions
│   ├── axios.js        # API client configuration
│   └── ProtectedRoute.jsx # Route protection
├── lib/                # Shared libraries
│   └── utils.ts        # shadcn/ui utilities
├── schemas/            # Form validation schemas
│   └── Schemas.jsx     # Yup validation schemas
└── assets/             # Static assets
```

## 🎨 UI Architecture

### Component Hierarchy

#### 1. **shadcn/ui Components** (`/components/ui/`)
- Base UI primitives (Button, Card, Dialog, Input, etc.)
- Consistent design system
- Fully accessible components
- TypeScript and JSX versions

#### 2. **Layout Components** (`/components/layout/`)
- `AppLayout.jsx` - Main application wrapper
- `AppSidebar.jsx` - Navigation sidebar with user menu
- `AppHeader.jsx` - Top header with search and notifications

#### 3. **Feature Components** (`/components/{feature}/`)
Each feature has its own folder with:
- `AddModal.jsx` - Create new records
- `EditModal.jsx` - Edit existing records  
- `ViewModal.jsx` - Display detailed information
- `DeleteModal.jsx` - Confirmation dialogs

#### 4. **Shared Components**
- `Table.jsx` - Enhanced table with search, pagination, sorting
- Robot components for AI assistance
- Landing page sections

## 🔄 State Management

### Zustand Stores

#### User Store (`user.store.js`)
```javascript
{
  user: null,          // Current user data
  token: null,         // JWT token
  isAuthenticated: false,
  login: () => {},     // Login action
  logout: () => {},    // Logout action
  updateUser: () => {} // Update user data
}
```

#### Chat Store (`chat.store.js`)
```javascript
{
  isOpen: false,       // Chatbot visibility
  messages: [],        // Chat history
  isTyping: false,     // Typing indicator
  toggleChat: () => {},
  addMessage: () => {}
}
```

## 🌐 API Integration

### Axios Configuration (`utils/axios.js`)
- Base URL: `/api`
- Automatic token refresh
- Request/response interceptors
- Error handling

### API Endpoints Structure
```
/api/
├── auth/           # Authentication
├── applications/   # Job applications
├── companies/      # Company database
├── employees/      # Employee contacts
├── mockinterview/  # Interview sessions
├── questions/      # Interview questions
├── resumetest/     # Resume matching
├── user-companies/ # User interests
└── users/          # User management
```

## 🛣️ Routing Structure

### Public Routes
- `/` - Landing page
- `/login` - User login
- `/register` - User registration
- `/forgot-password` - Password reset

### Protected Routes (Require Authentication)
- `/dashboard` - Main dashboard
- `/applications` - Job applications
- `/companies` - Company database
- `/employees` - Employee contacts
- `/interviews` - Interview management
- `/questions` - Question bank
- `/resume-matching` - ATS testing
- `/user-companies` - Company interests
- `/profile` - User profile

## 🔐 Authentication Flow

1. **Login Process**
   - User submits credentials
   - API returns JWT token
   - Token stored in Zustand store
   - User redirected to dashboard

2. **Protected Routes**
   - `ProtectedRoute` component checks authentication
   - Redirects to login if unauthenticated
   - Automatic token refresh on API calls

3. **Logout Process**
   - Clear user store
   - Redirect to landing page

## 🎯 Key Features

### 1. **Interview System**
- **Interview Scheduling** - Create and manage interviews
- **Recording Modal** - In-app interview recording with:
  - Video recording
  - Speech-to-text transcription
  - Real-time notes
  - AI question management
- **Question Bank** - Reusable interview questions

### 2. **Application Tracking**
- Job application lifecycle management
- Company and employee contact tracking
- Application status updates
- Timeline tracking

### 3. **Resume Matching**
- ATS score calculation
- Job description matching
- Skills gap analysis
- Performance statistics

### 4. **AI Assistant**
- Floating chatbot with Lottie animations
- Contextual help and guidance
- Interview question suggestions

## 🛠️ Development Standards

### Code Organization
- **Feature-based folders** for components
- **Consistent naming** conventions
- **Modular architecture** for maintainability
- **Separation of concerns**

### Component Standards
- Functional components with hooks
- PropTypes for type checking
- Consistent export/import patterns
- Reusable and composable design

### State Management
- Zustand for global state
- React Query for server state
- Local state for component-specific data
- Optimistic updates where appropriate

### Styling
- Tailwind CSS for utility-first styling
- shadcn/ui for consistent design system
- Responsive design patterns
- Dark mode support (where applicable)

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

## 📝 Contributing Guidelines

### Adding New Features
1. Create feature-specific component folder
2. Follow existing modal patterns (Add/Edit/View/Delete)
3. Integrate with Table component for listing
4. Add proper error handling and loading states
5. Update documentation

### Component Guidelines
- Use functional components
- Implement proper prop validation
- Follow accessibility standards
- Include loading and error states
- Write self-documenting code

### API Integration
- Use React Query for data fetching
- Implement optimistic updates
- Handle errors gracefully
- Add proper loading indicators

## 🔧 Technical Decisions

### Why Vite?
- Fast development server
- Optimized build process
- Modern ES modules support
- Better developer experience

### Why shadcn/ui?
- Consistent design system
- Fully accessible components
- Customizable and themeable
- TypeScript support

### Why Zustand?
- Lightweight state management
- No boilerplate
- TypeScript friendly
- Easy to test

### Why React Query?
- Powerful data fetching
- Caching and synchronization
- Optimistic updates
- Background refetching

## 📊 Performance Considerations

### Code Splitting
- Route-based code splitting
- Lazy loading for heavy components
- Dynamic imports for large libraries

### State Management
- Minimal global state
- Local state when possible
- Optimistic updates for better UX

### API Optimization
- Request caching with React Query
- Pagination for large datasets
- Debounced search inputs
- Background data synchronization

## 🧪 Testing Strategy

### Component Testing
- Unit tests for utility functions
- Component testing with React Testing Library
- Integration tests for complex workflows

### API Testing
- Mock API responses
- Error scenario testing
- Loading state verification

## 🚦 Deployment

### Build Process
- Vite optimization
- Asset minification
- Tree shaking
- Environment configuration

### Environment Variables
- API base URLs
- Feature flags
- Third-party service keys

This architecture provides a solid foundation for a maintainable, scalable React application with modern development practices and clear separation of concerns.
