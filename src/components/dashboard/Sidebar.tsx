
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { BookIcon, LayoutDashboardIcon, UserIcon, BellIcon, BarChartIcon, Settings2Icon, LogOutIcon, XIcon } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboardIcon, roles: ['student', 'teacher', 'admin'] },
    { name: 'Courses', path: '/courses', icon: BookIcon, roles: ['student', 'teacher', 'admin'] },
    { name: 'Notices', path: '/notices', icon: BellIcon, roles: ['student', 'teacher', 'admin'] },
    { name: 'Performance', path: '/performance', icon: BarChartIcon, roles: ['student', 'admin'] },
    { name: 'Users', path: '/users', icon: UserIcon, roles: ['admin'] },
    { name: 'Settings', path: '/settings', icon: Settings2Icon, roles: ['student', 'teacher', 'admin'] },
  ];

  // Filter navItems based on user role
  const filteredNavItems = navItems.filter(item => user && item.roles.includes(user.role));

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-white border-r shadow-sm transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <Logo size="md" />
            <button 
              onClick={() => setOpen(false)}
              className="p-1 rounded-full hover:bg-gray-100 lg:hidden"
            >
              <XIcon size={20} className="text-gray-600" />
            </button>
          </div>
          
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover border border-gray-200" 
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-lpu-orange/20 flex items-center justify-center text-lpu-orange font-semibold">
                  {user?.name.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="font-medium text-gray-900">{user?.name}</h3>
                <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {filteredNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "nav-link group",
                  isActive ? "active" : ""
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
          
          <div className="p-4 border-t">
            <Button 
              variant="ghost" 
              onClick={logout}
              className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50"
            >
              <LogOutIcon className="h-5 w-5 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
