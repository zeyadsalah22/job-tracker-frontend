import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Application from "./pages/Application";
import Company from "./pages/Company";
import Dashboard from "./pages/Dashboard";
import Employee from "./pages/Employee";
import Question from "./pages/Question";
import Table from "./components/Table";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Home from "./pages/Home";
// import axios from "axios";
// import AdminRoute from "./utils/AdminRoute";
// import Register from "./pages/Register";
// import Login from "./pages/Login";
// import Courts from "./pages/Courts";
// import useUserStore from "./store/user.store";
// import Reservation from "./pages/Reservation";
// import NewCourt from "./pages/NewCourt";

export default function App() {
  // const [loading, setLoading] = useState(true);
  // const token = localStorage.getItem("token");
  // const setUser = useUserStore((state) => state.setUser);

  // const fetchUser = async () => {
  //   if (token) {
  //     try {
  //       const res = await axios.get("http://localhost:3000/api/users/me", {
  //         headers: {
  //           Authorization: `Token ${token}`,
  //         },
  //       });
  //       setUser(res.data);
  //       console.log(res.data);
  //     } catch (error) {
  //       console.error("Error fetching user:", error);
  //     }
  //   }
  //   setLoading(false);
  // };

  // useEffect(() => {
  //   fetchUser();
  // }, []);

  // if (loading) {
  //   return (
  //     <div className="h-screen p-[40px] flex justify-center items-center gap-[40px]">
  //       <ReactLoading type="spinningBubbles" color="#11664F" />
  //     </div>
  //   );
  // }

  // const redirectToHome = () => {
  //   setTimeout(() => {
  //     window.location.href = "/dashboard";
  //   }, 2000);
  // };

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/applications" element={<Application />} />
        <Route path="/companies" element={<Company />} />
        <Route path="/employees" element={<Employee />} />
        <Route path="/questions" element={<Question />} />
        <Route path="/table" element={<Table />} />
        <Route
          path="*"
          element={
            <div className="h-screen w-full flex flex-col justify-center items-center ">
              <p className="text-7xl font-bold"> 404</p>
              <div className="text-gray-500 flex items-center gap-5">
                Sorry, the page was not found! redirecting to home page...
              </div>
            </div>
          }
        />
      </Routes>
      <ToastContainer position="bottom-center" limit={1} autoClose={2000} />
    </>
  );
}
