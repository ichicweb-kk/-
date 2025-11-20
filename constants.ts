
import { Department, LeaveStatus, LeaveType, LeaveRequest } from './types';

export const DEPARTMENTS = Object.values(Department);
export const LEAVE_TYPES = Object.values(LeaveType);

export const POSITIONS = [
  'ครูผู้ช่วย',
  'ครู คศ.1',
  'ครูชำนาญการ',
  'ครูชำนาญการพิเศษ',
  'ครูเชี่ยวชาญ',
  'พนักงานราชการ',
  'ครูอัตราจ้าง',
  'เจ้าหน้าที่ประจำสำนักงาน',
  'นักการภารโรง',
  'อื่นๆ'
];

export const INITIAL_DATA: LeaveRequest[] = [
  {
    id: '1715481234',
    fullName: 'สมชาย ใจดี',
    position: 'ครูชำนาญการ',
    department: Department.MATH,
    leaveType: LeaveType.PERSONAL,
    startDate: '2023-10-25',
    endDate: '2023-10-26',
    totalDays: 2,
    reason: 'ทำธุระส่วนตัวที่อำเภอ',
    contact: '081-234-5678',
    address: '123 หมู่ 1 ต.ในเมือง อ.เมือง จ.ขอนแก่น',
    status: LeaveStatus.APPROVED,
    createdAt: '2023-10-20T08:30:00.000Z'
  },
  {
    id: '1715482234',
    fullName: 'สมหญิง รักเรียน',
    position: 'ครูผู้ช่วย',
    department: Department.THAI,
    leaveType: LeaveType.SICK,
    startDate: '2023-11-01',
    endDate: '2023-11-02',
    totalDays: 2,
    reason: 'ไข้หวัดใหญ่',
    contact: '089-999-8888',
    address: '44/5 ถนนกลางเมือง อ.เมือง จ.ขอนแก่น',
    status: LeaveStatus.PENDING,
    createdAt: '2023-10-31T10:00:00.000Z'
  }
];
