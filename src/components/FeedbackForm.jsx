import { useState } from 'react';
import { MessageSquare, X, Send, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const FeedbackForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    painPoint: '',
    usefulness: '3',
    missingFeature: '',
    willingnessToPay: '',
    email: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Insert data into Supabase
      const { error } = await supabase
        .from('feedback')
        .insert([
          { 
            pain_point: formData.painPoint,
            usefulness: parseInt(formData.usefulness),
            missing_feature: formData.missingFeature,
            willingness_to_pay: formData.willingnessToPay,
            email: formData.email
          }
        ]);

      if (error) throw error;

      setIsSubmitted(true);
      
      // Auto-close and reset after 3 seconds
      setTimeout(() => {
        setIsOpen(false);
        setIsSubmitted(false);
        setFormData({ painPoint: '', usefulness: '3', missingFeature: '', willingnessToPay: '', email: '' });
      }, 3000);

    } catch (error) {
      console.error("Error saving feedback:", error.message);
      alert("Something went wrong saving your feedback. Please try again.");
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        // Changed: Smaller padding (p-3), smaller icon (w-5 h-5), and removed text
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-xl hover:bg-blue-700 hover:scale-110 transition-all z-[1001] flex items-center justify-center group"
        aria-label="Leave Feedback"
      >
        <MessageSquare className="w-5 h-5" />
        
        {/* Tooltip: Only shows when they hover over the icon */}
        <span className="absolute right-full mr-3 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity font-bold uppercase tracking-widest shadow-lg">
          Leave Feedback
        </span>
      </button>

      {/* Slide-over Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-slide-in-right">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">Prototype Feedback</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-900">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex-1 overflow-y-auto">
              {isSubmitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-green-500" />
                  <h3 className="text-2xl font-bold text-gray-900">Thank You!</h3>
                  <p className="text-gray-500">Your insights will shape the future of MineralChain AI.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 text-left">
                  
                  {/* Q1: Pain Points */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">1. What is your biggest pain point when shipments are delayed?</label>
                    <textarea 
                      required
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                      rows="3"
                      placeholder="e.g., Calling 10 different people to find out why..."
                      value={formData.painPoint}
                      onChange={(e) => setFormData({...formData, painPoint: e.target.value})}
                    />
                  </div>

                  {/* Q2: Usefulness */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">2. Rate the usefulness of this platform (1-5)</label>
                    <input 
                      type="range" min="1" max="5" 
                      className="w-full accent-blue-600"
                      value={formData.usefulness}
                      onChange={(e) => setFormData({...formData, usefulness: e.target.value})}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1 font-bold">
                      <span>1 (Not useful)</span>
                      <span>Score: {formData.usefulness}</span>
                      <span>5 (Critical)</span>
                    </div>
                  </div>

                  {/* Q3: Missing Feature */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">3. What critical data or feature is missing for you?</label>
                    <input 
                      type="text" required
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g., Integration with SAP..."
                      value={formData.missingFeature}
                      onChange={(e) => setFormData({...formData, missingFeature: e.target.value})}
                    />
                  </div>

                  {/* Q4: Value Perception & Budget - Source [101, 102] */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      4. How would your organization value a tool like this (e.g., monthly budget or ROI)?
                    </label>
                    <textarea 
                      required
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                      rows="2"
                      placeholder="e.g., We would pay based on successful re-sourcing events..."
                      value={formData.willingnessToPay}
                      onChange={(e) => setFormData({...formData, willingnessToPay: e.target.value})}
                    />
                    <p className="text-[10px] text-gray-400 mt-1 italic">
                      *Note: Helps us understand if this replaces a headcount cost or a software budget. 
                    </p>
                  </div>

                  {/* Q5: Follow-up */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">5. Email (for early pilot access)</label>
                    <input 
                      type="email" required
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <button type="submit" className="w-full bg-gray-900 text-white font-bold py-4 rounded-lg hover:bg-gray-800 transition-colors flex justify-center items-center gap-2">
                    <Send className="w-5 h-5" /> Submit Feedback
                  </button>

                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackForm;