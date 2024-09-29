import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Book, CheckCheck, X, LoaderCircle, Trash2 } from "lucide-react";
import { TEChart } from "tw-elements-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from "react-query";
import useUserStore from "../store/user.store";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";

function Todo() {
  const user = useUserStore((state) => state.user);
  const [loading, setLoading] = useState(false);

  const fetchTodos = async () => {
    const { data } = await axios.get(`http://127.0.0.1:8000/api/todos`, {
      headers: {
        Authorization: `Token  ${localStorage.getItem("token")}`,
      },
    });
    return data;
  };

  const { data: todos, isLoading, refetch } = useQuery(["todos"], fetchTodos);

  const addTodo = async (e) => {
    if (e.key === "Enter" && !e.target.value) {
      return alert("Please enter a task");
    } else if (e.key === "Enter") {
      setLoading(true);
      await axios
        .post(
          "http://127.0.0.1:8000/api/todos",
          {
            user_id: user.id,
            application_title: e.target.value,
          },
          {
            headers: {
              Authorization: `Token  ${localStorage.getItem("token")}`,
            },
          }
        )
        .then(() => {
          refetch();
          setLoading(false);
          return (e.target.value = "");
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error.response.data.non_field_errors[0]);
        });
    }
  };

  const deleteTodo = async (id) => {
    setLoading(true);
    await axios
      .delete(`http://127.0.0.1:8000/api/todos/${id}`, {
        headers: {
          Authorization: `Token  ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        setLoading(false);
        refetch();
      });
  };

  const toggleCompletion = async (id) => {
    setLoading(true);
    const todo = todos.results.find((todo) => todo.id === id);
    await axios
      .patch(
        `http://127.0.0.1:8000/api/todos/${id}`,
        {
          completed: !todo.completed,
        },
        {
          headers: {
            Authorization: `Token  ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        setLoading(false);
        refetch();
      });
  };

  return (
    <div className="bg-white col-span-1 rounded-lg p-6 shadow-md flex flex-col justify-between w-[25%]">
      <div className="flex flex-col gap-4">
        <p className="text-lg font-medium">Todo List</p>
        <div className="flex flex-col">
          {isLoading || loading ? (
            <div className="flex justify-center items-center py-2">
              <ReactLoading
                type="bubbles"
                color="#7571F9"
                height={25}
                width={25}
              />{" "}
            </div>
          ) : todos.results.length === 0 ? (
            <p className="text-gray-500">No tasks. Add a task!</p>
          ) : (
            todos.results.map((todo) => (
              <div
                key={todo.id}
                className="flex justify-between items-center py-2"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleCompletion(todo.id)}
                    className="cursor-pointer"
                  />

                  <p
                    className={`${
                      todo.completed ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {todo.application_title}
                  </p>
                </div>
                <span
                  onClick={() => deleteTodo(todo.id)}
                  className="cursor-pointer hover:text-red-500 transition-all"
                >
                  <Trash2 size={18} />
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <input
        type="text"
        onKeyDown={addTodo}
        placeholder="Add a task"
        className="border-2 border-gray-200 px-2 py-1 rounded-lg w-full focus:border-primary focus:ring-primary"
      />
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [interval, setInterval] = useState("week");
  const [points, setPoints] = useState(12);
  const [start_date, setStartDate] = useState("2024-09-26");

  const fetchStatistics = async () => {
    const { data } = await axios.get(`http://127.0.0.1:8000/api/statistics`, {
      headers: {
        Authorization: `Token  ${localStorage.getItem("token")}`,
      },
    });
    return data;
  };

  const {
    data: statistics,
    isLoading,
    refetch,
  } = useQuery(["statistics"], fetchStatistics);

  const fetchPercents = async () => {
    const { data } = await axios.get(`http://127.0.0.1:8000/api/percents`, {
      headers: {
        Authorization: `Token  ${localStorage.getItem("token")}`,
      },
    });
    return data;
  };

  const {
    data: percents,
    isLoading: percentsLoading,
    refetch: refetchPercents,
  } = useQuery(["percents"], fetchPercents);

  const fetchTimeseries = async () => {
    const { data } = await axios.get(
      `http://127.0.0.1:8000/api/timeseries?start_date=${start_date}&points=${points}&interval=${interval}`,
      {
        headers: {
          Authorization: `Token  ${localStorage.getItem("token")}`,
        },
      }
    );
    return data;
  };

  const {
    data: timeseries,
    isLoading: timeseriesLoading,
    refetch: refetchTimeseries,
  } = useQuery(
    ["timeseries", { interval, start_date, points }],
    fetchTimeseries
  );

  const cards = [
    {
      title: "Applications",
      value: statistics?.total_applications,
      date: "Last 7 days",
      icon: <Book size={50} />,
      color: "#8055F9",
    },
    {
      title: "Rejections",
      value: statistics?.rejected_applications,
      date: "Last 7 days",
      icon: <X size={50} />,
      color: "#FC678D",
    },
    {
      title: "Pendings",
      value: statistics?.pending_applications,
      date: "Last 7 days",
      icon: <LoaderCircle size={50} />,
      color: "#FF7F43",
    },
    {
      title: "Acceptences",
      value: statistics?.accepted_applications,
      date: "Last 7 days",
      icon: <CheckCheck size={50} />,
      color: "#2059FD",
    },
  ];

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate, token]);

  const weeks = timeseries?.results?.map((result) =>
    result.date.split("-").pop()
  );

  const totalApplications = timeseries?.results?.map(
    (result) => result.total_applications
  );
  const rejections = timeseries?.results?.map((result) => result.rejections);
  const acceptances = timeseries?.results?.map((result) => result.acceptances);

  const startMonth = timeseries?.start_date?.split("-")[1];

  const months = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    10: "October",
    11: "November",
    12: "December",
  };

  const monthName = months[startMonth];
  const chartData = {
    labels: weeks,
    datasets: [
      {
        label: "Total Applications",
        data: totalApplications,
        borderColor: "rgba(63, 81, 181, 0.5)",
        pointBackgroundColor: "rgba(63, 81, 181, 0.5)",
        pointBorderColor: "rgba(63, 81, 181, 0.5)",
        fill: false,
      },
      {
        label: "Rejections",
        data: rejections,
        borderColor: "rgba(77, 182, 172, 0.5)",
        pointBackgroundColor: "rgba(77, 182, 172, 0.5)",
        pointBorderColor: "rgba(77, 182, 172, 0.5)",
        fill: false,
      },
      {
        label: "Acceptances",
        data: acceptances,
        borderColor: "rgba(66, 133, 244, 0.5)",
        pointBackgroundColor: "rgba(66, 133, 244, 0.5)",
        pointBorderColor: "rgba(66, 133, 244, 0.5)",
        fill: false,
      },
      {
        label: "Pendings",
        data: totalApplications?.map(
          (total, index) => total - (rejections[index] + acceptances[index])
        ),
        borderColor: "rgba(156, 39, 176, 0.5)",
        pointBackgroundColor: "rgba(156, 39, 176, 0.5)",
        pointBorderColor: "rgba(156, 39, 176, 0.5)",
        fill: false,
      },
    ],
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`rounded-lg p-8 shadow-md flex justify-between text-white`}
              style={{ backgroundColor: card.color }}
            >
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold">{card.title}</h2>
                <h2 className="text-xl font-semibold">{card.value}</h2>
                <p className="">{card.date}</p>
              </div>
              <span className="self-end opacity-65">{card.icon}</span>
            </div>
          ))}
        </div>
        <div className="bg-white col-span-2 rounded-lg p-6 shadow-md gap-2 flex flex-col">
          <h2 className="font-semibold">{monthName} Data</h2>
          <div className="flex gap-2">
            <div className="flex flex-col gap-2 w-[200px]">
              <label className="text-sm flex items-center text-gray-600">
                <p>Starting date</p>
              </label>
              <input
                type="date"
                value={start_date}
                onChange={(e) => setStartDate(e.target.value)}
                className="border-2 border-gray-200 px-2 py-1 rounded-lg w-full focus:border-primary focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-2 w-[200px]">
              <label className="text-sm flex items-center text-gray-600">
                <p>Points</p>
              </label>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                className="border-2 border-gray-200 px-2 py-1 rounded-lg w-full focus:border-primary focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-2 w-[200px]">
              <label className="text-sm flex items-center text-gray-600">
                <p>Interval</p>
              </label>
              <select
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                className="border-2 border-gray-200 px-2 py-1 rounded-lg w-full focus:border-primary focus:ring-primary"
              >
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="day">Day</option>
              </select>
            </div>
          </div>
          <TEChart
            type="line"
            // labels:
            //   interval === "week"
            //     ? weeks
            //     : interval === "month"
            //     ? months
            //     : days,
            // Example: ["W39", "W40", "W41", "W42"]
            data={chartData}
            height={350}
          />
        </div>
        <div className="flex gap-6 w-full">
          <div className="bg-white col-span-1 rounded-lg p-6 shadow-md w-[75%]">
            <TEChart
              type="pie"
              data={{
                labels: [
                  "Applied",
                  "Assessment",
                  "Interview",
                  "Offer",
                  "Phone Screen",
                ],
                datasets: [
                  {
                    label: "Percents",
                    data: [
                      percents?.applied_stage,
                      percents?.assessment_stage,
                      percents?.interview_stage,
                      percents?.offer_stage,
                      percents?.phonescreen_stage,
                    ],
                    backgroundColor: [
                      "rgba(63, 81, 181, 0.5)",
                      "rgba(77, 182, 172, 0.5)",
                      "rgba(66, 133, 244, 0.5)",
                      "rgba(156, 39, 176, 0.5)",
                      "rgba(244, 67, 54, 0.5)",
                    ],
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
              }}
              height={500}
            />
          </div>
          <Todo />
        </div>
      </div>
    </Layout>
  );
}
