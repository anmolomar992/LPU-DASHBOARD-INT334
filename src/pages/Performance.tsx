
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUpIcon, TrendingDownIcon, AwardIcon, CalendarIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/context/AuthContext';

// Mock performance data
const gradeData = [
  { course: 'CSE101', grade: 'A', score: 92 },
  { course: 'MAT205', grade: 'B+', score: 87 },
  { course: 'PHY103', grade: 'A-', score: 89 },
  { course: 'ENG201', grade: 'A', score: 95 },
  { course: 'CSE202', grade: 'B', score: 84 }
];

const attendanceData = [
  { course: 'CSE101', attended: 18, total: 20, percentage: 90 },
  { course: 'MAT205', attended: 16, total: 18, percentage: 89 },
  { course: 'PHY103', attended: 17, total: 20, percentage: 85 },
  { course: 'ENG201', attended: 14, total: 15, percentage: 93 },
  { course: 'CSE202', attended: 15, total: 18, percentage: 83 }
];

const monthlyPerformanceData = [
  { month: 'Jan', attendance: 95, grades: 88 },
  { month: 'Feb', attendance: 92, grades: 85 },
  { month: 'Mar', attendance: 87, grades: 82 },
  { month: 'Apr', attendance: 91, grades: 89 },
  { month: 'May', attendance: 94, grades: 91 },
  { month: 'Jun', attendance: 96, grades: 87 },
  { month: 'Jul', attendance: 89, grades: 84 }
];

const gradeDistributionData = [
  { name: 'A', value: 2 },
  { name: 'A-', value: 1 },
  { name: 'B+', value: 1 },
  { name: 'B', value: 1 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Performance = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  // Calculate average GPA and attendance
  const calculateGPA = () => {
    const gradePoints: { [key: string]: number } = {
      'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 
      'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0
    };
    
    const totalPoints = gradeData.reduce((sum, course) => sum + gradePoints[course.grade], 0);
    return (totalPoints / gradeData.length).toFixed(2);
  };
  
  const calculateAverageAttendance = () => {
    const totalPercentage = attendanceData.reduce((sum, course) => sum + course.percentage, 0);
    return (totalPercentage / attendanceData.length).toFixed(1);
  };

  return (
    <DashboardLayout title="Performance Analytics">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Academic Performance</h1>
        <p className="text-gray-600">Track your progress and academic achievements</p>
      </div>
      
      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="hover-scale">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Current GPA</p>
                <p className="text-3xl font-bold mt-1">{calculateGPA()}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUpIcon className="h-4 w-4 mr-1" />
                  +0.2 from last semester
                </p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <AwardIcon className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-scale">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Average Attendance</p>
                <p className="text-3xl font-bold mt-1">{calculateAverageAttendance()}%</p>
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <TrendingDownIcon className="h-4 w-4 mr-1" />
                  -2.5% from last month
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <CalendarIcon className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-scale">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Completed Courses</p>
                <p className="text-3xl font-bold mt-1">{gradeData.length}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Out of 12 total courses
                </p>
              </div>
              <div className="rounded-full bg-purple-100 p-3">
                <AwardIcon className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-scale">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Credits Earned</p>
                <p className="text-3xl font-bold mt-1">17</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUpIcon className="h-4 w-4 mr-1" />
                  41% of required credits
                </p>
              </div>
              <div className="rounded-full bg-amber-100 p-3">
                <AwardIcon className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <Tabs defaultValue="overview" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          {isAdmin && <TabsTrigger value="departmental">Departmental</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trend</CardTitle>
                <CardDescription>Monthly grades and attendance statistics</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[50, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="attendance" stroke="#F26522" strokeWidth={2} />
                    <Line type="monotone" dataKey="grades" stroke="#1C3F94" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>Distribution of grades across all courses</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gradeDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {gradeDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="grades">
          <Card>
            <CardHeader>
              <CardTitle>Course Grades</CardTitle>
              <CardDescription>Performance in individual courses</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                  <XAxis dataKey="course" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#F26522" name="Score" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Course Attendance</CardTitle>
              <CardDescription>Attendance percentage by course</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                  <XAxis dataKey="course" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="percentage" fill="#1C3F94" name="Attendance %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        {isAdmin && (
          <TabsContent value="departmental">
            <Card>
              <CardHeader>
                <CardTitle>Departmental Performance</CardTitle>
                <CardDescription>Aggregate data across all departments</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Departmental analytics will be available soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </DashboardLayout>
  );
};

export default Performance;
