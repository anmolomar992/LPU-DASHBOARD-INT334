
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpenIcon, UserIcon, BellIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const statData = {
  student: [
    { name: 'Enrolled Courses', value: 5, icon: BookOpenIcon, color: 'bg-blue-100 text-blue-600' },
    { name: 'Attendance', value: '87%', icon: UserIcon, color: 'bg-green-100 text-green-600' },
    { name: 'Notifications', value: 3, icon: BellIcon, color: 'bg-amber-100 text-amber-600' },
  ],
  teacher: [
    { name: 'Teaching Courses', value: 4, icon: BookOpenIcon, color: 'bg-blue-100 text-blue-600' },
    { name: 'Students', value: 121, icon: UserIcon, color: 'bg-green-100 text-green-600' },
    { name: 'Notifications', value: 5, icon: BellIcon, color: 'bg-amber-100 text-amber-600' },
  ],
  admin: [
    { name: 'Total Courses', value: 42, icon: BookOpenIcon, color: 'bg-blue-100 text-blue-600' },
    { name: 'Total Users', value: 528, icon: UserIcon, color: 'bg-green-100 text-green-600' },
    { name: 'Notifications', value: 12, icon: BellIcon, color: 'bg-amber-100 text-amber-600' },
  ],
};

const attendanceData = [
  { month: 'Jan', attendance: 90 },
  { month: 'Feb', attendance: 87 },
  { month: 'Mar', attendance: 82 },
  { month: 'Apr', attendance: 88 },
  { month: 'May', attendance: 92 },
  { month: 'Jun', attendance: 95 },
  { month: 'Jul', attendance: 91 },
];

const upcomingEvents = [
  {
    id: 1,
    title: 'Mid Term Examination',
    date: '2023-10-15',
    type: 'exam',
  },
  {
    id: 2,
    title: 'Project Submission Deadline',
    date: '2023-10-20',
    type: 'assignment',
  },
  {
    id: 3,
    title: 'College Festival',
    date: '2023-11-05',
    type: 'event',
  },
];

const Overview: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role || 'student';

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statData[role].map((stat) => (
          <Card key={stat.name} className="hover-scale">
            <CardContent className="flex items-center p-6">
              <div className={`rounded-full ${stat.color} p-3 mr-4`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Attendance Overview</CardTitle>
            <CardDescription>Monthly attendance percentage</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={attendanceData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                <XAxis dataKey="month" />
                <YAxis domain={[50, 100]} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="attendance"
                  stroke="#F26522"
                  fill="#F26522"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Events and deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {upcomingEvents.map((event) => (
                <li key={event.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`mt-0.5 h-3 w-3 rounded-full ${
                    event.type === 'exam' 
                      ? 'bg-red-500' 
                      : event.type === 'assignment' 
                        ? 'bg-blue-500' 
                        : 'bg-green-500'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <time className="text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
