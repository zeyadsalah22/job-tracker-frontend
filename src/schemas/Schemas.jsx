import * as Yup from "yup";

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password is too short - should be 6 chars minimum."),
});

export const registerSchema = Yup.object().shape({
  Fname: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot be longer than 50 characters"),
  Lname: Yup.string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot be longer than 50 characters"),
  Email: Yup.string()
    .email("Invalid email format")
    .required("Email is required")
    .max(100, "Email cannot be longer than 100 characters"),
  Password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(255, "Password cannot be longer than 255 characters"),
  ConfirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("Password"), null], "Passwords must match"),
  Address: Yup.string()
    .nullable()
    .max(255, "Address cannot be longer than 255 characters"),
  BirthDate: Yup.date()
    .nullable()
    .transform((curr, orig) => (orig === "" ? null : curr))
    .typeError("Please enter a valid date")
});

export const companySchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  location: Yup.string().required("Required"),
});

export const userCompanySchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  location: Yup.string().required("Required"),
});

export const employeeSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  linkedinLink: Yup.string()
    .matches(
      /^https?:\/\/(www\.)?linkedin\.com\/(in|pub|company)\/[a-zA-Z0-9_-]+\/?$/,
      "Enter correct url!"
    )
    .optional().nullable(),
  email: Yup.string().email("Invalid email").optional().nullable(),
  jobTitle: Yup.string().required("Required"),
  contacted: Yup.string().required("Required"),
  companyId: Yup.string().required("Required"),
});

export const applicationSchema = Yup.object().shape({
  company_id: Yup.string().required("Required"),
  job_title: Yup.string().required("Required"),
  job_type: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  link: Yup.string().required("Required"),
  ats_score: Yup.number().required("Required"),
  stage: Yup.string().required("Required"),
  status: Yup.string().required("Required"),
  submission_date: Yup.string().required("Required"),
  contacted_employees: Yup.array().default([]),
  submitted_cv: Yup.number().required("Required"),
});

export const questionSchema = Yup.object().shape({
  user_id: Yup.string().required("Required"),
  question: Yup.string().required("Required"),
  answer: Yup.string().optional(),
  application_id: Yup.string().required("Required"),
});

export const todoSchema = Yup.object().shape({
  userId: Yup.string().required("Required"),
  applicationTitle: Yup.string().required("Required"),
  applicationLink: Yup.string().optional(),
  deadline: Yup.date().required("Required"),
  completed: Yup.boolean().optional(),
});

export const interviewSchema = Yup.object().shape({
  userId : Yup.string().required("Required"),
  applicationId: Yup.string(),
  userCompanyId: Yup.string(),
  position: Yup.string(),
  jobDescription: Yup.string()
});

export const notificationCreateSchema = Yup.object().shape({
  userId: Yup.number()
    .integer("User ID must be an integer")
    .optional(),
  actorId: Yup.number()
    .integer("Actor ID must be an integer")
    .optional(),
  type: Yup.string()
    .oneOf(
      ['SystemAnnouncement', 'Application', 'ToList', 'Post', 'Comment', 'React'],
      'Invalid notification type'
    )
    .optional(),
  entityTargetedId: Yup.number()
    .integer("Entity targeted ID must be an integer")
    .nullable()
    .optional(),
  message: Yup.string()
    .required("Message is required")
    .max(1000, "Message cannot be longer than 1000 characters")
});

export const notificationFilterSchema = Yup.object().shape({
  pageNumber: Yup.number()
    .integer("Page number must be an integer")
    .min(1, "Page number must be at least 1")
    .max(2147483647, "Page number is too large")
    .optional(),
  pageSize: Yup.number()
    .integer("Page size must be an integer")
    .min(1, "Page size must be at least 1")
    .max(500, "Page size cannot exceed 500")
    .optional(),
  sortBy: Yup.string()
    .optional(),
  sortDescending: Yup.boolean()
    .optional()
});