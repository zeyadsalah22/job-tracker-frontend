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
import AddModalCompanies from "../user-companies/AddModal";
import Dropdown from "../Dropdown";
import { useAxiosPrivate } from "../../utils/axios";

export default function AddModal({ refetch, openAdd, setOpenAdd }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useUserStore((state) => state.user);
  const [addEmployee, setAddEmployee] = useState(false);
  const [addCompany, setAddCompany] = useState(false);
  const [companySearch, setCompanySearch] = useState("");
  const [employeeSearch, setEmployeeSearch] = useState("");
  const axiosPrivate = useAxiosPrivate();

  const { values, errors, handleSubmit, handleChange, touched, setFieldValue } =
    useFormik({
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
        contacted_employees: [],
      },

      validationSchema: applicationSchema,
      onSubmit: async (values) => {
        setLoading(true);
        await axiosPrivate
          .post("/applications", {
            ...values,
            submitted_cv: parseInt(values.submitted_cv, 10),
          })
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
              error.response?.data?.name?.map((error) => error) ||
                "An error occurred. Please try again"
            );
          });
      },
    });

  const fetchCompanies = async () => {
    const { data } = await axiosPrivate.get(
      `/companies?search=${companySearch}`
    );
    return data;
  };

  const {
    data: companies,
    isLoading: companyies_Loading,
    refetch: company_refetch,
  } = useQuery(["companies", companySearch], fetchCompanies);

  const fetchEmployees = async () => {
    const { data } = await axiosPrivate.get(
      `/employees?company__id=${values.company_id}&search=${employeeSearch}`
    );
    return data;
  };

  const {
    data: employees,
    isLoading: employees_loading,
    refetch: employee_refetch,
  } = useQuery(
    ["employees", { id: values.company_id, employeeSearch }],
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
    { name: "Applied", value: "APPLIED" },
    { name: "Phone Screen", value: "PHONE_SCREEN" },
    { name: "Assessment", value: "ASSESSMENT" },
    { name: "Interview", value: "INTERVIEW" },
    { name: "Offer", value: "OFFER" },
  ];

  const status = [
    { name: "Pending", value: "PENDING" },
    { name: "Assessment", value: "ASSESSMENT" },
    { name: "Interview", value: "INTERVIEW" },
    { name: "Rejected", value: "REJECTED" },
    { name: "Accepted", value: "ACCEPTED" },
  ];

  useEffect(() => {
    if (user) {
      values.user_id = user.id;
    }
  }, [user, values]);

  const setCompanyId = (id) => {
    if (id === "add-company") {
      setAddCompany(true);
    }
    setFieldValue("company_id", id);
  };

  const setEmployeeId = (id) => {
    if (id === "add-employee") {
      setAddEmployee(true);
      return;
    }

    if (!values.contacted_employees.includes(id)) {
      setFieldValue("contacted_employees", [...values.contacted_employees, id]);
    }
  };

  return (
    <Modal open={openAdd} setOpen={setOpenAdd} width="600px">
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
        <h1 className="font-semibold text-lg">Add Application</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2 w-full">
            <p className="text-sm text-gray-600">
              Choose Company<span className="text-red-500">*</span>
            </p>
            <Dropdown
              add={{
                name: "Add Company",
                value: "add-company",
              }}
              options={companies?.results}
              query={companySearch}
              setQuery={setCompanySearch}
              setValue={setCompanyId}
              isLoading={companyies_Loading}
              error={errors.company_id || error?.response?.data?.company_id}
              touched={touched.company_id}
            />
            {errors.company_id && touched.company_id && (
              <span className="mt-1 text-xs text-red-500">
                {errors.company_id}
              </span>
            )}
          </div>

          <div className="flex gap-6 w-full">
            <div className="w-full">
              <FormInput
                label="Job Title"
                name="job_title"
                placeHolder="Job Title"
                type="text"
                onChange={handleChange}
                value={values.job_title}
                error={errors.job_title || error?.response?.data?.job_title}
                touched={touched.job_title}
                required
              />
            </div>
            <div className="w-full">
              <FormInput
                label="Job Type"
                name="job_type"
                placeHolder="Job Type"
                type="text"
                onChange={handleChange}
                value={values.job_type}
                error={errors.job_type || error?.response?.data?.job_type}
                touched={touched.job_type}
                required
              />
            </div>
          </div>
          <FormInput
            label="Link"
            name="link"
            placeHolder="Link"
            type="text"
            required
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
              name="submitted_cv"
              value={values.submitted_cv}
              onChange={handleChange}
              className={`${
                touched.submitted_cv && errors.submitted_cv && "border-red-500"
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
                  <option key={cv.id} value={cv.id}>
                    {cv.cv.split("/").pop()}
                  </option>
                ))
              )}
            </select>
            {errors.submitted_cv && touched.submitted_cv && (
              <span className="mt-1 text-xs text-red-500">
                {errors.submitted_cv || error?.response?.data?.submitted_cv}
              </span>
            )}
          </div>

          <div className="flex gap-6">
            <FormInput
              label="ATS Score"
              name="ats_score"
              placeHolder="ATS Score"
              type="number"
              required
              onChange={handleChange}
              value={values.ats_score}
              error={errors.ats_score || error?.response?.data?.ats_score}
              touched={touched.ats_score}
            />
          </div>
          <div className="flex gap-6 w-full">
            <div className="flex flex-col gap-2 w-full">
              <div className="text-sm text-gray-600">
                Choose Stage<span className="text-red-500">*</span>
              </div>
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
                {stage.map((stage) => (
                  <option key={stage.value} value={stage.value}>
                    {stage.name}
                  </option>
                ))}
              </select>
              {errors.stage && touched.stage && (
                <span className="mt-1 text-xs text-red-500">
                  {errors.stage || error?.response?.data?.stage}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2 w-full">
              <div className="text-sm text-gray-600">
                Choose Status<span className="text-red-500">*</span>
              </div>
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
                  {errors.status || error?.response?.data?.status}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2 w-full">
              <div className="text-sm text-gray-600">
                Choose Employee<span className="text-red-500">*</span>
              </div>
              <Dropdown
                add={{
                  name: "Add Employee",
                  value: "add-employee",
                }}
                options={employees?.results}
                query={employeeSearch}
                setQuery={setEmployeeSearch}
                setValue={setEmployeeId}
                isLoading={employees_loading}
              />
            </div>
            <div className="flex flex-wrap">
              {Array.isArray(values?.contacted_employees) &&
                values?.contacted_employees.length !== 0 &&
                values.contacted_employees.map((employeeId) => {
                  const employee = employees?.results?.find(
                    (emp) => emp.id === Number(employeeId)
                  );
                  return (
                    <div
                      key={employeeId}
                      className="flex bg-primary text-white px-2 py-1 rounded-full text-xs items-center gap-2"
                    >
                      {employee ? (
                        <p>{employee.name}</p>
                      ) : (
                        <p>Invalid Employee</p>
                      )}
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
            required
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
            required
            textArea
            onChange={handleChange}
            value={values.description}
            error={errors.description || error?.response?.data?.description}
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
