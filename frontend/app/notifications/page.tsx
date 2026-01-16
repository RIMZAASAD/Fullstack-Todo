'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import ProtectedRoute from '@/components/layout/protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card-enhanced';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
  Bell,
  Mail,
  Check,
  X,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  Trash2
} from 'lucide-react';
import AppLayout from '@/components/layout/app-layout';
import { BounceIn, StaggeredList, StaggeredItem, FadeIn } from '@/components/reactbits-animated';

// Define notification types
type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: Date;
  read: boolean;
  category: string;
}

const NotificationsPage: React.FC = () => {
  const { state } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [loading, setLoading] = useState(true);

  // Mock notifications data
  useEffect(() => {
    // Simulate loading notifications
    setTimeout(() => {
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'Task Completed',
          message: 'Your task "Prepare quarterly report" has been marked as completed',
          type: 'success',
          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
          read: false,
          category: 'Task Updates'
        },
        {
          id: '2',
          title: 'Upcoming Deadline',
          message: 'Your task "Review project proposal" is due tomorrow',
          type: 'warning',
          timestamp: new Date(Date.now() - 86400000), // 1 day ago
          read: false,
          category: 'Reminders'
        },
        {
          id: '3',
          title: 'Welcome to Planit',
          message: 'Thanks for joining us! Start by creating your first task',
          type: 'info',
          timestamp: new Date(Date.now() - 172800000), // 2 days ago
          read: true,
          category: 'Announcements'
        },
        {
          id: '4',
          title: 'New Feature Available',
          message: 'Task sharing is now available! Share tasks with your team members',
          type: 'info',
          timestamp: new Date(Date.now() - 259200000), // 3 days ago
          read: true,
          category: 'Product Updates'
        },
        {
          id: '5',
          title: 'Overdue Task',
          message: 'Your task "Submit expense report" is overdue by 2 days',
          type: 'error',
          timestamp: new Date(Date.now() - 432000000), // 5 days ago
          read: false,
          category: 'Urgent'
        }
      ];
      setNotifications(mockNotifications);
      setLoading(false);
    }, 500);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const deleteAllNotifications = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'read') return notification.read;
    if (filter === 'unread') return !notification.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'info':
      default: return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getNotificationBadgeVariant = (type: NotificationType) => {
    switch (type) {
      case 'success': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'warning': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'info':
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <ProtectedRoute fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full mb-4"
        />
        <p className="text-slate-400 font-medium tracking-tight">Loading notifications...</p>
      </div>
    }>
      <AppLayout>
        <BounceIn>
          <div className="space-y-8 max-w-4xl">
            {/* Header */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <FadeIn>
                  <h2 className="text-4xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                      <Bell size={24} />
                    </div>
                    Notifications
                  </h2>
                  <p className="text-slate-400 font-medium">Stay updated with important alerts</p>
                </FadeIn>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="border-white/10 hover:bg-white/5 text-slate-300 rounded-xl"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  <Check size={16} className="mr-2" />
                  Mark all as read
                </Button>
                <Button
                  variant="outline"
                  className="border-white/10 hover:bg-white/5 text-slate-300 rounded-xl"
                  onClick={deleteAllNotifications}
                  disabled={notifications.length === 0}
                >
                  <Trash2 size={16} className="mr-2" />
                  Clear all
                </Button>
              </div>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StaggeredList>
                <StaggeredItem>
                  <Card className="glass border-white/5">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                          <Bell size={20} />
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Total</p>
                          <p className="text-2xl font-bold text-white">{notifications.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </StaggeredItem>
                <StaggeredItem>
                  <Card className="glass border-white/5">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                          <Mail size={20} />
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Unread</p>
                          <p className="text-2xl font-bold text-white">{unreadCount}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </StaggeredItem>
                <StaggeredItem>
                  <Card className="glass border-white/5">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                          <Check size={20} />
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Read</p>
                          <p className="text-2xl font-bold text-white">{notifications.length - unreadCount}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </StaggeredItem>
              </StaggeredList>
            </div>

            {/* Filters */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'secondary' : 'ghost'}
                  className={`${filter === 'all' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500'} rounded-xl`}
                  onClick={() => setFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={filter === 'unread' ? 'secondary' : 'ghost'}
                  className={`${filter === 'unread' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500'} rounded-xl`}
                  onClick={() => setFilter('unread')}
                >
                  Unread
                </Button>
                <Button
                  variant={filter === 'read' ? 'secondary' : 'ghost'}
                  className={`${filter === 'read' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500'} rounded-xl`}
                  onClick={() => setFilter('read')}
                >
                  Read
                </Button>
              </div>
              <p className="text-slate-400 text-sm">
                Showing {filteredNotifications.length} of {notifications.length} notifications
              </p>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
              {loading ? (
                <Card className="glass border-white/5">
                  <CardContent className="p-8 text-center">
                    <div className="flex justify-center mb-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full"
                      />
                    </div>
                    <p className="text-slate-400">Loading notifications...</p>
                  </CardContent>
                </Card>
              ) : filteredNotifications.length === 0 ? (
                <Card className="glass border-white/5">
                  <CardContent className="p-12 text-center">
                    <div className="mx-auto p-3 rounded-full bg-white/5 mb-4">
                      <Bell className="w-8 h-8 text-slate-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No notifications</h3>
                    <p className="text-slate-400 max-w-md mx-auto">
                      {filter === 'unread'
                        ? "You've read all notifications"
                        : "You don't have any notifications yet"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredNotifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-4 rounded-2xl border ${
                      notification.read
                        ? 'border-white/5 bg-white/2'
                        : 'border-indigo-500/20 bg-indigo-500/5'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-white flex items-center gap-2">
                              {notification.title}
                              {!notification.read && (
                                <Badge className="ml-2 bg-indigo-500/20 text-indigo-400 border-indigo-500/30 text-xs px-1.5 py-0.5 h-auto">
                                  New
                                </Badge>
                              )}
                            </h3>
                            <p className="text-slate-300 mt-1">{notification.message}</p>
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            <Badge className={getNotificationBadgeVariant(notification.type)}>
                              {notification.category}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              {notification.timestamp.toLocaleDateString()} at {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-500 hover:text-white rounded-lg h-8"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <Check size={16} />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-500 hover:text-red-400 rounded-lg h-8"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <X size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </BounceIn>
      </AppLayout>
    </ProtectedRoute>
  );
};

export default NotificationsPage;