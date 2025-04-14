
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpenIcon, ClockIcon, UserIcon, BookIcon, PlusIcon, SearchIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Course } from '@/types';

// Mock data
const mockCourses: Course[] = [
  {
    id: '1',
    code: 'CSE101',
    name: 'Introduction to Computer Science',
    description: 'An introductory course to the fundamentals of computer science and programming.',
    credits: 4,
    teacherId: '2',
    teacherName: 'Dr. Sarah Johnson'
  },
  {
    id: '2',
    code: 'MAT205',
    name: 'Linear Algebra',
    description: 'Study of linear equations, matrices, vector spaces, determinants, and linear transformations.',
    credits: 3,
    teacherId: '5',
    teacherName: 'Dr. Robert Chen'
  },
  {
    id: '3',
    code: 'PHY103',
    name: 'Physics for Engineers',
    description: 'The study of mechanics, thermodynamics, and electromagnetism with engineering applications.',
    credits: 4,
    teacherId: '8',
    teacherName: 'Prof. Michael Lee'
  },
  {
    id: '4',
    code: 'ENG201',
    name: 'Technical Writing',
    description: 'Developing effective communication skills for technical and scientific contexts.',
    credits: 2,
    teacherId: '10',
    teacherName: 'Prof. Amanda Wilson'
  },
  {
    id: '5',
    code: 'CSE202',
    name: 'Data Structures and Algorithms',
    description: 'Implementation and analysis of fundamental data structures and algorithms.',
    credits: 4,
    teacherId: '2',
    teacherName: 'Dr. Sarah Johnson'
  }
];

const Courses = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  const isAdmin = user?.role === 'admin';
  const isTeacher = user?.role === 'teacher';
  
  const filteredCourses = mockCourses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout title="Courses">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600">Browse and manage your courses</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          
          {(isAdmin || isTeacher) && (
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              {isAdmin ? 'Add Course' : 'Create Course'}
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="hover-scale overflow-hidden">
            <div className="h-2 bg-lpu-orange"></div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">{course.code}</p>
                  <CardTitle>{course.name}</CardTitle>
                </div>
                <div className="bg-lpu-orange/10 text-lpu-orange font-medium text-sm py-1 px-2 rounded">
                  {course.credits} CR
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 mb-4 line-clamp-2">
                {course.description}
              </CardDescription>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <UserIcon className="h-4 w-4 mr-2" />
                <span>{course.teacherName}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <BookOpenIcon className="h-4 w-4 mr-2" />
                <span>12 Lectures</span>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button variant="outline" size="sm">
                <BookIcon className="h-4 w-4 mr-2" />
                Details
              </Button>
              
              {isTeacher || isAdmin ? (
                <Button size="sm">
                  {isTeacher ? 'Manage' : 'Edit'}
                </Button>
              ) : (
                <Button size="sm">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No courses found</h3>
          <p className="text-gray-600 mt-1">Try adjusting your search criteria</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Courses;
