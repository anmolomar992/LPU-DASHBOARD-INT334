
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HelpCircleIcon, BookOpenIcon, PhoneIcon, MessageCircleIcon } from 'lucide-react';

const Help = () => {
  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "Go to the login page and click on 'Forgot Password'. Follow the instructions sent to your registered email address to reset your password."
    },
    {
      question: "How do I enroll in a new course?",
      answer: "Navigate to the Courses page, browse available courses, and click on the 'Enroll' button for the course you wish to take. Confirm your enrollment when prompted."
    },
    {
      question: "Where can I view my assignment submissions?",
      answer: "You can view all your submitted assignments in the Performance page under the 'Submissions' tab. Here you can track grades and feedback for each submission."
    },
    {
      question: "How do I contact my course instructor?",
      answer: "Open the specific course from your Courses page, and click on the 'Contact Instructor' button. Alternatively, you can send a message through the messaging system accessible from the course details page."
    },
    {
      question: "Can I download course materials for offline use?",
      answer: "Yes, course materials that are enabled for download will have a download icon next to them. Click on this icon to save the material to your device for offline access."
    }
  ];

  return (
    <DashboardLayout title="Help & Support">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-gray-600">Find answers to common questions and get assistance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircleIcon className="h-5 w-5 mr-2" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Find quick answers to common questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpenIcon className="h-5 w-5 mr-2" />
                Knowledge Base
              </CardTitle>
              <CardDescription>
                Explore our comprehensive guides and tutorials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="hover-scale">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Getting Started Guide</h3>
                    <p className="text-sm text-gray-600 mb-3">Learn the basics of navigating the LPU dashboard</p>
                    <Button variant="outline" size="sm">Read Guide</Button>
                  </CardContent>
                </Card>
                <Card className="hover-scale">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Course Enrollment</h3>
                    <p className="text-sm text-gray-600 mb-3">How to find and enroll in your semester courses</p>
                    <Button variant="outline" size="sm">Read Guide</Button>
                  </CardContent>
                </Card>
                <Card className="hover-scale">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Assignment Submission</h3>
                    <p className="text-sm text-gray-600 mb-3">Step-by-step process for submitting your assignments</p>
                    <Button variant="outline" size="sm">Read Guide</Button>
                  </CardContent>
                </Card>
                <Card className="hover-scale">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Academic Calendar</h3>
                    <p className="text-sm text-gray-600 mb-3">Important dates and deadlines for the academic year</p>
                    <Button variant="outline" size="sm">Read Guide</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircleIcon className="h-5 w-5 mr-2" />
                Contact Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Input placeholder="Subject" />
                  <textarea 
                    className="min-h-[100px] w-full p-2 border rounded-md" 
                    placeholder="Describe your issue..."
                  ></textarea>
                </div>
                <Button className="w-full">Submit Request</Button>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium mb-2">Other Ways to Reach Us</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <PhoneIcon className="h-4 w-4 mr-2 text-gray-600" />
                    <span className="text-sm">+91 1800 102 4431</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircleIcon className="h-4 w-4 mr-2 text-gray-600" />
                    <span className="text-sm">support@lpu.co.in</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Operating Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Support requests made outside operating hours will be addressed on the next working day.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Help;
