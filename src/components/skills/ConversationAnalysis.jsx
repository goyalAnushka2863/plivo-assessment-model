import React, { useState } from 'react';
import { FileUpload } from '../FileUpload';
import { LoadingSpinner } from '../LoadingSpinner';
import { ApiService } from '../../lib/api';
import { MessageSquare, Users, List } from 'lucide-react';

export function ConversationAnalysis() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setError('');
  };

  const handleProcess = async () => {
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const result = await ApiService.analyzeConversation(file);
      setResult(result);
      await ApiService.saveToHistory('conversation', 'audio', file.name, result);
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

  if (loading) {
    return <LoadingSpinner message="Analyzing conversation..." />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <MessageSquare className="text-blue-600" size={24} />
          Conversation Analysis
        </h2>

        <div className="space-y-4">
          <FileUpload
            file={file}
            onFileSelect={handleFileSelect}
            onFileRemove={handleRemoveFile}
            accept="audio/*"
            maxSize={50 * 1024 * 1024} // 50MB
            description="Drop your audio file here or click to browse"
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
              {error}
            </div>
          )}

          {file && !result && (
            <button
              onClick={handleProcess}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
            >
              Analyze Conversation
            </button>
          )}
        </div>
      </div>

      {result && (
        <div className="space-y-6">
          {/* Transcript Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <MessageSquare className="text-green-600" size={20} />
              Transcript
            </h3>
            <div className="bg-slate-50 rounded-lg p-4 max-h-60 overflow-y-auto">
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                {result.transcript}
              </p>
            </div>
          </div>

          {/* Diarization Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Users className="text-purple-600" size={20} />
              Speaker Diarization
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {result.diarization.map((item, index) => (
                <div key={index} className="flex gap-4 p-3 bg-slate-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.speaker === 'Speaker 1' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {item.speaker}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-700">{item.text}</p>
                    <p className="text-xs text-slate-500 mt-1">{item.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <List className="text-orange-600" size={20} />
              Summary
            </h3>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-slate-700 leading-relaxed">
                {result.summary}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}