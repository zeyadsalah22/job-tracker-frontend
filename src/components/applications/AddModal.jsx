import Modal from "../Modal";
import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { applicationSchema } from "../../schemas/Schemas";
import FormInput from "../FormInput";
import ReactLoading from "react-loading";
import { useQuery } from "react-query";
import useUserStore from "../../store/user.store";

export default function AddModal({ refetch, openAdd, setOpenAdd }) {
  const token = localStorage.getItem("token");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useUserStore((state) => state.user);

  const fetchCompanies = async () => {
    const { data } = await axios.get(`http://127.0.0.1:8000/api/companies`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });
    return data.results;
  };

  const { data: companies } = useQuery(["companies"], fetchCompanies);

  // {
  //   "id": 0,
  //   "user_id": 0,
  //   "company_id": 0,
  //   "job_title": "string",
  //   "job_type": "string",
  //   "description": "string",
  //   "link": "string",
  //   "submitted_cv": {},
  //   "ats_score": 0,
  //   "stage": "string",
  //   "status": "string",
  //   "submission_date": "2024-09-23",
  //   "contacted_employees": [
  //     0
  //   ]
  // }

  const { values, errors, handleSubmit, handleChange, touched } = useFormik({
    initialValues: {
      user_id: "",
      company_id: "",
      job_title: "",
      job_type: "",
      description: "",
      link: "",
      submitted_cv: "",
      ats_score: "",
      stage: "",
      status: "",
      submission_date: "",
      contacted_employees: "",
    },

    validationSchema: applicationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      await axios
        .post(
          "http://127.0.0.1:8000/api/applicationscompany_id=${companyId}",
          values,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        )
        .then(() => {
          setOpenAdd(false);
          setLoading(false);
          toast.success("Application added successfully");
          refetch();
        })
        .catch((error) => {
          setLoading(false);
          setError(error);
          toast.error(
            error.response.data.name.map((error) => error) ||
              "An error occurred. Please try again"
          );
        });
    },
  });

  const fetchEmployees = async () => {
    const { data } = await axios.get(
      `http://127.0.0.1:8000/api/employees`,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    );
    return data.results;
  };

  const { data: employees } = useQuery(
    ["employees", values.company_id],
    () => fetchEmployees(values.company_id),
    {
      enabled: !!values.company_id,
    }
  );

  const filteredEmployees = employees
    ?.filter((employee) => employee?.company?.id === values.company_id)
    .map((employee) => employee.name);

  console.log(filteredEmployees);

  const stage = ["Applied", "Phone Screen", "Assessment", "Interview", "Offer"];
  const status = ["Pending", "Assessment", "Interview", "Rejected", "Accepted"];

  useEffect(() => {
    if (user) {
      values.user_id = user.id;
    }
  }, [user, values]);

  return (
    <Modal open={openAdd} setOpen={setOpenAdd} width="600px">
      <div className="flex flex-col gap-4">
        <h1 className="font-semibold text-lg">Add Employee</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <select
            name="company_id"
            value={values.company_id}
            onChange={handleChange}
            className={`${
              touched.company_id && errors.company_id && "border-red-500"
            } w-full rounded-md border px-4 py-2 text-gray-500 focus:border-primary focus:outline-none
                ${
                  values.company_id ? "text-black" : "text-gray-500"
                } focus:ring-primary`}
          >
            <option value="" disabled className="text-gray-400">
              Select Company
            </option>
            {companies?.length > 0 &&
              companies.map((company) => (
                <option
                  key={company.id}
                  value={company.id}
                  className="text-black"
                >
                  {company.name}
                </option>
              ))}
          </select>
          <div className="flex gap-6">
            <FormInput
              label="Job Title"
              name="job_title"
              placeHolder="Job Title"
              type="text"
              onChange={handleChange}
              value={values.job_title}
              error={errors.job_title}
              touched={touched.job_title}
            />
            <FormInput
              label="Job Type"
              name="job_type"
              placeHolder="Job Type"
              type="text"
              onChange={handleChange}
              value={values.job_type}
              error={errors.job_type}
              touched={touched.job_type}
            />
          </div>
          <FormInput
            label="Link"
            name="link"
            placeHolder="Link"
            type="text"
            onChange={handleChange}
            value={values.link}
            error={errors.link}
            touched={touched.link}
          />
          <div className="flex gap-6">
            <FormInput
              label="Submitted CV"
              name="submitted_cv"
              placeHolder="Submitted CV"
              type="file"
              onChange={handleChange}
              value={values.submitted_cv}
              error={errors.submitted_cv}
              touched={touched.submitted_cv}
            />
            <FormInput
              label="ATS Score"
              name="ats_score"
              placeHolder="ATS Score"
              type="number"
              onChange={handleChange}
              value={values.ats_score}
              error={errors.ats_score}
              touched={touched.ats_score}
            />
          </div>
          <div className="flex gap-6 w-full">
            <div className="w-full">
              <select
                name="stage"
                value={values.stage}
                onChange={handleChange}
                className={`${
                  touched.stage && errors.stage && "border-red-500"
                } w-full rounded-md border px-4 py-2 focus:border-primary focus:outline-none focus:ring-primary`}
              >
                <option value="" disabled>
                  Select Stage
                </option>
                {stage.map((stage, index) => (
                  <option key={index} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
              {errors.stage && touched.stage && (
                <span className="mt-1 text-xs text-red-500">
                  {errors.stage}
                </span>
              )}
            </div>
            <div className="w-full">
              <select
                name="status"
                value={values.status}
                onChange={handleChange}
                className={`${
                  touched.status && errors.status && "border-red-500"
                } w-full rounded-md border px-4 py-2 focus:border-primary focus:outline-none focus:ring-primary`}
              >
                <option value="" disabled className="text-gray-500">
                  Select Status
                </option>
                {status.map((status, index) => (
                  <option key={index} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {errors.status && touched.status && (
                <span className="mt-1 text-xs text-red-500">
                  {errors.status}
                </span>
              )}
            </div>
          </div>
          <select
            name="contacted_employees"
            value={values.contacted_employees}
            onChange={handleChange}
            className={`${
              touched.contacted_employees &&
              errors.contacted_employees &&
              "border-red-500"
            } w-full rounded-md border px-4 py-2 text-gray-500 focus:border-primary focus:outline-none
                ${
                  values.contacted_employees ? "text-black" : "text-gray-500"
                } focus:ring-primary`}
          >
            <option value="" disabled className="text-gray-400">
              Select Contacted Employees
            </option>
            {filteredEmployees?.length > 0 &&
              filteredEmployees.map((employee) => (
                <option
                  key={employee.id}
                  value={employee.id}
                  className="text-black"
                >
                  {employee.name}
                </option>
              ))}
          </select>
          <FormInput
            label="Submission Date"
            name="submission_date"
            placeHolder="Submission Date"
            type="date"
            onChange={handleChange}
            value={values.submission_date}
            error={errors.submission_date}
            touched={touched.submission_date}
          />
          <FormInput
            label="Description"
            name="description"
            placeHolder="Description"
            textarea
            onChange={handleChange}
            value={values.description}
            error={errors.description}
            touched={touched.description}
          />

          {loading ? (
            <button
              disabled
              className="rounded cursor-not-allowed flex items-center justify-center bg-primary px-8 py-2 text-white transition h-10"
            >
              <ReactLoading
                type="bubbles"
                color="#ffffff"
                height={25}
                width={25}
              />
            </button>
          ) : (
            <button
              type="submit"
              className="rounded bg-primary px-8 py-2 text-white transition hover:bg-primary/80 h-10"
            >
              Submit
            </button>
          )}
        </form>
      </div>
    </Modal>
  );
}
