import { useState } from 'react';

export default function useLecturerDashboard() {
  const [sessions, setSessions] = useState([
    { id: 1, groupName: 'Group Alpha', reviewer: 'Group Beta', progress: 80, active: true },
    { id: 2, groupName: 'Group Charlie', reviewer: 'Group Delta', progress: 100, active: false },
    { id: 3, groupName: 'Group Echo', reviewer: 'Group Foxtrot', progress: 45, active: true }
  ]);

  return {
    sessions
  };
}
