import React, { useState } from 'react'

const FormSection = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formMessage, setFormMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormMessage(null)

    try {
      const response = await fetch('https://formspree.io/f/xyzjeqkg', {
        method: 'POST',
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          company: formData.company,
          message: formData.message
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setFormMessage({
          text: "Thank you for joining the waitlist! We'll be in touch soon.",
          type: 'success'
        })
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          company: '',
          message: ''
        })
      } else {
        throw new Error('Form submission failed')
      }
    } catch {
      setFormMessage({
        text: 'Sorry, there was an error submitting your form. Please try again.',
        type: 'error'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Join the Waitlist for Early Access to ELM
          </h2>
          <p className="text-gray-600">
            Ready to revolutionize your energy strategy?
          </p>
        </div>

        {/* Form Card */}
        <div className="relative rounded-2xl p-[2px] overflow-hidden shadow-[0_10px_15px_rgba(0,0,0,0.1)] ">
          
          {/* Form content */}
          <div className="relative bg-white rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Form Message */}
              {formMessage && (
                <div
                  className={`p-4 rounded-lg text-center font-medium ${
                    formMessage.type === 'success'
                      ? 'bg-green-50 border border-green-300 text-green-600'
                      : 'bg-red-50 border border-red-300 text-red-600'
                  }`}
                >
                  {formMessage.text}
                </div>
              )}

              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-400 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[var(--purple)] focus:ring-1 focus:ring-[var(--purple)] transition-colors"
                />
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-400 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[var(--purple)] focus:ring-1 focus:ring-[var(--purple)] transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-400 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[var(--purple)] focus:ring-1 focus:ring-[var(--purple)] transition-colors"
                />
              </div>

              {/* Company */}
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-400 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[var(--purple)] focus:ring-1 focus:ring-[var(--purple)] transition-colors"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us what you are most excited to use ELM for."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-400 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[var(--purple)] focus:ring-1 focus:ring-[var(--purple)] transition-colors resize-y"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 bg-[var(--purple)] rounded-lg text-white font-semibold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Join Waitlist'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormSection