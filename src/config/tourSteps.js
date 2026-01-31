// Tour step configurations for all pages

export const PAGE_SEQUENCE = [
  { page: 'dashboard', route: '/dashboard' },
  { page: 'profile', route: '/profile' },
  { page: 'companies', route: '/companies' },
  { page: 'user-companies', route: '/user-companies' },
  { page: 'employees', route: '/employees' },
  { page: 'applications', route: '/applications' },
  { page: 'questions', route: '/questions' },
  { page: 'interviews', route: '/interviews' },
  { page: 'community', route: '/community' },
  { page: 'resume-matching', route: '/resume-matching' }
];

// Dashboard Tour Steps
export const dashboardSteps = [
  {
    target: 'body',
    content: "👋 Welcome to JobLander! Let's take a quick tour of your job search command center.",
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="sidebar"]',
    content: 'This is your main navigation. Access all features from here.',
    placement: 'right',
  },
  {
    target: '[data-tour="dashboard-stats"]',
    content: 'Track your application statistics at a glance.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="recent-applications"]',
    content: 'View and manage your recent job applications.',
    placement: 'top',
  },
  {
    target: '[data-tour="todo-list"]',
    content: 'Stay organized with your job search tasks.',
    placement: 'top',
  },
  {
    target: '[data-tour="chatbot"]',
    content: '🤖 Meet your AI assistant! Ask questions about your applications, get career advice, or help with any job search task. Click to start chatting!',
    placement: 'left',
  },
  {
    target: 'body',
    content: "Great! Now let's set up your profile.",
    placement: 'center',
  },
];

// Profile Tour Steps
export const profileSteps = [
  {
    target: 'body',
    content: 'Your profile is the foundation of your job search. Let\'s set it up!',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="personal-info"]',
    content: 'Keep your contact details up to date.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="cv-management"]',
    content: 'Upload and manage multiple versions of your resume here.',
    placement: 'top',
  },
  {
    target: '[data-tour="cv-upload"]',
    content: 'Upload your CV to unlock features like Resume Matching.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="gmail-integration"]',
    content: 'Connect your Gmail to automatically track application status updates! We\'ll monitor emails from companies and notify you when your application status changes.',
    placement: 'top',
  },
  {
    target: '[data-tour="chrome-extension"]',
    content: 'Install our Chrome Extension to auto-capture job applications and use AI-powered auto-fill across all job boards. It\'s a game-changer!',
    placement: 'top',
  },
  {
    target: 'body',
    content: "Now let's explore the Companies database!",
    placement: 'center',
  },
];

// Companies Tour Steps
export const companiesSteps = [
  {
    target: 'body',
    content: 'This is the global company database with thousands of companies.',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="search-filters"]',
    content: 'Search companies by name, industry, or location.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="company-table"]',
    content: 'Click any company to view detailed information.',
    placement: 'top',
  },
  {
    target: '[data-tour="request-company"]',
    content: 'Add new companies to the database. Admins can add directly, while regular users can submit requests for approval.',
    placement: 'left',
  },
  {
    target: 'body',
    content: "Let's look at how to track companies you're interested in.",
    placement: 'center',
  },
];

// User Companies Tour Steps
export const userCompaniesSteps = [
  {
    target: 'body',
    content: 'Track companies you\'re interested in or have applied to.',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="tabs"]',
    content: 'Toggle between your saved companies and requests.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="add-company-btn"]',
    content: 'Add companies from the global database to your list.',
    placement: 'left',
  },
  {
    target: '[data-tour="requests-tab"]',
    content: 'Your submitted company requests will appear in the Requests tab.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="company-table"]',
    content: 'Set priority levels for companies you\'re targeting.',
    placement: 'top',
  },
  {
    target: 'body',
    content: "Now let's learn about managing employee contacts.",
    placement: 'center',
  },
];

// Employees Tour Steps
export const employeesSteps = [
  {
    target: 'body',
    content: 'Build your professional network by tracking employee contacts at target companies.',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="add-employee-btn"]',
    content: 'Add employees you\'ve connected with, including their contact details and department information.',
    placement: 'left',
  },
  {
    target: '[data-tour="employee-table"]',
    content: 'Link employees to their companies, track interactions, and manage follow-ups. You can view, edit, or delete employee contacts from the actions column.',
    placement: 'top',
  },
  {
    target: 'body',
    content: "Ready to start tracking applications? Let's go!",
    placement: 'center',
  },
];

// Applications Tour Steps
export const applicationsSteps = [
  {
    target: 'body',
    content: 'This is your application tracking hub. Track all your job applications and their progress.',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="add-application-btn"]',
    content: 'Click here to add a new job application with details like company, position, and submission date.',
    placement: 'left',
  },
  {
    target: '[data-tour="filters"]',
    content: 'Filter applications by status (Pending, Accepted, Rejected), stage (Applied, Phone Screen, Interview, Offer), company, or job type.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="application-table"]',
    content: 'View all your applications with status badges, application stages, and quick actions to edit, view details, or delete entries.',
    placement: 'top',
  },
  {
    target: 'body',
    content: "Let's prepare for interviews with the Questions bank!",
    placement: 'center',
  },
];

// Questions Tour Steps
export const questionsSteps = [
  {
    target: 'body',
    content: 'Build your personal library of interview questions and answers.',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="add-question-btn"]',
    content: 'Add questions you\'ve encountered or want to practice.',
    placement: 'left',
  },
  {
    target: '[data-tour="categories"]',
    content: 'Organize questions by topic (Behavioral, Technical, etc.).',
    placement: 'bottom',
  },
  {
    target: '[data-tour="question-table"]',
    content: 'Store your prepared answers and notes for each question.',
    placement: 'top',
  },
  {
    target: 'body',
    content: "Now let's practice with Mock Interviews! 🎥",
    placement: 'center',
  },
];

// Interviews Tour Steps
export const interviewsSteps = [
  {
    target: 'body',
    content: 'Schedule and track all your practice and real interviews. Features include video recording, real-time speech-to-text transcription, and AI-powered feedback on your answers and presentation.',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="add-interview-btn"]',
    content: 'Click here to start a mock interview with video recording. During the interview, your answers will be automatically transcribed using speech-to-text.',
    placement: 'left',
  },
  {
    target: '[data-tour="interview-table"]',
    content: 'View all your past and upcoming interviews. Click on any interview to see detailed AI-powered feedback on your answers and video performance.',
    placement: 'top',
  },
  {
    target: 'body',
    content: "Let's connect with the JobLander community!",
    placement: 'center',
  },
];

// Community Tour Steps
export const communitySteps = [
  {
    target: 'body',
    content: 'Connect with other job seekers, share experiences, and get advice. The community is here to support you throughout your job search journey.',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="create-post-btn"]',
    content: 'Share your job search journey, tips, success stories, or ask questions to the community.',
    placement: 'left',
  },
  {
    target: '[data-tour="community-feed"]',
    content: 'Like, comment, and save helpful posts. You can filter posts by type and interact with the community.',
    placement: 'top',
  },
  {
    target: 'body',
    content: "Finally, let's test your resume with Resume Matching!",
    placement: 'center',
  },
];

// Resume Matching Tour Steps
export const resumeMatchingSteps = [
  {
    target: 'body',
    content: 'Test how well your resume matches job descriptions.',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="upload-resume"]',
    content: 'Upload a resume and job description to get started.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="ats-score"]',
    content: 'See your Applicant Tracking System compatibility score.',
    placement: 'left',
  },
  {
    target: '[data-tour="job-matching"]',
    content: 'Understand which keywords and skills are matched.',
    placement: 'top',
  },
  {
    target: '[data-tour="improvements"]',
    content: 'Get AI-powered suggestions to improve your resume.',
    placement: 'top',
  },
  {
    target: 'body',
    content: "Congratulations! You're all set to land your dream job!",
    placement: 'center',
  },
];

// Export all steps
export const tourSteps = {
  dashboard: dashboardSteps,
  profile: profileSteps,
  companies: companiesSteps,
  'user-companies': userCompaniesSteps,
  employees: employeesSteps,
  applications: applicationsSteps,
  questions: questionsSteps,
  interviews: interviewsSteps,
  community: communitySteps,
  'resume-matching': resumeMatchingSteps,
};

