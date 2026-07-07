import React, { createContext, useContext, useState, useCallback } from 'react';
import NotificationPopup from '../components/NotificationPopup';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState({
    visible: false,
    type: 'error',
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
  });

  const showNotification = useCallback(({ type, title, message, onConfirm, onCancel }) => {
    setNotification({
      visible: true,
      type: type || 'error',
      title: title || '',
      message: message || '',
      onConfirm: onConfirm || null,
      onCancel: onCancel || null,
    });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, visible: false }));
  }, []);

  const showError = useCallback((message, title = 'Gagal', onConfirm = null) => {
    showNotification({ type: 'error', title, message, onConfirm });
  }, [showNotification]);

  const showSuccess = useCallback((message, title = 'Sukses', onConfirm = null) => {
    showNotification({ type: 'success', title, message, onConfirm });
  }, [showNotification]);

  const showWarning = useCallback((message, title = 'Peringatan', onConfirm = null) => {
    showNotification({ type: 'warning', title, message, onConfirm });
  }, [showNotification]);

  const showConfirm = useCallback((message, title = 'Konfirmasi', onConfirm = null, onCancel = null) => {
    showNotification({ type: 'confirm', title, message, onConfirm, onCancel });
  }, [showNotification]);

  const handleClose = () => {
    if (notification.type === 'confirm') {
      if (notification.onCancel) {
        notification.onCancel();
      }
    } else {
      if (notification.onConfirm) {
        notification.onConfirm();
      }
    }
    hideNotification();
  };

  const handleConfirm = () => {
    if (notification.onConfirm) {
      notification.onConfirm();
    }
    hideNotification();
  };

  return (
    <NotificationContext.Provider value={{ showNotification, showError, showSuccess, showWarning, showConfirm, hideNotification }}>
      {children}
      <NotificationPopup
        visible={notification.visible}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
