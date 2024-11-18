import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Display, DisplayUsage } from '../../types';
import { useAtom } from 'jotai';
import { addUsageReportAtom } from '../../store/displayStore';

interface UsageReportProps {
  display: Display;
  onClose: () => void;
  onSubmit?: (usage: Partial<DisplayUsage>) => void;
}

export const UsageReport: React.FC<UsageReportProps> = ({
  display,
  onClose,
  onSubmit
}) => {
  const [usageCount, setUsageCount] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [, addUsageReport] = useAtom(addUsageReportAtom);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const usage: Partial<DisplayUsage> = {
      displayId: display.id,
      date: new Date().toISOString(),
      usageCount,
      feedback: feedback.trim() || undefined
    };

    // Add usage report to store
    await addUsageReport(usage);

    // Call optional onSubmit callback
    if (onSubmit) {
      onSubmit(usage);
    }

    onClose();
  };

  // Rest of the component remains the same...
};