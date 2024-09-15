import React from "react";
import {
  Gauge,
  AppWindowMac,
  Building2,
  UserPen,
  ChartNoAxesCombined,
  CircleHelp,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";

export default function SideNav() {
  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <Gauge />,
    },
    {
      name: "Application",
      href: "/application",
      icon: <AppWindowMac />,
    },
    {
      name: "Company",
      href: "/company",
      icon: <Building2 />,
    },
    {
      name: "Employee",
      href: "/employee",
      icon: <UserPen />,
    },
    {
      name: "Insights",
      href: "/insights",
      icon: <ChartNoAxesCombined />,
    },
    {
      name: "Question",
      href: "/question",
      icon: <CircleHelp />,
    },
  ];

  return (
    <div className="w-[250px] flex flex-col">
      <div className="bg-primary py-7 px-8 text-xl font-semibold text-white">
        Company
      </div>
      <div className="flex flex-col">
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.href}
            className="flex items-center gap-4 px-6 py-5 hover:bg-gray-100"
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
