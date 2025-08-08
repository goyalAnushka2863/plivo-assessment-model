import React, { useState, useEffect } from 'react';
import { History, Calendar, FileText, Image, MessageSquare, ChevronRight } from 'lucide-react';
import { ApiService } from '../lib/api';
import { SKILL_TYPES } from '../types';

const getSkillIcon = (skill) => {
  switch (skill) {
    case SKILL_TYPES.CONVERSATION:
      return MessageSquare;
    case SKILL_TYPES.IMAGE:
      return Image;
    case SKILL_TYPES.SUMMARIZATION:
      return FileText;
    default:
      return FileText;
  }
};

const getSkillColor = (skill) => {
  switch (skill) {
    case SKILL_TYPES.CONVERSATION:
      return 'text-blue-600';
    case SKILL_TYPES.IMAGE:
      return 'text-purple-600';
    case SKILL_TYPES.SUMMARIZATION:
      return 'text-green-600';
    default:
      return 'text-slate-600';
  }
};

export function HistoryPanel() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await ApiService.getHistory();
      setHistory(data);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  const renderResultPreview = (skill, result) => {
    switch (skill) {
      case SKILL_TYPES.CONVERSATION:
        return (
          <div className="space-y-2 text-sm">
            <p className="text-slate-700">
              <span className="font-medium">Summary:</span> {truncateText(result.summary)}
            </p>
          </div>
        );
      case SKILL_TYPES.IMAGE:
        return (
          <div className="space-y-2 text-sm">
            <p className="text-slate-700">{truncateText(result.description)}</p>
          </div>
        );
      case SKILL_TYPES.SUMMARIZATION:
        return (
          <div className="space-y-2 text-sm">
            <p className="text-slate-700">{truncateText(result.summary)}</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-slate-200 rounded"></div>
            <div className="h-16 bg-slate-200 rounded"></div>
            <div className="h-16 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
        <History className="text-slate-600" size={24} />
        Recent History
      </h2>

      {history.length === 0 ? (
        <div className="text-center py-8">
          <History className="mx-auto text-slate-400 mb-4" size={48} />
          <p className="text-slate-600">No history yet</p>
          <p className="text-sm text-slate-500 mt-1">
            Your processed files will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => {
            const SkillIcon = getSkillIcon(item.skill);
            const skillColor = getSkillColor(item.skill);
            const isExpanded = expandedId === item.id;

            return (
              <div key={item.id} className="border border-slate-200 rounded-lg overflow-hidden">
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <SkillIcon className={skillColor} size={20} />
                      <div>
                        <p className="font-medium text-slate-900">{item.inputName}</p>
                        <p className="text-sm text-slate-500 flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(item.createdAt)}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      className={`text-slate-400 transition-transform ${
                        isExpanded ? 'transform rotate-90' : ''
                      }`}
                      size={16}
                    />
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-slate-100 bg-slate-50">
                    <div className="pt-4">
                      {renderResultPreview(item.skill, item.result)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}