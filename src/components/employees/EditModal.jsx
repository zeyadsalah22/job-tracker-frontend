import Modal from "../Modal";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { employeeSchema } from "../../schemas/Schemas";
import FormInput from "../FormInput";
import ReactLoading from "react-loading";
import { useQuery } from "react-query";
import useUserStore from "../../store/user.store";
import { useAxiosPrivate } from "../../utils/axios";
import Dropdown from "../Dropdown";
import AddModalCompanies from "../user-companies/AddModal";

export default function EditModal({ id, refetch, openEdit, setOpenEdit }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useUserStore((state) => state.user);
  const axiosPrivate = useAxiosPrivate();
  const [companySearch, setCompanySearch] = useState("");
  const [addCompany, setAddCompany] = useState(false);

  const contacted = [
    {
      name: "Sent",
      value: "SENT",
    },
    {
      name: "Accepted",
      value: "ACCEPTED",
    },
    {
      name: "Messaged",
      value: "MESSAGED",
    },
    {
      name: "Replied",
      value: "REPLIED",
    },
    {
      name: "Established Connection",
      value: "STRONG_CONNECTION",
    },
  ];

  const fetchEmployee = async () => {
    try {
      const response = await axiosPrivate.get(`/employees/${id}`);
      console.log("Employee details for edit:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching employee details:", error);
      throw error;
    }
  };

  const { data: employee, isLoading } = useQuery(
    ["employee", id],
    fetchEmployee,
    {
      enabled: !!id,
    }
  );

  const fetchCompanies = async () => {
    try {
      const params = {
        SearchTerm: companySearch || undefined,
        PageSize: 100 // Ensure we get a good number of results
      };
      
      console.log("Fetching user companies with params:", params);
      const response = await axiosPrivate.get('/user-companies', { params });
      console.log("User companies response:", response.data);
      
      // Map the API response to match what the dropdown expects
      const items = response.data.items || [];
      return {
        results: items.map(company => ({
          id: company.companyId,
          name: company.companyName || company.name, // Handle different possible API formats
          value: company.companyId,
          location: company.companyLocation || company.location
        }))
      };
    } catch (error) {
      console.error("Error fetching user companies:", error);
      return {
        results: []
      };
    }
  };

  const {
    data: companies,
    isLoading: companiesLoading,
    refetch: companyRefetch
  } = useQuery(["user-companies", companySearch], fetchCompanies);

  const { values, errors, handleSubmit, handleChange, touched, setFieldValue } =
    useFormik({
      initialValues: {
        userId: "",
        name: "",
        linkedinLink: "",
        email: "",
        jobTitle: "",
        contacted: "",
        companyId: "",
      },

      validationSchema: employeeSchema,
      onSubmit: async (values) => {
        setLoading(true);
        
        try {
          console.log("Updating employee with values:", values);
          const response = await axiosPrivate.put(`/employees/${id}`, values);
          console.log("Update response:", response.data);
          
          setOpenEdit(false);
          setLoading(false);
          toast.success("Employee updated successfully");
          refetch();
        } catch (error) {
          console.error("Error updating employee:", error);
          setLoading(false);
          setError(error);
          
          const errorMessage = error.response?.data?.errors 
            ? Object.values(error.response.data.errors).flat().join(", ")
            : "An error occurred. Please try again";
            
          toast.error(errorMessage);
        }
      },
    });

  useEffect(() => {
    if (!isLoading && employee) {
      setFieldValue("userId", employee.userId || user.userId);
      setFieldValue("name", employee.name || "");
      setFieldValue("linkedinLink", employee.linkedinLink || "");
      setFieldValue("email", employee.email || "");
      setFieldValue("jobTitle", employee.jobTitle || "");
      setFieldValue("contacted", employee.contacted || "");
      setFieldValue("companyId", employee.companyId);
    }
  }, [setFieldValue, employee, isLoading, user]);

  const setCompanyId = (id) => {
    if (id === "add-company") {
      setAddCompany(true);
    }
    setFieldValue("companyId", id);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Modal open={openEdit} setOpen={setOpenEdit} width="600px">
      <div className="flex flex-col gap-4">
        <h1 className="font-semibold text-lg">Update Employee</h1>
        <div className="z-[100]">
          {addCompany && (
            <AddModalCompanies
              openAdd={addCompany}
              setOpenAdd={setAddCompany}
              refetch={companyRefetch}
            />
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <FormInput
            name="name"
            type="text"
            placeHolder="Employee Name"
            value={values.name}
            onChange={handleChange}
            error={errors.name || error?.response?.data?.name}
            touched={touched.name}
            required
          />

          <FormInput
            name="linkedinLink"
            type="text"
            placeHolder="Linkedin Link"
            value={values.linkedinLink}
            onChange={handleChange}
            error={errors.linkedinLink || error?.response?.data?.linkedinLink}
            touched={touched.linkedinLink}
          />

          <FormInput
            name="email"
            type="email"
            placeHolder="Email"
            value={values.email}
            onChange={handleChange}
            error={errors.email || error?.response?.data?.email}
            touched={touched.email}
          />

          <FormInput
            name="jobTitle"
            type="text"
            placeHolder="Job Title"
            value={values.jobTitle}
            onChange={handleChange}
            error={errors.jobTitle || error?.response?.data?.jobTitle}
            touched={touched.jobTitle}
            required
          />

          <div className="flex gap-6 w-full">
            <div className="flex flex-col gap-2 w-full">
              <p className="text-sm text-gray-600">
                Choose Status<span className="text-red-500">*</span>
              </p>
              <select
                name="contacted"
                value={values.contacted}
                onChange={handleChange}
                className={`${
                  touched.contacted && errors.contacted && "border-red-500"
                } w-full rounded-md border px-4 py-2 focus:border-primary focus:outline-none focus:ring-primary`}
              >
                <option value="" disabled>
                  Select Contact Status
                </option>
                {contacted.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.name}
                  </option>
                ))}
              </select>
              {errors.contacted && touched.contacted && (
                <span className="mt-1 text-xs text-red-500">
                  {errors.contacted || error?.response?.data?.contacted}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2 w-full">
              <p className="text-sm text-gray-600">
                Choose Company<span className="text-red-500">*</span>
              </p>
              <Dropdown
                add={{
                  name: "Add Company",
                  value: "add-company",
                }}
                id={values.companyId}
                options={companies?.results}
                query={companySearch}
                setQuery={setCompanySearch}
                setValue={setCompanyId}
                isLoading={companiesLoading}
                error={errors.companyId || error?.response?.data?.companyId}
                touched={touched.companyId}
              />
              {errors.companyId && touched.companyId && (
                <span className="mt-1 text-xs text-red-500">
                  {errors.companyId || error?.response?.data?.companyId}
                </span>
              )}
            </div>
          </div>

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
