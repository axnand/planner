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
        localStorage.setItem('weekendly-editing-plan', JSON.stringify(plan));
        router.push('/weekend-planner?mode=edit&planId=' + plan.id);
      }}
      onCreateNew={() => {
        localStorage.removeItem('weekendly-editing-plan');
        router.push('/weekend-planner');
      }}
    />
  );
}
