import { useState } from 'react';
import { useLockedBody } from '@/hooks/useLockedBody';
import { Bell, Check, CheckCheck, Trash2, X, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useNotifications, NotificationType } from '@/contexts/NotificationContext';

const NotificationIcon = ({ type }: { type: NotificationType }) => {
  const iconClasses = {
    success: 'h-5 w-5 text-green-500',
    error: 'h-5 w-5 text-red-500',
    info: 'h-5 w-5 text-blue-500',
    warning: 'h-5 w-5 text-yellow-500',
  };

  switch (type) {
    case 'success':
      return <CheckCircle className={iconClasses.success} />;
    case 'error':
      return <XCircle className={iconClasses.error} />;
    case 'info':
      return <Info className={iconClasses.info} />;
    case 'warning':
      return <AlertTriangle className={iconClasses.warning} />;
  }
};

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  useLockedBody(isOpen, "notifications");
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications();

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days}d atrás`;
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative hover:bg-accent/10 hover:scale-110 transition-all"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#FF3131] text-white text-xs flex items-center justify-center font-bold animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          <Card className="absolute right-0 top-12 w-80 md:w-96 z-50 shadow-xl border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  Notificações
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex gap-1">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="h-8 px-2"
                      title="Marcar todas como lidas"
                    >
                      <CheckCheck className="h-4 w-4" />
                    </Button>
                  )}
                  {notifications.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label="Limpar notificações"
                      onClick={clearNotifications}
                      className="h-8 px-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Fechar notificações"
                    onClick={() => setIsOpen(false)}
                    className="h-8 px-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0 max-h-[400px]">
              <ScrollArea className="h-[400px]">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Bell className="h-12 w-12 mb-3 opacity-30" />
                    <p className="text-sm">Sem notificações</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          'p-3 hover:bg-muted/50 transition-colors cursor-pointer',
                          !notification.read && 'bg-muted/30'
                        )}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            <NotificationIcon type={notification.type} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={cn(
                                'text-sm font-medium',
                                !notification.read && 'text-foreground'
                              )}>
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <div className="w-2 h-2 rounded-full bg-[#FF3131] flex-shrink-0 mt-1.5" />
                              )}
                            </div>
                            {notification.message && (
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                {notification.message}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatTime(notification.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
