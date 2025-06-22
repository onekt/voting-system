
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Users, Vote, Calendar, Settings, BarChart3, UserCheck, UserX, Plus } from 'lucide-react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { ElectionManagement } from '@/components/ElectionManagement';
import { CandidateManagement } from '@/components/CandidateManagement';
import { ElectionMonitoring } from '@/components/ElectionMonitoring';
import { DatabaseManagement } from '@/components/DatabaseManagement';
import { AdminRequestManagement, AdminRequest, Admin } from '@/components/AdminRequestManagement';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [adminRequests, setAdminRequests] = useState<AdminRequest[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    try {
      const loggedInUserStr = sessionStorage.getItem('loggedInUser');
      if (loggedInUserStr) {
        const loggedInUser = JSON.parse(loggedInUserStr);
        setUserRole(loggedInUser.role);
      }
      
      const storedRequests = JSON.parse(localStorage.getItem('adminRequests') || '[]');
      setAdminRequests(storedRequests);
      const storedAdmins = JSON.parse(localStorage.getItem('admins') || '[]');
      setAdmins(storedAdmins);
    } catch (error) {
      console.error("Failed to parse data from storage", error);
      setAdminRequests([]);
      setAdmins([]);
    }
  }, []);

  const handleRequestStatusChange = (id: number, status: 'approved' | 'denied') => {
    const request = adminRequests.find(req => req.id === id);
    if (!request) return;

    if (status === 'approved') {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { status: reqStatus, ...adminData } = request;
        const newAdmin: Admin = {
            ...adminData,
            admissionDate: new Date().toISOString().split('T')[0],
        };
        const updatedAdmins = [...admins, newAdmin];
        setAdmins(updatedAdmins);
        localStorage.setItem('admins', JSON.stringify(updatedAdmins));
        toast.success('Admin request approved.');
    } else {
        toast.error('Admin request denied.');
    }

    const updatedRequests = adminRequests.filter(req => req.id !== id);
    setAdminRequests(updatedRequests);
    localStorage.setItem('adminRequests', JSON.stringify(updatedRequests));
  };
  
  const handleDeleteAdmin = (id: number) => {
    setAdmins(currentAdmins => {
      const updatedAdmins = currentAdmins.filter(admin => admin.id !== id);
      localStorage.setItem('admins', JSON.stringify(updatedAdmins));
      toast.info("Admin has been removed successfully.");
      return updatedAdmins;
    });
  };

  const pendingRequestsCount = adminRequests.filter(req => req.status === 'pending').length;

  // Mock data for dashboard stats
  const stats = {
    totalElections: 5,
    activeElections: 2,
    totalCandidates: 24,
    pendingApplications: pendingRequestsCount,
    totalVoters: 1250,
    completedElections: 3
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} />
      
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage college voting system</p>
          </div>

          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search elections, candidates, voters..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Elections</CardTitle>
                    <Vote className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalElections}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.activeElections} currently active
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
                    <UserCheck className="h-4 w-4 text-orange-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.pendingApplications}</div>
                    <p className="text-xs text-muted-foreground">
                      Awaiting approval
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Voters</CardTitle>
                    <Users className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalVoters}</div>
                    <p className="text-xs text-muted-foreground">
                      Registered students
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates in the voting system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Student Guild Elections 2025 created</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">John Smith's candidacy approved</p>
                        <p className="text-xs text-gray-500">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">3 new candidate applications</p>
                        <p className="text-xs text-gray-500">6 hours ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'elections' && <ElectionManagement />}
          {activeTab === 'candidates' && <CandidateManagement />}
          {activeTab === 'requests' && userRole === 'head-admin' && <AdminRequestManagement requests={adminRequests} onApprove={(id) => handleRequestStatusChange(id, 'approved')} onDeny={(id) => handleRequestStatusChange(id, 'denied')} />}
          {activeTab === 'monitoring' && <ElectionMonitoring />}
          {activeTab === 'database' && <DatabaseManagement admins={admins} handleDeleteAdmin={handleDeleteAdmin} userRole={userRole} />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
