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

export default function EditModal({ id, refetch, openEdit, setOpenEdit }) {
  const token = localStorage.getItem("access");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = useUserStore((state) => state.user);

  const fetchQeustion = async () => {
    const { data } = await axios.get(
      `http://127.0.0.1:8000/api/questions/${id}`,
      {
        headers: {
          Authorization: `Bearer  ${token}`,
        },
      }
    );
    return data;
  };

  const { data: question } = useQuery(["question", id], fetchQeustion, {
    enabled: !!id,
  });

  const fetchApplications = async () => {
    const { data } = await axios.get(`http://127.0.0.1:8000/api/applications`, {
      headers: {
        Authorization: `Bearer  ${token}`,
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
          .patch(`http://127.0.0.1:8000/api/questions/${id}`, values, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(() => {
            setOpenEdit(false);
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

  useEffect(() => {
    if (user) {
      values.user_id = user.id;
    }
    setFieldValue("application_id", question?.application.id);
    setFieldValue("question", question?.question);
    setFieldValue("answer", question?.answer);
  }, [user, values, question, setFieldValue]);

  return (
    <Modal open={openEdit} setOpen={setOpenEdit} width="600px">
      <div className="flex flex-col gap-4">
        <h1 className="font-semibold text-lg">Edit Question</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <FormInput
            label="Question"
            type="text"
            name="question"
            placeHolder="Question"
            value={values.question}
            onChange={handleChange}
            error={errors.question}
            touched={touched.question}
            textArea
          />
          <FormInput
            label="Answer"
            type="text"
            name="answer"
            placeHolder="Answer"
            value={values.answer}
            onChange={handleChange}
            error={errors.answer}
            touched={touched.answer}
            textArea
          />

          <div className="w-full">
            <select
              name="application_id"
              value={values.application_id}
              onChange={handleChange}
              className={`${
                touched.application_id &&
                errors.application_id &&
                "border-red-500"
              } w-full rounded-md border px-4 py-2 text-gray-500 focus:border-primary focus:outline-none
                ${
                  values.application_id ? "text-black" : "text-gray-500"
                } focus:ring-primary`}
            >
              <option value="" disabled className="text-gray-400">
                Select Application
              </option>
              {applications?.results?.map((application) => (
                <option
                  key={application.id}
                  value={application.id}
                  className="text-black"
                >
                  {application.job_title}
                </option>
              ))}
            </select>
            {errors.application_id && touched.application_id && (
              <span className="mt-1 text-xs text-red-500">
                {errors.application_id}
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
