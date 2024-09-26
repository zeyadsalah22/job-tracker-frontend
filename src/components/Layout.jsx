import SideNav from "./SideNav";

export default function ({ children }) {
  return (
    <div className="flex h-screen">
      <SideNav />
      <div className="w-[calc(100vw-300px)] bg-secondry py-7 px-8 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
