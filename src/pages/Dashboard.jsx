import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Book, CheckCheck, X, LoaderCircle, Trash2 } from "lucide-react";
import { TEChart } from "tw-elements-react";
import { useNavigate } from "react-router-dom";

function Todo() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      setTodos([...todos, { text: e.target.value.trim(), completed: false }]);
      e.target.value = "";
    }
  };

  const toggleCompletion = (index) => {
    const updatedTodos = todos.map((todo, i) =>
      i === index ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };

  const deleteTodo = (indexToDelete) => {
    const updatedTodos = todos.filter((_, index) => index !== indexToDelete);
    setTodos(updatedTodos);
  };

  return (
    <div className="bg-white col-span-1 rounded-lg p-6 shadow-md flex flex-col h-full justify-between">
      <div className="flex flex-col gap-4">
        <p className="text-lg font-medium">Todo List</p>

        <div className="flex flex-col">
          {todos.length === 0 ? (
            <p className="text-gray-500">No tasks. Add a task!</p>
          ) : (
            todos.map((todo, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleCompletion(index)}
                    className="cursor-pointer"
                  />

                  <p
                    className={`${
                      todo.completed ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {todo.text}
                  </p>
                </div>
                <span
                  onClick={() => deleteTodo(index)}
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
  const cards = [
    {
      title: "Applications",
      value: 10,
      date: "Last 7 days",
      icon: <Book size={50} />,
      color: "#8055F9",
    },
    {
      title: "Rejections",
      value: 5,
      date: "Last 7 days",
      icon: <X size={50} />,
      color: "#FC678D",
    },
    {
      title: "Pendings",
      value: 15,
      date: "Last 7 days",
      icon: <LoaderCircle size={50} />,
      color: "#FF7F43",
    },
    {
      title: "Acceptences",
      value: 20,
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

  return (
    <Layout>
      <div className="flex flex-col gap-6 h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
        <div className="grid grid-cols-4 gap-6 h-full">
          <div className="bg-white col-span-3 rounded-lg p-6 shadow-md">
            <TEChart
              type="line"
              data={{
                labels: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ],
                datasets: [
                  {
                    label: "Applications",
                    data: [2112, 2343, 2545, 3423, 2365, 1985, 987],
                  },
                  {
                    label: "Acceptences",
                    data: [2112, 2343, 2545, 3423, 2365, 1985, 987],
                  },
                  {
                    label: "Pendings",
                    data: [2112, 2343, 2545, 3423, 2365, 1985, 987],
                  },
                  {
                    label: "Rejections",
                    data: [2112, 2343, 2545, 3423, 2365, 1985, 987],
                  },
                ],
              }}
            />
          </div>
          <Todo />
        </div>
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white col-span-3 rounded-lg p-6 shadow-md ">
            <TEChart
              type="pie"
              data={{
                labels: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday ",
                ],
                datasets: [
                  {
                    label: "Traffic",
                    data: [2112, 2343, 2545, 3423, 2365, 1985, 987],
                    backgroundColor: [
                      "rgba(63, 81, 181, 0.5)",
                      "rgba(77, 182, 172, 0.5)",
                      "rgba(66, 133, 244, 0.5)",
                      "rgba(156, 39, 176, 0.5)",
                      "rgba(233, 30, 99, 0.5)",
                      "rgba(66, 73, 244, 0.4)",
                      "rgba(66, 133, 244, 0.2)",
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
        </div>
      </div>
    </Layout>
  );
}
