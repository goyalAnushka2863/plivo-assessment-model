import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { AuthForm } from './components/AuthForm';
import { SkillSelector } from './components/SkillSelector';
import { ConversationAnalysis } from './components/skills/ConversationAnalysis';
import { ImageAnalysis } from './components/skills/ImageAnalysis';
import { DocumentSummarization } from './components/skills/DocumentSummarization';
import { HistoryPanel } from './components/HistoryPanel';
import { SKILL_TYPES } from './types';
import { LogOut, Brain, User } from 'lucide-react';

function App() {
  const { user, loading, signIn, signUp, signOut } = useAuth();
  const [selectedSkill, setSelectedSkill] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Brain className="text-white animate-pulse" size={32} />
          </div>
          <p className="text-slate-600">Loading AI Playground...</p>
        </div>
      </div>
    );
  }

  // if (!user) {
  //   return <AuthForm onSignIn={signIn} onSignUp={signUp} />;
  // }

  const renderSkillComponent = () => {
    switch (selectedSkill) {
      case SKILL_TYPES.CONVERSATION:
        return <ConversationAnalysis />;
      case SKILL_TYPES.IMAGE:
        return <ImageAnalysis />;
      case SKILL_TYPES.SUMMARIZATION:
        return <DocumentSummarization />;
      default:
        return (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <Brain className="mx-auto text-slate-400 mb-6" size={64} />
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Welcome to AI Playground</h3>
            <p className="text-slate-600 mb-6">
              Select a skill from the dropdown above to get started with AI-powered analysis
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900">Conversation Analysis</h4>
                <p className="text-sm text-blue-700 mt-1">Speech-to-text, diarization & summarization</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-900">Image Analysis</h4>
                <p className="text-sm text-purple-700 mt-1">Detailed image descriptions & tagging</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900">Document Summary</h4>
                <p className="text-sm text-green-700 mt-1">PDF, DOC & URL content summarization</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-bold text-slate-900">AI Playground</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  showHistory
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                History
              </button>
              <div className="flex items-center gap-2 text-slate-700">
                <User size={16} />
                <span className="text-sm">{user?.email || 'Demo User'}</span>
              </div>
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className={`${showHistory ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-6`}>
            <SkillSelector selectedSkill={selectedSkill} onSkillSelect={setSelectedSkill} />
            {renderSkillComponent()}
          </div>
          
          {showHistory && (
            <div className="lg:col-span-1">
              <HistoryPanel />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;