import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Users,
  UserCheck,
  Trash2,
  Plus,
  X,
  CheckCircle,
  AlertTriangle,
  UserPlus,
} from 'lucide-react';
import { Message, User, Student, Teacher } from '../types';

interface MessagingAppProps {
  currentUser: User;
  initialMessages: Message[];
  students?: Student[];
  teachers?: Teacher[];
  onSendMessage: (msg: Message) => Promise<Message>;
  onClearAllMessages?: () => Promise<void>;
  onDeleteMessage?: (id: string) => Promise<void>;
}

export const MessagingApp: React.FC<MessagingAppProps> = ({
  currentUser,
  initialMessages,
  students = [],
  teachers = [],
  onSendMessage,
  onClearAllMessages,
  onDeleteMessage,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [activeChannelId, setActiveChannelId] = useState<string>('group-block7');
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'demo' | 'connecting'>('connecting');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [customChannels, setCustomChannels] = useState<{ id: string; name: string; desc: string; isGroup: boolean }[]>([]);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync with prop changes
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // Connect to SSE stream for live updates
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/messages/stream');

      eventSource.onopen = () => {
        setConnectionStatus('connected');
      };

      eventSource.addEventListener('new_message', (event) => {
        try {
          const newMsg: Message = JSON.parse(event.data);
          if (newMsg.text === '__MESSAGES_CLEARED__') {
            setMessages([]);
            return;
          }
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        } catch {
          // ignore parsing error
        }
      });

      eventSource.onerror = () => {
        setConnectionStatus('demo');
      };
    } catch {
      setConnectionStatus('demo');
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChannelId]);

  // All available channels
  const allChannels = [
    {
      id: 'group-block7',
      name: 'PTP Block 7 Class Group Chat',
      desc: 'Grade 11 - PTP Block 7 official class channel',
      isGroup: true,
    },
    ...customChannels,
  ];

  const activeChannel = allChannels.find((c) => c.id === activeChannelId) || allChannels[0];
  const channelMessages = messages.filter((m) => m.channelId === activeChannelId);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    setIsSending(true);
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      channelId: activeChannelId,
      senderId: currentUser.id,
      senderName: currentUser.name + (currentUser.title ? ` (${currentUser.title})` : ''),
      senderRole: currentUser.role,
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatarColor: currentUser.avatar || '#1e40af',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    try {
      await onSendMessage(newMsg);
    } catch {
      // offline fallback
    } finally {
      setIsSending(false);
    }
  };

  const handleClearChat = async () => {
    setMessages([]);
    setConfirmClearOpen(false);
    if (onClearAllMessages) {
      await onClearAllMessages();
    }
  };

  const handleDeleteSingle = async (msgId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== msgId));
    if (onDeleteMessage) {
      await onDeleteMessage(msgId);
    }
  };

  const handleStartDirectChat = (recipientName: string, roleTitle: string) => {
    const channelId = `dm-${recipientName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    const exists = customChannels.some((c) => c.id === channelId);
    if (!exists) {
      setCustomChannels((prev) => [
        ...prev,
        {
          id: channelId,
          name: recipientName,
          desc: `Direct consultation with ${recipientName} (${roleTitle})`,
          isGroup: false,
        },
      ]);
    }
    setActiveChannelId(channelId);
    setShowNewChatModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-[#0f294a] text-white rounded-2xl p-6 sm:p-8 border border-blue-900 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/40 text-blue-200 text-xs font-semibold">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Real-Time Classroom Communications</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Grade 11 - PTP Block 7 Messages
            </h1>
            <p className="text-blue-200 text-xs sm:text-sm">
              Live discussion channels for classroom inquiries, teacher consultations, and section updates.
            </p>
          </div>

          {/* Action & Status Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                connectionStatus === 'connected'
                  ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-700'
                  : 'bg-amber-900/80 text-amber-200 border border-amber-700'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected'
                    ? 'bg-emerald-400 animate-pulse'
                    : 'bg-amber-400'
                }`}
              ></span>
              <span>
                {connectionStatus === 'connected'
                  ? 'Live Stream Active (SSE)'
                  : 'Demo Mode (Local Sync)'}
              </span>
            </div>

            <button
              onClick={() => setConfirmClearOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
              title="Clear all messages"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Messages</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Layout (Flexbox) */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col md:flex-row h-[620px]">
        {/* Left Channels Sidebar */}
        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50/50 flex flex-col shrink-0">
          <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#0f294a]">
                Channels
              </h3>
              <p className="text-[11px] text-gray-500">Official section chats</p>
            </div>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold cursor-pointer transition-colors"
              title="Start a direct chat with student or teacher"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Chat</span>
            </button>
          </div>

          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {allChannels.map((c) => {
              const isActive = c.id === activeChannelId;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveChannelId(c.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-start gap-3 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'hover:bg-gray-100 text-gray-800'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold ${
                      isActive
                        ? 'bg-blue-800 text-white'
                        : c.isGroup
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {c.isGroup ? <Users className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs truncate">{c.name}</span>
                    </div>
                    <p
                      className={`text-[11px] truncate mt-0.5 ${
                        isActive ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {c.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Current User Session Bar */}
          <div className="p-3 bg-white border-t border-gray-200 text-[11px] text-gray-500 flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <div
                className="w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0"
                style={{ backgroundColor: currentUser.avatar || '#1e40af' }}
              >
                {currentUser.name.charAt(0)}
              </div>
              <span className="truncate">
                Posting as <strong>{currentUser.name}</strong>
              </span>
            </div>
            <span className="capitalize px-1.5 py-0.2 rounded bg-gray-100 text-gray-700 font-bold shrink-0">
              {currentUser.role}
            </span>
          </div>
        </div>

        {/* Right Active Chat Pane */}
        <div className="flex-1 flex flex-col justify-between bg-white">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                {activeChannel.isGroup ? <Users className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#0f294a]">
                  {activeChannel.name}
                </h4>
                <p className="text-[11px] text-gray-500">
                  {activeChannel.desc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setConfirmClearOpen(true)}
                className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded font-medium flex items-center gap-1 cursor-pointer"
                title="Clear messages in this chat"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear Messages</span>
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gray-50/40">
            {channelMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 text-xs p-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-3">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-gray-700 text-sm mb-1">
                  No messages yet
                </h4>
                <p className="text-gray-500 max-w-sm mb-3">
                  All messages and chat history have been cleared. Be the first to start the conversation in {activeChannel.name}!
                </p>
                <div className="text-[11px] text-gray-400 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                  Type your message below and press Send.
                </div>
              </div>
            ) : (
              channelMessages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                const isTeacher = msg.senderRole === 'teacher';
                const isAdmin = msg.senderRole === 'admin';

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 group ${isMe ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    <div
                      className="w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-2xs"
                      style={{ backgroundColor: msg.avatarColor || '#1e40af' }}
                    >
                      {msg.senderName.charAt(0)}
                    </div>

                    {/* Bubble */}
                    <div className={`max-w-[78%] space-y-1 ${isMe ? 'items-end' : ''}`}>
                      <div className={`flex items-center gap-2 text-[11px] ${isMe ? 'justify-end' : ''}`}>
                        <span className="font-bold text-gray-800">
                          {msg.senderName}
                        </span>
                        {isTeacher && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                            Teacher
                          </span>
                        )}
                        {isAdmin && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                            Admin
                          </span>
                        )}
                        <span className="text-gray-400 text-[10px]">{msg.timestamp}</span>

                        {/* Delete Single Message Button */}
                        <button
                          onClick={() => handleDeleteSingle(msg.id)}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-0.5 cursor-pointer transition-opacity"
                          title="Delete message"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      <div
                        className={`p-3 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                          isMe
                            ? 'bg-blue-600 text-white rounded-tr-xs'
                            : 'bg-white border border-gray-200 text-gray-800 rounded-tl-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-gray-400 shrink-0">Quick reply:</span>
            {[
              "Good morning everyone!",
              'When is the CSS exam schedule?',
              'Confirmed for tomorrow.',
              'Thank you!',
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInputText(chip)}
                className="px-2.5 py-1 rounded-full bg-white border border-gray-200 hover:border-blue-300 text-gray-600 hover:text-blue-700 shrink-0 cursor-pointer transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Message Input Form */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-gray-200 bg-white flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Message ${activeChannel.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className="h-11 px-5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors min-w-[70px] justify-center"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>

      {/* Confirm Clear All Messages Modal */}
      {confirmClearOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-gray-200 animate-in fade-in">
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-base text-[#0f294a]">
                Clear All Messages?
              </h3>
            </div>
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              This will remove all messages from all users across the classroom channels. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setConfirmClearOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearChat}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold cursor-pointer"
              >
                Yes, Clear All Messages
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Start New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-base text-[#0f294a] flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                <span>Start Direct Message</span>
              </h3>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-3">
              Select a teacher or student to start a private one-to-one consultation channel:
            </p>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1 text-xs">
              <div className="font-bold text-gray-400 uppercase text-[10px] tracking-wider">
                Teachers &amp; Faculty:
              </div>
              {teachers.map((t) => (
                <div
                  key={t.id}
                  onClick={() => handleStartDirectChat(t.fullName, t.department)}
                  className="p-2.5 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50/30 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-lg text-white font-bold flex items-center justify-center text-xs"
                      style={{ backgroundColor: t.avatarColor || '#1d4ed8' }}
                    >
                      {t.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">{t.fullName}</div>
                      <div className="text-[10px] text-gray-500">{t.department}</div>
                    </div>
                  </div>
                  <span className="text-[11px] text-blue-600 font-semibold">Message →</span>
                </div>
              ))}

              <div className="font-bold text-gray-400 uppercase text-[10px] tracking-wider pt-2">
                Class Officers &amp; Students:
              </div>
              {students.slice(0, 8).map((s) => (
                <div
                  key={s.id}
                  onClick={() => handleStartDirectChat(s.fullName, s.officerRole || 'Student')}
                  className="p-2.5 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50/30 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-full text-white font-bold flex items-center justify-center text-xs"
                      style={{ backgroundColor: s.avatarColor || '#3b82f6' }}
                    >
                      {s.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">{s.fullName}</div>
                      <div className="text-[10px] text-gray-500">{s.officerRole || 'Student'}</div>
                    </div>
                  </div>
                  <span className="text-[11px] text-blue-600 font-semibold">Message →</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowNewChatModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
