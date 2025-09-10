'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SavedPlansManager from '@/components/SavedPlansManager';

export default function SavedPlansPage() {
  const router = useRouter();
  const [editingPlan, setEditingPlan] = useState(null);

  return (
    <SavedPlansManager
      onBack={() => router.back()} // go back to home
      onEditPlan={(plan) => {
        setEditingPlan(plan);
        router.push('/weekend-planner'); // jump into planner with selected plan
      }}
      onCreateNew={() => {
        setEditingPlan(null);
        router.push('/weekend-planner'); // new planner
      }}
    />
  );
}
