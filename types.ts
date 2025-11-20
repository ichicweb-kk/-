
export enum LeaveType {
  SICK = 'ลาป่วย',
  PERSONAL = 'ลากิจ',
  VACATION = 'ลาพักผ่อน',
  TRAINING = 'ลาไปราชการ/อบรม',
  MATERNITY = 'ลาคลอด',
  OTHER = 'อื่นๆ'
}

export enum LeaveStatus {
  PENDING = 'รออนุมัติ',
  APPROVED = 'อนุมัติ',
  REJECTED = 'ไม่อนุมัติ',
  CANCELLED = 'ยกเลิก'
}

export enum Department {
  THAI = 'ภาษาไทย',
  MATH = 'คณิตศาสตร์',
  SCIENCE = 'วิทยาศาสตร์และเทคโนโลยี',
  SOCIAL = 'สังคมศึกษา ศาสนา และวัฒนธรรม',
  HEALTH = 'สุขศึกษาและพลศึกษา',
  ART = 'ศิลปะ',
  CAREER = 'การงานอาชีพ',
  FOREIGN = 'ภาษาต่างประเทศ',
  GUIDANCE = 'กิจกรรมพัฒนาผู้เรียน',
  ADMIN = 'สำนักงาน/บริหารทั่วไป'
}

export interface LeaveRequest {
  id: string;
  fullName: string;
  position: string;
  department: Department;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number; // New field for number of days
  reason: string;
  contact: string;
  address: string;
  status: LeaveStatus;
  createdAt: string;
  note?: string;
}

export type ViewState = 'form' | 'history' | 'admin' | 'stats';
