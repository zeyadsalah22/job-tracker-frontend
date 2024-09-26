import { useFormik } from "formik";
import Layout from "../components/Layout";
import useUserStore from "../store/user.store";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import FormInput from "../components/FormInput";
import ReactLoading from "react-loading";
import DeleteModal from "../components/user/DeleteModal";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function Profile() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const userLogout = useUserStore((state) => state.logout);
  const navigate = useNavigate();

  const { values, errors, handleSubmit, handleChange, touched, setFieldValue } =
    useFormik({
      initialValues: {
        username: "",
        email: "",
        password: "",
        re_password: "",
      },
      onSubmit: async (values) => {
        setLoading(true);
        await axios
          .patch("http://127.0.0.1:8000/api/users/me/", values, {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          })
          .then(() => {
            setUser(values);
            toast.success("Profile updated successfully");
            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
            setError(error);
            toast.error(
              error.response.data.non_field_errors.map((error) => error) ||
                "An error occurred. Please try again"
            );
          });
      },
    });

  useEffect(() => {
    if (user) {
      setFieldValue("username", user.username);
      setFieldValue("email", user.email);
    }
  }, [user, setFieldValue]);

  const handleLogout = async () => {
    // Attempt to send the logout request to the server
    await axios.post("http://127.0.0.1:8000/api/token/logout", null, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });
    // Successful logout
    userLogout(); // Function to clear user state (if any)
    localStorage.removeItem("token"); // Remove token from localStorage
    navigate("/login"); // Redirect to login page
    toast.success("Logout successful");
  };

  return (
    <Layout>
      <div className="bg-white rounded-lg h-full flex flex-col p-4 justify-between">
        <div className="flex flex-col">
          <div className="flex items-center pb-4 border-b-2 justify-between">
            <h1 className="text-2xl font-bold">Profile settings</h1>
            <button
              onClick={handleLogout}
              className="bg-primary hover:bg-primary/85 transition-all text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-[500px] gap-5 my-8"
          >
            <FormInput
              type="text"
              name="username"
              placeHolder="Username"
              label="Username"
              value={values?.username}
              onChange={handleChange}
              error={errors?.username || error?.response?.data?.username}
              touched={touched.username}
            />
            <FormInput
              type="email"
              name="email"
              placeHolder="Email"
              label="Email"
              value={values?.email}
              onChange={handleChange}
              error={errors?.email || error?.response?.data?.email}
              touched={touched.email}
            />
            <FormInput
              type="password"
              name="password"
              placeHolder="Password"
              label="Password"
              value={values?.password}
              onChange={handleChange}
              error={errors?.password || error?.response?.data?.password}
              touched={touched.password}
            />
            <FormInput
              type="password"
              name="re_password"
              placeHolder="Confirm password"
              label="Confirm Password"
              value={values?.re_password}
              onChange={handleChange}
              error={errors.re_password}
              touched={touched.re_password}
            />

            {loading ? (
              <button
                disabled
                className="rounded cursor-not-allowed flex items-center justify-center bg-primary px-8 py-2 text-white transition h-12"
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
                className="rounded bg-primary px-8 py-2 text-white transition hover:bg-primary/80 h-12"
              >
                Update user
              </button>
            )}
          </form>
          <div className="flex gap-1">
            <p className="text-sm">{"Do you want to delete your account?"}</p>
            <button
              onClick={() => {
                setDeleteModal(true);
              }}
              className="text-sm underline text-red-500"
            >
              Delete
            </button>
          </div>
        </div>
        {deleteModal && (
          <DeleteModal
            openDelete={deleteModal}
            setOpenDelete={setDeleteModal}
          />
        )}
      </div>
    </Layout>
  );
}
