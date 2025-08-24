import { useFormik } from "formik";

import useUserStore from "../store/user.store";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FormField from "../components/ui/FormField";
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
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosPrivate.get("/users/me");
        console.log("User data from API:", response.data);
        setUser(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        toast.error("Failed to load user profile");
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [axiosPrivate, setUser]);

  const { values, errors, handleSubmit, handleChange, touched, setFieldValue } =
    useFormik({
      initialValues: {
        fname: "",
        lname: "",
        email: "",
        address: "",
        birthDate: ""
      },
      onSubmit: async (values) => {
        setLoading(true);
        try {
          // Use userId instead of id, and ensure it exists
          if (!user || !user.userId) {
            throw new Error("User ID not found");
          }
          
          console.log("Updating user with ID:", user.userId);
          await axiosPrivate.put(`/users/${user.userId}`, values);
          setUser({...user, ...values});
          toast.success("Profile updated successfully");
          setLoading(false);
        } catch (error) {
          console.error("Profile update error:", error);
          setLoading(false);
          setError(error);
          const errorMessage = error.response?.data?.message || 
            Object.values(error.response?.data || {}).flat().join(', ') || 
            error.message;
          toast.error(errorMessage || "An error occurred. Please try again");
        }
      },
    });

  useEffect(() => {
    if (user) {
      console.log("Setting form values from user:", user);
      setFieldValue("fname", user.fname || "");
      setFieldValue("lname", user.lname || "");
      setFieldValue("email", user.email || "");
      setFieldValue("address", user.address || "");
      setFieldValue("birthDate", user.birthDate ? user.birthDate.split('T')[0] : "");
    }
  }, [user, setFieldValue]);

  const handleLogout = async () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("fullName");
    localStorage.removeItem("role");
    localStorage.removeItem("expiresAt");
    userLogout();
    navigate("/");
    toast.success("Logout successful");
  };

  if (isLoading) {
    return (
        <div className="bg-white rounded-lg h-full flex items-center justify-center">
          <ReactLoading type="spinningBubbles" color="#7571F9" height={50} width={50} />
        </div>
    );
  }

  return (
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
              <FormField
                type="text"
                name="fname"
                placeHolder="First Name"
                label="First Name"
                value={values.fname}
                onChange={handleChange}
                error={errors.fname || error?.response?.data?.fname}
                touched={touched.fname}
              />
              <FormField
                type="text"
                name="lname"
                placeHolder="Last Name"
                label="Last Name"
                value={values.lname}
                onChange={handleChange}
                error={errors.lname || error?.response?.data?.lname}
                touched={touched.lname}
              />
              <FormField
                type="email"
                name="email"
                placeHolder="Email"
                label="Email"
                value={values.email}
                onChange={handleChange}
                error={errors.email || error?.response?.data?.email}
                touched={touched.email}
              />
              <FormField
                type="text"
                name="address"
                placeHolder="Address"
                label="Address"
                value={values.address}
                onChange={handleChange}
                error={errors.address || error?.response?.data?.address}
                touched={touched.address}
              />
              <div className="flex flex-col gap-1">
                <label htmlFor="birthDate" className="text-sm font-medium">
                  Birth Date
                </label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={values.birthDate || ""}
                  onChange={handleChange}
                  className="border rounded-md p-2 outline-none focus:border-primary"
                />
                {(errors.birthDate || error?.response?.data?.birthDate) && touched.birthDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.birthDate || error?.response?.data?.birthDate}
                  </p>
                )}
              </div>

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
  );
}
