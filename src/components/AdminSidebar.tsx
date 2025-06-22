
import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChart3, Vote, Users, Database, Settings, LogOut, Home, UserCheck } from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole?: string | null;
}

export const AdminSidebar = ({ activeTab, setActiveTab, userRole }: AdminSidebarProps) => {
  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: Home },
    { id: 'elections', label: 'Elections', icon: Vote },
    { id: 'candidates', label: 'Candidates', icon: Users },
    { id: 'requests', label: 'Admin Requests', icon: UserCheck, role: 'head-admin' },
    { id: 'monitoring', label: 'Monitor', icon: BarChart3 },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const filteredMenuItems = menuItems.filter(item => !('role' in item) || item.role === userRole);

  return (
    <div className="w-64 bg-blue-900 text-white min-h-screen">
      {/* Admin Profile */}
      <div className="p-6 border-b border-blue-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center">
            <span className="font-semibold text-sm">AD</span>
          </div>
          <div>
            <h3 className="font-semibold">Admin</h3>
            <p className="text-blue-200 text-sm">System Administrator</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2">
        {filteredMenuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? 'secondary' : 'ghost'}
            className={`w-full justify-start text-left ${
              activeTab === item.id 
                ? 'bg-blue-800 text-white' 
                : 'text-blue-100 hover:bg-blue-800 hover:text-white'
            }`}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon className="mr-3 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-6 left-4 right-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-blue-100 hover:bg-blue-800 hover:text-white"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};
