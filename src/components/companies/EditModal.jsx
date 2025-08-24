import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/Dialog";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { companySchema } from "../../schemas/Schemas";
import FormField from "../ui/FormField";
import ReactLoading from "react-loading";
import { useQuery } from "react-query";
import useUserStore from "../../store/user.store";
import { useAxiosPrivate } from "../../utils/axios";

export default function EditModal({ id, refetch, openEdit, setOpenEdit }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useUserStore((state) => state.user);
  const axiosPrivate = useAxiosPrivate();

  const fetchCompany = async () => {
    const { data } = await axiosPrivate.get(`/Company/${id}`);
    return data;
  };

  const { data: company, isLoading } = useQuery(
    ["company", { id }],
    fetchCompany,
    {
      enabled: !!id,
    }
  );

  const { values, errors, handleSubmit, handleChange, touched, setFieldValue } =
    useFormik({
      initialValues: {
        name: "",
        location: "",
        careersLink: "",
        linkedinLink: "",
      },

      validationSchema: companySchema,
      onSubmit: async (values) => {
        setLoading(true);
        await axiosPrivate
          .put(`/Company/${id}`, values)
          .then(() => {
            setOpenEdit(false);
            setLoading(false);
            toast.success("Company updated successfully");
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

  useEffect(() => {
    if (company) {
      setFieldValue("name", company.name);
      setFieldValue("location", company.location);
      setFieldValue("careersLink", company.careersLink);
      setFieldValue("linkedinLink", company.linkedinLink);
    }
  }, [company, setFieldValue]);

  return (
    <Modal open={openEdit} setOpen={setOpenEdit} width="600px">
      <div className="flex flex-col gap-4">
        <h1 className="font-semibold text-lg">Update Company</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <FormField
            name="name"
            type="text"
            placeHolder="Name"
            value={values.name}
            onChange={handleChange}
            error={errors.name || error?.response?.data?.name}
            touched={touched.name}
            required
          />

          <FormField
            name="location"
            type="text"
            placeHolder="Location"
            value={values.location}
            onChange={handleChange}
            error={errors.location || error?.response?.data?.location}
            touched={touched.location}
            required
          />

          <FormField
            name="careersLink"
            type="text"
            placeHolder="Careers Link"
            value={values.careersLink}
            onChange={handleChange}
            error={errors.careersLink || error?.response?.data?.careersLink}
            touched={touched.careersLink}
          />

          <FormField
            name="linkedinLink"
            type="text"
            placeHolder="LinkedIn Link"
            value={values.linkedinLink}
            onChange={handleChange}
            error={errors.linkedinLink || error?.response?.data?.linkedinLink}
            touched={touched.linkedinLink}
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