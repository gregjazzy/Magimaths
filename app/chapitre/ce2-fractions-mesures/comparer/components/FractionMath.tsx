'use client';

interface FractionMathProps {
  a: string | number;
  b: string | number;
  size?: string;
}

export function FractionMath({a, b, size = 'text-base sm:text-xl'}: FractionMathProps) {
  return (
    <span className={`inline-block align-middle ${size} text-gray-900 font-bold`} style={{ minWidth: 24 }}>
      <span className="flex flex-col items-center" style={{lineHeight:1}}>
        <span className="border-b-2 border-gray-800 px-1 text-gray-900">{a}</span>
        <span className="px-1 text-gray-900">{b}</span>
      </span>
    </span>
  );
}
