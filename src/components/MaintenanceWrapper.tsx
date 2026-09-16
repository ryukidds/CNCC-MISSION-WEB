'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Maintenance from '@/components/Maintenance';

export default function MaintenanceWrapper({
  isMaintenance,
  children,
}: {
  isMaintenance: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Allow admin routes even when maintenance mode is active
  if (isMaintenance && !pathname?.startsWith('/admin')) {
    return <Maintenance />;
  }

  return <>{children}</>;
}
