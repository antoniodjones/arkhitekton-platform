import React from 'react';
import { QualityLayout } from '@/components/quality/quality-layout';
import { TestCoverageDashboard } from '@/components/quality/test-coverage-dashboard';

export default function QualityReportsPage() {
  return (
    <QualityLayout>
      <TestCoverageDashboard />
    </QualityLayout>
  );
}

