
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BellIcon, PlusIcon, SearchIcon, AlertTriangleIcon, ClockIcon, GlobeIcon, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { Notice } from '@/types';

// Mock data
const mockNotices: Notice[] = [
  {
    id: '1',
    title: 'Mid-Term Examination Schedule',
    content: 'The mid-term examinations for all departments will begin from October 15, 2023. The detailed schedule is available on the university portal.',
    date: '2023-10-01',
    important: true,
    author: 'Examination Department'
  },
  {
    id: '2',
    title: 'Annual Sports Meet',
    content: 'The Annual Sports Meet will be held from November 5-7, 2023. Students interested in participating should register with their respective sports coordinators.',
    date: '2023-09-28',
    important: false,
    author: 'Sports Department'
  },
  {
    id: '3',
    title: 'Workshop on Artificial Intelligence',
    content: 'A three-day workshop on Artificial Intelligence and Machine Learning will be conducted by industry experts from October 10-12, 2023. Registration is mandatory.',
    date: '2023-09-25',
    important: false,
    author: 'Department of Computer Science'
  },
  {
    id: '4',
    title: 'Library Timings Update',
    content: 'The library will remain open from 8:00 AM to 10:00 PM during the examination period, starting from October 10, 2023.',
    date: '2023-09-22',
    important: false,
    author: 'Library Services'
  },
  {
    id: '5',
    title: 'Campus Recruitment Drive',
    content: 'A campus recruitment drive by leading tech companies will be held on October 20, 2023. Eligible students must register by October 10.',
    date: '2023-09-20',
    important: true,
    author: 'Career Development Center'
  }
];

const Notices = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  const isAdmin = user?.role === 'admin';
  const isTeacher = user?.role === 'teacher';
  
  const filterNotices = () => {
    let filtered = mockNotices;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(notice => 
        notice.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        notice.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by tab
    if (activeTab === 'important') {
      filtered = filtered.filter(notice => notice.important);
    }
    
    return filtered;
  };
  
  const filteredNotices = filterNotices();

  return (
    <DashboardLayout title="Notices">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notice Board</h1>
          <p className="text-gray-600">Stay updated with important announcements</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              placeholder="Search notices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          
          {(isAdmin || isTeacher) && (
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              New Notice
            </Button>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Notices</TabsTrigger>
          <TabsTrigger value="important">Important</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="space-y-4">
        {filteredNotices.map((notice) => (
          <Card key={notice.id} className={`hover-scale ${notice.important ? 'border-l-4 border-l-red-500' : ''}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    {notice.important && (
                      <div className="flex items-center text-red-500 mr-2 text-sm font-medium">
                        <AlertTriangleIcon className="h-4 w-4 mr-1" />
                        Important
                      </div>
                    )}
                    <div className="text-sm text-gray-500">
                      <CalendarIcon className="h-3 w-3 inline mr-1" />
                      {format(new Date(notice.date), 'MMMM d, yyyy')}
                    </div>
                  </div>
                  <CardTitle>{notice.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-700 whitespace-pre-line">
                {notice.content}
              </CardDescription>
            </CardContent>
            <CardFooter className="border-t pt-3 flex justify-between">
              <div className="text-sm text-gray-600">
                Posted by: {notice.author}
              </div>
              
              {(isAdmin || isTeacher) ? (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="destructive" size="sm">Delete</Button>
                </div>
              ) : (
                <Button variant="outline" size="sm">
                  <GlobeIcon className="h-4 w-4 mr-2" />
                  Read More
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
        
        {filteredNotices.length === 0 && (
          <div className="text-center py-12">
            <BellIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No notices found</h3>
            <p className="text-gray-600 mt-1">Try adjusting your search criteria or check back later</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Notices;
