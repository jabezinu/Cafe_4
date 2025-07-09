import React, { useState, useEffect } from 'react'
import { MdEmail, MdPhone, MdLocationOn, MdAccessTime } from 'react-icons/md';
import axios from 'axios'
import Footer from '../component/Footer';

const workingHours = [
  { day: 'Monday', hours: '8:30 AM – 7:30 PM' },
  { day: 'Tuesday', hours: '8:30 AM – 7:30 PM' },
  { day: 'Wednesday', hours: '8:30 AM – 7:30 PM' },
  { day: 'Thursday', hours: '8:30 AM – 7:30 PM' },
  { day: 'Friday', hours: '8:30 AM – 7:30 PM' },
  { day: 'Saturday', hours: '8:30 AM – 7:30 PM' },
  { day: 'Sunday', hours: '8:30 AM – 7:30 PM' },
];

const Contact = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [form, setForm] = useState({
    name: '',
    phone: '',
    comment: '',
    is_anonymous: false
  })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasCommentedToday, setHasCommentedToday] = useState(false);
  const [lastCommentTime, setLastCommentTime] = useState(null);

  useEffect(() => {
    const checkCommentRestriction = () => {
      const lastCommentDate = localStorage.getItem('lastCommentDate');
      const lastCommentTimestamp = localStorage.getItem('lastCommentTimestamp');
      const now = new Date();
      const today = now.toISOString().split('T')[0];

      if (lastCommentDate && lastCommentTimestamp) {
        const lastComment = new Date(parseInt(lastCommentTimestamp));
        const timeDiff = now - lastComment;
        const hoursDiff = timeDiff / (1000 * 60 * 60);

        if (lastCommentDate === today && hoursDiff < 24) {
          setHasCommentedToday(true);
          setLastCommentTime(lastComment);
        } else {
          // Clear storage if 24 hours have passed or it's a new day
          localStorage.removeItem('lastCommentDate');
          localStorage.removeItem('lastCommentTimestamp');
          setHasCommentedToday(false);
          setLastCommentTime(null);
        }
      }
    };

    checkCommentRestriction();
    // Add event listener to recheck on date change
    const interval = setInterval(checkCommentRestriction, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.is_anonymous) {
      if (!form.name.trim()) newErrors.name = 'Name is required.'
      if (!form.phone.trim()) newErrors.phone = 'Phone number is required.'
    }
    if (!form.comment.trim()) newErrors.comment = 'Comment is required.'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess('')
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setLoading(true)
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/comments`, {
        comment: {
          name: form.is_anonymous ? '' : form.name,
          phone_no: form.is_anonymous ? '' : form.phone,
          comment: form.comment,
          is_anonymous: form.is_anonymous
        }
      })
      setSuccess('Comment submitted successfully!')
      setForm({ name: '', phone: '', comment: '', is_anonymous: false })
      setErrors({})
      const now = new Date();
      localStorage.setItem('lastCommentDate', now.toISOString().split('T')[0]);
      localStorage.setItem('lastCommentTimestamp', now.getTime().toString());
      setHasCommentedToday(true);
      setLastCommentTime(now);
    } catch {
      setErrors({ submit: 'Failed to submit comment.' })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden">
      {/* Coffee Steam Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-t from-amber-200/40 to-transparent rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-20 right-20 w-24 h-24 bg-gradient-to-t from-orange-200/40 to-transparent rounded-full blur-2xl animate-pulse delay-700"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-t from-yellow-200/40 to-transparent rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-10 right-10 w-28 h-28 bg-gradient-to-t from-amber-300/40 to-transparent rounded-full blur-2xl animate-pulse delay-300"></div>
      </div>
      {/* Coffee Bean Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-3 h-6 bg-amber-800 rounded-full transform rotate-12 animate-bounce delay-500"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-4 bg-orange-800 rounded-full transform -rotate-12 animate-bounce delay-1000"></div>
        <div className="absolute bottom-1/3 left-1/3 w-2.5 h-5 bg-yellow-800 rounded-full transform rotate-45 animate-bounce delay-1500"></div>
        <div className="absolute bottom-1/4 right-1/4 w-2 h-4 bg-amber-900 rounded-full transform -rotate-45 animate-bounce delay-2000"></div>
      </div>
      <div className="relative z-10 min-h-screen px-4 py-8 sm:py-12 lg:py-20 pt-20 sm:pt-12 lg:pt-20">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-block mb-4 sm:mb-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-amber-900 via-orange-800 to-yellow-800 bg-clip-text text-transparent tracking-tight leading-none">
              Contact Us
            </h1>
            <div className="w-16 sm:w-24 lg:w-32 h-1 bg-gradient-to-r from-amber-600 to-orange-600 mx-auto mt-2 sm:mt-4 rounded-full"></div>
          </div>
          <p className="text-lg sm:text-xl text-amber-800 max-w-2xl mx-auto leading-relaxed px-4">
            Brewing connections, one conversation at a time. Let's chat over coffee!
          </p>
        </div>
        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12 lg:mb-16">
            {/* Contact Info */}
            <div className="space-y-4 sm:space-y-6 lg:space-y-8 order-2 lg:order-1">
              {/* Email Card */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-amber-200/50 shadow-xl hover:shadow-2xl hover:bg-white/90 transition-all duration-500 group">
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-3 sm:p-4 rounded-xl sm:rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <MdEmail size={24} className="text-white sm:w-8 sm:h-8" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-amber-900 mb-1 sm:mb-2">Email</h3>
                    <a href="mailto:contact@akakacoffee.com" className="text-amber-700 hover:text-amber-900 text-sm sm:text-lg font-medium transition-colors duration-300 break-all">
                      contact@akakacoffee.com
                    </a>
                  </div>
                </div>
              </div>
              {/* Phone Card */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-orange-200/50 shadow-xl hover:shadow-2xl hover:bg-white/90 transition-all duration-500 group">
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 sm:p-4 rounded-xl sm:rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <MdPhone size={24} className="text-white sm:w-8 sm:h-8" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-amber-900 mb-1 sm:mb-2">Phone</h3>
                    <a href="tel:+251903243174" className="text-amber-700 hover:text-amber-900 text-sm sm:text-lg font-medium transition-colors duration-300">
                      +251 903 243174
                    </a>
                  </div>
                </div>
              </div>
              {/* Location Card */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-yellow-200/50 shadow-xl hover:shadow-2xl hover:bg-white/90 transition-all duration-500 group">
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="bg-gradient-to-br from-yellow-500 to-amber-500 p-3 sm:p-4 rounded-xl sm:rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <MdLocationOn size={24} className="text-white sm:w-8 sm:h-8" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-amber-900 mb-1 sm:mb-2">Location</h3>
                    <span className="text-amber-700 text-sm sm:text-lg font-medium">Addis Ababa</span>
                  </div>
                </div>
              </div>
              {/* Working Hours Card */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-amber-200/50 shadow-xl hover:shadow-2xl hover:bg-white/90 transition-all duration-500 group">
                <div className="flex items-start gap-4 sm:gap-6">
                  <div className="bg-gradient-to-br from-amber-600 to-orange-600 p-3 sm:p-4 rounded-xl sm:rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <MdAccessTime size={24} className="text-white sm:w-8 sm:h-8" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-amber-900 mb-3 sm:mb-4">Working Hours</h3>
                    <div className="space-y-2 sm:space-y-3">
                      {workingHours.map(({ day, hours }) => (
                        <div key={day} className="flex justify-between items-center py-1 border-b border-amber-200/50 last:border-b-0">
                          <span className="text-amber-700 font-medium text-sm sm:text-base">{day}</span>
                          <span className="text-amber-600 text-xs sm:text-sm whitespace-nowrap ml-2">{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Map Section */}
            <div className="order-1 lg:order-2">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-6 border border-amber-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 group sticky top-4">
                <div className="w-full h-64 sm:h-80 lg:h-96 xl:h-[500px] rounded-xl sm:rounded-2xl overflow-hidden relative">
                  <iframe
                    title="location-map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3001.5061911848766!2d38.79584867501893!3d9.023665991037442!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85febe384a97%3A0xe4261d5ca58150c7!2sAkaka%20Coffee!5e1!3m2!1sen!2set!4v1751265774959!5m2!1sen!2set"
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-900/10 to-transparent pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>
          {/* CTA Section */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-amber-300/50 shadow-xl inline-block max-w-2xl mx-4 sm:mx-auto">
              <div className="mb-4 sm:mb-6">
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-2 sm:mb-4">☕</div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-900 mb-2 sm:mb-4">Love our coffee?</h2>
                <p className="text-amber-700 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6">Share your experience with fellow coffee lovers!</p>
              </div>
              <a
                href="https://maps.app.goo.gl/yctmZKAvD1j97bcH8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-5 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white font-bold text-sm sm:text-lg lg:text-xl rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-amber-500/25 hover:scale-105 transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span>Leave a Review on Google Maps</span>
                  <span className="text-lg sm:text-xl">⭐</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
            </div>
          </div>
          {/* Comment Section (with daily restriction and improved styling) */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-amber-200/50 shadow-xl max-w-6xl mx-auto">
            <div className="text-center mb-4 sm:mb-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-2">Share Your Thoughts</h3>
              <p className="text-amber-700 text-sm sm:text-base">We'd love to hear from our coffee community!</p>
            </div>
            <div className="max-w-md mx-auto mt-8">
              <h2 className="text-2xl font-bold mb-4">Leave a Comment</h2>
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
                    <input type="checkbox" id="is_anonymous" name="is_anonymous" checked={form.is_anonymous} onChange={handleChange} />
                    <label htmlFor="is_anonymous">Submit as Anonymous</label>
                  </div>
                  {!form.is_anonymous && (
                    <>
                      <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={form.name}
                        onChange={handleChange}
                        disabled={form.is_anonymous}
                        className={`border p-2 rounded w-full ${errors.name ? 'border-red-500' : ''}`}
                        required
                      />
                      <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        value={form.phone}
                        onChange={handleChange}
                        disabled={form.is_anonymous}
                        className={`border p-2 rounded w-full ${errors.phone ? 'border-red-500' : ''}`}
                        required
                      />
                    </>
                  )}
                  <textarea
                    name="comment"
                    placeholder="Your Comment"
                    value={form.comment}
                    onChange={handleChange}
                    className={`border p-2 rounded w-full ${errors.comment ? 'border-red-500' : ''}`}
                    required
                  />
                  <button
                    type="submit"
                    className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit'}
                  </button>
                  {errors.submit && <div className="text-red-500">{errors.submit}</div>}
                  {success && <div className="text-green-500">{success}</div>}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Contact