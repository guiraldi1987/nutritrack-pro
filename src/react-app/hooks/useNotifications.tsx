import { useState, useEffect } from 'react';
import { useAuth } from '@/react-app/hooks/useAuth.tsx';

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'measurement' | 'diet' | 'info' | 'reminder';
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  // Request notification permission
  const requestPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      return perm === 'granted';
    }
    return false;
  };

  // Check for pending measurements
  const checkMeasurementReminders = async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/student');
      const data = await response.json();
      
      if (data.student?.next_measurement_date) {
        const nextDate = new Date(data.student.next_measurement_date);
        const today = new Date();
        const diffDays = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        // Notify if measurement is due today or overdue
        if (diffDays <= 0) {
          const notification: NotificationData = {
            id: `measurement-${Date.now()}`,
            title: 'Hora da medição!',
            message: diffDays === 0 ? 'Sua medição está agendada para hoje!' : 'Sua medição está atrasada. Que tal atualizar suas medidas?',
            type: 'measurement',
            isRead: false,
            createdAt: new Date(),
            actionUrl: '/measurements'
          };
          
          setNotifications(prev => {
            // Check if notification already exists
            const exists = prev.some(n => n.type === 'measurement' && !n.isRead);
            if (exists) return prev;
            return [notification, ...prev];
          });
        }
        // Notify 3 days before
        else if (diffDays === 3) {
          const notification: NotificationData = {
            id: `measurement-reminder-${Date.now()}`,
            title: 'Lembrete: Medição em breve',
            message: 'Sua próxima medição está marcada para daqui a 3 dias.',
            type: 'reminder',
            isRead: false,
            createdAt: new Date(),
            actionUrl: '/measurements'
          };
          
          setNotifications(prev => {
            const exists = prev.some(n => n.id.includes('measurement-reminder') && !n.isRead);
            if (exists) return prev;
            return [notification, ...prev];
          });
        }
      }
    } catch (error) {
      console.error('Error checking measurement reminders:', error);
    }
  };

  // Show browser notification
  const showBrowserNotification = (notification: NotificationData) => {
    if (permission === 'granted' && 'Notification' in window) {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: 'https://mocha-cdn.com/01992a5f-6030-712d-8eb0-6e263a681ab5/Captura-de-tela-2025-09-08-151739.png',
        badge: 'https://mocha-cdn.com/01992a5f-6030-712d-8eb0-6e263a681ab5/Captura-de-tela-2025-09-08-151739.png'
      });

      browserNotification.onclick = () => {
        window.focus();
        if (notification.actionUrl) {
          window.location.href = notification.actionUrl;
        }
        browserNotification.close();
      };

      // Auto close after 10 seconds
      setTimeout(() => browserNotification.close(), 10000);
    }
  };

  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Add custom notification
  const addNotification = (notification: Omit<NotificationData, 'id' | 'isRead' | 'createdAt'>) => {
    const newNotification: NotificationData = {
      ...notification,
      id: `custom-${Date.now()}`,
      isRead: false,
      createdAt: new Date()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    showBrowserNotification(newNotification);
  };

  // Initialize
  useEffect(() => {
    if (user) {
      // Check permission status
      if ('Notification' in window) {
        setPermission(Notification.permission);
      }

      // Check for reminders immediately
      checkMeasurementReminders();

      // Set up interval to check periodically
      const interval = setInterval(checkMeasurementReminders, 60000 * 60); // Check every hour
      
      return () => clearInterval(interval);
    }
  }, [user]);

  // Show notifications when they're added
  useEffect(() => {
    const unreadNotifications = notifications.filter(n => !n.isRead);
    const latestNotification = unreadNotifications[0];
    
    if (latestNotification && permission === 'granted') {
      // Small delay to avoid showing notification immediately on state change
      const timeout = setTimeout(() => {
        showBrowserNotification(latestNotification);
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [notifications, permission]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return {
    notifications,
    unreadCount,
    permission,
    requestPermission,
    markAsRead,
    markAllAsRead,
    addNotification
  };
}
