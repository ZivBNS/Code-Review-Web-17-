import React from 'react';
import useProjectUpload from './useProjectUpload';
import ProjectUploadView from './ProjectUploadView';

export default function ProjectUploadContainer() {
  const logic = useProjectUpload();
  return <ProjectUploadView {...logic} />;
}
