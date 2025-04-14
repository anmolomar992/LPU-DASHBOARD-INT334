
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CalendarIcon, BookOpenIcon, AwardIcon, ClockIcon, MapPinIcon, PhoneIcon, MailIcon, GraduationCapIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  
  // Mock data - in a real app, this would come from your API
  const profileData = {
    name: user?.name || "Student Name",
    email: user?.email || "student@lpu.co.in",
    role: user?.role || "student",
    department: "Computer Science & Engineering",
    registrationNumber: "11912345",
    batch: "2021-2025",
    program: "B.Tech",
    cgpa: "8.75",
    achievements: [
      { title: "Dean's List", date: "Fall 2022" },
      { title: "Hackathon Winner", date: "March 2023" },
      { title: "Best Project Award", date: "Spring 2023" }
    ],
    currentCourses: [
      { code: "CSE101", name: "Introduction to Computer Science", credits: 4 },
      { code: "MAT205", name: "Linear Algebra", credits: 3 },
      { code: "PHY103", name: "Physics for Engineers", credits: 4 }
    ],
    attendance: {
      overall: 92,
      thisMonth: 95,
      courses: {
        "CSE101": 94,
        "MAT205": 88,
        "PHY103": 96
      }
    }
  };

  return (
    <DashboardLayout title="Profile">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
        <p className="text-gray-600">View and manage your academic profile</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview Card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="/placeholder.svg" alt={profileData.name} />
                <AvatarFallback>{profileData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{profileData.name}</h2>
              <p className="text-gray-600">{profileData.registrationNumber}</p>
              <Badge className="mt-2 capitalize">{profileData.role}</Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-gray-700">
                <MailIcon className="h-4 w-4 mr-2" />
                <span>{profileData.email}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <GraduationCapIcon className="h-4 w-4 mr-2" />
                <span>{profileData.program}, {profileData.department}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <span>Batch: {profileData.batch}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <MapPinIcon className="h-4 w-4 mr-2" />
                <span>Lovely Professional University, Phagwara</span>
              </div>
              <div className="flex items-center text-gray-700">
                <PhoneIcon className="h-4 w-4 mr-2" />
                <span>+91 98765 43210</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <Button variant="outline">Edit Profile</Button>
          </CardFooter>
        </Card>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Academic Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Academic Status</CardTitle>
              <CardDescription>Your current academic performance and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Current CGPA</p>
                  <h3 className="text-2xl font-bold text-lpu-orange">{profileData.cgpa}</h3>
                  <p className="text-xs text-gray-500">Out of 10.0</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Overall Attendance</p>
                  <h3 className="text-2xl font-bold text-lpu-orange">{profileData.attendance.overall}%</h3>
                  <p className="text-xs text-gray-500">Across all courses</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Credits Completed</p>
                  <h3 className="text-2xl font-bold text-lpu-orange">72</h3>
                  <p className="text-xs text-gray-500">Total required: 160</p>
                </div>
              </div>
              
              <h4 className="font-semibold mb-3">Current Courses</h4>
              <div className="space-y-2">
                {profileData.currentCourses.map((course, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50">
                    <div>
                      <div className="font-medium">{course.name}</div>
                      <div className="text-sm text-gray-600">{course.code}</div>
                    </div>
                    <Badge variant="outline">{course.credits} CR</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tabs Content */}
          <Tabs defaultValue="attendance">
            <TabsList className="mb-4">
              <TabsTrigger value="attendance">
                <ClockIcon className="h-4 w-4 mr-2" />
                Attendance
              </TabsTrigger>
              <TabsTrigger value="achievements">
                <AwardIcon className="h-4 w-4 mr-2" />
                Achievements
              </TabsTrigger>
              <TabsTrigger value="documents">
                <BookOpenIcon className="h-4 w-4 mr-2" />
                Documents
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="attendance">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Record</CardTitle>
                  <CardDescription>Your attendance across all enrolled courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(profileData.attendance.courses).map(([courseCode, percentage]) => (
                      <div key={courseCode} className="space-y-1">
                        <div className="flex justify-between">
                          <div className="font-medium">{courseCode}</div>
                          <div className={`text-sm ${Number(percentage) < 75 ? 'text-red-500' : 'text-green-600'}`}>
                            {percentage}%
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${Number(percentage) < 75 ? 'bg-red-500' : 'bg-green-600'}`} 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="text-sm text-gray-600">
                  <strong>Note:</strong> Minimum 75% attendance is required to be eligible for examinations.
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="achievements">
              <Card>
                <CardHeader>
                  <CardTitle>Achievements & Awards</CardTitle>
                  <CardDescription>Your academic and extracurricular achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profileData.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start">
                        <div className="bg-lpu-orange/10 p-2 rounded-full mr-3">
                          <AwardIcon className="h-5 w-5 text-lpu-orange" />
                        </div>
                        <div>
                          <h4 className="font-medium">{achievement.title}</h4>
                          <p className="text-sm text-gray-600">{achievement.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents & Certificates</CardTitle>
                  <CardDescription>Access your official documents and certificates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50">
                      <div className="flex items-center">
                        <BookOpenIcon className="h-5 w-5 mr-3 text-gray-600" />
                        <div>Admission Letter</div>
                      </div>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50">
                      <div className="flex items-center">
                        <BookOpenIcon className="h-5 w-5 mr-3 text-gray-600" />
                        <div>Fee Receipt (2023-24)</div>
                      </div>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50">
                      <div className="flex items-center">
                        <BookOpenIcon className="h-5 w-5 mr-3 text-gray-600" />
                        <div>Last Semester Grade Card</div>
                      </div>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50">
                      <div className="flex items-center">
                        <BookOpenIcon className="h-5 w-5 mr-3 text-gray-600" />
                        <div>Character Certificate</div>
                      </div>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
