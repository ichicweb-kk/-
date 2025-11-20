
import React, { useEffect, useState } from 'react';
import { getLeaves, deleteLeave } from '../services/storageService';
import { LeaveRequest, LeaveStatus } from '../types';
import { Trash2, Calendar, Clock, User, AlertCircle, MapPin, RefreshCw, FileText } from 'lucide-react';

interface LeaveListProps {
    onPrint: (data: LeaveRequest) => void;
}

export const LeaveList: React.FC<LeaveListProps> = ({ onPrint }) => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (force = false) => {
    setIsLoading(true);
    const data = await getLeaves(force);
    setLeaves(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('คุณต้องการลบข้อมูลการลานี้ใช่หรือไม่?')) {
      setIsLoading(true);
      const success = await deleteLeave(id);
      if (success) {
        await fetchData(true);
      } else {
        alert('ลบข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
        setIsLoading(false);
      }
    }
  };

  const filteredLeaves = leaves.filter(l => l.fullName.includes(filter) || l.department.includes(filter));

  const getStatusColor = (status: LeaveStatus) => {
    switch (status) {
      case LeaveStatus.APPROVED: return 'bg-green-100 text-green-800 border-green-200';
      case LeaveStatus.REJECTED: return 'bg-red-100 text-red-800 border-red-200';
      case LeaveStatus.PENDING: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2">
            <Clock className="w-6 h-6" />
            ประวัติการลาทั้งหมด
        </h2>
        <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
            type="text"
            placeholder="ค้นหาชื่อ หรือ กลุ่มสาระ..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button 
                onClick={() => fetchData(true)} 
                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                title="รีเฟรชข้อมูล"
            >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-blue-600 font-medium">กำลังโหลดข้อมูล...</span>
        </div>
      ) : filteredLeaves.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl text-gray-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>ยังไม่มีข้อมูลการลา</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredLeaves.map((leave) => (
            <div key={leave.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 border border-gray-100 relative group">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-gray-800">{leave.leaveType}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(leave.status)}`}>
                            {leave.status}
                        </span>
                    </div>
                  <p className="text-gray-600 flex items-center gap-1 text-sm">
                    <User className="w-4 h-4" /> {leave.fullName} ({leave.department})
                  </p>
                  <p className="text-blue-600 flex items-center gap-1 text-sm font-medium">
                    <Calendar className="w-4 h-4" /> 
                    {new Date(leave.startDate).toLocaleDateString('th-TH')} - {new Date(leave.endDate).toLocaleDateString('th-TH')}
                    <span className="text-gray-500 font-normal ml-1">({leave.totalDays || 0} วัน)</span>
                  </p>
                  <p className="text-gray-500 text-sm mt-2 bg-gray-50 p-2 rounded-lg inline-block w-full sm:w-auto">
                    สาเหตุ: {leave.reason}
                  </p>
                  {leave.address && (
                     <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {leave.address}
                     </p>
                  )}
                  {leave.note && (
                    <p className="text-red-500 text-sm mt-1">หมายเหตุจากผู้บริหาร: {leave.note}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onPrint(leave)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="พิมพ์ใบลา"
                    >
                        <FileText className="w-5 h-5" />
                    </button>
                    
                    {leave.status === LeaveStatus.PENDING && (
                        <button
                            onClick={() => handleDelete(leave.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="ยกเลิกการลา"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
