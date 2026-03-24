'use client';

interface DialogData {
  title: string;
  msg: string;
  label: string;
  onConfirm: () => void;
}

interface Props {
  dialog: DialogData | null;
  onClose: () => void;
}

export function ConfirmDialog({ dialog, onClose }: Props) {
  if (!dialog) return null;

  return (
    <div
      className="dialog-overlay show"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="dialog">
        <h3>{dialog.title}</h3>
        <p>{dialog.msg}</p>
        <div className="dialog-actions">
          <button className="dialog-cancel" onClick={onClose}>Cancel</button>
          <button className="dialog-confirm" onClick={() => { onClose(); dialog.onConfirm(); }}>
            {dialog.label}
          </button>
        </div>
      </div>
    </div>
  );
}
