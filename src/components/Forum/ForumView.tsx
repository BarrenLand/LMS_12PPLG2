import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import {
  MessageSquare,
  Plus,
  Pin,
  Send,
  Trash2,
  MessageCircle,
  Clock,
  Sparkles,
  User,
} from 'lucide-react';

export const ForumView: React.FC = () => {
  const {
    currentUser,
    classes,
    forumPosts,
    users,
    addForumPost,
    deleteForumPost,
    addForumComment,
  } = useLms();

  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [showPostModal, setShowPostModal] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [targetClassId, setTargetClassId] = useState(classes[0]?.id || '');
  const [isPinned, setIsPinned] = useState(false);

  // Comment input per post state
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});

  const filteredPosts = forumPosts.filter((p) =>
    selectedClassId === 'all' ? true : p.classId === selectedClassId
  );

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim() || !targetClassId) return;

    addForumPost(postTitle, postContent, targetClassId, isPinned);
    setPostTitle('');
    setPostContent('');
    setShowPostModal(false);
  };

  const handleSendComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    addForumComment(postId, text.trim());
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="space-y-8">
      {/* Forum Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-400/30 mb-3">
              <MessageSquare className="w-3.5 h-3.5" /> Class Discussion Forums
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Community & Academic Discussions
            </h1>
            <p className="mt-2 text-slate-300 text-sm max-w-2xl leading-relaxed">
              Ask questions, discuss Golang coding concepts, share learning resources, and receive guidance from course teachers.
            </p>
          </div>

          <button
            onClick={() => setShowPostModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-lg shadow-purple-500/30 transition shrink-0"
          >
            <Plus className="w-4 h-4" /> Start Discussion Thread
          </button>
        </div>

        {/* Filter by class */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedClassId('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedClassId === 'all'
                ? 'bg-purple-500 text-white shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-slate-200'
            }`}
          >
            All Forum Threads
          </button>
          {classes.map((cls) => (
            <button
              key={cls.id}
              onClick={() => setSelectedClassId(cls.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                selectedClassId === cls.id
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200'
              }`}
            >
              <span className="font-mono text-[11px] opacity-80">{cls.code}</span>
              <span>{cls.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Forum Thread List */}
      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8">
            <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No Discussions Started Yet
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Be the first to post a question or announcement for your classmates!
            </p>
            <button
              onClick={() => setShowPostModal(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold"
            >
              Start New Thread
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const author = users.find((u) => u.id === post.authorId);
            const classObj = classes.find((c) => c.id === post.classId);

            return (
              <div
                key={post.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl border transition shadow-sm p-6 space-y-4 ${
                  post.isPinned
                    ? 'border-purple-300 dark:border-purple-800 ring-1 ring-purple-500/20 bg-purple-50/30 dark:bg-purple-950/20'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Thread Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        author?.avatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                      }
                      alt=""
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/20"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {author?.name || 'User'}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                            author?.role === 'teacher'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : author?.role === 'admin'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          }`}
                        >
                          {author?.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Posted in <strong className="text-slate-600 dark:text-slate-300">{classObj?.code || 'Class'}</strong> • {new Date(post.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {post.isPinned && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800">
                        <Pin className="w-3.5 h-3.5" /> Pinned Thread
                      </span>
                    )}

                    {(currentUser.id === post.authorId || currentUser.role === 'admin') && (
                      <button
                        onClick={() => deleteForumPost(post.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Thread Body */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 whitespace-pre-line leading-relaxed">
                    {post.content}
                  </p>
                </div>

                {/* Comments Section */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <span>Replies ({post.comments?.length || 0})</span>
                  </div>

                  <div className="space-y-3 pl-2 sm:pl-4 border-l-2 border-slate-200 dark:border-slate-800">
                    {post.comments?.map((comment) => {
                      const cAuthor = users.find((u) => u.id === comment.authorId);
                      return (
                        <div
                          key={comment.id}
                          className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img
                                src={
                                  cAuthor?.avatar ||
                                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                                }
                                alt=""
                                className="w-5 h-5 rounded-full object-cover"
                              />
                              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                {cAuthor?.name}
                              </span>
                              <span className="text-[10px] text-slate-400 capitalize">
                                ({cAuthor?.role})
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400">
                              {new Date(comment.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 dark:text-slate-200 pl-7">
                            {comment.content}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add Reply Form */}
                  <div className="flex items-center gap-2 pt-2">
                    <img
                      src={currentUser.avatar}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover shrink-0"
                    />
                    <input
                      type="text"
                      placeholder="Write a comment or ask a question..."
                      value={commentInputs[post.id] || ''}
                      onChange={(e) =>
                        setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendComment(post.id);
                      }}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      onClick={() => handleSendComment(post.id)}
                      className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-sm shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CREATE THREAD MODAL */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Start New Forum Thread
              </h3>
              <button
                onClick={() => setShowPostModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Class
                </label>
                <select
                  value={targetClassId}
                  onChange={(e) => setTargetClassId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      [{cls.code}] {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Thread Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How to handle channel deadlocks in Go worker pools?"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Content & Details
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide context or your code snippet question..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {(currentUser.role === 'teacher' || currentUser.role === 'admin') && (
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Pin thread to top of class forum
                  </span>
                </label>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20"
                >
                  Publish Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
