
import React from 'react';
import { LeaveRequest } from '../types';

interface PrintLayoutProps {
  data: Partial<LeaveRequest> | null;
}

export const PrintLayout: React.FC<PrintLayoutProps> = ({ data }) => {
  if (!data) return null;

  // Helper to format Thai Date (Full Format)
  const formatThaiDate = (dateString?: string) => {
    if (!dateString) return '....................';
    const date = new Date(dateString);
    const months = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    return `${date.getDate()} ${months[date.getMonth()]} พ.ศ. ${date.getFullYear() + 543}`;
  };

  const calculateDays = (days?: number) => {
      return days ? days : '...';
  };

  const today = new Date();
  const currentThaiDate = formatThaiDate(today.toISOString());

  return (
    <div className="bg-white text-black p-[20mm] font-sarabun leading-normal text-[16pt]">
        {/* Header - Garuda */}
        <div className="flex justify-center mb-2">
            <img 
                src="https://kruprem.com/upload/gov-form/krut-3-cm.png" 
                alt="Garuda" 
                className="w-[100px] h-auto object-contain"
            />
        </div>

        <h1 className="text-3xl font-bold text-center mb-8 tracking-wide">บันทึกข้อความ</h1>

        {/* Section 1: Header Details */}
        <div className="mb-4 space-y-1">
            <div className="flex">
                <span className="font-bold w-24 flex-shrink-0">ส่วนราชการ</span>
                <span className="border-b border-dotted border-gray-400 flex-grow px-2 break-words">โรงเรียนครูกิ๊กจ้าพาใช้ AI สังกัดสำนักงานเขตพื้นที่การศึกษามัธยมศึกษาเกินร้อย</span>
            </div>
            <div className="flex gap-4">
                <div className="flex flex-1">
                    <span className="font-bold w-8 flex-shrink-0">ที่</span>
                    <span className="border-b border-dotted border-gray-400 flex-grow px-2">....................</span>
                </div>
                <div className="flex flex-1">
                    <span className="font-bold w-12 flex-shrink-0">วันที่</span>
                    <span className="border-b border-dotted border-gray-400 flex-grow px-2">{data.createdAt ? formatThaiDate(data.createdAt) : currentThaiDate}</span>
                </div>
            </div>
            <div className="flex">
                <span className="font-bold w-12 flex-shrink-0">เรื่อง</span>
                <span className="border-b border-dotted border-gray-400 flex-grow px-2">ขอ{data.leaveType}</span>
            </div>
        </div>

        {/* Section 2: To */}
        <div className="mb-4 mt-4">
            <span className="font-bold">เรียน</span> ผู้อำนวยการโรงเรียนครูกิ๊กจ้าพาใช้ AI
        </div>

        {/* Section 3: Body */}
        <div className="mb-4 indent-[2.5cm] text-justify leading-relaxed break-words">
            ข้าพเจ้า <span className="font-bold">{data.fullName}</span> ตำแหน่ง <span className="font-bold">{data.position}</span> สังกัด <span className="font-bold">{data.department}</span> 
            ขออนุญาต <span className="font-bold">{data.leaveType}</span> เนื่องจาก <span className="underline decoration-dotted decoration-gray-400 underline-offset-4">{data.reason}</span>
        </div>
        <div className="mb-4 text-justify leading-relaxed break-words">
            ตั้งแต่วันที่ {formatThaiDate(data.startDate)} ถึงวันที่ {formatThaiDate(data.endDate)} มีกำหนด {calculateDays(data.totalDays)} วัน 
            ในระหว่างลาจะติดต่อข้าพเจ้าได้ที่ <span className="underline decoration-dotted decoration-gray-400 underline-offset-4">{data.address}</span> 
            หมายเลขโทรศัพท์ <span className="underline decoration-dotted decoration-gray-400 underline-offset-4">{data.contact}</span>
        </div>

        <div className="indent-[2.5cm] mb-12">
            จึงเรียนมาเพื่อโปรดพิจารณาอนุญาต
        </div>

        {/* Signatures */}
        <div className="flex flex-col items-end mb-12 pr-4">
            <div className="text-center space-y-4 min-w-[200px]">
                <div className="border-b border-dotted border-gray-400 w-full mx-auto h-8"></div>
                <div>( {data.fullName} )</div>
                <div>ตำแหน่ง {data.position}</div>
            </div>
        </div>

        {/* Comments Section */}
        <div className="grid grid-cols-2 gap-8 mt-8">
            <div className="space-y-6">
                 <div>
                    <p className="font-bold mb-2 underline decoration-gray-400 underline-offset-4">ความเห็นหัวหน้ากลุ่มสาระฯ/หัวหน้าฝ่าย</p>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 border border-black"></div> เห็นควรอนุญาต
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-4 h-4 border border-black"></div> อื่นๆ ................................
                    </div>
                    <div className="mt-8 text-center">
                        <div className="border-b border-dotted border-gray-400 w-40 mx-auto h-8"></div>
                        <div className="mt-2">(........................................)</div>
                        <div className="mt-1">หัวหน้ากลุ่มสาระฯ/ฝ่าย</div>
                    </div>
                 </div>
            </div>

             <div className="space-y-6">
                 <div>
                    <p className="font-bold mb-2 underline decoration-gray-400 underline-offset-4">คำสั่ง/ความเห็น ผู้อำนวยการสถานศึกษา</p>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 border border-black"></div> อนุญาต
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-4 h-4 border border-black"></div> ไม่อนุญาต
                    </div>
                    <div className="mt-8 text-center">
                        <div className="border-b border-dotted border-gray-400 w-40 mx-auto h-8"></div>
                        <div className="mt-2">(........................................)</div>
                        <div className="mt-1">ผู้อำนวยการโรงเรียน</div>
                    </div>
                 </div>
            </div>
        </div>
    </div>
  );
};
