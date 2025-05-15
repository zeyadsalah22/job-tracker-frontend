import * as Yup from "yup";

export const loginSchema = Yup.object().shape({
  username: Yup.string().required("Required"),
  password: Yup.string()
    .required("Required")
    .min(5, "Password is too short - should be 6 chars minimum."),
});

export const registerSchema = Yup.object().shape({
  username: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .required("Required")
    .min(8, "Password is too short - should be 8 chars minimum."),
  re_password: Yup.string()
    .required("Required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
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
  linkedin_link: Yup.string()
    .matches(
      /^https?:\/\/(www\.)?linkedin\.com\/(in|pub|company)\/[a-zA-Z0-9_-]+\/?$/,
      "Enter correct url!"
    )
    .optional(),
  email: Yup.string().email("Invalid email").optional(),
  job_title: Yup.string().required("Required"),
  contacted: Yup.string().required("Required"),
  company_id: Yup.string().required("Required"),
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
  contacted_employees: Yup.array().required("Required"),
  submitted_cv: Yup.number().required("Required"),
});

export const questionSchema = Yup.object().shape({
  user_id: Yup.string().required("Required"),
  question: Yup.string().required("Required"),
  answer: Yup.string().optional(),
  application_id: Yup.string().required("Required"),
});

export const todoSchema = Yup.object().shape({
  user_id: Yup.string().required("Required"),
  application_title: Yup.string().required("Required"),
  application_link: Yup.string().optional(),
  deadline: Yup.date().required("Required"),
  completed: Yup.boolean().optional(),
});
