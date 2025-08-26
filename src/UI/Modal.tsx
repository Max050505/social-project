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

  }, []);
  return createPortal(
    <dialog
      ref={dialog}
      onClose={onClose}
      onCancel={onClose}
      style={{
        border: "none",
        borderRadius: '10%',
        textAlign: "center",
        zIndex: 10000,
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)"
      }}
      onClick={(event) => {
        if (event.target === dialog.current) {
          onClose();
        }
      }}
    >
      {children}
    </dialog>,
    document.body
  );
}
