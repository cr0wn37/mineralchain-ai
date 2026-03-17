import { X, Send } from 'lucide-react';

const WhatsAppMockup = ({ isOpen, onClose, alert }) => {
  if (!isOpen || !alert) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      {/* Phone Hardware Frame */}
      <div className="w-full max-w-[320px] bg-white h-[600px] rounded-[3rem] border-[8px] border-gray-900 shadow-2xl relative overflow-hidden flex flex-col animate-slide-in-right">
        
        {/* Phone Camera Notch */}
        <div className="absolute top-0 inset-x-0 h-6 bg-gray-900 rounded-b-3xl w-32 mx-auto z-20"></div>

        {/* WhatsApp Header */}
        <div className="bg-[#008069] text-white p-4 pt-8 flex items-center justify-between z-10 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#008069] font-black text-xl">
              M
            </div>
            <div>
              <h3 className="font-bold leading-tight text-md">MineralChain AI</h3>
              <p className="text-xs text-green-100 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse"></span> Online
              </p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* WhatsApp Chat Background */}
        <div 
          className="flex-1 bg-[#efeae2] p-4 flex flex-col justify-end space-y-4 relative" 
          style={{ 
            backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', 
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          
          {/* System Alert Bubble */}
          <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-sm max-w-[90%] self-start text-sm text-gray-800 border-l-4 border-red-500">
            <p className="font-bold text-red-600 mb-1">🚨 URGENT: Supply Risk Detected</p>
            <p className="mb-2"><b>Mineral:</b> {alert.mineral}</p>
            <p className="mb-2"><b>Issue:</b> {alert.cause}</p>
            <p className="mb-2"><b>Affected:</b> Batch {alert.affected_batches.join(', ')}</p>
            <p className="mb-1"><b>Action required:</b> {alert.action}</p>
            
            <div className="mt-3 pt-2 border-t border-gray-100 text-xs italic text-gray-600">
              Reply <b>'1'</b> to view verified alternative suppliers.<br/>
              Reply <b>'2'</b> to dismiss alert.
            </div>
            <div className="text-[10px] text-gray-400 text-right mt-1">10:42 AM</div>
          </div>

          {/* User Reply Bubble */}
          <div className="bg-[#dcf8c6] p-2 px-3 rounded-xl rounded-tr-none shadow-sm max-w-[80%] self-end text-sm text-gray-800">
            <p>1</p>
            <div className="flex justify-end items-center gap-1 mt-1">
              <span className="text-[10px] text-gray-500">10:45 AM</span>
              <span className="text-blue-500 text-xs leading-none">✓✓</span>
            </div>
          </div>
          
          {/* System Response Bubble */}
          <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-sm max-w-[90%] self-start text-sm text-gray-800 border-l-4 border-blue-500">
            <p>Scanning domestic directory...</p>
            <p className="mt-1">Found <b>3 verified suppliers</b> matching your mineral and ESG requirements.</p>
            <p className="mt-2 text-blue-600 underline font-semibold cursor-pointer">Click here to review & request quotes.</p>
            <div className="text-[10px] text-gray-400 text-right mt-1">10:45 AM</div>
          </div>

        </div>

        {/* WhatsApp Input Footer */}
        <div className="bg-[#f0f2f5] p-2 flex items-center gap-2">
          <div className="flex-1 bg-white rounded-full px-4 py-2.5 text-gray-400 text-sm shadow-sm border border-gray-200">
            Message
          </div>
          <div className="w-10 h-10 bg-[#008069] rounded-full flex items-center justify-center text-white shadow-sm shrink-0">
            <Send className="w-4 h-4 -ml-0.5" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default WhatsAppMockup;