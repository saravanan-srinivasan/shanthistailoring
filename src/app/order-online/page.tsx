'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, ChevronRight, UploadCloud } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

const GARMENTS = ['Saree Blouse', 'Bridal Lehenga', 'Chudidhar / Salwar', 'Kids Wear', 'Custom Fusion']

export default function OrderOnlinePage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const supabase = createClient()

  // Form State
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    garment_type: 'Saree Blouse',
    fabric_choice: 'I will courier my own fabric',
    notes: '',
    measurements: {
      bust: '',
      waist: '',
      shoulder: '',
      armhole: '',
      length: ''
    },
    reference_images: [] as string[]
  })

  const handleNext = () => setStep(prev => prev + 1)
  const handleBack = () => setStep(prev => prev - 1)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploadingImage(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`

    const { error: uploadError } = await supabase.storage.from('order_references').upload(fileName, file)
    if (uploadError) {
      alert('Error uploading image: ' + uploadError.message)
      setUploadingImage(false)
      return
    }

    const { data } = supabase.storage.from('order_references').getPublicUrl(fileName)
    setFormData(prev => ({ ...prev, reference_images: [...prev.reference_images, data.publicUrl] }))
    setUploadingImage(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        alert("Error submitting order: " + (data.error || "Unknown error"))
      } else {
        setSuccess(true)
      }
    } catch (error: any) {
      alert("Error submitting order: " + error.message)
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 text-center">
        <CheckCircle2 size={64} className="text-[#C9A84C] mb-6" />
        <h1 className="text-4xl text-white font-light mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Measurements Received</h1>
        <p className="text-white/60 max-w-md mx-auto leading-relaxed mb-8">
          Thank you, {formData.customer_name}! Our master tailors are reviewing your profile. We will email you a custom quotation shortly.
        </p>
        <button onClick={() => window.location.href = '/'} className="btn-gold">Return Home</button>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] pt-32 pb-24">
      <div className="max-w-2xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[#C9A84C] text-[10px] tracking-[0.3em] uppercase mb-3">Phase 1 Stealth Mode</p>
          <h1 className="text-4xl md:text-5xl text-white font-light mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Remote Tailoring
          </h1>
          <p className="text-white/50 text-sm font-light">Build your custom garment from the comfort of your home.</p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-1 rounded-full ${step >= s ? 'bg-[#C9A84C]' : 'bg-white/10'}`} />
            </div>
          ))}
        </div>

        <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="bg-white/5 border border-white/10 p-6 md:p-10">
          
          {/* STEP 1: GARMENT DETAILS */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-2xl text-white mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>1. Design & Fabric</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">What are we making?</label>
                  <select 
                    value={formData.garment_type}
                    onChange={(e) => setFormData({...formData, garment_type: e.target.value})}
                    className="w-full bg-[#1A1A1A] border border-white/10 p-4 text-white outline-none focus:border-[#C9A84C]"
                  >
                    {GARMENTS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Fabric Choice</label>
                  <select 
                    value={formData.fabric_choice}
                    onChange={(e) => setFormData({...formData, fabric_choice: e.target.value})}
                    className="w-full bg-[#1A1A1A] border border-white/10 p-4 text-white outline-none focus:border-[#C9A84C]"
                  >
                    <option value="I will courier my own fabric">I will courier my own fabric to Chennai</option>
                    <option value="Use fabric from Boutique Catalog">Use fabric from Boutique Catalog</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Upload Reference Image (Optional)</label>
                  <label className={`block border-2 border-dashed ${uploadingImage ? 'border-[#C9A84C] bg-[#C9A84C]/10' : 'border-white/10 bg-white/5 hover:bg-white/10'} p-8 text-center cursor-pointer transition-colors`}>
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} className="hidden" />
                    <UploadCloud className={`mx-auto mb-2 ${uploadingImage ? 'text-[#C9A84C] animate-pulse' : 'text-white/50'}`} />
                    <p className="text-sm text-white/80">{uploadingImage ? 'Uploading...' : 'Click to upload your design inspiration'}</p>
                  </label>
                  {formData.reference_images.length > 0 && (
                    <div className="flex gap-2 mt-4 flex-wrap">
                      {formData.reference_images.map((img, idx) => (
                        <div key={idx} className="relative w-16 h-16 bg-[#1A1A1A] border border-white/20">
                          <img src={img} alt="Ref" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: MEASUREMENTS */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-2xl text-white mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>2. Your Measurements (Inches)</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(formData.measurements).map((key) => (
                  <div key={key}>
                    <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">{key}</label>
                    <input
                      type="number"
                      required
                      value={formData.measurements[key as keyof typeof formData.measurements]}
                      onChange={(e) => setFormData({
                        ...formData,
                        measurements: { ...formData.measurements, [key]: e.target.value }
                      })}
                      className="w-full bg-[#1A1A1A] border border-white/10 p-4 text-white outline-none focus:border-[#C9A84C]"
                      placeholder='e.g. 34'
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: CONTACT INFO */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-2xl text-white mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>3. Contact Details</h2>
              <div className="space-y-4">
                <input
                  type="text" required placeholder="Full Name"
                  value={formData.customer_name} onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                  className="w-full bg-[#1A1A1A] border border-white/10 p-4 text-white outline-none focus:border-[#C9A84C]"
                />
                <input
                  type="email" required placeholder="Email Address"
                  value={formData.customer_email} onChange={(e) => setFormData({...formData, customer_email: e.target.value})}
                  className="w-full bg-[#1A1A1A] border border-white/10 p-4 text-white outline-none focus:border-[#C9A84C]"
                />
                <input
                  type="tel" required placeholder="Phone / WhatsApp"
                  value={formData.customer_phone} onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
                  className="w-full bg-[#1A1A1A] border border-white/10 p-4 text-white outline-none focus:border-[#C9A84C]"
                />
              </div>
            </motion.div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 mt-10">
            {step > 1 && (
              <button type="button" onClick={handleBack} className="px-6 py-3 border border-white/20 text-white hover:bg-white/5 transition-colors uppercase tracking-widest text-xs font-medium">
                Back
              </button>
            )}
            <button type="submit" disabled={loading} className="flex-1 bg-[#C9A84C] text-black py-3 px-6 uppercase tracking-widest text-xs font-medium hover:bg-[#E8C97A] transition-colors flex items-center justify-center gap-2">
              {loading ? 'Processing...' : step === 3 ? 'Submit Request' : 'Next Step'}
              {step < 3 && <ChevronRight size={16} />}
            </button>
          </div>

        </form>
      </div>
    </main>
  )
}
