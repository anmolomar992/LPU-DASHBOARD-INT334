
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { UserIcon, BellIcon, ShieldIcon, KeyIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Settings = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout title="Settings">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600">Manage your account preferences and settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="space-y-4 sticky top-6">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <a href="#profile" className="flex items-center p-2 rounded-md bg-gray-100 text-gray-900">
                    <UserIcon className="h-4 w-4 mr-3" />
                    <span>Profile</span>
                  </a>
                  <a href="#notifications" className="flex items-center p-2 rounded-md hover:bg-gray-100 text-gray-700">
                    <BellIcon className="h-4 w-4 mr-3" />
                    <span>Notifications</span>
                  </a>
                  <a href="#security" className="flex items-center p-2 rounded-md hover:bg-gray-100 text-gray-700">
                    <ShieldIcon className="h-4 w-4 mr-3" />
                    <span>Security</span>
                  </a>
                </nav>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card id="profile">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={user?.name || ""} className="max-w-md" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue={user?.email || ""} className="max-w-md" readOnly />
                <p className="text-sm text-gray-500">Your email address is used for login and cannot be changed</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" defaultValue={user?.role || ""} className="max-w-md" readOnly />
              </div>
              
              <Button className="mt-2">Save Changes</Button>
            </CardContent>
          </Card>

          <Card id="notifications">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-gray-500">Receive email notifications about important updates</p>
                </div>
                <Switch defaultChecked={true} />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Course Reminders</h4>
                  <p className="text-sm text-gray-500">Get reminders about upcoming classes and assignments</p>
                </div>
                <Switch defaultChecked={true} />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Important Notices</h4>
                  <p className="text-sm text-gray-500">Receive alerts about urgent university announcements</p>
                </div>
                <Switch defaultChecked={true} />
              </div>
              
              <Button className="mt-2">Save Preferences</Button>
            </CardContent>
          </Card>

          <Card id="security">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium flex items-center">
                  <KeyIcon className="h-4 w-4 mr-2" />
                  Change Password
                </h4>
                <div className="grid gap-3 max-w-md">
                  <Input type="password" placeholder="Current Password" />
                  <Input type="password" placeholder="New Password" />
                  <Input type="password" placeholder="Confirm New Password" />
                </div>
                <Button className="mt-2">Update Password</Button>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                <Button variant="outline">Enable 2FA</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
