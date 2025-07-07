import React, { useState } from 'react'
import axios from 'axios'

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
    } catch {
      setErrors({ submit: 'Failed to submit comment.' })
    }
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Leave a Comment</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="is_anonymous"
            name="is_anonymous"
            checked={form.is_anonymous}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="is_anonymous">Submit as Anonymous</label>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            disabled={form.is_anonymous}
            className={`border p-2 w-full rounded ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Your Name"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            disabled={form.is_anonymous}
            className={`border p-2 w-full rounded ${errors.phone ? 'border-red-500' : ''}`}
            placeholder="Your Phone Number"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Comment <span className="text-red-500">*</span></label>
          <textarea
            name="comment"
            value={form.comment}
            onChange={handleChange}
            className={`border p-2 w-full rounded ${errors.comment ? 'border-red-500' : ''}`}
            placeholder="Your Comment"
            rows={4}
            required
          />
        </div>
        {errors.submit && <div className="text-red-500 mb-2">{errors.submit}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Comment'}
        </button>
      </form>
    </div>
  )
}

export default Contact
