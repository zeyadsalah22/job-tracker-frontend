import { useState } from "react";
import Layout from "../components/Layout";
import { Book, CheckCheck, X, LoaderCircle, Trash2, Plus, Calendar, Pencil } from "lucide-react";
import { TEChart } from "tw-elements-react";
import { useQuery } from "react-query";
import ReactLoading from "react-loading";
import AddTodoModal from "../components/AddTodoModal";
import EditTodoModal from "../components/EditTodoModal";
import { useAxiosPrivate } from "../utils/axios";

function Todo() {
  const [loading, setLoading] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  const fetchTodos = async () => {
    try {
      const response = await axiosPrivate.get('/todos');
      console.log("Fetched todos:", response.data);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Error fetching todos:", error);
      return [];
    }
  };

  const { data: todos, isLoading, refetch } = useQuery(["todos"], fetchTodos);
  
  const deleteTodo = async (id) => {
    setLoading(true);
    try {
      console.log(`Deleting todo with id: ${id}`);
      await axiosPrivate.delete(`/todos/${id}`);
      setLoading(false);
      refetch();
    } catch (error) {
      console.error("Error deleting todo:", error);
      setLoading(false);
    }
  };

  const toggleCompletion = async (id) => {
    setLoading(true);
    try {
      const todo = todos.find((todo) => todo.todoId === id);
      if (!todo) {
        console.error(`Todo with id ${id} not found`);
        setLoading(false);
        return;
      }
      
      console.log(`Updating todo completion status: ${id} to ${!todo.completed}`);
      await axiosPrivate.put(`/todos/${id}`, {
        userId: todo.userId,
        applicationTitle: todo.applicationTitle,
        applicationLink: todo.applicationLink,
        deadline: todo.deadline,
        completed: !todo.completed
      });
      
      setLoading(false);
      refetch();
    } catch (error) {
      console.error("Error updating todo:", error);
      setLoading(false);
    }
  };
  
  const handleOpenEdit = (todo) => {
    setSelectedTodo(todo);
    setOpenEdit(true);
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
          ) : !todos || todos.length === 0 ? (
            <p className="text-gray-500">No tasks. Add a task!</p>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.todoId}
                className="flex justify-between items-center py-2 border-b last:border-b-0"
              >
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleCompletion(todo.todoId)}
                    className="cursor-pointer"
                  />
                  <div className="flex flex-col">
                    {todo.applicationLink && !todo.completed ? (
                      <a
                        href={todo.applicationLink?.startsWith('http') ? todo.applicationLink : `https://${todo.applicationLink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-blue-600 cursor-pointer"
                      >
                        {todo.applicationTitle}
                      </a>
                    ) : (
                      <p
                        className={`${
                          todo.completed ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {todo.applicationTitle}
                      </p>
                    )}
                    {todo.deadline && (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar size={14} />
                        <span>Deadline: {new Date(todo.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    onClick={() => handleOpenEdit(todo)}
                    className="cursor-pointer hover:text-primary transition-all"
                  >
                    <Pencil size={16} />
                  </span>
                  <span
                    onClick={() => deleteTodo(todo.todoId)}
                    className="cursor-pointer hover:text-red-500 transition-all"
                  >
                    <Trash2 size={16} />
                  </span>
                </div>
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
      {selectedTodo && (
        <EditTodoModal 
          refetch={refetch} 
          openEdit={openEdit} 
          setOpenEdit={setOpenEdit} 
          todoItem={selectedTodo}
        />
      )}
    </div>
  );
}

export default function Dashboard() {
  const axiosPrivate = useAxiosPrivate();
  const [timePeriod, setTimePeriod] = useState("days");
  
  // Set default startDate to 7 days ago
  const getDefaultStartDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split('T')[0];
  };
  
  const [startDate, setStartDate] = useState(getDefaultStartDate());

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    
    // Convert to minutes
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    }
    
    // Convert to hours
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }
    
    // Convert to days
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  const fetchStatistics = async () => {
    try {
      const response = await axiosPrivate.get('/insights/statistics');
      return {
        total_applications: response.data.total_applications,
        total_accepted: response.data.accepted_applications,
        total_pending: response.data.pending_applications,
        total_rejected: response.data.rejected_applications,
        last_application: response.data.last_application,
        last_acceptance: response.data.last_acceptance,
        last_pending: response.data.last_pending,
        last_rejection: response.data.last_rejection
      };
    } catch (error) {
      console.error("Error fetching statistics:", error);
      return {
        total_applications: 0,
        total_accepted: 0,
        total_pending: 0,
        total_rejected: 0,
        last_application: null,
        last_acceptance: null,
        last_pending: null,
        last_rejection: null
      };
    }
  };

  const fetchPercents = async () => {
    try {
      const response = await axiosPrivate.get('/insights/percents');
      console.log("Percents response:", response.data);
      
      // Return all stages directly from the API
      return {
        counts: {
          applied: response.data.applied_stage || 0,
          phonescreen: response.data.phonescreen_stage || 0,
          assessment: response.data.assessment_stage || 0,
          interview: response.data.interview_stage || 0,
          offer: response.data.offer_stage || 0
        },
        total: response.data.total_applications || 0
      };
    } catch (error) {
      console.error("Error fetching percents:", error);
      return {
        counts: {
          applied: 0,
          phonescreen: 0,
          assessment: 0,
          interview: 0,
          offer: 0
        },
        total: 0
      };
    }
  };

  const fetchTimeseries = async () => {
    try {
      // Map frontend time periods to API intervals
      const intervalMap = {
        days: "day",
        weeks: "week",
        months: "month"
      };
      
      // Determine number of points based on time period
      const pointsMap = {
        days: 7,
        weeks: 4,
        months: 6
      };
      
      // Format the date properly for the API
      const formattedStartDate = new Date(startDate).toISOString().split('T')[0];
      
      const params = {
        start_date: formattedStartDate,
        interval: intervalMap[timePeriod],
        points: pointsMap[timePeriod]
      };
      
      console.log("Timeseries request params:", params);
      const response = await axiosPrivate.get('/insights/timeseries', { params });
      console.log("Timeseries response:", response.data);
      
      // Format the data for the chart
      const labels = response.data.results.map(point => {
        const date = new Date(point.date);
        if (timePeriod === "days") {
          return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
        } else if (timePeriod === "weeks") {
          // Format as "Week of May 21" or similar
          return `Week of ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
        } else {
          return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        }
      });
      
      return {
        labels,
        applications: response.data.results.map(point => point.total_applications || 0),
        accepted: response.data.results.map(point => point.acceptances || 0),
        rejected: response.data.results.map(point => point.rejections || 0),
        pending: response.data.results.map(point => point.pending || 0)
      };
    } catch (error) {
      console.error("Error fetching timeseries:", error);
      
      // Use the same date logic for fallback data
      const selectedDate = new Date(startDate);
      
      let labels = [];
      if (timePeriod === "days") {
        // Generate 7 days starting from the selected date
        labels = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(selectedDate);
          date.setDate(date.getDate() + i);
          return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
        });
      } else if (timePeriod === "weeks") {
        // Generate 4 weeks starting from the selected date
        labels = Array.from({ length: 4 }, (_, i) => {
          const date = new Date(selectedDate);
          date.setDate(date.getDate() + (i * 7));
          return `Week of ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
        });
      } else {
        // Generate 6 months starting from the selected date
        labels = Array.from({ length: 6 }, (_, i) => {
          const date = new Date(selectedDate);
          date.setMonth(date.getMonth() + i);
          return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        });
      }

      if (timePeriod === "days") {
        return {
          labels,
          applications: [0, 0, 0, 0, 0, 0, 0],
          accepted: [0, 0, 0, 0, 0, 0, 0],
          pending: [0, 0, 0, 0, 0, 0, 0],
          rejected: [0, 0, 0, 0, 0, 0, 0]
        };
      } else if (timePeriod === "weeks") {
        return {
          labels,
          applications: [0, 0, 0, 0],
          accepted: [0, 0, 0, 0],
          pending: [0, 0, 0, 0],
          rejected: [0, 0, 0, 0]
        };
      } else {
        return {
          labels,
          applications: [0, 0, 0, 0, 0, 0],
          accepted: [0, 0, 0, 0, 0, 0],
          pending: [0, 0, 0, 0, 0, 0],
          rejected: [0, 0, 0, 0, 0, 0]
        };
      }
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
                {!statisticsLoading && statistics?.last_application && (
                  <p className="text-xs text-gray-500">
                    Last from {formatTimeAgo(statistics.last_application)}
                  </p>
                )}
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
                {!statisticsLoading && statistics?.last_acceptance && (
                  <p className="text-xs text-gray-500">
                    Last from {formatTimeAgo(statistics.last_acceptance)}
                  </p>
                )}
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
                {!statisticsLoading && statistics?.last_pending && (
                  <p className="text-xs text-gray-500">
                    Last from {formatTimeAgo(statistics.last_pending)}
                  </p>
                )}
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
                {!statisticsLoading && statistics?.last_rejection && (
                  <p className="text-xs text-gray-500">
                    Last from {formatTimeAgo(statistics.last_rejection)}
                  </p>
                )}
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
            <p className="text-lg font-medium mb-4">Application Stages</p>
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
                    labels: [
                      "Applied", 
                      "Phone Screening", 
                      "Assessment", 
                      "Interview", 
                      "Offer"
                    ],
                    datasets: [
                      {
                        data: [
                          percents?.counts?.applied,
                          percents?.counts?.phonescreen,
                          percents?.counts?.assessment,
                          percents?.counts?.interview,
                          percents?.counts?.offer,
                        ],
                        backgroundColor: [
                          "#7571F9",  // Applied - Primary
                          "#FFB800",  // Phone Screening - Orange
                          "#FF3D00",  // Assessment - Red
                          "#00BCD4",  // Interview - Cyan
                          "#00C853",  // Offer - Green
                        ],
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          padding: 20
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = percents?.total || 0;
                            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                            return `${label}: ${value} (${percentage}%)`;
                          }
                        }
                      }
                    }
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
