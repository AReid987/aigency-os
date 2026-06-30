import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, File, Image, FileText, FileCode, Archive, Table, Eye } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  accept?: string;
  className?: string;
}

interface UploadedFile {
  file: File;
  id: string;
  previewUrl?: string;
  progress: number;
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

function getAllAcceptedExtensions(): string[] {
  return Object.values(ACCEPTED_EXTENSIONS).flat();
}

// ─── Component ───────────────────────────────────────────────────────────────

export function FileUpload({
  onFilesSelected,
  maxFiles = 10,
  maxSizeMB = 50,
  accept,
  className = '',
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const totalSize = uploadedFiles.reduce((sum, f) => sum + f.file.size, 0);

  const validateFiles = useCallback(
    (incoming: File[]): File[] => {
      setError(null);
      const validExtensions = getAllAcceptedExtensions();
      const valid: File[] = [];

      for (const file of incoming) {
        const ext = '.' + file.name.split('.').pop()?.toLowerCase();
        if (!validExtensions.includes(ext)) {
          setError(`File type "${ext}" is not supported.`);
          continue;
        }
        if (file.size > maxSizeMB * 1024 * 1024) {
          setError(`"${file.name}" exceeds the ${maxSizeMB}MB limit.`);
          continue;
        }
        valid.push(file);
      }

      if (uploadedFiles.length + valid.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed.`);
        return valid.slice(0, maxFiles - uploadedFiles.length);
      }

      return valid;
    },
    [uploadedFiles.length, maxFiles, maxSizeMB],
  );

  const simulateProgress = useCallback((id: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30 + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setUploadedFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, progress: Math.min(100, Math.round(progress)) } : f)),
      );
    }, 200);
  }, []);

  const processFiles = useCallback(
    (incoming: File[]) => {
      const valid = validateFiles(incoming);
      if (valid.length === 0) return;

      const newFiles: UploadedFile[] = valid.map((file) => {
        const id = `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const isImage = getFileCategory(file.name) === 'image';
        return {
          file,
          id,
          previewUrl: isImage ? URL.createObjectURL(file) : undefined,
          progress: 0,
        };
      });

      setUploadedFiles((prev) => [...prev, ...newFiles]);
      newFiles.forEach((f) => simulateProgress(f.id));
      onFilesSelected(valid);
    },
    [validateFiles, simulateProgress, onFilesSelected],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      processFiles(files);
    },
    [processFiles],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      processFiles(files);
      if (inputRef.current) inputRef.current.value = '';
    },
    [processFiles],
  );

  const removeFile = useCallback((id: string) => {
    setUploadedFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.previewUrl) URL.revokeObjectURL(file.previewUrl);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);

  return (
    <div className={className}>
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-lg border-2 border-dashed transition-all duration-200 p-8 text-center ${
          isDragOver
            ? 'border-primary bg-primary-muted/20 scale-[1.01]'
            : 'border-border hover:border-border-hover bg-surface/70 backdrop-blur-md'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={handleInputChange}
          className="hidden"
          accept={accept || getAllAcceptedExtensions().join(',')}
        />

        <Upload
          size={32}
          className={`mx-auto mb-3 ${isDragOver ? 'text-primary' : 'text-fg-muted'}`}
        />
        <p className="text-sm font-medium text-fg mb-1">
          {isDragOver ? 'Drop files here' : 'Drag & drop files here'}
        </p>
        <p className="text-xs text-fg-muted">
          or <span className="text-primary underline">browse files</span> · Max {maxSizeMB}MB per file · Up to {maxFiles} files
        </p>
        <p className="text-xs text-fg-muted mt-2">
          Images, documents, spreadsheets, code files, and archives accepted
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-3 px-3 py-2 rounded-md bg-danger/10 border border-danger/30 text-xs text-danger">
          {error}
        </div>
      )}

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {/* Storage Indicator */}
          <div className="flex items-center justify-between text-xs text-fg-muted mb-3">
            <span>{uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} selected</span>
            <span>{formatFileSize(totalSize)} total</span>
          </div>

          {uploadedFiles.map((uf) => {
            const category = getFileCategory(uf.file.name);
            const IconComponent = getFileIcon(category);
            const colorClass = getCategoryColor(category);
            const isUploading = uf.progress < 100;

            return (
              <div
                key={uf.id}
                className="bg-surface/70 backdrop-blur-md rounded-lg border border-border p-3 flex items-center gap-3 group"
              >
                {/* Icon / Preview */}
                {uf.previewUrl ? (
                  <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0 bg-elevated">
                    <img
                      src={uf.previewUrl}
                      alt={uf.file.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); setPreviewFile(uf); }}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Eye size={14} className="text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-md bg-elevated/60 flex items-center justify-center shrink-0">
                    <IconComponent size={18} className={colorClass} />
                  </div>
                )}

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-fg truncate">{uf.file.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-fg-muted">{formatFileSize(uf.file.size)}</span>
                    <span className="text-xs text-fg-muted capitalize px-1.5 py-0.5 rounded bg-elevated/60">
                      {category}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  {isUploading && (
                    <div className="mt-1.5 h-1 bg-elevated rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${uf.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFile(uf.id)}
                  className="p-1.5 rounded-md hover:bg-elevated text-fg-muted hover:text-danger transition-colors shrink-0"
                  title="Remove file"
                >
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Image Preview Modal */}
      {previewFile?.previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setPreviewFile(null)}
        >
          <div
            className="bg-surface/95 backdrop-blur-md rounded-lg border border-border p-4 max-w-lg max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-fg truncate">{previewFile.file.name}</p>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-1 rounded-md hover:bg-elevated text-fg-muted"
              >
                <X size={16} />
              </button>
            </div>
            <img
              src={previewFile.previewUrl}
              alt={previewFile.file.name}
              className="max-w-full rounded-md"
            />
            <p className="text-xs text-fg-muted mt-2">
              {formatFileSize(previewFile.file.size)} · {previewFile.file.type}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
