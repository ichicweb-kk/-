
import React, { useEffect, useState } from 'react';
import { getLeaves, updateLeaveStatus, invalidateCache } from '../services/storageService';
import { LeaveRequest, LeaveStatus } from '../types';
import { CheckCircle, XCircle, AlertTriangle, Shield, Download, FileSpreadsheet, RefreshCw } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [pendingLeaves, setPendingLeaves] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (force = false) => {
    setIsLoading(true);
    const allLeaves = await getLeaves(force);
    setLeaves(allLeaves);
    setPendingLeaves(allLeaves.filter(l => l.status === LeaveStatus.PENDING));
    setIsLoading(false);
  };

  const handleAction = async (id: string, status: LeaveStatus) => {
    let note = '';
    if (status === LeaveStatus.REJECTED) {
      note = prompt('ระบุเหตุผลที่ไม่อนุมัติ (ถ้ามี):') || '-';
    }
    
    setProcessingId(id);
    const success = await updateLeaveStatus(id, status, note);
    if (success) {
        invalidateCache(); // Force clear cache
        await loadData(true);
    } else {
        alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    }
    setProcessingId(null);
  };

  const exportToCSV = () => {
    // Define CSV Headers
    const headers = ['วันที่แจ้ง', 'ชื่อ-สกุล', 'ตำแหน่ง', 'กลุ่มสาระฯ', 'ประเภทการลา', 'เริ่มวันที่', 'ถึงวันที่', 'เหตุผล', 'ที่อยู่ระหว่างลา', 'ติดต่อ', 'สถานะ', 'หมายเหตุ'];
    
    // Convert data to CSV rows
    const rows = leaves.map(leave => [
        new Date(leave.createdAt).toLocaleDateString('th-TH'),
        `"${leave.fullName}"`, 
        `"${leave.position}"`,
        `"${leave.department}"`,
        `"${leave.leaveType}"`,
        new Date(leave.startDate).toLocaleDateString('th-TH'),
        new Date(leave.endDate).toLocaleDateString('th-TH'),
        `"${leave.reason}"`,
        `"${leave.address}"`,
        `"${leave.contact}"`,
        leave.status,
        `"${leave.note || ''}"`
    ]);

    // Add BOM for Excel
    const BOM = "\uFEFF";
    const csvContent = BOM + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `report_leave_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-blue-900">แผงควบคุมผู้บริหาร</h2>
            <button 
                onClick={() => loadData(true)}
                disabled={isLoading}
                className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-all"
            >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-sm transition-all disabled:opacity-50"
            disabled={leaves.length === 0 || isLoading}
          >
            <FileSpreadsheet className="w-4 h-4" />
            ส่งออก Excel (CSV)
          </button>
      </div>

      {/* Pending Approvals Section */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-yellow-100">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4 flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
                <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-white">รายการรออนุมัติ</h2>
                <p className="text-yellow-50 text-sm">มี {pendingLeaves.length} รายการ ที่รอการดำเนินการ</p>
            </div>
        </div>
        
        <div className="p-6">
          {isLoading ? (
             <div className="text-center py-8">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-2"></div>
                 <p className="text-gray-500">กำลังโหลด...</p>
             </div>
          ) : pendingLeaves.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
              <p>ไม่มีรายการค้างดำเนินการ</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingLeaves.map(leave => (
                <div key={leave.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-yellow-50 rounded-xl border border-yellow-100 gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{leave.fullName} <span className="font-normal text-gray-600">({leave.department} - {leave.position})</span></h3>
                    <p className="text-blue-700 font-medium text-sm mt-1">{leave.leaveType} : {new Date(leave.startDate).toLocaleDateString('th-TH')} - {new Date(leave.endDate).toLocaleDateString('th-TH')}</p>
                    <p className="text-gray-600 text-sm mt-1"><b>เหตุผล:</b> {leave.reason}</p>
                    <p className="text-gray-600 text-sm"><b>ที่อยู่:</b> {leave.address}</p>
                    <p className="text-gray-500 text-xs mt-1">ติดต่อ: {leave.contact}</p>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    {processingId === leave.id ? (
                        <div className="flex items-center gap-2 px-4 py-2 text-gray-500">
                             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                             กำลังบันทึก...
                        </div>
                    ) : (
                        <>
                            <button
                            onClick={() => handleAction(leave.id, LeaveStatus.APPROVED)}
                            className="flex-1 md:flex-none flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                            >
                            <CheckCircle className="w-4 h-4" /> อนุมัติ
                            </button>
                            <button
                            onClick={() => handleAction(leave.id, LeaveStatus.REJECTED)}
                            className="flex-1 md:flex-none flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                            >
                            <XCircle className="w-4 h-4" /> ไม่อนุมัติ
                            </button>
                        </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent History Section (Read Only for Admin) */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            ประวัติการดำเนินการล่าสุด
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ-สกุล</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ประเภท</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaves.filter(l => l.status !== LeaveStatus.PENDING).slice(0, 5).map(leave => (
                <tr key={leave.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{leave.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.leaveType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(leave.startDate).toLocaleDateString('th-TH')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${leave.status === LeaveStatus.APPROVED ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
