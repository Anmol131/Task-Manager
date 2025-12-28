import React from 'react';
import { createPortal } from 'react-dom';

type Props = {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function Modal({ open, title, message, confirmText = 'Yes', cancelText = 'No', onConfirm, onCancel }: Props) {
  if (!open) return null;

  const modal = (
    <div className="modal-overlay">
      <div className="modal">
        {title && <h3 style={{ marginTop: 0 }}>{title}</h3>}
        {message && <p style={{ color: 'var(--text-secondary)' }}>{message}</p>}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '.5rem', marginTop: '1rem' }}>
          <button onClick={onCancel} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>{cancelText}</button>
          <button className="btn-danger" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modal, document.body) : modal;
}
