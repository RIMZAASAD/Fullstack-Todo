'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import ProtectedRoute from '@/components/layout/protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card-enhanced';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Lock,
  Bell,
  Shield,
  Save,
  CreditCard,
  Activity,
  Settings as SettingsIcon,
  Upload,
  ListTodo
} from 'lucide-react';
import AppLayout from '@/components/layout/app-layout';
import { BounceIn, StaggeredList, StaggeredItem, FadeIn } from '@/components/reactbits-animated';

// Auth Service Helper - To be moved to separate file later
const authHelper = {
  updateProfile: async (data: any) => {
    // This should be in auth-service.ts but adding here for quick fix
    const response = await fetch('/api/auth/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update profile');
    }

    return response.json();
  }
};

const SettingsPage: React.FC = () => {
  const { state } = useAuth();
  const [userData, setUserData] = useState({
    name: state.user?.name || '',
    email: state.user?.email || '',
    username: state.user?.username || ''
  });
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    setUserData({
      name: state.user?.name || '',
      email: state.user?.email || '',
      username: state.user?.username || ''
    });
  }, [state.user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      // In a real implementation this would use authService.updateProfile
      // For now we use the direct fetch helper
      const updatedUser = await authHelper.updateProfile({
        name: userData.name,
        email: userData.email
        // Username is not updatable in backend yet
      });

      setMessage({ type: 'success', text: 'Profile updated successfully!' });

      // Update local context if possible (simplified here)
      // window.location.reload(); // Ideally use context dispatcher

    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProtectedRoute fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px] animate-pulse" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="relative bg-gradient-to-tr from-indigo-600 to-cyan-500 p-4 rounded-[2rem] shadow-2xl shadow-indigo-500/20"
            >
              <ListTodo className="w-10 h-10 text-white" />
            </motion.div>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tighter mb-2 uppercase text-center">PLANIT</h2>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
            <span className="text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase ml-2 whitespace-nowrap">Loading Preferences</span>
          </div>
        </motion.div>
      </div>
    }>
      <AppLayout>
        <BounceIn>
          <div className="space-y-8 max-w-4xl">
            {/* Header */}
            <header>
              <FadeIn>
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                  <div className="p-3 w-fit rounded-2xl bg-indigo-500/10 text-indigo-400">
                    <SettingsIcon size={28} className="md:w-8 md:h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-1">
                      Account Settings
                    </h2>
                    <p className="text-sm md:text-lg text-slate-400 font-medium">Manage your workspace and security preferences</p>
                  </div>
                </div>
              </FadeIn>
            </header>

            {/* Settings Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 md:space-y-8">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/5 blur-xl -z-10" />
                <TabsList className="flex md:grid w-full md:grid-cols-4 bg-white/5 p-1.5 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar scrollbar-hide">
                  <TabsTrigger value="profile" className="flex-1 min-w-[100px] md:min-w-0 rounded-xl data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-400 text-xs md:text-sm py-2.5">
                    <User size={16} className="mr-2 hidden sm:inline" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="account" className="flex-1 min-w-[100px] md:min-w-0 rounded-xl data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-400 text-xs md:text-sm py-2.5">
                    <Shield size={16} className="mr-2 hidden sm:inline" />
                    Account
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex-1 min-w-[100px] md:min-w-0 rounded-xl data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-400 text-xs md:text-sm py-2.5">
                    <Lock size={16} className="mr-2 hidden sm:inline" />
                    Security
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex-1 min-w-[100px] md:min-w-0 rounded-xl data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-400 text-xs md:text-sm py-2.5">
                    <Bell size={16} className="mr-2 hidden sm:inline" />
                    Alerts
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <Card className="glass border-white/5">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <User className="w-5 h-5 text-indigo-400" />
                      Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/5">
                      <div className="relative group">
                        <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Avatar className="w-20 h-20 md:w-24 md:h-24 border-2 border-white/5 relative z-10">
                          <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${state.user?.name || 'User'}`} alt={state.user?.name} />
                          <AvatarFallback className="bg-slate-900 text-indigo-400 font-black text-2xl">
                            {state.user?.name?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <Button variant="outline" className="w-full sm:w-auto border-white/10 hover:bg-white/5 text-slate-300 rounded-xl h-11 px-5">
                          <Upload size={16} className="mr-2" />
                          Change Photo
                        </Button>
                        <Button variant="ghost" className="w-full sm:w-auto text-slate-500 hover:text-slate-300 rounded-xl h-11 px-5">
                          Remove
                        </Button>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name" className="text-slate-400">Full Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={userData.name}
                            onChange={handleInputChange}
                            className="bg-white/5 border-white/5 text-white rounded-xl mt-1"
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="username" className="text-slate-400">Username</Label>
                          <Input
                            id="username"
                            name="username"
                            value={userData.username}
                            onChange={handleInputChange}
                            className="bg-white/5 border-white/5 text-white rounded-xl mt-1"
                            placeholder="Enter your username"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-slate-400">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={userData.email}
                          onChange={handleInputChange}
                          className="bg-white/5 border-white/5 text-white rounded-xl mt-1"
                          placeholder="Enter your email"
                        />
                      </div>
                      <div className="pt-4">
                        <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 rounded-xl px-6 h-12 flex items-center gap-2">
                          <Save size={18} />
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Account Tab */}
              <TabsContent value="account" className="space-y-6">
                <Card className="glass border-white/5">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Shield className="w-5 h-5 text-indigo-400" />
                      Account Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <h3 className="font-bold text-white mb-2">Account Status</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          Active
                        </Badge>
                        <span className="text-slate-400 text-sm">Verified</span>
                      </div>
                    </div>

                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <h3 className="font-bold text-white mb-2">Subscription</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
                          Pro Plan
                        </Badge>
                        <span className="text-slate-400 text-sm">Renews on Jan 1, 2025</span>
                      </div>
                    </div>

                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <h3 className="font-bold text-white mb-2">Data Export</h3>
                      <p className="text-slate-400 text-sm mb-4">Download a copy of your data including tasks, preferences, and account information.</p>
                      <Button variant="outline" className="border-white/10 hover:bg-white/5 text-slate-300 rounded-xl">
                        Export Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <Card className="glass border-white/5">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Lock className="w-5 h-5 text-indigo-400" />
                      Security Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <h3 className="font-bold text-white mb-2">Password</h3>
                      <p className="text-slate-400 text-sm mb-4">Last changed 3 months ago</p>
                      <Button variant="outline" className="border-white/10 hover:bg-white/5 text-slate-300 rounded-xl">
                        Change Password
                      </Button>
                    </div>

                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <h3 className="font-bold text-white mb-2">Two-Factor Authentication</h3>
                      <p className="text-slate-400 text-sm mb-4">Add an extra layer of security to your account</p>
                      <Button variant="outline" className="border-white/10 hover:bg-white/5 text-slate-300 rounded-xl">
                        Enable 2FA
                      </Button>
                    </div>

                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <h3 className="font-bold text-white mb-2">Active Sessions</h3>
                      <p className="text-slate-400 text-sm mb-4">Manage your active login sessions across all devices</p>
                      <Button variant="outline" className="border-white/10 hover:bg-white/5 text-slate-300 rounded-xl">
                        View Sessions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <Card className="glass border-white/5">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Bell className="w-5 h-5 text-indigo-400" />
                      Notification Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                      <div>
                        <h3 className="font-bold text-white">Email Notifications</h3>
                        <p className="text-slate-400 text-sm">Receive notifications via email</p>
                      </div>
                      <Button variant="outline" className="border-white/10 hover:bg-white/5 text-slate-300 rounded-xl">
                        Manage
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                      <div>
                        <h3 className="font-bold text-white">Task Reminders</h3>
                        <p className="text-slate-400 text-sm">Get reminded about upcoming tasks</p>
                      </div>
                      <Button variant="outline" className="border-white/10 hover:bg-white/5 text-slate-300 rounded-xl">
                        Manage
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                      <div>
                        <h3 className="font-bold text-white">Weekly Reports</h3>
                        <p className="text-slate-400 text-sm">Receive weekly productivity reports</p>
                      </div>
                      <Button variant="outline" className="border-white/10 hover:bg-white/5 text-slate-300 rounded-xl">
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </BounceIn>
      </AppLayout>
    </ProtectedRoute>
  );
};

export default SettingsPage;