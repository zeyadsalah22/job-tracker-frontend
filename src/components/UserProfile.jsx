import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function UserProfile({ open, setOpen, user }) {
    
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-y-hidden"
        >
          {/* Background overlay */}
          <div className="fixed inset-0 z-[1] bg-black/70 backdrop-blur-[4px]" />

          {/* Modal content */}
          <div className="relative z-[2] mx-4 w-[500px] rounded-lg bg-white p-6 text-black">
            {/* Close button */}
            <button
              onClick={() => setOpen(false)} // Close the modal
              className="absolute right-4 top-4 text-3xl"
            >
              <X />
            </button>

            {/* User info */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <img
                  src="https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png"
                  alt="Profile"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{user?.username}</h3>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>

            {/* Optional additional content (e.g. more profile details, actions) */}
            <div className="mt-6">
              <button
                onClick={() => {
                  setOpen(false); // Close the modal on action
                }}
                className="text-red-500"
              >
                Delete User
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
