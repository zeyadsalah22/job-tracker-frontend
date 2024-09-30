import SideNav from "./SideNav";

export default function ({ children }) {
  return (
    <div className="flex min-h-screen">
      <SideNav />
      <div className="w-[calc(100vw-300px)] bg-secondry overflow-y-auto px-8 py-7">
        {children}
      </div>
    </div>
  );
}
