import { useCallback, useEffect, useState } from "react";

export function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal__header">
          <h3>{title}</h3>
          <button type="button" className="modal__close" aria-label="Close" onClick={onClose}>
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// const [confirm, confirmDialog] = useConfirm();
// if (await confirm({ title, message, confirmLabel, danger })) { ... }
// Render {confirmDialog} somewhere in the component.
export function useConfirm() {
  const [pending, setPending] = useState(null);

  const confirm = useCallback(
    (options) => new Promise((resolve) => setPending({ ...options, resolve })),
    []
  );

  const close = useCallback(
    (result) => {
      pending?.resolve(result);
      setPending(null);
    },
    [pending]
  );

  const cancel = useCallback(() => close(false), [close]);

  const dialog = pending && (
    <Modal title={pending.title} onClose={cancel}>
      <p className="modal__message">{pending.message}</p>
      <div className="modal__actions">
        <button type="button" className="btn btn-secondary" onClick={cancel}>
          Cancel
        </button>
        <button
          type="button"
          className={`btn ${pending.danger ? "btn-danger" : "btn-primary"}`}
          onClick={() => close(true)}
          autoFocus
        >
          {pending.confirmLabel || "Confirm"}
        </button>
      </div>
    </Modal>
  );

  return [confirm, dialog];
}
