import React, { useState } from "react";

interface PTCLogoProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  alt?: string;
}

export const PTCLogo: React.FC<PTCLogoProps> = ({
  className = "",
  size = "md",
  alt = "Pateros Technological College Official Seal",
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    xs: "w-6 h-6",
    sm: "w-8 h-8 sm:w-9 sm:h-9",
    md: "w-10 h-10 sm:w-12 sm:h-12",
    lg: "w-16 h-16 sm:w-20 sm:h-20",
    xl: "w-24 h-24 sm:w-28 sm:h-28",
  };

  return (
    <div
      className={`relative rounded-full shrink-0 flex items-center justify-center select-none overflow-hidden ${sizeClasses[size]} ${className}`}
      title={alt}
    >
      {!imgError ? (
        <img
          src="/ptc-logo.png"
          alt={alt}
          className="w-full h-full object-contain rounded-full"
          onError={() => setImgError(true)}
        />
      ) : (
        /* Vector Fallback Graphic matching the official PTC seal */
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-xs"
          xmlns="http://www.w3.org/2000/svg"
          aria-label={alt}
        >
        <defs>
          {/* Top text path for PATEROS TECHNOLOGICAL COLLEGE */}
          <path
            id="ptc-top-arc"
            d="M 26,100 A 74,74 0 0,1 174,100"
            fill="none"
          />
          {/* Bottom text path for DULANG NG DUNONG */}
          <path
            id="ptc-bottom-arc"
            d="M 172,105 A 73,73 0 0,1 28,105"
            fill="none"
          />
          {/* Sun gradient */}
          <radialGradient id="sun-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#F59E0B" />
          </radialGradient>
        </defs>

        {/* 1. Outer Dark Border */}
        <circle cx="100" cy="100" r="98" fill="#14532D" stroke="#0F291E" strokeWidth="2.5" />

        {/* 2. Green Outer Ring */}
        <circle cx="100" cy="100" r="95" fill="#16A34A" stroke="#15803D" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="74" fill="none" stroke="#0F291E" strokeWidth="1.8" />

        {/* 3. Text on Outer Ring */}
        <text
          fill="#FFFFFF"
          fontSize="11"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="2.2"
        >
          <textPath
            href="#ptc-top-arc"
            startOffset="50%"
            textAnchor="middle"
          >
            PATEROS TECHNOLOGICAL COLLEGE
          </textPath>
        </text>

        {/* Side decorative star bullets */}
        <circle cx="21" cy="100" r="2.2" fill="#FEF08A" stroke="#0F291E" strokeWidth="0.5" />
        <circle cx="179" cy="100" r="2.2" fill="#FEF08A" stroke="#0F291E" strokeWidth="0.5" />

        {/* Bottom motto: DULANG NG DUNONG */}
        <text
          fill="#FEF08A"
          fontSize="9.5"
          fontWeight="800"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="2"
        >
          <textPath
            href="#ptc-bottom-arc"
            startOffset="50%"
            textAnchor="middle"
          >
            DULANG NG DUNONG
          </textPath>
        </text>

        {/* 4. The Engineering Gear / Cogwheel (Yellow with 16 teeth) */}
        <g id="gear-cog">
          {/* Base Yellow Ring */}
          <circle cx="100" cy="100" r="72" fill="#FACC15" stroke="#0F291E" strokeWidth="2" />

          {/* 16 Cog Teeth radiating outward */}
          {[...Array(16)].map((_, i) => {
            const angle = (i * 360) / 16;
            return (
              <rect
                key={i}
                x="94"
                y="24"
                width="12"
                height="8"
                rx="1.5"
                fill="#FACC15"
                stroke="#0F291E"
                strokeWidth="1.2"
                transform={`rotate(${angle} 100 100)`}
              />
            );
          })}
        </g>

        {/* 5. Inner White Circle */}
        <circle cx="100" cy="100" r="54" fill="#FFFFFF" stroke="#0F291E" strokeWidth="2" />

        {/* 6. Green Laurel Wreath surrounding the core shield */}
        <g id="laurel-wreath" fill="#15803D" opacity="0.95">
          {/* Left branch leaves */}
          <path d="M 64,80 C 60,78 57,84 62,86 C 65,84 67,82 64,80 Z" />
          <path d="M 60,92 C 55,90 53,97 58,99 C 62,97 64,94 60,92 Z" />
          <path d="M 62,106 C 58,105 56,112 61,113 C 64,111 65,108 62,106 Z" />
          <path d="M 68,118 C 65,119 65,125 70,125 C 72,123 73,120 68,118 Z" />
          <path d="M 78,127 C 76,129 79,134 83,132 C 84,130 83,127 78,127 Z" />
          {/* Right branch leaves */}
          <path d="M 136,80 C 140,78 143,84 138,86 C 135,84 133,82 136,80 Z" />
          <path d="M 140,92 C 145,90 147,97 142,99 C 138,97 136,94 140,92 Z" />
          <path d="M 138,106 C 142,105 144,112 139,113 C 136,111 135,108 138,106 Z" />
          <path d="M 132,118 C 135,119 135,125 130,125 C 128,123 127,120 132,118 Z" />
          <path d="M 122,127 C 124,129 121,134 117,132 C 116,130 117,127 122,127 Z" />
        </g>

        {/* 7. Golden Philippine Sun with 8 rays (Top Center) */}
        <g id="ph-sun">
          {/* Central sun disc */}
          <circle cx="100" cy="82" r="10" fill="url(#sun-grad)" stroke="#CA8A04" strokeWidth="1" />
          {/* 8 Primary Sun Rays */}
          {[...Array(8)].map((_, i) => {
            const angle = (i * 360) / 8;
            return (
              <line
                key={i}
                x1="100"
                y1="67"
                x2="100"
                y2="71"
                stroke="#EAB308"
                strokeWidth="2.5"
                strokeLinecap="round"
                transform={`rotate(${angle} 100 82)`}
              />
            );
          })}
        </g>

        {/* 8. Philippine Dual-Color Shield / Book at the center */}
        <g id="center-shield">
          {/* Left Blue Half */}
          <path
            d="M 78,98 Q 78,118 100,126 L 100,98 Z"
            fill="#1D4ED8"
            stroke="#0F291E"
            strokeWidth="1.2"
          />
          {/* Right Red Half */}
          <path
            d="M 100,98 L 100,126 Q 122,118 122,98 Z"
            fill="#DC2626"
            stroke="#0F291E"
            strokeWidth="1.2"
          />

          {/* White Open Book / Torch Motif Overlay */}
          <path
            d="M 86,104 Q 93,101 100,105 Q 107,101 114,104 L 114,115 Q 107,112 100,116 Q 93,112 86,115 Z"
            fill="#FFFFFF"
            stroke="#0F291E"
            strokeWidth="1"
          />
          {/* Spine divider of the book */}
          <line x1="100" y1="105" x2="100" y2="116" stroke="#0F291E" strokeWidth="1" />

          {/* Micro Details on the pages */}
          <circle cx="93" cy="109" r="1.5" fill="#1D4ED8" />
          <circle cx="107" cy="109" r="1.5" fill="#DC2626" />
        </g>
      </svg>
      )}
    </div>
  );
};
