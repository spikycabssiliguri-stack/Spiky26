import { useState, useRef } from 'react';
import { 
  Upload, 
  Trash2, 
  Search, 
  Copy, 
  Check, 
  Eye, 
  X, 
  FileText, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  AlertCircle,
  ExternalLink,
  Edit2
} from 'lucide-react';
import { CMSData } from '../../data/defaultCMSData';
import { uploadMedia, deleteMedia } from '../../services/api';

interface MediaLibraryViewProps {
  cmsData: CMSData;
  onRefreshCMS: () => Promise<void>;
  onSaveCMS: (updated: CMSData, summary: string) => Promise<void>;
  isSaving: boolean;
}

export const MediaLibraryView = ({ cmsData, onRefreshCMS, onSaveCMS, isSaving }: MediaLibraryViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video'>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<(typeof cmsData.media)[0] | null>(null);
  const [editingItem, setEditingItem] = useState<(typeof cmsData.media)[0] | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mediaList = cmsData.media || [];

  const filteredMedia = mediaList.filter(item => {
    const matchesSearch = 
      (item.originalName || item.filename || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.altText || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.caption || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const isVid = (item.mimeType || '').startsWith('video') || item.filename.endsWith('.mp4');
    const matchesType = 
      typeFilter === 'all' || 
      (typeFilter === 'video' && isVid) || 
      (typeFilter === 'image' && !isVid);

    return matchesSearch && matchesType;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        await uploadMedia(file, file.name.replace(/\.[^/.]+$/, ""), "");
      }
      await onRefreshCMS();
    } catch (err: any) {
      setUploadError(err.message || 'File upload failed. Max size: 25MB.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMedia(id);
      await onRefreshCMS();
      setDeleteConfirmId(null);
      if (previewItem?.id === id) setPreviewItem(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete media');
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSaveMetadata = async () => {
    if (!editingItem) return;
    const updatedMedia = mediaList.map(m => m.id === editingItem.id ? editingItem : m);
    await onSaveCMS({ ...cmsData, media: updatedMedia }, `Updated metadata for ${editingItem.originalName}`);
    setEditingItem(null);
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e5ea] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">
              Media Library
            </h2>
            <p className="text-xs text-[#86868b]">
              Manage route photos, vehicle showcases, and traveler video thumbnails.
            </p>
          </div>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept="image/*,video/mp4,video/webm"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white px-5 py-2.5 text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isUploading ? 'Uploading Media...' : 'Upload Media Asset'}</span>
            </button>
          </div>
        </div>

        {uploadError && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Filters and search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-[#86868b] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by file name or alt text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs bg-[#f5f5f7] p-1 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                typeFilter === 'all' ? 'bg-white shadow-xs font-medium text-[#1d1d1f]' : 'text-[#86868b]'
              }`}
            >
              All Assets ({mediaList.length})
            </button>
            <button
              onClick={() => setTypeFilter('image')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                typeFilter === 'image' ? 'bg-white shadow-xs font-medium text-[#1d1d1f]' : 'text-[#86868b]'
              }`}
            >
              Images
            </button>
            <button
              onClick={() => setTypeFilter('video')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                typeFilter === 'video' ? 'bg-white shadow-xs font-medium text-[#1d1d1f]' : 'text-[#86868b]'
              }`}
            >
              Videos
            </button>
          </div>
        </div>

        {/* Media Grid */}
        {filteredMedia.length === 0 ? (
          <div className="text-center py-16 bg-[#fbfbfd] rounded-2xl border border-dashed border-[#d2d2d7] space-y-2">
            <ImageIcon className="w-8 h-8 text-[#86868b] mx-auto opacity-50" />
            <p className="text-xs text-[#86868b]">No media found matching your filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMedia.map((item) => {
              const isVid = (item.mimeType || '').startsWith('video') || item.filename.endsWith('.mp4');
              return (
                <div 
                  key={item.id}
                  className="group bg-[#fbfbfd] border border-[#e5e5ea] rounded-2xl overflow-hidden hover:border-[#0071e3] transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-4/3 bg-[#f5f5f7] overflow-hidden flex items-center justify-center">
                    {isVid ? (
                      <div className="flex flex-col items-center justify-center text-[#86868b] gap-1 p-2">
                        <VideoIcon className="w-8 h-8 text-[#0071e3]" />
                        <span className="text-[10px] uppercase font-mono">Video File</span>
                      </div>
                    ) : (
                      <img
                        src={item.url}
                        alt={item.altText || item.filename}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    )}

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                      <button
                        onClick={() => setPreviewItem(item)}
                        className="p-1.5 rounded-full bg-white text-[#1d1d1f] hover:bg-neutral-100 cursor-pointer shadow-sm"
                        title="Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleCopyUrl(item.url, item.id)}
                        className="p-1.5 rounded-full bg-white text-[#1d1d1f] hover:bg-neutral-100 cursor-pointer shadow-sm"
                        title="Copy public URL"
                      >
                        {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => setEditingItem(JSON.parse(JSON.stringify(item)))}
                        className="p-1.5 rounded-full bg-white text-[#1d1d1f] hover:bg-neutral-100 cursor-pointer shadow-sm"
                        title="Edit metadata"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#0071e3]" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="p-1.5 rounded-full bg-white text-rose-600 hover:bg-rose-50 cursor-pointer shadow-sm"
                        title="Delete file"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-2.5 space-y-1">
                    <p className="text-[11px] font-medium text-[#1d1d1f] truncate" title={item.originalName || item.filename}>
                      {item.originalName || item.filename}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-[#86868b]">
                      <span>{formatFileSize(item.fileSize)}</span>
                      <button
                        onClick={() => handleCopyUrl(item.url, item.id)}
                        className="hover:text-[#0071e3] cursor-pointer"
                      >
                        {copiedId === item.id ? 'Copied!' : 'Copy Link'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Metadata Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#e5e5ea] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f5f5f7]">
              <h3 className="font-semibold text-base text-[#1d1d1f]">Edit Media Details</h3>
              <button onClick={() => setEditingItem(null)} className="p-1 text-[#86868b] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-[#1d1d1f] mb-1">File Name</label>
                <input
                  type="text"
                  value={editingItem.originalName || editingItem.filename}
                  onChange={(e) => setEditingItem({ ...editingItem, originalName: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3 py-2 text-xs text-[#1d1d1f]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#1d1d1f] mb-1">Alt Text (Accessibility & SEO)</label>
                <input
                  type="text"
                  value={editingItem.altText || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, altText: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3 py-2 text-xs text-[#1d1d1f]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#1d1d1f] mb-1">Caption</label>
                <textarea
                  rows={2}
                  value={editingItem.caption || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, caption: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-3 py-2 text-xs text-[#1d1d1f] resize-none"
                />
              </div>

              <div className="p-3 bg-[#f5f5f7] rounded-xl text-[11px] text-[#6e6e73] space-y-1 font-mono">
                <div>URL: {editingItem.url}</div>
                <div>Size: {formatFileSize(editingItem.fileSize)}</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 rounded-full bg-[#f5f5f7] text-xs text-[#1d1d1f] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveMetadata}
                className="px-5 py-2 rounded-full bg-[#0071e3] text-white text-xs font-medium cursor-pointer"
              >
                Save Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full border border-white/20 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#f5f5f7]">
              <div className="truncate pr-4">
                <h3 className="font-semibold text-sm text-[#1d1d1f] truncate">
                  {previewItem.originalName || previewItem.filename}
                </h3>
                <span className="text-[11px] text-[#86868b]">{formatFileSize(previewItem.fileSize)}</span>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1.5 rounded-full bg-[#f5f5f7] text-[#1d1d1f] cursor-pointer hover:bg-[#e5e5ea]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-black/5 flex items-center justify-center max-h-[500px]">
              {(previewItem.mimeType || '').startsWith('video') || previewItem.filename.endsWith('.mp4') ? (
                <video src={previewItem.url} controls className="max-h-[480px] w-full" />
              ) : (
                <img
                  src={previewItem.url}
                  alt={previewItem.altText || ''}
                  className="max-h-[480px] object-contain rounded-xl"
                />
              )}
            </div>

            {previewItem.caption && (
              <p className="text-xs text-[#6e6e73] italic text-center">
                "{previewItem.caption}"
              </p>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-[#f5f5f7] text-xs">
              <span className="font-mono text-[#86868b] text-[11px] truncate max-w-xs">{previewItem.url}</span>
              <button
                onClick={() => handleCopyUrl(previewItem.url, previewItem.id)}
                className="px-4 py-1.5 rounded-full bg-[#0071e3] text-white font-medium cursor-pointer"
              >
                {copiedId === previewItem.id ? 'Copied!' : 'Copy Asset Link'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#e5e5ea] shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-semibold text-[#1d1d1f]">Delete Media Asset</h3>
            </div>
            <p className="text-xs text-[#6e6e73]">
              Are you sure you want to permanently delete this media file from storage?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-full bg-[#f5f5f7] text-xs text-[#1d1d1f] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium cursor-pointer"
              >
                Delete File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
