import { useState } from 'react';
import { Bell, X, Scale, Apple, Info, Calendar, Check, CheckCheck } from 'lucide-react';
import { useNotifications } from '@/react-app/hooks/useNotifications';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, permission, requestPermission, markAsRead, markAllAsRead } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case 'measurement':
        return Scale;
      case 'diet':
        return Apple;
      case 'reminder':
        return Calendar;
      default:
        return Info;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'measurement':
        return 'text-blue-600 bg-blue-100';
      case 'diet':
        return 'text-orange-600 bg-orange-100';
      case 'reminder':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Agora mesmo';
    if (diffMins < 60) return `${diffMins}min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays === 1) return 'Ontem';
    return `${diffDays} dias atrás`;
  };

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      // Optionally show a success message or notification
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon with Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  Notificações
                  {unreadCount > 0 && (
                    <span className="ml-2 bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                      {unreadCount}
                    </span>
                  )}
                </h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                      title="Marcar todas como lidas"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Permission Request */}
            {permission === 'default' && (
              <div className="p-4 bg-blue-50 border-b border-gray-200">
                <div className="text-sm">
                  <p className="text-blue-800 font-medium mb-2">
                    Ative as notificações para não perder lembretes importantes!
                  </p>
                  <button
                    onClick={handleRequestPermission}
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-700 transition-colors"
                  >
                    Ativar Notificações
                  </button>
                </div>
              </div>
            )}

            {permission === 'denied' && (
              <div className="p-4 bg-amber-50 border-b border-gray-200">
                <p className="text-xs text-amber-800">
                  Notificações bloqueadas. Ative nas configurações do navegador para receber lembretes.
                </p>
              </div>
            )}

            {/* Notifications List */}
            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm">Nenhuma notificação</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => {
                    const IconComponent = getIcon(notification.type);
                    const iconColor = getIconColor(notification.type);
                    
                    return (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                          !notification.isRead ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColor}`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <h4 className={`text-sm font-medium ${
                                !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {notification.title}
                              </h4>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 ml-2 mt-2"></div>
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-400">
                                {formatTime(notification.createdAt)}
                              </span>
                              
                              {!notification.isRead && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification.id);
                                  }}
                                  className="text-xs text-indigo-600 hover:text-indigo-700"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
