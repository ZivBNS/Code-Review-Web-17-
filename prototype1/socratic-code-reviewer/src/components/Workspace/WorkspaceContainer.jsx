import React from 'react';
import useWorkspace from './useWorkspace';
import WorkspaceView from './WorkspaceView';

export default function WorkspaceContainer() {
  const logic = useWorkspace();
  return <WorkspaceView {...logic} />;
}
