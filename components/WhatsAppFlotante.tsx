"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { urlWhatsApp } from "@/lib/config";

export function WhatsAppFlotante() {
  return (
    <motion.a
      href={urlWhatsApp()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20"
    >
      <MessageCircle size={28} aria-hidden="true" />
      <span className="sr-only">Escríbenos por WhatsApp</span>
    </motion.a>
  );
}
