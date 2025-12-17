import React from 'react';
import { DefectManagement } from '@/components/defect-management';

export default function PlanDefects() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Quality & Defects</h2>
          <p className="text-sm text-muted-foreground">Track and manage bugs and issues</p>
        </div>
      </div>
      <DefectManagement />
    </div>
  );
}

