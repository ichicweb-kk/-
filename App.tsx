
import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LeaveForm } from './components/LeaveForm';
import { LeaveList } from './components/LeaveList';
import { AdminDashboard } from './components/AdminDashboard';
import { StatsDashboard } from './components/StatsDashboard';
import { Footer } from './components/Footer';
import { PrintLayout } from './components/PrintLayout';
import { ViewState, LeaveRequest } from './types';
import { Lock, Printer, X } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('form');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  // Print State
  const [printData, setPrintData] = useState<Partial<LeaveRequest> | null>(null);

  const handleAdminToggle = () => {
    if (isAdminMode) {
      setIsAdminMode(false);
      setCurrentView('form');
    } else {
      setShowLoginModal(true);
      setPasswordInput('');
      setLoginError(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'kk99999') {
      setIsAdminMode(true);
      setShowLoginModal(false);
      setCurrentView('admin');
    } else {
      setLoginError(true);
    }
  };

  const handlePrintPreview = (data: Partial<LeaveRequest>) => {
      setPrintData(data);
  };

  const renderView = () => {
    switch (currentView) {
      case 'form':
        return (
          <div className="animate-fade-in">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-blue-900">ระบบบันทึกการลาออนไลน์</h1>
              <p className="text-gray-600">โรงเรียนครูกิ๊กจ้าพาใช้ AI</p>
            </div>
            <LeaveForm onSuccess={() => setCurrentView('history')} onPrint={handlePrintPreview} />
          </div>
        );
      case 'history':
        return <LeaveList onPrint={handlePrintPreview} />;
      case 'admin':
        return isAdminMode ? <AdminDashboard /> : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <p>กรุณาเข้าสู่ระบบผู้บริหารที่มุมขวาบน</p>
            </div>
        );
      case 'stats':
        return <StatsDashboard />;
      default:
        return <LeaveForm onSuccess={() => setCurrentView('history')} onPrint={handlePrintPreview} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
        {/* Main App Content - Hidden when printing */}
        <div className={`flex-grow flex flex-col ${printData ? 'print:hidden' : ''}`}>
            <div className={printData ? 'hidden' : 'block'}>
                <Navbar 
                    currentView={currentView} 
                    setView={setCurrentView} 
                    isAdminMode={isAdminMode}
                    toggleAdminMode={handleAdminToggle}
                />
                
                <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {renderView()}
                </main>

                <Footer />
            </div>
        </div>

        {/* Login Modal */}
        {showLoginModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 no-print">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl transform transition-all">
                <div className="text-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full inline-block mb-3">
                    <Lock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">เข้าสู่ระบบผู้บริหาร</h3>
                <p className="text-sm text-gray-500">กรุณาระบุรหัสผ่านเพื่อดำเนินการต่อ</p>
                </div>
                
                <form onSubmit={handleLogin}>
                <input
                    type="password"
                    autoFocus
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none mb-2 text-center tracking-widest"
                    placeholder="รหัสผ่าน"
                />
                {loginError && (
                    <p className="text-red-500 text-xs mb-3 text-center">รหัสผ่านไม่ถูกต้อง</p>
                )}
                <div className="flex gap-2 mt-4">
                    <button
                    type="button"
                    onClick={() => setShowLoginModal(false)}
                    className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors font-medium"
                    >
                    ยกเลิก
                    </button>
                    <button
                    type="submit"
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-sm"
                    >
                    ยืนยัน
                    </button>
                </div>
                </form>
            </div>
            </div>
        )}

        {/* Print Preview Modal */}
        {printData && (
            <div className="fixed inset-0 z-[100] bg-gray-900/90 flex flex-col items-center justify-start overflow-y-auto p-4 print:p-0 print:bg-white print:static print:block">
                {/* Toolbar - Hidden on Print */}
                <div className="w-full max-w-[210mm] flex justify-between items-center mb-4 text-white no-print mt-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Printer className="w-6 h-6" /> ตัวอย่างก่อนพิมพ์ (Preview)
                    </h2>
                    <div className="flex gap-3">
                         <button 
                            onClick={() => window.print()}
                            title="คีย์ลัด Ctrl + P"
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg transition-all flex items-center gap-2"
                        >
                            <Printer className="w-4 h-4" /> สั่งพิมพ์ (Ctrl+P)
                        </button>
                        <button 
                            onClick={() => setPrintData(null)}
                            className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg transition-all flex items-center gap-2"
                        >
                            <X className="w-4 h-4" /> ปิด
                        </button>
                    </div>
                </div>

                {/* The Paper - Visible on Print */}
                <div className="bg-white shadow-2xl w-full max-w-[210mm] min-h-[297mm] p-0 print:shadow-none print:w-full print:h-auto">
                    <PrintLayout data={printData} />
                </div>
                
                <div className="h-10 no-print"></div>
            </div>
        )}
    </div>
  );
};

export default App;
