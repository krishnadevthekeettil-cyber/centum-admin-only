
import React from 'react';
import { CentumAdmission } from '../types';

interface AdmissionPrintFormProps {
  data: CentumAdmission;
}

const AdmissionPrintForm: React.FC<AdmissionPrintFormProps> = ({ data }) => {
  const renderGridBoxes = (text: string = '', count: number = 30) => {
    const chars = text.toUpperCase().split('').slice(0, count);
    const boxes = Array(count).fill('');
    return (
      <div className="flex flex-wrap gap-0">
        {boxes.map((_, i) => (
          <div 
            key={i} 
            className="w-[22px] h-[22px] border border-black flex items-center justify-center text-[13px] font-mono -ml-[1px] -mt-[1px] bg-white"
          >
            {chars[i] || ''}
          </div>
        ))}
      </div>
    );
  };

  const renderMultiLineGrid = (text: string = '', lines: number = 3, charsPerLine: number = 30, pinCode?: string) => {
    const totalChars = lines * charsPerLine;
    const chars = text.toUpperCase().split('').slice(0, totalChars);
    const rows = [];
    for (let i = 0; i < lines; i++) {
      const lineChars = chars.slice(i * charsPerLine, (i + 1) * charsPerLine);
      rows.push(
        <div key={i} className="flex gap-0">
          {Array(charsPerLine).fill('').map((_, j) => {
            // Check if this is the PIN area (last row, last 9 boxes or so)
            const isPinArea = pinCode && i === lines - 1 && j >= charsPerLine - 9;
            if (isPinArea) {
              if (j === charsPerLine - 9) return <div key={j} className="w-[22px] h-[22px] flex items-center justify-center text-[11px] font-bold pr-1">P</div>;
              if (j === charsPerLine - 8) return <div key={j} className="w-[22px] h-[22px] flex items-center justify-center text-[11px] font-bold pr-1">I</div>;
              if (j === charsPerLine - 7) return <div key={j} className="w-[22px] h-[22px] flex items-center justify-center text-[11px] font-bold pr-1">N</div>;
              
              const pinIdx = j - (charsPerLine - 6);
              const pinChar = pinCode.split('')[pinIdx] || '';
              return (
                <div 
                  key={j} 
                  className="w-[22px] h-[22px] border border-black flex items-center justify-center text-[13px] font-mono -ml-[1px] -mt-[1px] bg-white"
                >
                  {pinChar}
                </div>
              );
            }

            return (
              <div 
                key={j} 
                className="w-[22px] h-[22px] border border-black flex items-center justify-center text-[13px] font-mono -ml-[1px] -mt-[1px] bg-white"
              >
                {lineChars[j] || ''}
              </div>
            );
          })}
        </div>
      );
    }
    return <div className="space-y-0">{rows}</div>;
  };

  return (
    <div className="bg-white text-black p-[10mm] w-[210mm] min-h-[297mm] mx-auto print:m-0 print:shadow-none shadow-xl border border-slate-200 print:border-none font-sans leading-tight relative overflow-hidden">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-0 w-52">
          <div className="flex border border-black">
            <div className="w-24 px-2 py-1 text-[11px] border-r border-black font-medium">Admn. No:</div>
            <div className="flex-1 h-7"></div>
          </div>
          <div className="flex border-x border-b border-black">
            <div className="w-24 px-2 py-1 text-[11px] border-r border-black font-medium">Serial No:</div>
            <div className="flex-1 h-7"></div>
          </div>
          <div className="flex border-x border-b border-black">
            <div className="w-24 px-2 py-1 text-[11px] border-r border-black font-medium">Total Fee:</div>
            <div className="flex-1 h-7"></div>
          </div>
          <div className="flex border-x border-b border-black">
            <div className="w-24 px-2 py-1 text-[11px] border-r border-black font-medium leading-none flex items-center">Concession<br/>if any</div>
            <div className="flex-1 h-9"></div>
          </div>
        </div>

        <div className="text-center flex-1 px-2">
          <h1 className="text-[52px] font-black tracking-tighter text-black leading-[0.75]">ACADEMY</h1>
          <h2 className="text-[26px] font-bold tracking-[0.15em] text-black mt-1">CHERPULASSERY</h2>
          <h3 className="text-[18px] font-bold border-b border-black inline-block px-10 mt-3 pb-0.5 italic">APPLICATION FORM</h3>
          
          <div className="flex justify-center gap-4 mt-8 text-[10px] font-bold">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px]">VIII</span>
              <div className="flex">
                <span className="border border-black px-1.5 py-0.5 -mr-[1px]">MM</span>
                <span className="border border-black px-1.5 py-0.5">EM</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px]">IX</span>
              <div className="flex">
                <span className="border border-black px-1.5 py-0.5 -mr-[1px]">MM</span>
                <span className="border border-black px-1.5 py-0.5">EM</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px]">X</span>
              <div className="flex">
                <span className="border border-black px-1.5 py-0.5 -mr-[1px]">MM</span>
                <span className="border border-black px-1.5 py-0.5">EM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-52 border border-black h-36 relative">
          <div className="absolute top-0 left-0 w-full text-[11px] px-2 py-1 border-b border-black font-medium">Fee Concession Details:</div>
        </div>
      </div>

      {/* Photo Box */}
      <div className="absolute right-[10mm] top-60 w-[30mm] h-[38mm] border border-black flex items-center justify-center text-center p-4 text-[11px] leading-tight font-medium">
        Affix<br/>Passport<br/>size<br/>Photograph
      </div>

      {/* Form Fields */}
      <div className="space-y-4 text-[13px] mt-6">
        {/* 1. Name */}
        <div className="flex gap-4">
          <div className="w-48 font-medium">1. a) Name of the Student<br/><span className="pl-4">(Block Letter)</span></div>
          <div className="flex-1">
            {renderMultiLineGrid(data.student_name, 2, 18)}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-48 font-medium pl-4">b) In Malayalam</div>
          <div className="flex-1">
            {renderGridBoxes(data.student_name_malayalam || '', 15)}
          </div>
        </div>

        {/* 2. School */}
        <div className="flex gap-4">
          <div className="w-48 font-medium">2. Name of School</div>
          <div className="flex-1">
            {renderGridBoxes(data.school_name, 14)}
          </div>
        </div>

        {/* 3. Gender */}
        <div className="flex gap-4">
          <div className="w-48 font-medium">3. Gender</div>
          <div className="flex gap-12">
            <div className="flex items-center gap-3">
              <span>Male</span>
              <div className="w-[22px] h-[22px] border border-black flex items-center justify-center font-bold">
                {data.gender === 'male' ? '✓' : ''}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span>Female</span>
              <div className="w-[22px] h-[22px] border border-black flex items-center justify-center font-bold">
                {data.gender === 'female' ? '✓' : ''}
              </div>
            </div>
          </div>
        </div>

        {/* 4. DOB */}
        <div className="flex gap-4">
          <div className="w-48 font-medium">4. Date of Birth</div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold">DD</span>
              <div className="flex">
                <div className="w-[22px] h-[22px] border border-black flex items-center justify-center font-mono">{String(data.dob_day || '').padStart(2, '0')[0]}</div>
                <div className="w-[22px] h-[22px] border border-black border-l-0 flex items-center justify-center font-mono">{String(data.dob_day || '').padStart(2, '0')[1]}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold">MM</span>
              <div className="flex">
                <div className="w-[22px] h-[22px] border border-black flex items-center justify-center font-mono">{String(data.dob_month || '').padStart(2, '0')[0]}</div>
                <div className="w-[22px] h-[22px] border border-black border-l-0 flex items-center justify-center font-mono">{String(data.dob_month || '').padStart(2, '0')[1]}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold">YYYY</span>
              <div className="flex">
                {String(data.dob_year || '').padStart(4, '0').split('').map((c, i) => (
                  <div key={i} className={`w-[22px] h-[22px] border border-black ${i > 0 ? 'border-l-0' : ''} flex items-center justify-center font-mono`}>{c}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 5. Father */}
        <div className="flex gap-4">
          <div className="w-48 font-medium">5. Name of Father<br/><span className="pl-4">Occupation</span></div>
          <div className="flex-1">
            {renderMultiLineGrid(`${data.father_name} ${data.father_occupation ? '- ' + data.father_occupation : ''}`, 2, 22)}
          </div>
        </div>

        {/* 6. Mother */}
        <div className="flex gap-4">
          <div className="w-48 font-medium">6. Name of Mother<br/><span className="pl-4">Occupation</span></div>
          <div className="flex-1">
            {renderMultiLineGrid(`${data.mother_name} ${data.mother_occupation ? '- ' + data.mother_occupation : ''}`, 2, 22)}
          </div>
        </div>

        {/* 7. Address */}
        <div className="flex gap-4">
          <div className="w-48 font-medium">7. Address</div>
          <div className="flex-1">
            {renderMultiLineGrid(data.address, 4, 22, data.pin_code)}
          </div>
        </div>

        {/* 9. Contact */}
        <div className="flex gap-4">
          <div className="w-48 font-medium">9. a) Mobile No. (Whatsapp)<br/><span className="pl-4">b) Second Mobile No.</span><br/><span className="pl-4">c) Email ID</span></div>
          <div className="flex-1 space-y-0.5">
            {renderGridBoxes(data.mobile_whatsapp, 22)}
            {renderGridBoxes(data.mobile_secondary || '', 22)}
            {renderGridBoxes(data.email || '', 22)}
          </div>
        </div>

        {/* 10. Relation */}
        <div className="flex gap-2 items-baseline">
          <span className="font-medium">10. Relation with Centum (if any) :</span>
          <span className="flex-1 border-b border-black border-dotted min-h-[1.5rem] font-bold pl-2">{data.relation_with_centum}</span>
        </div>

        {/* 11. Marks */}
        <div className="space-y-2">
          <div className="font-medium">11. Number of Mark obtained (Last Exam)</div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 pl-4">
            {['Phy', 'Chem', 'Bio', 'Maths', 'Eng', 'Hin', 'SS'].map(subject => (
              <div key={subject} className="flex items-center gap-2">
                <span className="text-[12px]">{subject}</span>
                <div className="w-[22px] h-[22px] border border-black flex items-center justify-center text-xs font-bold">
                  {data.subject_grades?.[subject] || ''}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 12. Batch */}
        <div className="flex gap-4 pt-1">
          <div className="w-48 font-medium">12. Batch</div>
          <div className="space-y-2">
            <div className="flex items-center gap-6">
              <span className="w-32">Morning Batch</span>
              <div className="w-[22px] h-[22px] border border-black flex items-center justify-center font-bold">
                {data.preferred_batch === 'morning' ? '✓' : ''}
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span className="w-32">Holiday Batch</span>
              <div className="w-[22px] h-[22px] border border-black flex items-center justify-center font-bold">
                {data.preferred_batch === 'holiday' ? '✓' : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Declaration */}
        <div className="italic text-center pt-8 font-medium">
          I affirm that the details shown above are true.
        </div>

        {/* Footer */}
        <div className="pt-12 grid grid-cols-2 gap-y-12">
          <div className="space-y-6 font-medium">
            <div>Place : <span className="font-bold pl-2">Cherpulassery</span></div>
            <div>Date : <span className="font-bold pl-2">{new Date().toLocaleDateString()}</span></div>
          </div>
          <div className="space-y-12 text-right font-medium">
            <div className="pr-4">Siganture of the Candidate</div>
            <div className="pr-4">Name and Signature of Guardian</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionPrintForm;
