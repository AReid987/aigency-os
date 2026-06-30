import React, { useState, useCallback } from 'react';
import { FileUpload } from '../components/FileUpload';
import { Upload, Download, Trash2, HardDrive, Image, FileText, FileCode, Archive, Table, File } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface VentureUploadPageProps {
  ventureName?: string;
}

interface UploadedFileInfo {
  file: File;
  id: string;
  previewUrl?: string;
  uploadedAt: Date;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ACCEPTED_EXTENSIONS: Record<string, string[]> = {
  image: ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'],
  document: ['.pdf', '.doc', '.docx', '.txt', '.md', '.rtf'],
  spreadsheet: ['.csv', '.xls', '.xlsx'],
  code: ['.js', '.ts', '.py', '.json', '.yaml', '.yml', '.html', '.css'],
  archive: ['.zip', '.tar', '.gz'],
};

function getFileCategory(filename: string): string {
  const ext = '.' + filename.split('.').pop()?.toLowerCase();
  for (const [category, exts] of Object.entries(ACCEPTED_EXTENSIONS)) {
    if (exts.includes(ext)) return category;
  }
  return 'document';
}

function getFileIcon(category: string) {
  switch (category) {
    case 'image': return Image;
    case 'document': return FileText;
    case 'spreadsheet': return Table;
    case 'code': return FileCode;
    case 'archive': return Archive;
    default: return File;
  }
}

function getCategoryColor(category: string): string {
  switch (category) {
    case 'image': return 'text-pink-400';
    case 'document': return 'text-blue-400';
    case 'spreadsheet': return 'text-green-400';
    case 'code': return 'text-amber-400';
    case 'archive': return 'text-purple-400';
    default: return 'text-fg-muted';
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function formatTotalSize(bytes: number): string {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

const STORAGE_LIMIT_MB = 500;
const STORAGE_LIMIT_BYTES = STORAGE_LIMIT_MB * 1024 * 1024;

// ─── Component ───────────────────────────────────────────────────────────────

export function VentureUploadPage({ ventureName = 'Untitled Venture' }: VentureUploadPageProps) {
  const [files, setFiles] = useState<UploadedFileInfo[]>([]);

  const totalSize = files.reduce((sum, f) => sum + f.file.size, 0);
  const storagePercent = Math.min(100, (totalSize / STORAGE_LIMIT_BYTES) * 100);

  const handleFilesSelected = useCallback((incoming: File[]) => {
    const newFiles: UploadedFileInfo[] = incoming.map((file) => ({
      file,
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      previewUrl: getFileCategory(file.name) === 'image' ? URL.createObjectURL(file) : undefined,
      uploadedAt: new Date(),
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleDownload = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.previewUrl) URL.revokeObjectURL(file.previewUrl);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Upload size={24} className="text-primary" />
        <div>
          <h2 className="text-lg font-bold font-display text-fg">Upload Files for {ventureName}</h2>
          <p className="text-xs text-fg-muted">Add supporting documents, assets, or reference files for your venture</p>
        </div>
      </div>

      {/* Storage Indicator */}
      <div className="bg-surface/70 backdrop-blur-md rounded-lg border border-border p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <HardDrive size={14} className="text-fg-muted" />
            <span className="text-sm font-medium text-fg">Storage Used</span>
          </div>
          <span className="text-xs text-fg-muted">
            {formatTotalSize(totalSize)} / {STORAGE_LIMIT_MB} MB
          </span>
        </div>
        <div className="h-2 bg-elevated rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              storagePercent > 90 ? 'bg-danger' : storagePercent > 70 ? 'bg-amber' : 'bg-primary'
            }`}
            style={{ width: `${storagePercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs text-fg-muted">
            {files.length} file{files.length !== 1 ? 's' : ''}
          </span>
          <span className="text-xs text-fg-muted">{storagePercent.toFixed(1)}%</span>
        </div>
      </div>

      {/* Upload Area */}
      <FileUpload
        onFilesSelected={handleFilesSelected}
        maxFiles={10}
        maxSizeMB={50}
      />

      {/* Files List */}
      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-fg mb-3">Uploaded Files</h3>
          <div className="space-y-2">
            {files.map((uf) => {
              const category = getFileCategory(uf.file.name);
              const IconComponent = getFileIcon(category);
              const colorClass = getCategoryColor(category);

              return (
                <div
                  key={uf.id}
                  className="bg-surface/70 backdrop-blur-md rounded-lg border border-border p-3 flex items-center gap-3 group hover:border-border-hover transition-colors"
                >
                  {/* Thumbnail / Icon */}
                  {uf.previewUrl ? (
                    <div className="w-12 h-12 rounded-md overflow-hidden shrink-0 bg-elevated border border-border">
                      <img
                        src={uf.previewUrl}
                        alt={uf.file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-md bg-elevated/60 flex items-center justify-center shrink-0 border border-border">
                      <IconComponent size={20} className={colorClass} />
                    </div>
                  )}

                  {/* File Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-fg truncate">{uf.file.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-fg-muted">{formatFileSize(uf.file.size)}</span>
                      <span className="text-xs text-fg-muted capitalize px-1.5 py-0.5 rounded bg-elevated/60">
                        {category}
                      </span>
                      <span className="text-xs text-fg-muted">
                        {uf.uploadedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleDownload(uf.file)}
                      className="p-2 rounded-md hover:bg-elevated text-fg-muted hover:text-primary transition-colors"
                      title="Download"
                    >
                      <Download size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(uf.id)}
                      className="p-2 rounded-md hover:bg-elevated text-fg-muted hover:text-danger transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
