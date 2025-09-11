'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SavedPlansManager from '@/components/SavedPlansManager';

export default function SavedPlansPage() {
  const router = useRouter();
  const [editingPlan, setEditingPlan] = useState(null);

  return (
    <SavedPlansManager
      onBack={() => router.push('/')}
      onEditPlan={(plan) => {
        // Store the plan in localStorage temporarily for editing
        localStorage.setItem('weekendly-editing-plan', JSON.stringify(plan));
        // Navigate to planner with edit mode parameter
        router.push('/weekend-planner?mode=edit&planId=' + plan.id);
      }}
      onCreateNew={() => {
        // Clear any existing editing plan
        localStorage.removeItem('weekendly-editing-plan');
        router.push('/weekend-planner');
      }}
    />
  );
}
