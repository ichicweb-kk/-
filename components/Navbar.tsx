import React, { useState } from 'react';
import { Menu, X, LayoutDashboard, FileText, History, ShieldCheck, LogOut } from 'lucide-react';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  isAdminMode: boolean;
  toggleAdminMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView, isAdminMode, toggleAdminMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'form', label: 'แจ้งลา', icon: FileText, adminOnly: false },
    { id: 'history', label: 'ประวัติ/สถานะ', icon: History, adminOnly: false },
    { id: 'admin', label: 'อนุมัติการลา', icon: ShieldCheck, adminOnly: true },
    { id: 'stats', label: 'สถิติภาพรวม', icon: LayoutDashboard, adminOnly: false },
  ];

  const handleNavClick = (view: ViewState) => {
    setView(view);
    setIsOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick('form')}>
            <div className="bg-white p-1.5 rounded-full">
              <LayoutDashboard className="h-6 w-6 text-blue-800" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight">ระบบบันทึกการลา</span>
              <span className="text-xs text-blue-200 font-light">โรงเรียนครูกิ๊กจ้าพาใช้ AI</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                (!item.adminOnly || (item.adminOnly && isAdminMode)) && (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id as ViewState)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      currentView === item.id
                        ? 'bg-blue-800 text-white shadow-inner'
                        : 'text-blue-100 hover:bg-blue-600'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                )
              ))}
            </div>
          </div>

          {/* Admin Toggle (Simulate Login) */}
          <div className="hidden md:flex items-center">
             <button 
                onClick={toggleAdminMode}
                className={`text-xs border px-3 py-1 rounded-full transition-colors ${isAdminMode ? 'bg-white text-blue-900 font-bold' : 'border-blue-400 text-blue-200 hover:text-white'}`}
             >
                {isAdminMode ? 'โหมดผู้บริหาร (Logout)' : 'เข้าสู่ระบบผู้บริหาร'}
             </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-600 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden bg-blue-800 border-t border-blue-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
               (!item.adminOnly || (item.adminOnly && isAdminMode)) && (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id as ViewState)}
                  className={`flex items-center gap-3 w-full text-left px-3 py-3 rounded-md text-base font-medium ${
                    currentView === item.id
                      ? 'bg-blue-900 text-white'
                      : 'text-blue-100 hover:bg-blue-700'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              )
            ))}
            <div className="border-t border-blue-600 pt-2 mt-2">
              <button 
                onClick={() => {
                    toggleAdminMode();
                    setIsOpen(false);
                }}
                className="flex items-center gap-3 w-full text-left px-3 py-3 text-sm text-yellow-300"
              >
                <LogOut className="w-5 h-5" />
                {isAdminMode ? 'ออกจากโหมดผู้บริหาร' : 'เข้าสู่ระบบผู้บริหาร'}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};