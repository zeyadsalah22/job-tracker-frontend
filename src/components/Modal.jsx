import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function Modal({ open, setOpen, children, width }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex h-screen items-center justify-center overflow-y-hidden"
        >
          <div
            onClick={() => setOpen(!open)}
            className="fixed inset-0 z-[1] bg-black/70 backdrop-blur-[4px]"
          />
          <div
            className="relative z-[2] mx-0 max-h-[85vh] h-fit overflow-auto rounded-md bg-white p-4 text-black"
            style={{ width: width }}
          >
            <button
              onClick={() => setOpen(!open)}
              className="absolute right-4 top-4 text-3xl"
            >
              <X />
            </button>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
