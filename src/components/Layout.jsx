import useSideNavStore from "../store/sidenav.store";
import SideNav from "./SideNav";

export default function Layout({ children }) {
  const isOpen = useSideNavStore((state) => state.isOpen);

  return (
    <div className="flex min-h-screen">
      <SideNav />
      <div
        className={`${
          isOpen ? "w-[calc(100vw-350px)]" : "w-[calc(100vw-75px)]"
        }  bg-secondry overflow-y-auto px-8 py-7`}
      >
        {children}
      </div>
    </div>
  );
}
