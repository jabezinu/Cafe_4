import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const CommentSection = () => {
  const [form, setForm] = useState({ name: '', phone: '', comment: '', anonymous: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasCommentedToday, setHasCommentedToday] = useState(false);
  const [lastCommentTime, setLastCommentTime] = useState(null);

  // Check if user has already commented today
  useEffect(() => {
    const lastCommentDate = localStorage.getItem('lastCommentDate');
    const lastCommentTimestamp = localStorage.getItem('lastCommentTimestamp');
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // Get YYYY-MM-DD format
    
    if (lastCommentDate === today && lastCommentTimestamp) {
      const lastComment = new Date(parseInt(lastCommentTimestamp));
      const timeDiff = now - lastComment;
      const hoursDiff = timeDiff / (1000 * 60 * 60); // Convert to hours
      
      if (hoursDiff < 24) {
        setHasCommentedToday(true);
        setLastCommentTime(lastComment);
      } else {
        // Clear old comment data if it's been more than 24 hours
        localStorage.removeItem('lastCommentDate');
        localStorage.removeItem('lastCommentTimestamp');
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Prepare data to match backend expectations
      const payload = {
        comment: {
          name: form.name,
          phone_no: form.phone,
          comment: form.comment,
          is_anonymous: form.anonymous,
        }
      };
      await axios.post(`${BACKEND_URL}/comments`, payload);
      setSuccess('Comment submitted successfully! Thank you for your feedback.');
      setForm({ name: '', phone: '', comment: '', anonymous: false });
      // Store the current timestamp and date in localStorage
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      localStorage.setItem('lastCommentDate', today);
      localStorage.setItem('lastCommentTimestamp', now.getTime().toString());
      setLastCommentTime(now);
      setHasCommentedToday(true);
    } catch (err) {
      setError(err.response?.data?.errors?.[0] || err.response?.data?.message || 'Failed to submit comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-8">
      <h2 className="text-xl font-bold mb-4">Leave a Comment</h2>
      {hasCommentedToday ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded shadow">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You've already submitted a comment today.</p>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded shadow">
          <div className="flex items-center space-x-2">
            <input type="checkbox" name="anonymous" checked={form.anonymous} onChange={handleChange} />
            <label>Submit as anonymous</label>
          </div>
          {!form.anonymous && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
            </>
          )}
          <textarea
            name="comment"
            placeholder="Your Comment"
            value={form.comment}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
          <button
            type="submit"
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
          {error && <div className="text-red-500">{error}</div>}
          {success && <div className="text-green-500">{success}</div>}
        </form>
      )}
    </div>
  );
};

export default CommentSection;
