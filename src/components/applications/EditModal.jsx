import Modal from "../Modal";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { applicationSchema } from "../../schemas/Schemas";
import FormInput from "../FormInput";
import ReactLoading from "react-loading";
import { useQuery } from "react-query";
import useUserStore from "../../store/user.store";
import AddModalEmployees from "../employees/AddModal";
import AddModalCompanies from "../companies/AddModal";
import { useAxiosPrivate } from "../../utils/axios";

export default function EditModal({ id, refetch, openEdit, setOpenEdit }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useUserStore((state) => state.user);
  const [addEmployee, setAddEmployee] = useState(false);
  const [addCompany, setAddCompany] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const fetchApplication = async () => {
    const { data } = await axiosPrivate.get(`/applications/${id}`);
    return data;
  };

  const { data: application, isLoading } = useQuery(
    ["application", { id }],
    fetchApplication,
    {
      enabled: !!id,
    }
  );

  const { values, errors, handleSubmit, handleChange, touched, setFieldValue } =
    useFormik({
      initialValues: {
        user_id: "",
        company_id: "",
        job_title: "",
        job_type: "",
        description: "",
        link: "",
        cv: "",
        ats_score: "",
        stage: "",
        status: "",
        submission_date: "",
        contacted_employees: [],
      },

      validationSchema: applicationSchema,
      onSubmit: async (values) => {
        setLoading(true);
        const formData = new FormData();
        for (const key in values) {
          if (key === "contacted_employees") {
            values[key].forEach((employeeId) => {
              formData.append("contacted_employees", employeeId);
            });
          } else {
            formData.append(key, values[key]);
          }
        }
        await axiosPrivate
          .patch(`/applications/${id}`, values)
          .then(() => {
            setOpenEdit(false);
            setLoading(false);
            toast.success("Application updated successfully");
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

  const fetchCompanies = async () => {
    const { data } = await axiosPrivate.get(`/companies`);
    return data.results;
  };

  const { data: companies, refetch: company_refetch } = useQuery(
    ["companies"],
    fetchCompanies
  );

  const fetchEmployees = async () => {
    const { data } = await axiosPrivate.get(
      `/employees?company__id=${values.company_id}`
    );
    return data.results;
  };

  const { data: employees, refetch: employee_refetch } = useQuery(
    ["employees", values.company_id],
    fetchEmployees,
    {
      enabled: !!values.company_id,
    }
  );

  const fetchCvs = async () => {
    const { data } = await axiosPrivate.get(`/cvs`);
    return data.results;
  };

  const { data: cvs, isLoading: cvs_loading } = useQuery(["cvs"], fetchCvs);

  const stage = [
    {
      name: "Applied",
      value: "APPLIED",
    },
    {
      name: "Phone Screen",
      value: "PHONE_SCREEN",
    },
    {
      name: "Assessment",
      value: "ASSESSMENT",
    },
    {
      name: "Interview",
      value: "INTERVIEW",
    },
    {
      name: "Offer",
      value: "OFFER",
    },
  ];

  const status = [
    { name: "Pending", value: "PENDING" },
    { name: "Assessment", value: "ASSESSMENT" },
    { name: "Interview", value: "INTERVIEW" },
    { name: "Rejected", value: "REJECTED" },
    { name: "Accepted", value: "ACCEPTED" },
  ];

  useEffect(() => {
    if (!isLoading && application) {
      setFieldValue("user_id", user.id);
      setFieldValue("company_id", application.company.id);
      setFieldValue("job_title", application.job_title);
      setFieldValue("job_type", application.job_type);
      setFieldValue("description", application.description);
      setFieldValue("link", application.link);
      setFieldValue("ats_score", application.ats_score);
      setFieldValue("stage", application.stage);
      setFieldValue("status", application.status);
      setFieldValue("submission_date", application.submission_date);
      setFieldValue("contacted_employees", application.contacted_employees);
      setFieldValue("cv", application.cv);
    }
  }, [setFieldValue, application, isLoading, user.id]);

  return (
    <Modal open={openEdit} setOpen={setOpenEdit} width="600px">
      <div className="z-[100]">
        {addEmployee && (
          <AddModalEmployees
            refetch={employee_refetch}
            openAdd={addEmployee}
            setOpenAdd={setAddEmployee}
          />
        )}
      </div>
      <div className="z-[100]">
        {addCompany && (
          <AddModalCompanies
            openAdd={addCompany}
            setOpenAdd={setAddCompany}
            refetch={company_refetch}
          />
        )}
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="font-semibold text-lg">Update application</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <select
            onChange={(e) => {
              if (e.target.value === "add-company") {
                setAddCompany(true);
              } else {
                handleChange(e);
              }
            }}
            name="company_id"
            value={values.company_id}
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
            <option value={"add-company"}>Add Company</option>
          </select>
          <div className="flex gap-6">
            <FormInput
              label="Job Title"
              name="job_title"
              placeHolder="Job Title"
              type="text"
              onChange={handleChange}
              value={values.job_title}
              error={errors.job_title || error?.response?.data?.job_title}
              touched={touched.job_title}
            />
            <FormInput
              label="Job Type"
              name="job_type"
              placeHolder="Job Type"
              type="text"
              onChange={handleChange}
              value={values.job_type}
              error={errors.job_type || error?.response?.data?.job_type}
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
            error={errors.link || error?.response?.data?.link}
            touched={touched.link}
          />

          <div className="flex flex-col gap-2 w-full">
            <div className="text-sm text-gray-600">
              Choose CV<span className="text-red-500">*</span>
            </div>
            <select
              name="cv"
              value={parseInt(values.cv, 10)}
              onChange={handleChange}
              className={`${
                touched.cv && errors.cv && "border-red-500"
              } w-full rounded-md border px-4 py-2 focus:border-primary focus:outline-none focus:ring-primary`}
            >
              <option value="" disabled>
                Select CV
              </option>
              {cvs_loading ? (
                <option value="" disabled>
                  Loading...
                </option>
              ) : (
                cvs.map((cv) => (
                  <option key={cv.id} value={parseInt(cv.id, 10)}>
                    {cv.cv.split("/").pop()}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="flex gap-6">
            <FormInput
              label="ATS Score"
              name="ats_score"
              placeHolder="ATS Score"
              type="number"
              onChange={handleChange}
              value={values.ats_score}
              error={errors.ats_score || error?.response?.data?.ats_score}
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
                <option value="" disabled className="text-gray-500">
                  Select Stage
                </option>
                {stage.map((stage) => (
                  <option key={stage.value} value={stage.value}>
                    {stage.name}
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
                {status.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.name}
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
          <div className="flex flex-col gap-2">
            <select
              onChange={(e) => {
                if (e.target.value === "add-employee") {
                  setAddEmployee(true);
                } else {
                  setFieldValue("contacted_employees", [
                    ...values.contacted_employees,
                    e.target.value,
                  ]);
                }
              }}
              name="contacted_employees"
              value={values.contacted_employees}
              className={`${
                touched.contacted_employees &&
                errors.contacted_employees &&
                "border-red-500"
              } w-full rounded-md border px-4 py-2 text-gray-500 focus:border-primary focus:outline-none ${
                values.contacted_employees ? "text-black" : "text-gray-500"
              } focus:ring-primary`}
            >
              <option value="" disabled className="text-gray-400">
                Select Contacted Employees
              </option>
              {employees?.length > 0 &&
                employees.map((employee) => (
                  <option
                    key={employee.id}
                    value={employee.id}
                    className="text-black"
                  >
                    {employee.name}
                  </option>
                ))}
              <option value={"add-employee"}>Add Employee</option>
            </select>

            {errors.contacted_employees && touched.contacted_employees && (
              <span className="mt-1 text-xs text-red-500">
                {errors.contacted_employees}
              </span>
            )}

            <div className="flex flex-wrap">
              {Array.isArray(values?.contacted_employees) &&
                values?.contacted_employees.length !== 0 &&
                values.contacted_employees.map((employeeId) => {
                  const employee = employees?.find((emp) => {
                    return emp.id === Number(employeeId);
                  });
                  return (
                    <div
                      key={employeeId}
                      className="flex bg-primary text-white px-2 py-1 rounded-full text-xs items-center gap-2"
                    >
                      <p>{employee?.name || "Loading..."}</p>
                      <button
                        onClick={() =>
                          setFieldValue(
                            "contacted_employees",
                            values.contacted_employees.filter(
                              (id) => id !== employeeId
                            )
                          )
                        }
                      >
                        x
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>

          <FormInput
            label="Submission Date"
            name="submission_date"
            placeHolder="Submission Date"
            type="date"
            onChange={handleChange}
            value={values.submission_date}
            error={
              errors.submission_date || error?.response?.data?.submission_date
            }
            touched={touched.submission_date}
          />
          <FormInput
            label="Description"
            name="description"
            placeHolder="Description"
            textarea
            onChange={handleChange}
            value={values.description}
            error={errors.description || error?.response?.data?.description}
            touched={touched.description}
            textArea
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
