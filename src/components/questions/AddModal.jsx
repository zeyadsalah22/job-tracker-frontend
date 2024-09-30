import Modal from "../Modal";
import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { questionSchema } from "../../schemas/Schemas";
import FormInput from "../FormInput";
import ReactLoading from "react-loading";
import { useQuery } from "react-query";
import useUserStore from "../../store/user.store";
import Dropdown from "../Dropdown";

export default function AddModal({ refetch, openAdd, setOpenAdd }) {
  const token = localStorage.getItem("token");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const user = useUserStore((state) => state.user);

  const fetchApplications = async () => {
    const { data } = await axios.get(`http://127.0.0.1:8000/api/applications`, {
      headers: {
        Authorization: `Token  ${localStorage.getItem("token")}`,
      },
    });
    return data;
  };

  const { data: applications, isLoading } = useQuery(
    ["applications"],
    fetchApplications
  );

  const { values, errors, handleSubmit, handleChange, touched, setFieldValue } =
    useFormik({
      initialValues: {
        user_id: "",
        question: "",
        answer: "",
        application_id: "",
      },

      validationSchema: questionSchema,
      onSubmit: async (values) => {
        setLoading(true);
        await axios
          .post("http://127.0.0.1:8000/api/questions", values, {
            headers: {
              Authorization: `Token ${token}`,
            },
          })
          .then(() => {
            setOpenAdd(false);
            setLoading(false);
            toast.success("Question added successfully");
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

  const setAppId = (id) => {
    setFieldValue("application_id", id);
  };

  useEffect(() => {
    if (user) {
      setFieldValue("user_id", user.id);
    }
  }, [user, setFieldValue]);

  const application_names = applications?.results?.map(({ id, job_title }) => {
    return {
      id,
      name: job_title,
    };
  });

  return (
    <Modal open={openAdd} setOpen={setOpenAdd} width="600px">
      <div className="flex flex-col gap-4">
        <h1 className="font-semibold text-lg">Add Question</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <FormInput
            label="Question"
            textArea={true}
            name="question"
            placeHolder="Question"
            value={values.question}
            onChange={handleChange}
            error={errors.question || error?.response?.data?.question}
            touched={touched.question}
          />
          <FormInput
            label="Answer"
            textArea={true}
            name="answer"
            placeHolder="Answer"
            value={values.answer}
            onChange={handleChange}
            error={errors.answer || error?.response?.data?.answer}
            touched={touched.answer}
          />

          <div className="flex flex-col gap-2 w-full">
            <p className="text-sm text-gray-600">
              Choose Application<span className="text-red-500">*</span>
            </p>
            <Dropdown
              options={application_names}
              query={search}
              setQuery={setSearch}
              setValue={setAppId}
              isLoading={isLoading}
              error={
                errors.application_id || error?.response?.data?.application_id
              }
              touched={touched.application_id}
            />
            {errors.application_id && touched.application_id && (
              <span className="mt-1 text-xs text-red-500">
                {errors.application_id || error?.response?.data?.application_id}
              </span>
            )}
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
