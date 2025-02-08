import { useFormik } from "formik";
import Layout from "../components/Layout";
import useUserStore from "../store/user.store";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FormInput from "../components/FormInput";
import ReactLoading from "react-loading";
import DeleteModal from "../components/user/DeleteModal";
import { useNavigate } from "react-router-dom";
import { LogOut, Trash2 } from "lucide-react";
import ChangePass from "../components/user/ChangePass";
import ManageCv from "../components/user/ManageCv";
import { useAxiosPrivate } from "../utils/axios";

export default function Profile() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const userLogout = useUserStore((state) => state.logout);
  const navigate = useNavigate();
  const [changePassword, setChangePassword] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const { values, errors, handleSubmit, handleChange, touched, setFieldValue } =
    useFormik({
      initialValues: {
        username: "",
        email: "",
        old_password: "",
        password: "",
        re_password: "",
      },
      onSubmit: async (values) => {
        setLoading(true);
        await axiosPrivate
          .patch("/users/me/", values)
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
    await axiosPrivate.post("/token/logout/", {
      refresh: localStorage.getItem("refresh"),
    });
    userLogout();
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
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
          <div className="flex gap-10">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col w-[50%] gap-5 my-8"
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

              {loading ? (
                <button
                  disabled
                  className="rounded cursor-not-allowed flex items-center justify-center bg-primary w-[122px] px-8 py-2 text-white transition h-10"
                >
                  <ReactLoading
                    type="bubbles"
                    color="#ffffff"
                    height={25}
                    width={25}
                  />
                </button>
              ) : (
                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="rounded-lg bg-primary px-4 py-2 text-white transition hover:bg-primary/80 w-fit text-sm font-semibold  h-10"
                  >
                    Save changes
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDeleteModal(true);
                    }}
                    className="text-red-700 font-semibold flex items-center gap-1 text-sm bg-red-50 w-fit rounded-lg px-4 py-2 transition hover:bg-red-100/65"
                  >
                    <Trash2 size={18} />
                    Delete user
                  </button>
                </div>
              )}
            </form>
            <ManageCv />
          </div>
          <div className="flex gap-1">
            <p className="text-sm">{"Do you want to change your password?"}</p>
            <button
              onClick={() => setChangePassword(true)}
              className="text-sm underline text-primary"
            >
              Change password
            </button>
          </div>
        </div>
        <DeleteModal openDelete={deleteModal} setOpenDelete={setDeleteModal} />
        <ChangePass open={changePassword} setOpen={setChangePassword} />
      </div>
    </Layout>
  );
}
