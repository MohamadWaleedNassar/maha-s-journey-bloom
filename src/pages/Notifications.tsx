
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, Clock, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Notification } from '@/lib/types';

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotifications();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications'
      }, () => {
        fetchNotifications();
        toast({
          title: 'New notification received!',
          description: 'You have a new message from your care team'
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to fetch notifications: ${error.message}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_status: true })
        .eq('id', id);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, read_status: true } : notif
        )
      );
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to mark as read: ${error.message}`,
        variant: 'destructive'
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_status: true })
        .eq('read_status', false);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read_status: true }))
      );

      toast({
        title: 'All notifications marked as read',
        description: 'Your notification list has been updated'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to mark all as read: ${error.message}`,
        variant: 'destructive'
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-500" size={20} />;
      case 'urgent':
        return <AlertCircle className="text-red-500" size={20} />;
      default:
        return <Info className="text-blue-500" size={20} />;
    }
  };

  const getNotificationBadgeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const unreadCount = notifications.filter(n => !n.read_status).length;

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-lilac-dark mb-2 flex items-center gap-3">
            <Bell className="text-pink" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="bg-pink text-white ml-2">
                {unreadCount} new
              </Badge>
            )}
          </h1>
          <p className="text-gray-600">Stay updated with messages from your care team</p>
        </div>
        
        {unreadCount > 0 && (
          <Button 
            onClick={markAllAsRead}
            variant="outline"
            className="border-pink text-pink hover:bg-pink hover:text-white"
          >
            <Check size={16} className="mr-2" />
            Mark All Read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Bell size={64} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No notifications yet</h3>
            <p className="text-gray-500">Your care team notifications will appear here</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`transition-all duration-200 hover:shadow-md ${
                !notification.read_status 
                  ? 'border-pink-200 bg-pink-50/30' 
                  : 'border-gray-200'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-lilac-dark flex items-center gap-2">
                        {notification.title}
                        {!notification.read_status && (
                          <div className="w-2 h-2 bg-pink rounded-full"></div>
                        )}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant="outline" 
                          className={getNotificationBadgeColor(notification.type)}
                        >
                          {notification.type}
                        </Badge>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(notification.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {!notification.read_status && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => markAsRead(notification.id)}
                      className="text-pink hover:bg-pink hover:text-white"
                    >
                      <Check size={14} />
                    </Button>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-700 leading-relaxed">{notification.message}</p>
                
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    From: {notification.sent_by} • 
                    Status: {notification.read_status ? 'Read' : 'Unread'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
