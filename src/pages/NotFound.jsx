import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in">
      <div className="bg-red-50 p-5 rounded-full mb-6 border border-red-100 shadow-sm">
        <AlertTriangle className="w-12 h-12 text-red-600" />
      </div>
      <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">404 - Signal Lost</h1>
      <p className="text-gray-500 max-w-md mb-8 text-lg">
        We couldn't trace this endpoint. The supply chain node you are looking for might have been moved or doesn't exist.
      </p>
      <Link 
        to="/" 
        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 hover:shadow-md transition-all"
      >
        <Home className="w-5 h-5" /> Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;