
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { getLeaves } from '../services/storageService';
import { LeaveStatus, LeaveRequest } from '../types';
import { DEPARTMENTS, LEAVE_TYPES } from '../constants';
import { Users, CalendarCheck, PieChart as PieIcon, Search, User, List } from 'lucide-react';

export const StatsDashboard: React.FC = () => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [uniqueUsers, setUniqueUsers] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        const data = await getLeaves();
        setLeaves(data);
        
        // Extract unique users
        const users = Array.from(new Set(data.map(l => l.fullName))).sort();
        setUniqueUsers(users);
        
        setIsLoading(false);
    };
    fetchData();
  }, []);

  if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
             <span className="ml-3 text-blue-600 font-medium">กำลังประมวลผลสถิติ...</span>
        </div>
      );
  }

  // Prepare Data for Pie Chart (Leave Types)
  const typeData = LEAVE_TYPES.map(type => ({
    name: type,
    value: leaves.filter(l => l.leaveType === type).length
  })).filter(d => d.value > 0);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Prepare Data for Bar Chart (Department Stats)
  const deptData = DEPARTMENTS.map(dept => ({
    name: dept.length > 15 ? dept.substring(0, 15) + '...' : dept,
    full: dept,
    count: leaves.filter(l => l.department === dept).length
  })).filter(d => d.count > 0);

  // Summary Stats
  const totalLeaves = leaves.length;
  const approvedLeaves = leaves.filter(l => l.status === LeaveStatus.APPROVED).length;
  const activeUsers = uniqueUsers.length;

  // Individual User Stats Logic
  const userLeaves = selectedUser ? leaves.filter(l => l.fullName === selectedUser) : [];
  const userTotalDays = userLeaves.reduce((sum, l) => sum + (l.totalDays || 0), 0);
  const userApprovedCount = userLeaves.filter(l => l.status === LeaveStatus.APPROVED).length;

  // Grouped Stats for User Table
  const userStatsByType = LEAVE_TYPES.map(type => {
      const typeLeaves = userLeaves.filter(l => l.leaveType === type);
      return {
          type: type,
          count: typeLeaves.length,
          totalDays: typeLeaves.reduce((sum, l) => sum + (l.totalDays || 0), 0)
      };
  }).filter(stat => stat.count > 0);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500 flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm">จำนวนการลาทั้งหมด</p>
                <h3 className="text-3xl font-bold text-blue-900">{totalLeaves} <span className="text-sm font-normal text-gray-400">ครั้ง</span></h3>
            </div>
            <CalendarCheck className="w-10 h-10 text-blue-200" />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500 flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm">อนุมัติแล้ว</p>
                <h3 className="text-3xl font-bold text-green-900">{approvedLeaves} <span className="text-sm font-normal text-gray-400">ครั้ง</span></h3>
            </div>
            <PieIcon className="w-10 h-10 text-green-200" />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500 flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm">ผู้ใช้บริการ</p>
                <h3 className="text-3xl font-bold text-purple-900">{activeUsers} <span className="text-sm font-normal text-gray-400">คน</span></h3>
            </div>
            <Users className="w-10 h-10 text-purple-200" />
        </div>
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Leave Types Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">สถิติแยกตามประเภทการลา (จำนวนครั้ง)</h3>
          <div className="h-64 w-full">
            {typeData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label
                    >
                    {typeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-full text-gray-400">ไม่มีข้อมูล</div>
            )}
          </div>
        </div>

        {/* Department Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">สถิติแยกตามกลุ่มสาระฯ (จำนวนครั้ง)</h3>
          <div className="h-64 w-full">
            {deptData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{fontSize: 12}} interval={0} angle={-20} textAnchor="end" height={60} />
                    <YAxis allowDecimals={false} />
                    <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                    <Bar dataKey="count" name="จำนวน (ครั้ง)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
                </ResponsiveContainer>
            ) : (
                 <div className="flex items-center justify-center h-full text-gray-400">ไม่มีข้อมูล</div>
            )}
          </div>
        </div>
      </div>

      {/* Individual Statistics Section */}
      <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-orange-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <User className="w-6 h-6 text-orange-500" />
                สถิติรายบุคคล
            </h3>
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <select 
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none appearance-none bg-white"
                >
                    <option value="">-- เลือกบุคลากร --</option>
                    {uniqueUsers.map(user => (
                        <option key={user} value={user}>{user}</option>
                    ))}
                </select>
            </div>
        </div>

        {selectedUser ? (
            <div className="animate-fade-in">
                {/* User Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-gray-500 text-xs">ชื่อ-สกุล</p>
                        <p className="font-bold text-gray-800 truncate">{selectedUser}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <p className="text-blue-500 text-xs">ลาทั้งหมด</p>
                        <p className="font-bold text-blue-800 text-xl">{userLeaves.length} <span className="text-sm font-normal">ครั้ง</span></p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg text-center">
                        <p className="text-orange-500 text-xs">รวมวันลา</p>
                        <p className="font-bold text-orange-800 text-xl">{userTotalDays} <span className="text-sm font-normal">วัน</span></p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                        <p className="text-green-500 text-xs">อนุมัติแล้ว</p>
                        <p className="font-bold text-green-800 text-xl">{userApprovedCount} <span className="text-sm font-normal">ครั้ง</span></p>
                    </div>
                </div>

                {/* Leave Type Breakdown Table */}
                <div className="mb-6">
                    <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <List className="w-5 h-5 text-blue-500" />
                        สรุปสถิติแยกประเภท (จำนวนครั้ง / จำนวนวัน)
                    </h4>
                    <div className="overflow-hidden border rounded-lg shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                             <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">ประเภทการลา</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase">จำนวนครั้ง</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase">รวมจำนวนวัน</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {userStatsByType.map((stat, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{stat.type}</td>
                                        <td className="px-4 py-3 text-sm text-center text-blue-600 font-bold">{stat.count}</td>
                                        <td className="px-4 py-3 text-sm text-center text-orange-600 font-bold">{stat.totalDays}</td>
                                    </tr>
                                ))}
                                <tr className="bg-gray-50 font-bold">
                                    <td className="px-4 py-3 text-sm text-gray-900 text-right">รวมทั้งสิ้น</td>
                                    <td className="px-4 py-3 text-sm text-center text-blue-800">{userLeaves.length}</td>
                                    <td className="px-4 py-3 text-sm text-center text-orange-800">{userTotalDays}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Leave History Table for User */}
                <div className="overflow-x-auto border rounded-lg mt-6">
                    <h4 className="text-md font-semibold text-gray-700 mb-3 px-2">ประวัติรายการลาล่าสุด</h4>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">วันที่ลา</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ประเภท</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">จำนวนวัน</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">เหตุผล</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">สถานะ</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {userLeaves.map(leave => (
                                <tr key={leave.id}>
                                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                                        {new Date(leave.startDate).toLocaleDateString('th-TH')} - {new Date(leave.endDate).toLocaleDateString('th-TH')}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{leave.leaveType}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 font-medium text-center">{leave.totalDays}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{leave.reason}</td>
                                    <td className="px-4 py-3 text-sm">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                                            ${leave.status === LeaveStatus.APPROVED ? 'bg-green-100 text-green-800' : 
                                              leave.status === LeaveStatus.REJECTED ? 'bg-red-100 text-red-800' : 
                                              'bg-yellow-100 text-yellow-800'}`}>
                                            {leave.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <Search className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">กรุณาเลือกรายชื่อบุคลากรเพื่อดูสถิติ</p>
            </div>
        )}
      </div>
    </div>
  );
};
