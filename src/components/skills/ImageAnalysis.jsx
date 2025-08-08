import React, { useState } from 'react';
import { FileUpload } from '../FileUpload';
import { LoadingSpinner } from '../LoadingSpinner';
import { ApiService } from '../../lib/api';
import { Eye, Tag, BarChart3 } from 'lucide-react';

export function ImageAnalysis() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setImageUrl(url);
    setError('');
  };

  const handleProcess = async () => {
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const result = await ApiService.analyzeImage(file);
      setResult(result);
      await ApiService.saveToHistory('image', 'image', file.name, result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setResult(null);
    setError('');
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
      setImageUrl('');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Analyzing image..." />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Eye className="text-purple-600" size={24} />
          Image Analysis
        </h2>

        <div className="space-y-4">
          <FileUpload
            file={file}
            onFileSelect={handleFileSelect}
            onFileRemove={handleRemoveFile}
            accept="image/*"
            maxSize={10 * 1024 * 1024} // 10MB
            description="Drop your image here or click to browse"
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
              {error}
            </div>
          )}

          {file && imageUrl && (
            <div className="bg-slate-50 rounded-lg p-4">
              <img 
                src={imageUrl} 
                alt="Preview" 
                className="max-w-full max-h-60 mx-auto rounded-lg shadow-sm"
              />
            </div>
          )}

          {file && !result && (
            <button
              onClick={handleProcess}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all"
            >
              Analyze Image
            </button>
          )}
        </div>
      </div>

      {result && (
        <div className="space-y-6">
          {/* Description Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Eye className="text-blue-600" size={20} />
              Image Description
            </h3>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-slate-700 leading-relaxed">
                {result.description}
              </p>
            </div>
          </div>

          {/* Tags Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Tag className="text-green-600" size={20} />
              Detected Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Confidence Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <BarChart3 className="text-orange-600" size={20} />
              Analysis Confidence
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-slate-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${result.confidence * 100}%` }}
                />
              </div>
              <span className="text-lg font-semibold text-slate-900">
                {Math.round(result.confidence * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}