import { Link, useLocation } from "react-router-dom";
import {
  Gauge,
  AppWindowMac,
  Building2,
  UserPen,
  CircleHelp,
  ChevronRight,
  ChevronLeft,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react";
import useUserStore from "../store/user.store";
import useSideNavStore from "../store/sidenav.store";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function SideNav() {
  const { pathname } = useLocation();
  const user = useUserStore((state) => state.user);
  const toggle = useSideNavStore((state) => state.toggle);
  const isClosed = useSideNavStore((state) => state.isClosed);
  const [isTrackerExpanded, setIsTrackerExpanded] = useState(false);

  // Check if current path is a tracker sub-route
  useEffect(() => {
    const trackerPaths = [
      "/dashboard",
      "/applications",
      "/companies",
      "/employees",
      "/questions",
    ];
    const isTrackerPage = trackerPaths.some((path) => pathname.startsWith(path));
    setIsTrackerExpanded(isTrackerPage);
  }, [pathname]);

  const trackerItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <Gauge size={20} />,
    },
    {
      name: "Applications",
      href: "/applications",
      icon: <AppWindowMac size={20} />,
    },
    {
      name: "Companies",
      href: "/companies",
      icon: <Building2 size={20} />,
    },
    {
      name: "Employees",
      href: "/employees",
      icon: <UserPen size={20} />,
    },
    {
      name: "Questions",
      href: "/questions",
      icon: <CircleHelp size={20} />,
    },
  ];

  const mainTabs = [
    {
      name: "Tracker",
      href: "/dashboard",
      icon: <Gauge size={20} />,
      subItems: trackerItems,
    },
    {
      name: "Interviews",
      href: "/interviews",
      icon: <CalendarDays size={20} />,
    },
    {
      name: "Resume Matching",
      href: "/resume-matching",
      icon: <FileText size={20} />,
    },
  ];

  const subItemsVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      initial={false}
      animate={{
        width: isClosed ? "350px" : "75px",
      }}
      transition={{
        duration: 0.4,
        ease: "easeInOut",
      }}
      className={`h-screen sticky top-0 left-0 flex flex-col justify-between bg-white`}
    >
      <div className="flex relative flex-col">
        <div className="absolute -right-4 top-32">
          <motion.button
            onClick={toggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-primary shadow-md border bg-white p-1 rounded-lg"
          >
            {isClosed ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </motion.button>
        </div>
        <div
          className={`bg-primary py-7 px-6 text-xl flex font-semibold text-white ${
            !isClosed && "justify-center items-center px-0"
          }`}
        >
          {isClosed ? (
            <img src="/logo_white.png" className="w-44" />
          ) : (
            <img src="/logo_white2.png" className="w-10" />
          )}
        </div>

        <div className="flex flex-col overflow-hidden">
          {mainTabs.map((tab, index) => (
            <motion.div
              key={index}
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
            >
              {tab.name === "Tracker" ? (
                <div
                  className={`${
                    pathname === tab.href && "text-primary"
                  } flex items-center gap-4 px-6 py-5 hover:bg-gray-100 ${
                    !isClosed && "justify-center"
                  } text-sm transition-all cursor-pointer`}
                  onClick={() => {
                    setIsTrackerExpanded(!isTrackerExpanded);
                  }}
                >
                  {tab.icon}
                  {isClosed && (
                    <>
                      <span>{tab.name}</span>
                      <motion.span
                        animate={{
                          rotate: isTrackerExpanded ? 180 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="ml-auto"
                      >
                        <ChevronDown size={16} />
                      </motion.span>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  to={tab.href}
                  className={`${
                    pathname === tab.href && "text-primary"
                  } flex items-center gap-4 px-6 py-5 hover:bg-gray-100 ${
                    !isClosed && "justify-center"
                  } text-sm transition-all`}
                >
                  {tab.icon}
                  {isClosed && <span>{tab.name}</span>}
                </Link>
              )}
              
              {isClosed && tab.subItems && (
                <AnimatePresence>
                  {isTrackerExpanded && (
                    <motion.div
                      variants={subItemsVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="pl-12"
                    >
                      {tab.subItems.map((item, subIndex) => (
                        <Link
                          key={subIndex}
                          to={item.href}
                          className={`${
                            pathname === item.href && "text-primary"
                          } flex items-center gap-4 px-6 py-3 hover:bg-gray-100 text-sm transition-all`}
                        >
                          {item.icon}
                          <span>{item.name}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {isClosed ? (
        <Link
          to={"/profile"}
          className="flex justify-between items-center m-3 p-4 bg-[#F1F1F9] rounded-xl group border border-transparent hover:border-primary transition-all"
        >
          <div className="flex items-center gap-2 text-sm cursor-pointer">
            <img
              src="https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png"
              className="h-10 w-10 rounded-full"
              alt="Profile"
            />
            <div className="flex flex-col">
              <p className="text-sm">{user?.username}</p>
              <p className="text-xs w-36 truncate text-gray-600">
                {user?.email}
              </p>
            </div>
          </div>
          <motion.span
            whileHover={{ scale: 1.2 }}
            className="hover:text-primary transition-all group-hover:text-primary"
          >
            <ChevronRight size={20} />
          </motion.span>
        </Link>
      ) : (
        <Link
          to={"/profile"}
          className="flex items-center justify-center mb-3"
        >
          <motion.img
            whileHover={{ scale: 1.1 }}
            src="https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png"
            className="h-12 w-12 rounded-full hover:border-primary border-2 transition-all"
            alt="Profile"
          />
        </Link>
      )}
    </motion.div>
  );
}
