import React from 'react';
import { Shield, Sparkles, CheckCircle, Info } from 'lucide-react';
import { SchoolInfo } from '../types';

interface FooterProps {
  schoolInfo: SchoolInfo;
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ schoolInfo, onNavigate }) => {
  return (
    <footer className="bg-[#0a1b30] text-gray-300 border-t border-blue-950 mt-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Col 1: School Identity */}
          <div className="flex-1 max-w-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded bg-blue-700 flex items-center justify-center font-bold text-white text-base">
                P7
              </div>
              <div>
                <h3 className="font-bold text-white text-base leading-tight">
                  {schoolInfo.gradeLevel} - {schoolInfo.programStrand} {schoolInfo.section}
                </h3>
                <p className="text-xs text-blue-300">{schoolInfo.schoolName}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-3 italic">
              &quot;{schoolInfo.motto}&quot;
            </p>
            <div className="text-xs text-gray-400 space-y-1">
              <div><strong className="text-gray-300">Term:</strong> {schoolInfo.term} ({schoolInfo.schoolYear})</div>
              <div><strong className="text-gray-300">Class Adviser:</strong> {schoolInfo.adviser}</div>
              <div><strong className="text-gray-300">Homeroom:</strong> {schoolInfo.roomNumber}</div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="flex-1">
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider text-blue-300">
              Quick Directory
            </h4>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
              <button onClick={() => onNavigate('dashboard')} className="hover:text-blue-300 cursor-pointer">
                Home Dashboard
              </button>
              <button onClick={() => onNavigate('section')} className="hover:text-blue-300 cursor-pointer">
                Section Overview
              </button>
              <button onClick={() => onNavigate('schedule')} className="hover:text-blue-300 cursor-pointer">
                Class Schedule
              </button>
              <button onClick={() => onNavigate('students')} className="hover:text-blue-300 cursor-pointer">
                Student Directory
              </button>
              <button onClick={() => onNavigate('teachers')} className="hover:text-blue-300 cursor-pointer">
                Teacher Directory
              </button>
              <button onClick={() => onNavigate('subjects')} className="hover:text-blue-300 cursor-pointer">
                Subjects List
              </button>
              <button onClick={() => onNavigate('map')} className="hover:text-blue-300 cursor-pointer">
                School Map
              </button>
              <button onClick={() => onNavigate('messages')} className="hover:text-blue-300 cursor-pointer">
                Class Messages
              </button>
              <button onClick={() => onNavigate('announcements')} className="hover:text-blue-300 cursor-pointer">
                Announcements
              </button>
            </div>
          </div>

          {/* Col 3: Privacy & Standards */}
          <div className="flex-1 max-w-sm">
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Data Protection & Standards</span>
            </h4>
            <div className="bg-[#0f243e] p-3 rounded-lg text-xs text-gray-300 border border-blue-900/60 space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <p>
                  Student identification numbers and private contact channels are masked for unauthorized viewers.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <p>
                  Built with CSS Flexbox &amp; readable tables for universal responsiveness.
                  <span className="block mt-1 text-[11px] text-gray-400 italic">
                    Note: Target compatibility for legacy iOS 9.3.5 / iPad mini 2 is intentional, but requires physical device verification.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-950 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-3">
          <div>
            © {new Date().getFullYear()} Grade 11 - PTP Block 7 Portal. Designed for educational classroom use.
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>System Status: Online &amp; Synchronized</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
