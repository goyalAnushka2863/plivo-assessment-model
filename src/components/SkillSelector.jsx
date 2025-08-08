import React from 'react';
import { MessageSquare, Image, FileText, ChevronDown } from 'lucide-react';
import { SKILL_TYPES } from '../types';

const skills = [
  {
    id: SKILL_TYPES.CONVERSATION,
    name: 'Conversation Analysis',
    description: 'Upload audio files for speech-to-text, diarization, and summarization',
    icon: MessageSquare,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    id: SKILL_TYPES.IMAGE,
    name: 'Image Analysis', 
    description: 'Upload images to generate detailed textual descriptions',
    icon: Image,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    id: SKILL_TYPES.SUMMARIZATION,
    name: 'Document Summarization',
    description: 'Upload documents or provide URLs for content summarization',
    icon: FileText,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  }
];

export function SkillSelector({ selectedSkill, onSkillSelect }) {
  const selectedSkillData = skills.find(skill => skill.id === selectedSkill);

  return (
    <div className="relative">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-1">
        <div className="relative">
          <select
            value={selectedSkill}
            onChange={(e) => onSkillSelect(e.target.value)}
            className="w-full appearance-none bg-transparent p-4 pr-12 text-lg font-medium text-slate-900 cursor-pointer focus:outline-none"
          >
            <option value="">Select an AI Skill</option>
            {skills.map(skill => (
              <option key={skill.id} value={skill.id}>
                {skill.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
        </div>
      </div>

      {selectedSkillData && (
        <div className="mt-4 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${selectedSkillData.bgColor}`}>
              <selectedSkillData.icon className={`${selectedSkillData.color}`} size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900">{selectedSkillData.name}</h3>
              <p className="text-slate-600 mt-1">{selectedSkillData.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}