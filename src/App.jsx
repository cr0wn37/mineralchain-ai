import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard, ShieldAlert, Route as TraceIcon, Users, FileText, Loader2 } from 'lucide-react';

// Pages
import Dashboard from './pages/Dashboard';
import RiskAlerts from './pages/RiskAlerts';
import BatchTrace from './pages/BatchTrace';
import SupplierDirectory from './pages/SupplierDirectory';
import ESGReport from './pages/ESGReport';
import NotFound from './pages/NotFound'; // Ensure this file exists in /pages

// Components
import FeedbackForm from './components/FeedbackForm';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Risk Alerts', path: '/alerts', icon: <ShieldAlert className="w-4 h-4" /> },
    { name: 'Batch Trace', path: '/trace', icon: <TraceIcon className="w-4 h-4" /> },
    { name: 'Suppliers', path: '/suppliers', icon: <Users className="w-4 h-4" /> },
    { name: 'ESG Report', path: '/esg', icon: <FileText className="w-4 h-4" /> },
  ];

  const activeClass = "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-bold bg-blue-50 text-blue-700";
  const idleClass = "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors";

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xl">M</div>
            <span className="font-black text-xl tracking-tight text-gray-900">MineralChain <span className="text-blue-600">AI</span></span>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link key={item.name} to={item.path} className={location.pathname === item.path ? activeClass : idleClass}>
                {item.icon} {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-gray-900 focus:outline-none">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                to={item.path} 
                onClick={() => setIsOpen(false)}
                className={location.pathname === item.path ? `${activeClass} block` : `${idleClass} block`}
              >
                <span className="flex items-center gap-2">{item.icon} {item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

// NEW: This sub-component handles the loading logic safely inside the Router
const AppContent = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Simulate a 500ms data-sync delay on every route change
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">Syncing Network Data...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/alerts" element={<RiskAlerts />} />
      <Route path="/trace" element={<BatchTrace />} />
      <Route path="/suppliers" element={<SupplierDirectory />} />
      <Route path="/esg" element={<ESGReport />} />
      {/* Catch-all for 404s */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-200">
        <Navigation />
        <main className="pb-12">
          <AppContent />
        </main>
        <FeedbackForm />
      </div>
    </Router>
  );
}

export default App;