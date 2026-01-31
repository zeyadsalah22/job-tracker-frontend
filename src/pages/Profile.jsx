import { useFormik } from "formik";

import useUserStore from "../store/user.store";
import useOnboardingStore from "../store/onboarding.store";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FormField from "../components/ui/FormField";
import ReactLoading from "react-loading";
import DeleteModal from "../components/user/DeleteModal";
import { useNavigate } from "react-router-dom";
import { LogOut, Trash2, Camera, Upload, X, GraduationCap, Chrome, Sparkles, Zap, Shield, Bot } from "lucide-react";
import ChangePass from "../components/user/ChangePass";
import ManageCv from "../components/user/ManageCv";
import GmailIntegration from "../components/user/GmailIntegration";
import NotificationPreferences from "../components/user/NotificationPreferences";
import { useAxiosPrivate } from "../utils/axios";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import OnboardingTour from "../components/onboarding/OnboardingTour";

export default function Profile() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const { restartTour } = useOnboardingStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const userLogout = useUserStore((state) => state.logout);
  const navigate = useNavigate();
  const [changePassword, setChangePassword] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);

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
      setProfilePicturePreview(user.profilePictureUrl || null);
    }
  }, [user, setFieldValue]);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicturePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProfilePicture = () => {
    setProfilePicture(null);
    setProfilePicturePreview(null);
  };

  const handleUploadProfilePicture = async () => {
    if (!profilePicture) return;
    
    setIsUploadingPicture(true);
    try {
      const formData = new FormData();
      formData.append('profilePicture', profilePicture);
      
      // Don't set Content-Type header manually - axios will automatically detect FormData
      // and set the correct Content-Type with boundary. Setting it manually breaks the upload.
      // Override the default Content-Type header from axiosPrivate config
      const response = await axiosPrivate.post('/users/profile-picture', formData, {
        headers: {
          'Content-Type': undefined, // Remove default JSON header, let axios set multipart/form-data
        },
      });
      
      // Update user data with new profile picture URL
      const updatedUser = { ...user, profilePictureUrl: response.data.profilePictureUrl };
      setUser(updatedUser);
      setProfilePicture(null);
      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      const errorMessage = error.response?.data?.message || "Failed to upload profile picture";
      toast.error(errorMessage);
    } finally {
      setIsUploadingPicture(false);
    }
  };

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

  const handleRestartTour = () => {
    restartTour();
    toast.success("Tour restarted! Redirecting to dashboard...");
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  return (
      <>
        <OnboardingTour page="profile" />
        <div className="bg-white rounded-lg h-full flex flex-col p-4 justify-between">
          <div className="flex flex-col">
            <div className="flex items-center pb-4 border-b-2 justify-between">
              <h1 className="text-2xl font-bold">Profile settings</h1>
              <div className="flex gap-2">
                <button
                  onClick={handleRestartTour}
                  className="bg-primary/10 hover:bg-primary/20 transition-all text-primary py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                  title="Restart the guided tour"
                >
                  <GraduationCap size={18} />
                  Restart Tour
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-primary hover:bg-primary/85 transition-all text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center py-6 border-b-2">
            <div className="relative">
              <Avatar
                src={profilePicturePreview}
                fallback={user?.fname?.[0] || user?.lname?.[0] || "U"}
                className="h-24 w-24 text-2xl"
              />
              <label
                htmlFor="profile-picture"
                className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer hover:bg-primary/80 transition-colors"
                title="Change profile picture"
              >
                <Camera className="h-4 w-4" />
              </label>
              <input
                id="profile-picture"
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
              />
            </div>
            
            {profilePicturePreview && (
              <div className="mt-4 flex items-center gap-2">
                <Button
                  onClick={handleUploadProfilePicture}
                  disabled={isUploadingPicture}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {isUploadingPicture ? (
                    <ReactLoading type="bubbles" color="#ffffff" height={16} width={16} />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  {isUploadingPicture ? "Uploading..." : "Upload"}
                </Button>
                <Button
                  onClick={handleRemoveProfilePicture}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Remove
                </Button>
              </div>
            )}
            
            <p className="text-sm text-gray-500 mt-2 text-center">
              Click the camera icon to change your profile picture
            </p>
          </div>
          <div className="flex gap-10">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col w-[50%] gap-5 my-8"
              data-tour="personal-info"
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
            <div data-tour="cv-management">
              <ManageCv />
            </div>
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
          
          {/* Gmail Integration Section */}
          <div className="mt-8 pt-8 border-t-2" data-tour="gmail-integration">
            <GmailIntegration />
          </div>
          
          {/* Notification Preferences Section */}
          <NotificationPreferences user={user} />
          
          {/* Chrome Extension Section */}
          <div className="mt-8 pt-8 border-t-2" data-tour="chrome-extension">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Card Header */}
              <div className="px-6 py-4 border-b bg-gradient-to-r from-primary/5 to-primary/10 border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Chrome className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        Chrome Extension
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                          NEW
                        </span>
                      </h3>
                      <p className="text-sm text-gray-600">
                        Automate your job applications with AI
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  Install our Chrome extension to automatically capture job applications and use AI-powered 
                  auto-fill to speed through applications across all major job boards.
                </p>

                {/* Features List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2 text-sm">
                    <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Auto-capture job details as you browse</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Bot className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">AI-powered smart form filling</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Works on all major job platforms</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Secure and private by design</span>
                  </div>
                </div>

                {/* CTA Section */}
                <div className="flex items-center gap-4 pt-2">
                  <a
                    href="https://chromewebstore.google.com/detail/ohhciboilkgeodnhpoehlpejnpfcekhc?utm_source=item-share-cb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary hover:bg-primary/85 text-white font-semibold px-6 py-2.5 rounded-lg transition-all flex items-center gap-2"
                  >
                    <Chrome className="h-4 w-4" />
                    Add to Chrome
                  </a>
                  <span className="text-xs text-gray-500">
                    ⭐ 5.0 rating • Free to use
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
          <DeleteModal openDelete={deleteModal} setOpenDelete={setDeleteModal} />
          <ChangePass open={changePassword} setOpen={setChangePassword} />
        </div>
      </>
  );
}
