import Modal from "../Modal";
import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { employeeSchema } from "../../schemas/Schemas";
import FormInput from "../FormInput";
import ReactLoading from "react-loading";
import { useQuery } from "react-query";
import useUserStore from "../../store/user.store";
import Dropdown from "../Dropdown";
import AddModalCompanies from "../user-companies/AddModal";
import { useAxiosPrivate } from "../../utils/axios";

export default function AddModal({ refetch, openAdd, setOpenAdd }) {
  const token = localStorage.getItem("access");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useUserStore((state) => state.user);
  const [companySearch, setCompanySearch] = useState("");
  const [addCompany, setAddCompany] = useState(false);
  const axiosPrivate = useAxiosPrivate();

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

  const fetchCompanies = async () => {
    const { data } = await axiosPrivate.get(
      `/companies?search=${companySearch}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  };

  const {
    data: companies,
    isLoading: companyies_Loading,
    refetch: company_refetch,
  } = useQuery(["companies", companySearch], fetchCompanies);

  const { values, errors, handleSubmit, handleChange, touched, setFieldValue } =
    useFormik({
      initialValues: {
        user_id: "",
        name: "",
        linkedin_link: "",
        email: "",
        job_title: "",
        contacted: "",
        company_id: "",
      },

      validationSchema: employeeSchema,
      onSubmit: async (values) => {
        setLoading(true);
        await axiosPrivate
          .post("/employees", values, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(() => {
            setOpenAdd(false);
            setLoading(false);
            toast.success("Employee added successfully");
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

  return (
    <Modal open={openAdd} setOpen={setOpenAdd} width="600px">
      <div className="flex flex-col gap-4">
        <h1 className="font-semibold text-lg">Add Employee</h1>
        <div className="z-[100]">
          {addCompany && (
            <AddModalCompanies
              openAdd={addCompany}
              setOpenAdd={setAddCompany}
              refetch={company_refetch}
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
            name="linkedin_link"
            type="text"
            placeHolder="Linkedin Link"
            value={values.linkedin_link}
            onChange={handleChange}
            error={errors.linkedin_link || error?.response?.data?.linkedin_link}
            touched={touched.linkedin_link}
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
            name="job_title"
            type="text"
            placeHolder="Job Title"
            value={values.job_title}
            onChange={handleChange}
            error={errors.job_title || error?.response?.data?.job_title}
            touched={touched.job_title}
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
                id={values.company_id}
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
                  {errors.company_id || error?.response?.data?.company_id}
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
