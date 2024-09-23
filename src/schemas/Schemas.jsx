import * as Yup from "yup";

export const loginSchema = Yup.object().shape({
  username: Yup.string().required("Required"),
  password: Yup.string()
    .required("Required")
    .min(5, "Password is too short - should be 6 chars minimum."),
});

export const comapnySchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  location: Yup.string().required("Required"),
  careers_link: Yup.string()
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      "Enter correct url!"
    )
    .required("Please enter a valid URL"),
  linkedin_link: Yup.string()
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      "Enter correct url!"
    )
    .required("Please enter a valid URL"),
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
  job_title: Yup.string().required("Required"),
  job_type: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  link: Yup.string().required("Required"),
  ats_score: Yup.number().required("Required"),
  stage: Yup.string().required("Required"),
  status: Yup.string().required("Required"),
  submission_date: Yup.string().required("Required"),
  contacted_employees: Yup.string().required("Required"),
});