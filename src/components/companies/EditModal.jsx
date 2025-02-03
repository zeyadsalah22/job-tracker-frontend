import Modal from "../Modal";
import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FormInput from "../FormInput";
import ReactLoading from "react-loading";
import { useQuery } from "react-query";

export default function EditModal({ id, refetch, openEdit, setOpenEdit }) {
  const token = localStorage.getItem("token");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCompany = async () => {
    const { data } = await axios.get(
      `https://job-lander-backend.fly.dev/api/companies/${id}`,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    );
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
        careers_link: "",
        linkedin_link: "",
      },

      // validationSchema: companySchema,
      onSubmit: async (values) => {
        setLoading(true);
        await axios
          .patch(
            `https://job-lander-backend.fly.dev/api/companies/${id}`,
            values,
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          )
          .then(() => {
            setOpenEdit(false);
            setLoading(false);
            toast.success("company updated successfully");
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
    if (!isLoading && company) {
      setFieldValue("name", company.name);
      setFieldValue("location", company.location);
      setFieldValue("careers_link", company.careers_link);
      setFieldValue("linkedin_link", company.linkedin_link);
    }
  }, [setFieldValue, company, isLoading]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Modal open={openEdit} setOpen={setOpenEdit} width="600px">
      <div className="flex flex-col gap-4">
        <h1 className="font-semibold text-lg">Update company</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <FormInput
            name="name"
            type="text"
            placeHolder="company Name"
            value={values.name}
            onChange={handleChange}
            error={errors.name || error?.response?.data?.name}
            touched={touched.name}
          />

          <FormInput
            name="location"
            type="text"
            placeHolder="Location"
            value={values.location}
            onChange={handleChange}
            error={errors.location || error?.response?.data?.location}
            touched={touched.location}
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
            name="careers_link"
            type="text"
            placeHolder="Careers Link"
            value={values.careers_link}
            onChange={handleChange}
            error={errors.careers_link || error?.response?.data?.careers_link}
            touched={touched.careers_link}
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
