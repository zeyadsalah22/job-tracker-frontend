import Modal from "../Modal";
import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import { comapnySchema } from "../../schemas/Schemas";
import FormInput from "../FormInput";
import ReactLoading from "react-loading";
import useUserStore from "../../store/user.store";
import { useAxiosPrivate } from "../../utils/axios";

export default function AddModal({ refetch, openAdd, setOpenAdd }) {
  const token = localStorage.getItem("access");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useUserStore((state) => state.user);
  const axiosPrivate = useAxiosPrivate();

  const { values, errors, handleSubmit, handleChange, touched } = useFormik({
    initialValues: {
      user_id: user.id,
      name: "",
      location: "",
      careers_link: "",
      linkedin_link: "",
    },

    validationSchema: comapnySchema,
    onSubmit: async (values) => {
      setLoading(true);
      await axiosPrivate
        .post("/companies", values)
        .then(() => {
          setOpenAdd(false);
          setLoading(false);
          toast.success("Company added successfully");
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

  return (
    <Modal open={openAdd} setOpen={setOpenAdd} width="600px">
      <div className="flex flex-col gap-4">
        <h1 className="font-semibold text-lg">Add Company</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <FormInput
            name="name"
            type="text"
            placeHolder="Name"
            value={values.name}
            onChange={handleChange}
            error={errors.name || error?.response?.data?.name}
            touched={touched.name}
            required
          />

          <FormInput
            name="location"
            type="text"
            placeHolder="Location"
            value={values.location}
            onChange={handleChange}
            error={errors.location || error?.response?.data?.location}
            touched={touched.location}
            required
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

          <FormInput
            name="linkedin_link"
            type="text"
            placeHolder="Linkedin Link"
            value={values.linkedin_link}
            onChange={handleChange}
            error={errors.linkedin_link || error?.response?.data?.linkedin_link}
            touched={touched.linkedin_link}
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
