import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const modal = dialog.current;
    try {
      if (modal) {
        modal.showModal();
      }
    } catch (err) {
      console.error("❌ Modal failed to open:", err);
    }

    return () => {
      modal?.close();
    };
  }, []);
  return createPortal(
    <dialog
      ref={dialog}
      onClose={onClose}
      style={{
        border: "none",
        padding: "20px",
        background: "white",
        borderRadius: "8px",
        maxWidth: "400px",
        zIndex: 9999,
        margin: "auto",
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
      }}
    >
      {children}
    </dialog>,
    document.getElementById("modal") || document.body
  );
}
