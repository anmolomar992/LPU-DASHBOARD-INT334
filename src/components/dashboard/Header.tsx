
import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  title: string;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ title, sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="bg-white border-b h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-10 subtle-shadow">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mr-2 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      </div>
      
      <div className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-1.5 flex-1 max-w-md mx-4">
        <Search className="h-4 w-4 text-gray-500 mr-2" />
        <Input 
          type="text" 
          placeholder="Search..." 
          className="border-0 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-8 p-0 placeholder:text-gray-500"
        />
      </div>
      
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-lpu-orange"></span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
