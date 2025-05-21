import Modal from "../Modal";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FormInput from "../FormInput";
import ReactLoading from "react-loading";
import { useQuery } from "react-query";
import { useAxiosPrivate } from "../../utils/axios";
import * as Yup from "yup";

// Simple schema for description only
const userCompanySchema = Yup.object().shape({
  description: Yup.string().required("Description is required"),
});

export default function EditModal({ id, refetch, openEdit, setOpenEdit }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const fetchUserCompany = async () => {
    try {
      const response = await axiosPrivate.get(`/user-companies/${id}`);
      console.log("User company data for edit:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching user company:", error);
      throw error;
    }
  };

  const { data: userCompany, isLoading } = useQuery(
    ["user-company", { id }],
    fetchUserCompany,
    {
      enabled: !!id,
    }
  );

  const { values, errors, handleSubmit, handleChange, touched, setFieldValue } =
    useFormik({
      initialValues: {
        description: "",
      },
      validationSchema: userCompanySchema,
      onSubmit: async (values) => {
        setLoading(true);
        try {
          await axiosPrivate.put(`/user-companies/${id}`, { 
            description: values.description 
          });
          setOpenEdit(false);
          setLoading(false);
          toast.success("Company information updated successfully");
          refetch();
        } catch (error) {
          setLoading(false);
          setError(error);
          toast.error(
            error.response?.data?.message || 
            "An error occurred. Please try again"
          );
        }
      },
    });

  useEffect(() => {
    if (!isLoading && userCompany) {
      setFieldValue("description", userCompany.description || "");
    }
  }, [setFieldValue, userCompany, isLoading]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Modal open={openEdit} setOpen={setOpenEdit} width="600px">
      <div className="flex flex-col gap-4">
        <h1 className="font-semibold text-lg">Update Company Notes</h1>
        {userCompany && (
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="font-medium text-gray-700">{userCompany.companyName}</p>
            <p className="text-sm text-gray-500">{userCompany.companyLocation}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <FormInput
            label="Description"
            name="description"
            placeHolder="Add your notes about this company (e.g., positions of interest, information gathering)"
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
              Update Notes
            </button>
          )}
        </form>
      </div>
    </Modal>
  );
}
