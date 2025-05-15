import { useState } from "react";
import Layout from "../components/Layout";
import { Book, CheckCheck, X, LoaderCircle, Trash2, Plus, Calendar } from "lucide-react";
import { TEChart } from "tw-elements-react";
import { useQuery } from "react-query";
import ReactLoading from "react-loading";
import AddTodoModal from "../components/AddTodoModal";
import { useAxiosPrivate } from "../utils/axios";

function Todo() {
  const [loading, setLoading] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const fetchTodos = async () => {
    // Static data for demonstration
    return {
      results: [
        {
          id: 1,
          application_title: "Senior Frontend Developer at Google",
          application_link: "https://careers.google.com/jobs/results/123",
          deadline: "2024-04-15",
          completed: false
        },
        {
          id: 2,
          application_title: "Full Stack Developer at Microsoft",
          application_link: "https://careers.microsoft.com/jobs/456",
          deadline: "2024-04-20",
          completed: true
        },
        {
          id: 3,
          application_title: "React Developer at Amazon",
          application_link: "https://amazon.jobs/789",
          deadline: "2024-04-25",
          completed: false
        }
      ]
    };
  };

  const { data: todos, isLoading, refetch } = useQuery(["todos"], fetchTodos);
  const deleteTodo = async (id) => {
    setLoading(true);
    await axiosPrivate.delete(`/todos/${id}`).then(() => {
      setLoading(false);
      refetch();
    });
  };

  const toggleCompletion = async (id) => {
    setLoading(true);
    const todo = todos.results.find((todo) => todo.id === id);
    await axiosPrivate
      .patch(`/todos/${id}`, {
        completed: !todo.completed,
      })
      .then(() => {
        setLoading(false);
        refetch();
      });
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md flex flex-col justify-between h-full">
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
              />
            </div>
          ) : todos?.results?.length === 0 ? (
            <p className="text-gray-500">No tasks. Add a task!</p>
          ) : (
            todos?.results?.map((todo) => (
              <div
                key={todo.id}
                className="flex justify-between items-center py-2 border-b last:border-b-0"
              >
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleCompletion(todo.id)}
                    className="cursor-pointer"
                  />
                  <div className="flex flex-col">
                    {todo.application_link && !todo.completed ? (
                      <a
                        href={todo.application_link}
                        target="_blank"
                        className="hover:underline text-blue-600 cursor-pointer"
                      >
                        {todo.application_title}
                      </a>
                    ) : (
                      <p
                        className={`${
                          todo.completed ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {todo.application_title}
                      </p>
                    )}
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar size={14} />
                      <span>Deadline: {new Date(todo.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <span
                  onClick={() => deleteTodo(todo.id)}
                  className="cursor-pointer hover:text-red-500 transition-all ml-2"
                >
                  <Trash2 size={18} />
                </span>
              </div>
            ))
          )}
        </div>
      </div>
      <button
        onClick={() => setOpenAdd(true)}
        className="flex items-center justify-center gap-2 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/80 transition-all mt-4"
      >
        <Plus size={18} />
        Add Task
      </button>
      <AddTodoModal refetch={refetch} openAdd={openAdd} setOpenAdd={setOpenAdd} />
    </div>
  );
}

export default function Dashboard() {
  const axiosPrivate = useAxiosPrivate();
  const [timePeriod, setTimePeriod] = useState("months");
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchStatistics = async () => {
    return {
      total_applications: 55,
      total_accepted: 10,
      total_pending: 15,
      total_rejected: 30
    };
  };

  const fetchPercents = async () => {
    return {
      applied: 40,
      interview: 30,
      offer: 20,
      rejected: 10
    };
  };

  const fetchTimeseries = async () => {
    const selectedDate = new Date(startDate);
    
    let labels = [];
    if (timePeriod === "days") {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const startDay = selectedDate.getDay();
      labels = [...days.slice(startDay), ...days.slice(0, startDay)];
    } else if (timePeriod === "weeks") {
      const weekNumber = Math.ceil(selectedDate.getDate() / 7);
      labels = Array.from({ length: 4 }, (_, i) => `Week ${weekNumber + i}`);
    } else {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const startMonth = selectedDate.getMonth();
      labels = months.slice(startMonth, startMonth + 6);
    }

    if (timePeriod === "days") {
      return {
        labels,
        applications: [3, 5, 7, 4, 6, 2, 1],
        accepted: [1, 2, 1, 1, 2, 0, 0],
        pending: [1, 2, 3, 2, 2, 1, 1],
        rejected: [1, 1, 3, 1, 2, 1, 0]
      };
    } else if (timePeriod === "weeks") {
      return {
        labels,
        applications: [12, 15, 18, 10],
        accepted: [3, 4, 5, 2],
        pending: [4, 5, 6, 3],
        rejected: [5, 6, 7, 5]
      };
    } else {
      return {
        labels,
        applications: [5, 8, 12, 15, 20, 25],
        accepted: [1, 2, 3, 4, 5, 6],
        pending: [2, 3, 4, 5, 6, 7],
        rejected: [2, 3, 5, 6, 9, 12]
      };
    }
  };

  const { data: statistics, isLoading: statisticsLoading } = useQuery(
    ["statistics"],
    fetchStatistics
  );
  const { data: percents, isLoading: percentsLoading } = useQuery(
    ["percents"],
    fetchPercents
  );
  const { data: timeseries, isLoading: timeseriesLoading } = useQuery(
    ["timeseries", timePeriod, startDate],
    fetchTimeseries
  );

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Book className="text-primary" size={24} />
              </div>
              <div>
                <p className="text-gray-500">Total Applications</p>
                <p className="text-2xl font-bold">
                  {statisticsLoading ? (
                    <ReactLoading
                      type="bubbles"
                      color="#7571F9"
                      height={25}
                      width={25}
                    />
                  ) : (
                    statistics?.total_applications
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <CheckCheck className="text-primary" size={24} />
              </div>
              <div>
                <p className="text-gray-500">Total Accepted</p>
                <p className="text-2xl font-bold">
                  {statisticsLoading ? (
                    <ReactLoading
                      type="bubbles"
                      color="#7571F9"
                      height={25}
                      width={25}
                    />
                  ) : (
                    statistics?.total_accepted
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <LoaderCircle className="text-primary" size={24} />
              </div>
              <div>
                <p className="text-gray-500">Total Pending</p>
                <p className="text-2xl font-bold">
                  {statisticsLoading ? (
                    <ReactLoading
                      type="bubbles"
                      color="#7571F9"
                      height={25}
                      width={25}
                    />
                  ) : (
                    statistics?.total_pending
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <X className="text-primary" size={24} />
              </div>
              <div>
                <p className="text-gray-500">Total Rejected</p>
                <p className="text-2xl font-bold">
                  {statisticsLoading ? (
                    <ReactLoading
                      type="bubbles"
                      color="#7571F9"
                      height={25}
                      width={25}
                    />
                  ) : (
                    statistics?.total_rejected
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <p className="text-lg font-medium">Applications Over Time</p>
            <div className="flex gap-4">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="days">Daily</option>
                <option value="weeks">Weekly</option>
                <option value="months">Monthly</option>
              </select>
            </div>
          </div>
          <div className="h-80">
            {timeseriesLoading ? (
              <div className="flex justify-center items-center h-full">
                <ReactLoading
                  type="bubbles"
                  color="#7571F9"
                  height={50}
                  width={50}
                />
              </div>
            ) : (
              <TEChart
                type="line"
                data={{
                  labels: timeseries?.labels,
                  datasets: [
                    {
                      label: "Total Applications",
                      data: timeseries?.applications,
                      borderColor: "#7571F9",
                      tension: 0.3,
                    },
                    {
                      label: "Accepted",
                      data: timeseries?.accepted,
                      borderColor: "#00C853",
                      tension: 0.3,
                    },
                    {
                      label: "Pending",
                      data: timeseries?.pending,
                      borderColor: "#FFB800",
                      tension: 0.3,
                    },
                    {
                      label: "Rejected",
                      data: timeseries?.rejected,
                      borderColor: "#FF3D00",
                      tension: 0.3,
                    }
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    }
                  }
                }}
              />
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <p className="text-lg font-medium mb-4">Application Status</p>
            <div className="h-80">
              {percentsLoading ? (
                <div className="flex justify-center items-center h-full">
                  <ReactLoading
                    type="bubbles"
                    color="#7571F9"
                    height={50}
                    width={50}
                  />
                </div>
              ) : (
                <TEChart
                  type="doughnut"
                  data={{
                    labels: ["Applied", "Interview", "Offer", "Rejected"],
                    datasets: [
                      {
                        data: [
                          percents?.applied,
                          percents?.interview,
                          percents?.offer,
                          percents?.rejected,
                        ],
                        backgroundColor: [
                          "#7571F9",
                          "#FFB800",
                          "#00C853",
                          "#FF3D00",
                        ],
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                  }}
                />
              )}
            </div>
          </div>
          <Todo />
        </div>
      </div>
    </Layout>
  );
}
