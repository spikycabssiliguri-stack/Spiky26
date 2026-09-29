import { useState } from 'react';
import { 
  History, 
  Clock, 
  RotateCcw, 
  Trash2, 
  Search, 
  AlertCircle, 
  Check, 
  ShieldCheck,
  User,
  Activity
} from 'lucide-react';
import { CMSData } from '../../data/defaultCMSData';
import { restoreRevision, clearAuditLogs } from '../../services/api';

interface AuditRevisionsViewProps {
  cmsData: CMSData;
  onRefreshCMS: () => Promise<void>;
}

export const AuditRevisionsView = ({ cmsData, onRefreshCMS }: AuditRevisionsViewProps) => {
  const [activeTab, setActiveTab] = useState<'revisions' | 'audit'>('revisions');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreConfirmId, setRestoreConfirmId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const revisions = cmsData.revisions || [];
  const auditLogs = cmsData.auditLogs || [];

  const filteredLogs = auditLogs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRestore = async (id: string) => {
    setIsRestoring(true);
    setStatusMessage(null);
    try {
      await restoreRevision(id);
      await onRefreshCMS();
      setStatusMessage('Content snapshot successfully restored!');
      setRestoreConfirmId(null);
    } catch (err: any) {
      alert(err.message || 'Failed to restore snapshot');
    } finally {
      setIsRestoring(false);
    }
  };

  const handleClearLogs = async () => {
    if (!confirm('Are you sure you want to clear historical audit logs?')) return;
    try {
      await clearAuditLogs();
      await onRefreshCMS();
      setStatusMessage('Audit logs cleared.');
    } catch (err: any) {
      alert(err.message || 'Failed to clear logs');
    }
  };

  return (
    <div className="space-y-6">
      {statusMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e5ea] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">
              Audit Trail & Revision History
            </h2>
            <p className="text-xs text-[#86868b]">
              Inspect administrator modifications and restore previous content snapshots if needed.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#f5f5f7] p-1 rounded-2xl self-start sm:self-auto text-xs">
            <button
              onClick={() => setActiveTab('revisions')}
              className={`px-4 py-2 rounded-xl cursor-pointer transition-colors ${
                activeTab === 'revisions' ? 'bg-white text-[#1d1d1f] font-semibold shadow-xs' : 'text-[#86868b]'
              }`}
            >
              Revisions ({revisions.length})
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-4 py-2 rounded-xl cursor-pointer transition-colors ${
                activeTab === 'audit' ? 'bg-white text-[#1d1d1f] font-semibold shadow-xs' : 'text-[#86868b]'
              }`}
            >
              Activity Logs ({auditLogs.length})
            </button>
          </div>
        </div>

        {activeTab === 'revisions' ? (
          /* Revisions List */
          <div className="space-y-4">
            <div className="p-4 bg-[#f5f5f7] rounded-2xl border border-[#e5e5ea] text-xs text-[#6e6e73]">
              Every time you hit <strong>Save Changes</strong>, an automatic snapshot is saved. You can roll back the entire website to any previous snapshot with one click.
            </div>

            {revisions.length === 0 ? (
              <div className="text-center py-12 text-xs text-[#86868b]">
                No previous snapshots recorded yet. Snapshots are created whenever changes are saved.
              </div>
            ) : (
              <div className="space-y-3">
                {revisions.map((rev, idx) => (
                  <div
                    key={rev.id}
                    className="p-4 bg-[#fbfbfd] border border-[#e5e5ea] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[11px] text-[#86868b]">
                        <Clock className="w-3.5 h-3.5 text-[#0071e3]" />
                        <span>{new Date(rev.timestamp).toLocaleString()}</span>
                        {idx === 0 && (
                          <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                            Latest Snapshot
                          </span>
                        )}
                      </div>
                      <div className="font-semibold text-[#1d1d1f]">
                        {rev.summary}
                      </div>
                      <div className="text-[11px] text-[#86868b]">
                        Pages: {rev.snapshotData?.pages?.length || 0} · Packages: {rev.snapshotData?.packages?.length || 0} · Fleet: {rev.snapshotData?.fleet?.length || 0}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setRestoreConfirmId(rev.id)}
                      disabled={isRestoring}
                      className="px-4 py-2 rounded-full bg-white border border-[#d2d2d7] hover:border-[#0071e3] hover:text-[#0071e3] text-[#1d1d1f] font-medium text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Rollback to this state</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Audit Logs List */
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 text-[#86868b] absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Filter logs by keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
                />
              </div>

              <button
                type="button"
                onClick={handleClearLogs}
                className="px-3.5 py-1.5 rounded-xl text-xs text-rose-600 hover:bg-rose-50 cursor-pointer self-start sm:self-auto flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Historical Logs</span>
              </button>
            </div>

            <div className="divide-y divide-[#f5f5f7] border border-[#f5f5f7] rounded-2xl overflow-hidden">
              {filteredLogs.map((log) => (
                <div key={log.id} className="p-3.5 bg-white hover:bg-[#fbfbfd] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-[#f5f5f7] text-[#1d1d1f]">
                        {log.action}
                      </span>
                      <span className="text-[11px] text-[#86868b]">by {log.user}</span>
                    </div>
                    <p className="text-[#424245]">{log.details}</p>
                  </div>

                  <span className="text-[11px] text-[#86868b] font-mono shrink-0">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Restore confirmation dialog */}
      {restoreConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#e5e5ea] shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <RotateCcw className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-semibold text-[#1d1d1f]">Confirm Snapshot Restore</h3>
            </div>
            <p className="text-xs text-[#6e6e73] leading-relaxed">
              This will rollback the website configuration, pages, fleet, and packages to this snapshot. A backup of the current state will also be preserved.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRestoreConfirmId(null)}
                className="px-4 py-2 rounded-full bg-[#f5f5f7] text-xs text-[#1d1d1f] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleRestore(restoreConfirmId)}
                className="px-4 py-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium cursor-pointer"
              >
                {isRestoring ? 'Restoring...' : 'Restore Snapshot'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
