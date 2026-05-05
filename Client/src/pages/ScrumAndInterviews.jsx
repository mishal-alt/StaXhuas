import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import AppShell from '../components/layout/AppShell';
import ScrumLogger from '../features/scrum/ScrumLogger';
import InterviewManager from '../features/interviews/InterviewManager';
import * as batchApi from '../api/batches.api';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';

const ScrumAndInterviews = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === ROLES.ADMIN;

  const { data: batchesRes } = useQuery({
    queryKey: ['batches'],
    queryFn: batchApi.getBatches,
  });

  const batches = batchesRes?.data || [];
  const [selectedBatch, setSelectedBatch] = useState('');
  const [activeTab, setActiveTab] = useState('scrum');

  useEffect(() => {
    if (batches.length > 0 && !selectedBatch) {
      setSelectedBatch(batches[0]._id);
    }
  }, [batches, selectedBatch]);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <h1 className="text-2xl font-bold font-sans text-brand-charcoal">Academics & Evaluation</h1>
            <p className="text-brand-gray">Track daily scrums and manage end-of-module interviews.</p>
          </div>
          
          <div className="w-full md:w-64">
            <label className="block text-sm font-medium text-brand-charcoal mb-1">Select Batch</label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
            >
              <option value="" disabled>Select a batch</option>
              {batches.map(b => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('scrum')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'scrum'
                  ? 'border-brand-orange text-brand-orange'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Daily Scrum Logger
            </button>
            <button
              onClick={() => setActiveTab('interviews')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'interviews'
                  ? 'border-brand-orange text-brand-orange'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Interviews
            </button>
          </nav>
        </div>

        <div>
          {activeTab === 'scrum' && <ScrumLogger batchId={selectedBatch} />}
          {activeTab === 'interviews' && <InterviewManager batchId={selectedBatch} />}
        </div>
      </div>
    </AppShell>
  );
};

export default ScrumAndInterviews;
