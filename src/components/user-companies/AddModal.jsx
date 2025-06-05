import Modal from "../Modal";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import FormInput from "../FormInput";
import ReactLoading from "react-loading";
import useUserStore from "../../store/user.store";
import { useAxiosPrivate } from "../../utils/axios";
import { useQuery } from "react-query";
import Dropdown from "../Dropdown";

// Create a schema for user company
const userCompanySchema = Yup.object().shape({
  companyId: Yup.number().required("Company is required"),
  description: Yup.string(),
});

export default function AddModal({ refetch, openAdd, setOpenAdd }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useUserStore((state) => state.user);
  const axiosPrivate = useAxiosPrivate();
  const [companySearch, setCompanySearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Fetch companies for dropdown
  const fetchCompanies = async () => {
    try {
      const response = await axiosPrivate.get('/companies', {
        params: {
          SearchTerm: companySearch || undefined,
          PageNumber: 1,
          PageSize: 50,
        }
      });
      
      console.log("Fetched companies:", response.data);
      
      // Ensure we get the data in the correct format regardless of API response structure
      const items = response.data.items || response.data || [];
      return {
        results: items.map(company => ({
          id: company.companyId,
          name: company.name,
          value: company.companyId,
          // Include other properties needed for display
          location: company.location
        }))
      };
    } catch (error) {
      console.error("Error fetching companies:", error);
      return { results: [] };
    }
  };

  const {
    data: companies,
    isLoading: companiesLoading,
    refetch: companiesRefetch
  } = useQuery(
    ["companies", companySearch], 
    fetchCompanies,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      enabled: true, // Always fetch, even if companySearch is empty
      onSuccess: (data) => {
        console.log("Companies loaded successfully:", data);
      }
    }
  );

  const { values, errors, handleSubmit, handleChange, touched, setFieldValue } = useFormik({
    initialValues: {
      userId: user?.userId,
      companyId: "",
      description: "",
    },

    validationSchema: userCompanySchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        console.log("Adding company:", values);
        await axiosPrivate.post("/user-companies", values);
        setOpenAdd(false);
        setLoading(false);
        toast.success("Company added successfully");
        refetch();
      } catch (error) {
        setLoading(false);
        setError(error);
        toast.error(
          "The company you are trying to add is already in your list" ||
          error.response?.data?.message || 
          "An error occurred. Please try again"
        );
      }
    },
  });

  const setCompanyId = (id) => {
    setFieldValue("companyId", id);
    // Find the selected company to display its name
    const company = companies?.results?.find(c => c.id === id);
    setSelectedCompany(company);
  };

  return (
    <Modal open={openAdd} setOpen={setOpenAdd} width="600px">
      <div className="flex flex-col gap-4">
        <h1 className="font-semibold text-lg">Add Company to My List</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2 w-full">
            <p className="text-sm text-gray-600">
              Choose Company<span className="text-red-500">*</span>
            </p>
            <Dropdown
              id={values.companyId}
              options={companies?.results || []}
              query={companySearch}
              setQuery={setCompanySearch}
              setValue={setCompanyId}
              isLoading={companiesLoading}
              error={errors.companyId || error?.response?.data?.companyId}
              touched={touched.companyId}
            />
            {errors.companyId && touched.companyId && (
              <span className="mt-1 text-xs text-red-500">
                {errors.companyId}
              </span>
            )}
          </div>

          <FormInput
            label="Description"
            name="description"
            placeHolder="Add notes about this company (e.g., positions of interest, data gathering)"
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
