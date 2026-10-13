import React, { useState } from 'react';
import {
  Bell,
  Search,
  Plus,
  Calendar,
  User,
  Paperclip,
  Trash2,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  Tag,
} from 'lucide-react';
import { Announcement, User as UserType } from '../types';

interface AnnouncementsViewProps {
  announcements: Announcement[];
  currentUser: UserType;
  onAddAnnouncement: (ann: Announcement) => void;
  onDeleteAnnouncement: (id: string) => void;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({
  announcements,
  currentUser,
  onAddAnnouncement,
  onDeleteAnnouncement,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [modalOpen, setModalOpen] = useState(false);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<Announcement['category']>('Class Reminder');
  const [formPriority, setFormPriority] = useState<Announcement['priority']>('Normal');
  const [formContent, setFormContent] = useState('');
  const [formAttachment, setFormAttachment] = useState('');

  const categories = [
    'All',
    'Exam Notice',
    'Assignment',
    'Schedule Change',
    'Class Reminder',
    'School Activity',
  ];

  const filtered = announcements.filter((ann) => {
    const matchSearch =
      ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ann.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ann.author.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchSearch) return false;
    if (selectedCategory !== 'All' && ann.category !== selectedCategory) return false;
    return true;
  });

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: formTitle,
      category: formCategory,
      priority: formPriority,
      content: formContent,
      author: currentUser.name,
      authorRole: currentUser.title || (currentUser.role === 'admin' ? 'Administrator' : 'Faculty Member'),
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: '2-digit',
        year: 'numeric',
      }),
      attachmentName: formAttachment.trim() || undefined,
    };
    onAddAnnouncement(newAnn);
    setFormTitle('');
    setFormContent('');
    setFormAttachment('');
    setModalOpen(false);
  };

  const isPresident =
    currentUser.title?.toLowerCase().includes('president') ||
    currentUser.officerRole?.toLowerCase().includes('president') ||
    currentUser.name.toLowerCase().includes('bautista');

  const canPublish = currentUser.role === 'teacher' || currentUser.role === 'admin' || isPresident;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-[#0f294a] text-white rounded-2xl p-6 sm:p-8 border border-blue-900 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/40 text-blue-200 text-xs font-semibold">
              <Bell className="w-3.5 h-3.5" />
              <span>Section Bulletin Board</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Grade 11 - PTP Block 7 Announcements
            </h1>
            <p className="text-blue-200 text-xs sm:text-sm">
              Official circulars, laboratory assessments, exam notices, and homeroom reminders.
            </p>
          </div>

          {canPublish && (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-lg shadow cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Announcement</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-3 text-xs">
        {/* Category Chips */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center justify-between gap-4 pt-2 border-t border-gray-100">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search announcements by keywords or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>
          <div className="text-gray-500 font-medium">
            Showing <strong>{filtered.length}</strong> announcements
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 text-gray-400 text-xs">
            <Bell className="w-10 h-10 mx-auto text-gray-300 mb-2" />
            <p>No announcements match your search or filter.</p>
          </div>
        ) : (
          filtered.map((ann) => {
            const isHigh = ann.priority === 'High';
            return (
              <div
                key={ann.id}
                className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-xs transition-all ${
                  isHigh ? 'border-amber-300 bg-amber-50/10' : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        ann.category === 'Exam Notice'
                          ? 'bg-rose-100 text-rose-700'
                          : ann.category === 'Assignment'
                          ? 'bg-amber-100 text-amber-700'
                          : ann.category === 'Schedule Change'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {ann.category}
                    </span>
                    {isHigh && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white">
                        Urgent / Important
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>{ann.date}</span>
                  </span>
                </div>

                <h3 className="font-bold text-base sm:text-lg text-[#0f294a] mb-2 leading-tight">
                  {ann.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line mb-4">
                  {ann.content}
                </p>

                {/* Optional Attachment */}
                {ann.attachmentName && (
                  <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-mono border border-gray-200 cursor-pointer">
                    <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                    <span>Attached Document: {ann.attachmentName}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-400">Published by:</span>
                    <strong className="text-gray-800">{ann.author}</strong>
                    <span className="text-blue-700">({ann.authorRole})</span>
                  </div>

                  {canPublish && (
                    <button
                      onClick={() => onDeleteAnnouncement(ann.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 cursor-pointer flex items-center gap-1"
                      title="Delete Announcement"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Delete</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Publish Announcement Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border border-gray-200 animate-in fade-in">
            <h3 className="text-lg font-bold text-[#0f294a] mb-1 flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <span>Publish Section Announcement</span>
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Post circulars, exam schedules, or homework assignments for Grade 11 - PTP Block 7.
            </p>

            <form onSubmit={handlePublish} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Announcement Title</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. CSS Hands-on Practical Examination Schedule"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  >
                    <option value="Class Reminder">Class Reminder</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Exam Notice">Exam Notice</option>
                    <option value="Schedule Change">Schedule Change</option>
                    <option value="School Activity">School Activity</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Priority Level</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High / Urgent</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Message Content</label>
                <textarea
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  rows={4}
                  placeholder="Full text of the announcement..."
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Attachment File Name (Optional)</label>
                <input
                  type="text"
                  value={formAttachment}
                  onChange={(e) => setFormAttachment(e.target.value)}
                  placeholder="e.g. CSS_Laboratory_Guide_Term2.pdf"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs cursor-pointer"
                >
                  Post Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
