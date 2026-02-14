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
import { Switch } from '@/components/ui/switch';
import RealTimeImageUploader from '@/components/ui/real-time-image-uploader';
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
  ListTodo,
  Loader2
} from 'lucide-react';
import AppLayout from '@/components/layout/app-layout';
import { BounceIn, StaggeredList, StaggeredItem, FadeIn } from '@/components/reactbits-animated';
import { toast } from 'sonner';
import { getUserSettings, updateUserSettings } from '@/lib/api/user-settings';
import { changePassword } from '@/lib/api/change-password';

// Auth Service Helper - To be moved to separate file later
const authHelper = {
  updateProfile: async (data: any) => {
    // This should be in auth-service.ts but adding here for quick fix
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/api/auth/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
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
  const { state, checkAuthStatus } = useAuth();
  const [userData, setUserData] = useState({
    name: state.user?.name || '',
    email: state.user?.email || ''
  });
  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    task_reminders: true,
    weekly_reports: true,
    alerts_enabled: true
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savingField, setSavingField] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    setUserData({
      name: state.user?.name || '',
      email: state.user?.email || ''
    });
    
    // Load notification settings
    loadNotificationSettings();
  }, [state.user]);

  const loadNotificationSettings = async () => {
    try {
      const settings = await getUserSettings();
      if (settings) {
        setNotificationSettings({
          email_notifications: settings.email_notifications ?? true,
          task_reminders: settings.task_reminders ?? true,
          weekly_reports: settings.weekly_reports ?? true,
          alerts_enabled: settings.alerts_enabled ?? true
        });
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
      // Use default values if there's an error
      setNotificationSettings({
        email_notifications: true,
        task_reminders: true,
        weekly_reports: true,
        alerts_enabled: true
      });
    }
  };

  useEffect(() => {
    // Load notification settings when component mounts to ensure they're available
    loadNotificationSettings();
  }, []);

  const handleAvatarUpload = async (file: File) => {
    // Validate file type
    if (!file.type.match('image/jpeg|image/png|image/jpg|image/webp')) {
      toast.error("Invalid file type. Please upload a valid image (JPG, PNG, WEBP)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit");
      return;
    }

    setIsSaving(true);
    setSavingField('avatar');
    
    try {
      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Prepare form data for upload
      const formData = new FormData();
      formData.append('file', file);

      // Upload to backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001'}/api/auth/upload-avatar`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let browser set it with boundary
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || response.statusText || 'Failed to upload avatar');
      }

      const result = await response.json();
      
      // Update user context with new avatar
      if (state.user) {
        const updatedUser = {
          ...state.user,
          avatar_url: result.avatar_url
        };
        // Update context with new user data
        // In a real implementation, this would use context dispatch
      }

      toast.success("Avatar updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload avatar");
      setAvatarPreview(null);
    } finally {
      setIsSaving(false);
      setSavingField(null);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/api/auth/remove-avatar`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to remove avatar');
      }

      // Refresh user data to get the updated avatar
      await checkAuthStatus();

      setAvatarPreview(null);
      toast("Success!", {
        description: "Avatar removed successfully!"
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to remove avatar", {
        description: "Avatar removal failed"
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavingField('profile');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001'}/api/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      
      // Update user context
      // In a real implementation, this would use context dispatch
      
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
      setSavingField(null);
    }
  };

  const handleNotificationChange = async (key: keyof typeof notificationSettings, value: boolean) => {
    try {
      setIsSaving(true);
      setSavingField('notifications');

      // Update local state immediately for responsiveness
      const updatedSettings = { ...notificationSettings, [key]: value };
      setNotificationSettings(updatedSettings);

      // Save to backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001'}/api/user-settings/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          email_notifications: updatedSettings.email_notifications,
          task_reminders: updatedSettings.task_reminders,
          weekly_reports: updatedSettings.weekly_reports,
          alerts_enabled: updatedSettings.alerts_enabled
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || 'Failed to update notification settings');
      }

      const result = await response.json();
      toast.success("Notification settings updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update notification settings");
      // Revert to previous state if update failed
      setNotificationSettings(prev => ({ ...prev, [key]: !value }));
    } finally {
      setIsSaving(false);
      setSavingField(null);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }

    // Validate password strength
    if (newPassword.length < 8 || 
        !/[A-Z]/.test(newPassword) || 
        !/[a-z]/.test(newPassword) || 
        !/[0-9]/.test(newPassword) || 
        !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      toast.error("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character");
      return;
    }

    setIsSaving(true);
    setSavingField('password');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001'}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || 'Failed to change password');
      }

      const result = await response.json();
      toast.success("Password changed successfully!");
      
      // Close modal and reset form
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      toast.error(err.message || "Failed to change password");
    } finally {
      setIsSaving(false);
      setSavingField(null);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      // In a real implementation this would use authService.updateProfile
      // For now we use the direct fetch helper
      const updatedUser = await authHelper.updateProfile({
        name: userData.name,
        email: userData.email,
        avatar_url: state.user?.avatar_url || null
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
          <div className="space-y-8 max-w-4xl w-full">
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
                <TabsList className="flex flex-wrap md:grid w-full md:grid-cols-4 bg-white/5 p-1.5 rounded-2xl border border-white/5 gap-2 max-h-none h-auto">
                  <TabsTrigger value="profile" className="flex-1 min-w-[120px] md:min-w-0 rounded-xl data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-400 text-xs md:text-sm py-2.5">
                    <User size={16} className="mr-2 inline" />
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
                    <div className="pb-6 border-b border-white/5">
                      <RealTimeImageUploader
                        onImageChange={handleAvatarUpload}
                        currentImageUrl={avatarPreview || (state.user?.avatar_url ? `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}${state.user.avatar_url}` : undefined)}
                        maxSize={5}
                        className="w-full max-w-md mx-auto"
                      />
                    </div>

                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-slate-400">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={userData.name}
                          onChange={(e) => setUserData({...userData, name: e.target.value})}
                          className="bg-white/5 border-white/5 text-white rounded-xl mt-1"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-slate-400">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={userData.email}
                          onChange={(e) => setUserData({...userData, email: e.target.value})}
                          className="bg-white/5 border-white/5 text-white rounded-xl mt-1"
                          placeholder="Enter your email"
                        />
                      </div>
                      <div className="pt-4">
                        <Button 
                          type="submit" 
                          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 rounded-xl px-6 h-12 flex items-center gap-2"
                          disabled={isSaving && savingField === 'profile'}
                        >
                          {isSaving && savingField === 'profile' ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save size={18} />
                              Save Changes
                            </>
                          )}
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
                      <Button
                        variant="outline"
                        className="border-white/10 hover:bg-white/5 text-slate-300 rounded-xl"
                        onClick={() => setShowPasswordModal(true)}
                        disabled={isSaving && savingField === 'password'}
                      >
                        {isSaving && savingField === 'password' ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Changing...
                          </>
                        ) : (
                          "Change Password"
                        )}
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
                      <div className="min-w-0">
                        <h3 className="font-bold text-white">Email Notifications</h3>
                        <p className="text-slate-400 text-sm">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={notificationSettings.email_notifications}
                        onCheckedChange={(checked) => handleNotificationChange('email_notifications', checked)}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
                      <div className="min-w-0">
                        <h3 className="font-bold text-white">Task Reminders</h3>
                        <p className="text-slate-400 text-sm">Get reminded about upcoming tasks</p>
                      </div>
                      <Switch
                        checked={notificationSettings.task_reminders}
                        onCheckedChange={(checked) => handleNotificationChange('task_reminders', checked)}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
                      <div className="min-w-0">
                        <h3 className="font-bold text-white">Weekly Reports</h3>
                        <p className="text-slate-400 text-sm">Receive weekly productivity reports</p>
                      </div>
                      <Switch
                        checked={notificationSettings.weekly_reports}
                        onCheckedChange={(checked) => handleNotificationChange('weekly_reports', checked)}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
                      <div className="min-w-0">
                        <h3 className="font-bold text-white">System Alerts</h3>
                        <p className="text-slate-400 text-sm">Enable system alerts and notifications</p>
                      </div>
                      <Switch
                        checked={notificationSettings.alerts_enabled}
                        onCheckedChange={(checked) => handleNotificationChange('alerts_enabled', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </BounceIn>
      </AppLayout>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Change Password</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowPasswordModal(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmNewPassword('');
                }}
                className="text-slate-400 hover:text-white hover:bg-white/5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="current-password" className="text-slate-400">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-white/5 border-white/5 text-white rounded-xl mt-1"
                  placeholder="Enter current password"
                />
              </div>
              
              <div>
                <Label htmlFor="new-password" className="text-slate-400">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-white/5 border-white/5 text-white rounded-xl mt-1"
                  placeholder="Enter new password"
                />
              </div>
              
              <div>
                <Label htmlFor="confirm-new-password" className="text-slate-400">Confirm New Password</Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="bg-white/5 border-white/5 text-white rounded-xl mt-1"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1 border-white/10 hover:bg-white/5 text-slate-300 rounded-xl"
                onClick={() => {
                  setShowPasswordModal(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmNewPassword('');
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 rounded-xl"
                onClick={async () => {
                  // Validate password strength
                  if (newPassword.length < 8 || 
                      !/[A-Z]/.test(newPassword) || 
                      !/[a-z]/.test(newPassword) || 
                      !/[0-9]/.test(newPassword) || 
                      !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
                    toast.error("New password must be at least 8 characters long and include uppercase, lowercase, number, and special character");
                    return;
                  }
                  
                  // Validate that new passwords match
                  if (newPassword !== confirmNewPassword) {
                    toast.error("New passwords do not match");
                    return;
                  }
                  
                  try {
                    await changePassword({ current_password: currentPassword, new_password: newPassword });
                    toast.success("Password changed successfully!");
                    
                    // Close modal and reset form
                    setShowPasswordModal(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmNewPassword('');
                  } catch (error: any) {
                    toast.error(error.message || "Failed to change password");
                  }
                }}
                disabled={!currentPassword || !newPassword || !confirmNewPassword}
              >
                Update Password
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </ProtectedRoute>
  );
};

export default SettingsPage;
