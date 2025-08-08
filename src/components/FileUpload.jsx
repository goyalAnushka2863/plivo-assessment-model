import React, { useRef, useState } from 'react';
import { Upload, X, File, Image, FileText, Music } from 'lucide-react';

const getFileIcon = (type) => {
  if (type.startsWith('image/')) return Image;
  if (type.startsWith('audio/')) return Music;
  if (type.includes('pdf') || type.includes('document')) return FileText;
  return File;
};

const getFileColor = (type) => {
  if (type.startsWith('image/')) return 'text-purple-600';
  if (type.startsWith('audio/')) return 'text-blue-600';
  if (type.includes('pdf') || type.includes('document')) return 'text-green-600';
  return 'text-slate-600';
};

export function FileUpload({ 
  file, 
  onFileSelect, 
  onFileRemove,
  accept = "*/*",
  maxSize = 10 * 1024 * 1024, // 10MB default
  description = "Drop your file here or click to browse"
}) {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.size <= maxSize) {
      onFileSelect(droppedFile);
    }
  };

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size <= maxSize) {
      onFileSelect(selectedFile);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (file) {
    const FileIcon = getFileIcon(file.type);
    const iconColor = getFileColor(file.type);

    return (
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileIcon className={`${iconColor}`} size={20} />
            <div>
              <p className="font-medium text-slate-900">{file.name}</p>
              <p className="text-sm text-slate-500">{formatFileSize(file.size)}</p>
            </div>
          </div>
          <button
            onClick={onFileRemove}
            className="p-1 hover:bg-slate-200 rounded-md transition-colors"
          >
            <X className="text-slate-500" size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onClick={() => fileInputRef.current?.click()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
        dragOver
          ? 'border-blue-400 bg-blue-50'
          : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
      }`}
    >
      <Upload className="mx-auto text-slate-400 mb-4" size={32} />
      <p className="text-lg font-medium text-slate-900 mb-2">Upload File</p>
      <p className="text-slate-500">{description}</p>
      <p className="text-sm text-slate-400 mt-2">
        Max file size: {formatFileSize(maxSize)}
      </p>
      
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
}