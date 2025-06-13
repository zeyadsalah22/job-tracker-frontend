import Modal from "../Modal";
import { useFormik } from "formik";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { applicationSchema } from "../../schemas/Schemas";
import FormInput from "../FormInput";
import ReactLoading from "react-loading";
import { useQuery } from "react-query";
import useUserStore from "../../store/user.store";
import AddModalEmployees from "../employees/AddModal";
import { useAxiosPrivate } from "../../utils/axios";

export default function EditModal({ id, refetch, openEdit, setOpenEdit }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useUserStore((state) => state.user);
  const [addEmployee, setAddEmployee] = useState(false);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const employeeDropdownRef = useRef(null);

  // Handle click outside to close employee dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (employeeDropdownRef.current && !employeeDropdownRef.current.contains(event.target)) {
        setEmployeeDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchApplication = async () => {
    try {
      if (!id) return null;
      const response = await axiosPrivate.get(`/applications/${id}`);
      console.log("Fetched application:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching application:", error);
      return null;
    }
  };

  const { data: application, isLoading } = useQuery(
    ["application", id],
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
        setError(null);
        
        // Validate required fields
        if (!values.submitted_cv) {
          toast.error("Please select a CV");
          setLoading(false);
          return;
        }
        
        // Transform form values to match backend API format
        const applicationData = {
          jobTitle: values.job_title,
          jobType: values.job_type, 
          description: values.description,
          link: values.link,
          submittedCvId: parseInt(values.submitted_cv, 10),
          atsScore: values.ats_score ? parseInt(values.ats_score, 10) : null,
          stage: values.stage,
          status: values.status,
          submissionDate: values.submission_date,
          contactedEmployeeIds: values.contacted_employees.map(id => parseInt(id, 10))
        };

        console.log("Updating application data:", applicationData);
        
        try {
          await axiosPrivate.put(`/applications/${id}`, applicationData);
          setOpenEdit(false);
          setLoading(false);
          toast.success("Application updated successfully");
          refetch();
        } catch (error) {
          console.error("Error updating application:", error);
          setLoading(false);
          setError(error);
          
          let errorMessage = "An error occurred. Please try again";
          if (error.response?.data) {
            // Try to extract error message from different possible formats
            if (typeof error.response.data === 'string') {
              errorMessage = error.response.data;
            } else if (error.response.data.message) {
              errorMessage = error.response.data.message;
            } else if (error.response.data.error) {
              errorMessage = error.response.data.error;
            } else if (error.response.data.title) {
              errorMessage = error.response.data.title;
            } else if (error.response.data.errors) {
              errorMessage = Object.values(error.response.data.errors).flat().join(", ");
            }
          }
          
          toast.error(errorMessage);
        }
      },
    });

  const fetchEmployees = async () => {
    try {
      // Only fetch employees if application is loaded and has a company
      if (!application?.companyId) return [];
      
      const params = { 
        CompanyId: application.companyId,
        Search: employeeSearch || undefined,
        PageSize: 100
      };
      
      const response = await axiosPrivate.get('/employees', { params });
      console.log("Fetched employees response:", response.data);
      console.log("Response data type:", typeof response.data);
      console.log("Is array:", Array.isArray(response.data));
      
      // Handle different possible response structures
      let employeesArray = [];
      
      if (Array.isArray(response.data)) {
        // Direct array response
        employeesArray = response.data;
      } else if (response.data && Array.isArray(response.data.items)) {
        // Response with items array
        employeesArray = response.data.items;
      } else if (response.data && Array.isArray(response.data.data)) {
        // Response with data array
        employeesArray = response.data.data;
      } else if (response.data && response.data.employees && Array.isArray(response.data.employees)) {
        // Response with employees array
        employeesArray = response.data.employees;
      } else {
        console.log("Unexpected response structure:", response.data);
        return [];
      }
      
      console.log("Employees array:", employeesArray);
      
      return employeesArray.map(employee => ({
        id: employee.employeeId || employee.id,
        name: employee.name,
        employeeId: employee.employeeId || employee.id,
        email: employee.email,
        jobTitle: employee.jobTitle,
        linkedinLink: employee.linkedinLink
      }));
    } catch (error) {
      console.error("Error fetching employees:", error);
      if (error.response) {
        console.log("Error response:", error.response.data);
        console.log("Error status:", error.response.status);
      }
      return [];
    }
  };

  const {
    data: employees,
    isLoading: employees_loading,
    refetch: employee_refetch,
  } = useQuery(
    ["employees", { id: application?.companyId, employeeSearch }],
    fetchEmployees,
    {
      enabled: !!application?.companyId,
    }
  );

  const fetchCvs = async () => {
    try {
      const response = await axiosPrivate.get(`/cvs`);
      console.log("Fetched CVs for edit modal:", response.data);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching CVs:", error);
      return [];
    }
  };

  const { data: cvs, isLoading: cvs_loading } = useQuery(["cvs"], fetchCvs);

  const stage = [
    { name: "Applied", value: "Applied" },
    { name: "Phone Screen", value: "Phonescreen" },
    { name: "Assessment", value: "Assessment" },
    { name: "Interview", value: "Interview" },
    { name: "Offer", value: "Offer" },
  ];

  const status = [
    { name: "Pending", value: "Pending" },
    { name: "Rejected", value: "Rejected" },
    { name: "Accepted", value: "Accepted" },
  ];

  useEffect(() => {
    if (!isLoading && application) {
      setFieldValue("user_id", user.userId);
      setFieldValue("company_id", application.companyId);
      setFieldValue("job_title", application.jobTitle);
      setFieldValue("job_type", application.jobType);
      setFieldValue("description", application.description);
      setFieldValue("link", application.link);
      setFieldValue("ats_score", application.atsScore);
      setFieldValue("stage", application.stage);
      setFieldValue("status", application.status);
      setFieldValue("submission_date", application.submissionDate);
      setFieldValue("contacted_employees", 
        application.contactedEmployees?.map(emp => emp.employeeId.toString()) || []);
      setFieldValue("submitted_cv", application.submittedCvId);
    }
  }, [setFieldValue, application, isLoading, user]);

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
      <div className="flex flex-col gap-4">
        <h1 className="font-semibold text-lg">Update application</h1>
        {isLoading ? (
          <div className="flex justify-center">
            <ReactLoading type="spin" color="#4F46E5" height={30} width={30} />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Read-only company display */}
            <div className="bg-gray-50 p-3 rounded-md border">
              <div className="text-sm text-gray-600 mb-1">Company</div>
              <div className="font-medium text-gray-800">
                {application?.companyName || application?.company?.name || 'Loading company...'}
              </div>
            </div>

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
                required
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
                required
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
                  cvs && cvs.map((cv) => (
                    <option key={cv.resumeId} value={cv.resumeId}>
                      Resume {cv.resumeId} ({new Date(cv.createdAt).toLocaleDateString()})
                    </option>
                  ))
                )}
              </select>
              {errors.submitted_cv && touched.submitted_cv && (
                <span className="mt-1 text-xs text-red-500">
                  {errors.submitted_cv}
                </span>
              )}
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
                required
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
                  {stage && stage.map((stage) => (
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
                  <option value="" disabled>
                    Select Status
                  </option>
                  {status && status.map((status) => (
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
              <div className="flex flex-col gap-2 w-full">
                <div className="text-sm text-gray-600">
                  Choose Employees<span className="text-red-500">*</span>
                </div>
                <div className="relative" ref={employeeDropdownRef}>
                  <input
                    type="text"
                    placeholder="Search and select employees..."
                    className="w-full rounded-md border px-4 py-2 focus:border-primary focus:outline-none focus:ring-primary"
                    value={employeeSearch}
                    onChange={(e) => {
                      setEmployeeSearch(e.target.value);
                      setEmployeeDropdownOpen(true);
                    }}
                    onFocus={() => {
                      setEmployeeDropdownOpen(true);
                      // Trigger employee fetch when focused
                      if (!employees?.length) {
                        employee_refetch();
                      }
                    }}
                  />
                  {employeeDropdownOpen && employees?.length > 0 && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1">
                      {employees_loading ? (
                        <div className="p-4 text-center text-gray-500">Loading...</div>
                      ) : (
                        <>
                          {employees
                            .filter(employee => 
                              !employeeSearch || 
                              employee.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
                              (employee.jobTitle && employee.jobTitle.toLowerCase().includes(employeeSearch.toLowerCase()))
                            )
                            .map((employee) => (
                              <div
                                key={employee.id}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                                onClick={() => {
                                  if (!values.contacted_employees.includes(employee.id.toString())) {
                                    setFieldValue("contacted_employees", [...values.contacted_employees, employee.id.toString()]);
                                  }
                                  setEmployeeSearch("");
                                  setEmployeeDropdownOpen(false);
                                }}
                              >
                                <div>
                                  <p className="font-medium">{employee.name}</p>
                                  {employee.jobTitle && (
                                    <p className="text-sm text-gray-500">{employee.jobTitle}</p>
                                  )}
                                </div>
                                {values.contacted_employees.includes(employee.id.toString()) && (
                                  <span className="text-green-600 text-sm">✓ Selected</span>
                                )}
                              </div>
                            ))}
                          <div
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-blue-600 border-t"
                            onClick={() => {
                              setAddEmployee(true);
                              setEmployeeSearch("");
                              setEmployeeDropdownOpen(false);
                            }}
                          >
                            + Add New Employee
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  {employeeDropdownOpen && !employees_loading && employees?.length === 0 && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg p-4 mt-1">
                      <div className="text-center text-gray-500 mb-2">
                        No employees found for this company
                      </div>
                      <div
                        className="text-center text-blue-600 cursor-pointer hover:underline"
                        onClick={() => {
                          setAddEmployee(true);
                          setEmployeeSearch("");
                          setEmployeeDropdownOpen(false);
                        }}
                      >
                        + Add New Employee
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap">
                {Array.isArray(values?.contacted_employees) &&
                  values?.contacted_employees.length !== 0 &&
                  values.contacted_employees.map((employeeId) => {
                    const employee = employees?.find(
                      (emp) => emp.id === Number(employeeId) || emp.employeeId === Number(employeeId)
                    );
                    return (
                      <div
                        key={employeeId}
                        className="flex bg-primary text-white px-2 py-1 rounded-full text-xs items-center gap-2 mr-2 mb-2"
                      >
                        {employee ? (
                          <p>{employee.name}</p>
                        ) : (
                          <p>Loading Employee...</p>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            setFieldValue(
                              "contacted_employees",
                              values.contacted_employees.filter(
                                (id) => id !== employeeId
                              )
                            )
                          }
                          className="ml-1 hover:bg-red-600 rounded-full w-4 h-4 flex items-center justify-center"
                        >
                          ×
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
              required
            />
            <FormInput
              label="Description"
              name="description"
              placeHolder="Description"
              textArea
              onChange={handleChange}
              value={values.description}
              error={errors.description || error?.response?.data?.description}
              touched={touched.description}
              required
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
                Update
              </button>
            )}
          </form>
        )}
      </div>
    </Modal>
  );
}
