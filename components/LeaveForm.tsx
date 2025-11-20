
import React, { useState, useEffect } from 'react';
import { DEPARTMENTS, LEAVE_TYPES, POSITIONS } from '../constants';
import { Department, LeaveType, LeaveRequest } from '../types';
import { addLeave } from '../services/storageService';
import { Save, Send, Printer, Calculator, CalendarDays } from 'lucide-react';

interface LeaveFormProps {
  onSuccess: () => void;
  onPrint: (data: Partial<LeaveRequest>) => void;
}

export const LeaveForm: React.FC<LeaveFormProps> = ({ onSuccess, onPrint }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    position: POSITIONS[0],
    department: DEPARTMENTS[0],
    leaveType: LEAVE_TYPES[0],
    startDate: '',
    endDate: '',
    totalDays: 0,
    reason: '',
    contact: '',
    address: ''
  });

  // Function to calculate working days (excluding Sat/Sun)
  const calculateWorkingDays = (startStr: string, endStr: string): number => {
    const start = new Date(startStr);
    const end = new Date(endStr);
    
    // Reset hours
    start.setHours(0,0,0,0);
    end.setHours(0,0,0,0);

    if (end < start) return 0;

    let count = 0;
    const curDate = new Date(start);

    while (curDate <= end) {
      const dayOfWeek = curDate.getDay();
      // 0 = Sunday, 6 = Saturday
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
      curDate.setDate(curDate.getDate() + 1);
    }
    
    return count;
  };

  // Auto-calculate days when dates change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
        const days = calculateWorkingDays(formData.startDate, formData.endDate);
        setFormData(prev => ({ ...prev, totalDays: days }));
    } else {
        setFormData(prev => ({ ...prev, totalDays: 0 }));
    }
  }, [formData.startDate, formData.endDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePrintClick = (e: React.MouseEvent) => {
      e.preventDefault();
      
      if (!formData.fullName || !formData.startDate || !formData.endDate || !formData.reason || formData.totalDays <= 0) {
          alert('กรุณากรอกข้อมูลให้ครบถ้วน และตรวจสอบวันลาให้ถูกต้องก่อนพิมพ์แบบฟอร์ม');
          return;
      }

      // Trigger the print preview modal in App.tsx
      onPrint({
          ...formData,
          department: formData.department as Department,
          leaveType: formData.leaveType as LeaveType
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.totalDays <= 0) {
        alert('จำนวนวันลาไม่ถูกต้อง (ต้องเป็นวันทำการ จันทร์-ศุกร์ เท่านั้น)');
        return;
    }

    setIsSubmitting(true);

    const success = await addLeave({
      fullName: formData.fullName,
      position: formData.position,
      department: formData.department as Department,
      leaveType: formData.leaveType as LeaveType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      totalDays: formData.totalDays,
      reason: formData.reason,
      contact: formData.contact,
      address: formData.address
    });

    if (success) {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("มีคำขอลาใหม่", {
            body: `${formData.fullName} ขอ${formData.leaveType}`,
          });
        }
        alert('บันทึกการลาเรียบร้อยแล้ว');
        onSuccess(); 
    } else {
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
      <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex items-center gap-2">
        <div className="bg-blue-600 p-2 rounded-lg">
            <Send className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-blue-900">แบบฟอร์มบันทึกการลา</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-สกุล</label>
            <input
              required
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="นายรักเรียน เพียรศึกษา"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ตำแหน่ง</label>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              {POSITIONS.map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">กลุ่มสาระการเรียนรู้ / ฝ่าย</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
          >
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Leave Details */}
        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-lg font-medium text-blue-800 mb-4 flex items-center gap-2">
             <CalendarDays className="w-5 h-5" />
             รายละเอียดการลา
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ประเภทการลา</label>
              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              >
                {LEAVE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนวันลา (ไม่รวมเสาร์-อาทิตย์)</label>
                <div className="relative">
                    <input
                    type="number"
                    readOnly
                    value={formData.totalDays}
                    className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 bg-blue-50 text-blue-900 font-bold focus:outline-none"
                    />
                    <Calculator className="w-5 h-5 text-blue-500 absolute left-3 top-2.5" />
                </div>
                <p className="text-xs text-gray-500 mt-1">*คำนวณเฉพาะวันทำการ (ตัดวันหยุดเสาร์-อาทิตย์)</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ตั้งแต่วันที่</label>
              <input
                required
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ถึงวันที่</label>
              <input
                required
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">เหตุผลการลา</label>
            <textarea
              required
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              placeholder="ระบุสาเหตุการลา..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่ระหว่างลา</label>
                <textarea
                required
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                placeholder="ระบุที่อยู่..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์ติดต่อ</label>
                <input
                required
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="08x-xxx-xxxx"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row gap-4">
          <button
            type="button"
            onClick={handlePrintClick}
            className="flex-1 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2"
          >
             <Printer className="w-5 h-5" />
             ดูตัวอย่าง/พิมพ์แบบฟอร์ม
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                กำลังบันทึก...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                ส่งใบลาเสนอผู้บริหาร
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
