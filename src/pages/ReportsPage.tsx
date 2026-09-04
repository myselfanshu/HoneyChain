import React, { useState } from 'react';
import { Calendar, Download, FileText, Filter, MoreHorizontal, Plus, Activity, Droplet, Star, ShieldCheck } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const YIELD_DATA = [
  { name: 'Jan', yield: 45 },
  { name: 'Feb', yield: 52 },
  { name: 'Mar', yield: 68 },
  { name: 'Apr', yield: 74 },
  { name: 'May', yield: 85 },
  { name: 'Jun', yield: 92 },
];

const RECENT_REPORTS = [
  { id: '1', name: 'Q2 Apiary Health Overview', period: 'Apr - Jun 2024', generated: 'Jul 1, 2024', status: 'Ready' },
  { id: '2', name: 'Monthly Yield Analysis', period: 'June 2024', generated: 'Jul 2, 2024', status: 'Ready' },
  { id: '3', name: 'Traceability Audit - Batch A2', period: 'Jan - Jun 2024', generated: 'Jul 5, 2024', status: 'Ready' },
  { id: '4', name: 'Nectar Flow Projections', period: 'Jul - Sep 2024', generated: 'Jul 10, 2024', status: 'Processing' },
];

const ReportsPage = () => {
  const [timeRange, setTimeRange] = useState('This Quarter');

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[var(--text-primary)]">Reports</h1>
          <p className="text-[var(--text-secondary)] mt-1">Analytics, yields, and compliance documents.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg pl-10 pr-8 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              <option>This Week</option>
              <option>This Month</option>
              <option>This Quarter</option>
              <option>Custom</option>
            </select>
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
          </div>
          
          <button className="flex items-center px-4 py-2.5 bg-[var(--accent)] hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-[var(--text-secondary)] text-sm font-medium">Hive Health</h3>
          <p className="text-2xl font-serif text-[var(--text-primary)] mt-1">94%</p>
          <div className="mt-2 text-sm text-green-500 font-medium">↑ 2.4% vs last period</div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
              <Droplet className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-[var(--text-secondary)] text-sm font-medium">Total Yield</h3>
          <p className="text-2xl font-serif text-[var(--text-primary)] mt-1">416 kg</p>
          <div className="mt-2 h-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={YIELD_DATA}>
                <Bar dataKey="yield" fill="var(--accent)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
              <Star className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-[var(--text-secondary)] text-sm font-medium">Quality Score</h3>
          <p className="text-2xl font-serif text-[var(--text-primary)] mt-1">A+</p>
          <div className="mt-2 text-sm text-[var(--text-secondary)]">Across 12 tested batches</div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-[var(--text-secondary)] text-sm font-medium">Verified Events</h3>
          <p className="text-2xl font-serif text-[var(--text-primary)] mt-1">1,248</p>
          <div className="mt-2 text-sm text-green-500 font-medium">100% compliance rate</div>
        </div>
      </div>

      {/* Recent Reports Table */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
          <h2 className="text-xl font-serif text-[var(--text-primary)]">Recent Reports</h2>
          <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <Filter className="w-5 h-5" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--background)] border-b border-[var(--border)] text-[var(--text-secondary)] text-sm">
                <th className="py-4 px-6 font-medium">Report Name</th>
                <th className="py-4 px-6 font-medium">Period</th>
                <th className="py-4 px-6 font-medium">Generated</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_REPORTS.map((report) => (
                <tr key={report.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--background)] transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 text-[var(--accent)] mr-3" />
                      <span className="font-medium text-[var(--text-primary)]">{report.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-[var(--text-secondary)]">{report.period}</td>
                  <td className="py-4 px-6 text-sm text-[var(--text-secondary)]">{report.generated}</td>
                  <td className="py-4 px-6">
                    {report.status === 'Ready' ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600 border border-green-500/20">
                        Ready
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
                        Processing
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        disabled={report.status !== 'Ready'}
                        className={`p-2 rounded-lg transition-colors ${
                          report.status === 'Ready' 
                            ? 'text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-amber-500/10' 
                            : 'text-[var(--text-muted)] cursor-not-allowed'
                        }`}
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] rounded-lg transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
