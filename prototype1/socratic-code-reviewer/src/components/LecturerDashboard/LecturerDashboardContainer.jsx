import React from 'react';
import useLecturerDashboard from './useLecturerDashboard';
import LecturerDashboardView from './LecturerDashboardView';

export default function LecturerDashboardContainer() {
  const logic = useLecturerDashboard();
  return <LecturerDashboardView {...logic} />;
}
