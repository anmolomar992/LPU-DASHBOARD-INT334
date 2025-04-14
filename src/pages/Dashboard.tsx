
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Overview from '@/components/dashboard/Overview';

const Dashboard = () => {
  return (
    <DashboardLayout title="Dashboard">
      <Overview />
    </DashboardLayout>
  );
};

export default Dashboard;
