import React, { useState } from 'react';
import { FileUpload } from '../FileUpload';
import { LoadingSpinner } from '../LoadingSpinner';
import { ApiService } from '../../lib/api';
import { FileText, Link, List, Hash } from 'lucide-react';

export function DocumentSummarization() {
  const [inputType, setInputType] = useState('file');
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setError('');
  };

  const handleProcess = async () => {
    if (inputType === 'file' && !file) return;
    if (inputType === 'url' && !url.trim()) return;

    setLoading(true);
    setError('');

    try {
      const input = inputType === 'file' ? file : url;
      const result = await ApiService.summarizeContent(input, inputType);
      setResult(result);
      
      const inputName = inputType === 'file' ? file.name : url;
      await ApiService.saveToHistory('summarization', inputType, inputName, result);
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
  };

  const handleReset = () => {
    setFile(null);
    setUrl('');
    setResult(null);
    setError('');
  };

  if (loading) {
    return <LoadingSpinner message="Summarizing content..." />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <FileText className="text-green-600" size={24} />
          Document Summarization
        </h2>

        <div className="space-y-4">
          {/* Input Type Selector */}
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setInputType('file');
                handleReset();
              }}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                inputType === 'file'
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileText className="inline mr-2" size={18} />
              Upload Document
            </button>
            <button
              onClick={() => {
                setInputType('url');
                handleReset();
              }}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                inputType === 'url'
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Link className="inline mr-2" size={18} />
              Provide URL
            </button>
          </div>

          {/* File Upload */}
          {inputType === 'file' && (
            <FileUpload
              file={file}
              onFileSelect={handleFileSelect}
              onFileRemove={handleRemoveFile}
              accept=".pdf,.doc,.docx,.txt"
              maxSize={25 * 1024 * 1024} // 25MB
              description="Drop your document here or click to browse (PDF, DOC, DOCX, TXT)"
            />
          )}

          {/* URL Input */}
          {inputType === 'url' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Website URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/article"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
              {error}
            </div>
          )}

          {((inputType === 'file' && file) || (inputType === 'url' && url.trim())) && !result && (
            <button
              onClick={handleProcess}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all"
            >
              Summarize Content
            </button>
          )}
        </div>
      </div>

      {result && (
        <div className="space-y-6">
          {/* Summary Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="text-blue-600" size={20} />
              Summary
            </h3>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-slate-700 leading-relaxed">
                {result.summary}
              </p>
            </div>
          </div>

          {/* Key Points Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <List className="text-purple-600" size={20} />
              Key Points
            </h3>
            <div className="space-y-3">
              {result.keyPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white text-sm font-semibold rounded-full flex items-center justify-center">
                    {index + 1}
                  </span>
                  <p className="text-slate-700">{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Statistics Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Hash className="text-orange-600" size={20} />
              Content Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-slate-900">{result.wordCount.toLocaleString()}</p>
                <p className="text-sm text-slate-600">Estimated Words</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-slate-900">{result.keyPoints.length}</p>
                <p className="text-sm text-slate-600">Key Points</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}