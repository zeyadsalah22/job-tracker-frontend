import { useState } from "react";

import { Book, CheckCheck, X, LoaderCircle, Trash2, Plus, Calendar, Pencil, Building2, Clock, ExternalLink, Edit2 } from "lucide-react";
import { TEChart } from "tw-elements-react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import ReactLoading from "react-loading";
import AddTodoModal from "../components/AddTodoModal";
import EditTodoModal from "../components/EditTodoModal";
import { useAxiosPrivate } from "../utils/axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Checkbox, { CheckboxWithLabel } from "../components/ui/Checkbox";

function Todo() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

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
  
  // Optimistic update mutation for deleting todos
  const deleteMutation = useMutation(
    async (id) => {
      console.log(`Deleting todo with id: ${id}`);
      return await axiosPrivate.delete(`/todos/${id}`);
    },
    {
      // Optimistic update
      onMutate: async (id) => {
        // Cancel any outgoing refetches
        await queryClient.cancelQueries(['todos']);
        
        // Snapshot the previous value
        const previousTodos = queryClient.getQueryData(['todos']);
        
        // Optimistically remove the todo from the list
        queryClient.setQueryData(['todos'], (old) => {
          if (!old) return old;
          return old.filter((todo) => todo.todoId !== id);
        });
        
        // Return a context object with the snapshotted value
        return { previousTodos };
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (err, id, context) => {
        console.error("Error deleting todo:", err);
        queryClient.setQueryData(['todos'], context.previousTodos);
      },
      // Always refetch after error or success to ensure consistency
      onSettled: () => {
        queryClient.invalidateQueries(['todos']);
      },
    }
  );

  const deleteTodo = (id) => {
    deleteMutation.mutate(id);
  };

  // Optimistic update mutation for toggling completion
  const toggleMutation = useMutation(
    async ({ id, todo }) => {
      console.log(`Updating todo completion status: ${id} to ${!todo.completed}`);
      return await axiosPrivate.put(`/todos/${id}`, {
        userId: todo.userId,
        applicationTitle: todo.applicationTitle,
        applicationLink: todo.applicationLink,
        deadline: todo.deadline,
        completed: !todo.completed
      });
    },
    {
      // Optimistic update
      onMutate: async ({ id }) => {
        // Cancel any outgoing refetches
        await queryClient.cancelQueries(['todos']);
        
        // Snapshot the previous value
        const previousTodos = queryClient.getQueryData(['todos']);
        
        // Optimistically update to the new value
        queryClient.setQueryData(['todos'], (old) => {
          if (!old) return old;
          return old.map((todo) =>
            todo.todoId === id
              ? { ...todo, completed: !todo.completed }
              : todo
          );
        });
        
        // Return a context object with the snapshotted value
        return { previousTodos };
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (err, newTodo, context) => {
        console.error("Error updating todo:", err);
        queryClient.setQueryData(['todos'], context.previousTodos);
      },
      // Always refetch after error or success to ensure consistency
      onSettled: () => {
        queryClient.invalidateQueries(['todos']);
      },
    }
  );

  const toggleCompletion = (id) => {
    const todo = todos.find((todo) => todo.todoId === id);
    if (!todo) {
      console.error(`Todo with id ${id} not found`);
      return;
    }
    
    toggleMutation.mutate({ id, todo });
  };
  
  const handleOpenEdit = (todo) => {
    setSelectedTodo(todo);
    setOpenEdit(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Todo List</CardTitle>
        <CardDescription className="text-sm">Track your job search tasks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <ReactLoading
                type="bubbles"
                color="#7571F9"
                height={25}
                width={25}
              />
            </div>
          ) : !todos || todos.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No tasks. Add a task!</p>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.todoId}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <CheckboxWithLabel
                  id={`todo-${todo.todoId}`}
                  checked={todo.completed}
                  onCheckedChange={() => toggleCompletion(todo.todoId)}
                />
                <div className="flex-1 min-w-0">
                  {todo.applicationLink && !todo.completed ? (
                    <a
                      href={todo.applicationLink?.startsWith('http') ? todo.applicationLink : `https://${todo.applicationLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:underline text-primary cursor-pointer flex items-center gap-1 truncate"
                    >
                      {todo.applicationTitle}
                      <ExternalLink size={12} className="flex-shrink-0" />
                    </a>
                  ) : (
                    <p
                      className={`text-sm truncate ${
                        todo.completed ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {todo.applicationTitle}
                    </p>
                  )}
                  {todo.deadline && (
                    <p className="text-xs text-muted-foreground">
                      Due: {new Date(todo.deadline).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenEdit(todo)}
                    className="p-1.5 hover:bg-muted rounded-md cursor-pointer hover:text-primary transition-all"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.todoId)}
                    className="p-1.5 hover:bg-muted rounded-md cursor-pointer hover:text-destructive transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <Button
          onClick={() => setOpenAdd(true)}
          className="w-full"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </CardContent>
      <AddTodoModal refetch={refetch} openAdd={openAdd} setOpenAdd={setOpenAdd} />
      {selectedTodo && (
        <EditTodoModal 
          refetch={refetch} 
          openEdit={openEdit} 
          setOpenEdit={setOpenEdit} 
          todoItem={selectedTodo}
        />
      )}
    </Card>
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

  const fetchRecentApplications = async () => {
    try {
      const params = new URLSearchParams({
        PageNumber: '1',
        PageSize: '5',
        SortBy: 'submissionDate',
        SortDescending: 'true',
      });
      
      const response = await axiosPrivate.get(`/applications?${params}`);
      console.log("Recent applications response:", response.data);
      return response.data?.items || [];
    } catch (error) {
      console.error("Error fetching recent applications:", error);
      return [];
    }
  };

  const { data: recentApplications = [], isLoading: recentApplicationsLoading } = useQuery(
    ["recentApplications"],
    fetchRecentApplications
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-500 text-white";
      case "accepted":
        return "bg-green-500 text-white";
      case "rejected":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case "Applied":
        return "bg-blue-500 text-white";
      case "PhoneScreen":
        return "bg-yellow-500 text-white";
      case "Assessment":
        return "bg-yellow-500 text-white";
      case "HrInterview":
      case "TechnicalInterview":
        return "bg-green-500 text-white";
      case "Offer":
        return "bg-green-600 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in px-4 sm:px-6 lg:px-8 pt-2 pb-4 sm:pb-6 lg:pb-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Track your job search progress and manage applications
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-lg font-medium">Total Applications</p>
              <p className="text-xl sm:text-2xl font-bold">
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
                <p className="text-xs text-gray-500 truncate">
                  Last from {formatTimeAgo(statistics.last_application)}
                </p>
              )}
            </div>
            <div className="bg-primary/10 p-2 sm:p-3 rounded-lg">
              <Book className="text-primary" size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-lg font-medium">Total Accepted</p>
              <p className="text-xl sm:text-2xl font-bold">
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
                <p className="text-xs text-gray-500 truncate">
                  Last from {formatTimeAgo(statistics.last_acceptance)}
                </p>
              )}
            </div>
            <div className="bg-primary/10 p-2 sm:p-3 rounded-lg">
              <CheckCheck className="text-primary" size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-lg font-medium">Total Pending</p>
              <p className="text-xl sm:text-2xl font-bold">
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
                <p className="text-xs text-gray-500 truncate">
                  Last from {formatTimeAgo(statistics.last_pending)}
                </p>
              )}
            </div>
            <div className="bg-primary/10 p-2 sm:p-3 rounded-lg">
              <LoaderCircle className="text-primary" size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-lg font-medium">Total Rejected</p>
              <p className="text-xl sm:text-2xl font-bold">
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
                <p className="text-xs text-gray-500 truncate">
                  Last from {formatTimeAgo(statistics.last_rejection)}
                </p>
              )}
            </div>
            <div className="bg-primary/10 p-2 sm:p-3 rounded-lg">
              <X className="text-primary" size={20} />
            </div>
          </div>
        </div>
      </div>
      {/* Charts Section */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3 mb-6 sm:mb-8">
        {/* Applications Over Time Chart */}
        <div className="lg:col-span-2">
          <Card className="hover-scale">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <CardTitle className="text-lg sm:text-xl">Applications Over Time</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border rounded-lg px-2 sm:px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <select
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(e.target.value)}
                    className="border rounded-lg px-2 sm:px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="days">Daily</option>
                    <option value="weeks">Weekly</option>
                    <option value="months">Monthly</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 sm:h-80">
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
            </CardContent>
          </Card>
        </div>

        {/* Application Stages Chart */}
        <Card className="hover-scale">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Application Stages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 sm:h-80">
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
                          "#7571f9",  // Applied - Primary
                          "#a78bfa",  // Phone Screening - Primary Glow
                          "#f59e0b",  // Assessment - Warning
                          "#10b981",  // Interview - Success
                          "#34d399",  // Offer - Success Light
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
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Recent Applications */}
        <div className="lg:col-span-2">
          <Card className="hover-scale">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Recent Applications</CardTitle>
              <CardDescription className="text-sm">Your latest job applications</CardDescription>
            </CardHeader>
            <CardContent>
              {recentApplicationsLoading ? (
                <div className="flex justify-center items-center py-8">
                  <ReactLoading
                    type="bubbles"
                    color="#7571F9"
                    height={50}
                    width={50}
                  />
                </div>
              ) : recentApplications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No applications yet. Start applying!</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {recentApplications.map((application) => (
                    <div
                      key={application.applicationId}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-sm sm:text-base truncate">{application.companyName || 'N/A'}</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">{application.jobTitle || 'N/A'}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">Applied {application.submissionDate ? new Date(application.submissionDate).toLocaleDateString() : 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        {/* Show status badge if Rejected or Accepted */}
                        {(application.status?.toLowerCase() === 'rejected' || application.status?.toLowerCase() === 'accepted') && (
                          <Badge className={`${getStatusColor(application.status)} text-xs flex-shrink-0`}>
                            {application.status}
                          </Badge>
                        )}
                        
                        {/* Show stage badge if status is Pending */}
                        {application.status?.toLowerCase() === 'pending' && application.stage && (
                          <Badge className={`${getStageColor(application.stage)} text-xs flex-shrink-0`}>
                            {application.stage === "PhoneScreen" ? "Phone Screen" :
                             application.stage === "HrInterview" ? "HR Interview" :
                             application.stage === "TechnicalInterview" ? "Technical Interview" :
                             application.stage}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Todo List */}
        <Todo />
      </div>
      </div>
  );
}
