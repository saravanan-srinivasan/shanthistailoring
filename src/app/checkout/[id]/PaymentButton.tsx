'use client';
import { useState } from 'react';

export default function PaymentButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/payment/phonepe/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId }),
      });
      
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Payment initiation failed. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handlePayment} 
      disabled={loading}
      className="w-full bg-[#C9A84C] text-black py-4 px-6 uppercase tracking-widest text-sm font-medium hover:bg-[#D4B661] transition-colors disabled:opacity-50"
    >
      {loading ? 'Processing...' : 'Pay via UPI'}
    </button>
  );
}
