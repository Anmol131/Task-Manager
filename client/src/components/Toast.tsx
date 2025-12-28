import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type Toast = { id: number; message: string; type?: 'info' | 'success' | 'error' };

type ToastContextValue = {
  addToast: (message: string, type?: Toast['type']) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts(t => [...t, { id, message, type }]);
  }, []);

  const remove = useCallback((id: number) => setToasts(t => t.filter(x => x.id !== id)), []);

  useEffect(() => {
    const timers: number[] = [];
    toasts.forEach(t => {
      const timer = window.setTimeout(() => remove(t.id), 3500);
      timers.push(timer);
    });
    return () => timers.forEach(clearTimeout);
  }, [toasts, remove]);

  const value = useMemo(() => ({ addToast }), [addToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type || 'info'}`} onClick={() => remove(t.id)}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
