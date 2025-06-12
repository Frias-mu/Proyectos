"use client";

import { useEffect, ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  imageUrl?: string;
  imageAlt?: string;
  ctaUrl?: string;
  ctaLabel?: string;
  telefono?: string;
};

const getWhatsappUrl = (telefono: string) => {
  const cleaned = telefono.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleaned}?text=Hola,%20vi%20tu%20perfil%20en%20la%20web%20de%20turismo%20y%20me%20gustaría%20saber%20más.`;
};

export default function Modal({
  isOpen,
  onClose,
  children,
  imageUrl,
  imageAlt = "Imagen destacada",
  ctaUrl,
  ctaLabel = "Ver más detalles",
  telefono,
}: ModalProps) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl w-full max-w-xl overflow-hidden relative flex flex-col"
            initial={{ scale: 0.95, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.175, 0.885, 0.32, 1.275] }}
          >
            {/* Botón cerrar */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-white hover:text-red-300 z-20"
              aria-label="Cerrar modal"
            >
              <X className="w-6 h-6 drop-shadow" />
            </button>
            {imageUrl && !imgError && (
              <div className="bg-gray-100 flex items-center justify-center max-h-[250px] overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  width={600}
                  height={250}
                  onError={() => setImgError(true)}
                  className="w-auto max-h-[250px] object-contain"
                />
              </div>
            )}

            {/* Contenido */}
            <div className="p-6 space-y-5 text-gray-800 text-sm sm:text-base overflow-y-auto max-h-[65vh]">
              {children}
            </div>

            {/* CTA y WhatsApp */}
            {(ctaUrl || telefono) && (
              <div className="p-4 border-t bg-white flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
                {ctaUrl && (
                  <Link
                    href={ctaUrl}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-medium transition"
                  >
                    {ctaLabel}
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                )}
                {telefono && (
                  <a
                    href={getWhatsappUrl(telefono)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md text-sm font-medium transition"
                  >
                    Contactar por WhatsApp
                  </a>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
