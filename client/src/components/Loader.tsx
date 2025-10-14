import { motion } from "framer-motion";

export default function Loader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <motion.div
        className="w-10 h-10 border-4 border-[#009632] border-t-transparent rounded-full animate-spin"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
      <p className="mt-4 text-gray-600 text-sm">{message}</p>
    </div>
  );
}
