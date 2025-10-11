export default function QRScanningAnimation() {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <svg
        viewBox="0 0 400 300"
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Definitions for animations */}
        <defs>
          <linearGradient id="scanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.8">
              <animate attributeName="stop-opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.3">
              <animate attributeName="stop-opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </defs>

        {/* Phone device */}
        <g>
          {/* Phone body */}
          <rect
            x="280"
            y="50"
            width="80"
            height="140"
            rx="8"
            fill="#1f2937"
            stroke="#374151"
            strokeWidth="2"
          />

          {/* Phone screen */}
          <rect
            x="285"
            y="65"
            width="70"
            height="110"
            rx="4"
            fill="#111827"
          />

          {/* Camera lens */}
          <circle cx="320" cy="90" r="8" fill="#374151" />
          <circle cx="320" cy="90" r="6" fill="#1f2937" />

          {/* Scanning beam */}
          <rect
            x="290"
            y="75"
            width="60"
            height="3"
            fill="url(#scanGradient)"
            opacity="0.8"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 0,80; 0,0"
              dur="3s"
              repeatCount="indefinite"
            />
          </rect>

          {/* Food items on phone screen */}
          <g>
            {/* First food item */}
            <rect x="295" y="100" width="55" height="15" rx="2" fill="#f97316" opacity="0">
              <animate attributeName="opacity" values="0;1;1" dur="3s" begin="0.5s" fill="freeze" />
            </rect>

            {/* Second food item */}
            <rect x="295" y="120" width="55" height="15" rx="2" fill="#ef4444" opacity="0">
              <animate attributeName="opacity" values="0;1;1" dur="3s" begin="1s" fill="freeze" />
            </rect>

            {/* Third food item */}
            <rect x="295" y="140" width="55" height="15" rx="2" fill="#10b981" opacity="0">
              <animate attributeName="opacity" values="0;1;1" dur="3s" begin="1.5s" fill="freeze" />
            </rect>
          </g>
        </g>

        {/* QR Code */}
        <g>
          {/* QR Code background */}
          <rect
            x="40"
            y="80"
            width="100"
            height="100"
            rx="4"
            fill="white"
            stroke="#e5e7eb"
            strokeWidth="1"
          />

          {/* QR Code pattern (simplified) */}
          <g opacity="0.3">
            {/* Corner squares */}
            <rect x="45" y="85" width="20" height="20" fill="#111827" />
            <rect x="50" y="90" width="10" height="10" fill="white" />

            <rect x="115" y="85" width="20" height="20" fill="#111827" />
            <rect x="120" y="90" width="10" height="10" fill="white" />

            <rect x="45" y="155" width="20" height="20" fill="#111827" />
            <rect x="50" y="160" width="10" height="10" fill="white" />

            {/* Random pattern */}
            <rect x="75" y="95" width="5" height="5" fill="#111827" />
            <rect x="85" y="95" width="5" height="5" fill="#111827" />
            <rect x="95" y="95" width="5" height="5" fill="#111827" />
            <rect x="105" y="95" width="5" height="5" fill="#111827" />

            <rect x="70" y="105" width="5" height="5" fill="#111827" />
            <rect x="80" y="105" width="5" height="5" fill="#111827" />
            <rect x="90" y="105" width="5" height="5" fill="#111827" />
            <rect x="100" y="105" width="5" height="5" fill="#111827" />
            <rect x="110" y="105" width="5" height="5" fill="#111827" />

            <rect x="75" y="115" width="5" height="5" fill="#111827" />
            <rect x="85" y="115" width="5" height="5" fill="#111827" />
            <rect x="95" y="115" width="5" height="5" fill="#111827" />
            <rect x="105" y="115" width="5" height="5" fill="#111827" />

            <rect x="70" y="125" width="5" height="5" fill="#111827" />
            <rect x="80" y="125" width="5" height="5" fill="#111827" />
            <rect x="90" y="125" width="5" height="5" fill="#111827" />
            <rect x="100" y="125" width="5" height="5" fill="#111827" />
            <rect x="110" y="125" width="5" height="5" fill="#111827" />

            <rect x="75" y="135" width="5" height="5" fill="#111827" />
            <rect x="85" y="135" width="5" height="5" fill="#111827" />
            <rect x="95" y="135" width="5" height="5" fill="#111827" />
            <rect x="105" y="135" width="5" height="5" fill="#111827" />

            <rect x="70" y="145" width="5" height="5" fill="#111827" />
            <rect x="80" y="145" width="5" height="5" fill="#111827" />
            <rect x="90" y="145" width="5" height="5" fill="#111827" />
            <rect x="100" y="145" width="5" height="5" fill="#111827" />
            <rect x="110" y="145" width="5" height="5" fill="#111827" />

            <rect x="75" y="155" width="5" height="5" fill="#111827" />
            <rect x="85" y="155" width="5" height="5" fill="#111827" />
            <rect x="95" y="155" width="5" height="5" fill="#111827" />
            <rect x="105" y="155" width="5" height="5" fill="#111827" />
          </g>
        </g>

        {/* Scanning lines effect */}
        <g opacity="0.5">
          <line x1="140" y1="130" x2="280" y2="130" stroke="#f97316" strokeWidth="2">
            <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
          </line>
          <line x1="140" y1="130" x2="280" y2="130" stroke="#f97316" strokeWidth="1">
            <animate attributeName="opacity" values="0;1;0" dur="2s" begin="0.5s" repeatCount="indefinite" />
          </line>
          <line x1="140" y1="130" x2="280" y2="130" stroke="#f97316" strokeWidth="1">
            <animate attributeName="opacity" values="0;1;0" dur="2s" begin="1s" repeatCount="indefinite" />
          </line>
        </g>

        {/* Connection dots */}
        <g>
          <circle cx="200" cy="130" r="3" fill="#f97316">
            <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="220" cy="125" r="2" fill="#f97316">
            <animate attributeName="r" values="2;4;2" dur="2s" begin="0.3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.5;1" dur="2s" begin="0.3s" repeatCount="indefinite" />
          </circle>
          <circle cx="240" cy="135" r="2" fill="#f97316">
            <animate attributeName="r" values="2;4;2" dur="2s" begin="0.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.5;1" dur="2s" begin="0.6s" repeatCount="indefinite" />
          </circle>
          <circle cx="260" cy="128" r="2" fill="#f97316">
            <animate attributeName="r" values="2;4;2" dur="2s" begin="0.9s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.5;1" dur="2s" begin="0.9s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Food icons floating around */}
        <g>
          {/* Bowl emoji */}
          <text x="60" y="40" fontSize="20" textAnchor="middle" opacity="0.6">
            🍜
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 5,-5; 0,0"
              dur="4s"
              repeatCount="indefinite"
            />
          </text>

          {/* Rice emoji */}
          <text x="180" y="60" fontSize="18" textAnchor="middle" opacity="0.6">
            🍛
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; -5,3; 0,0"
              dur="3.5s"
              repeatCount="indefinite"
            />
          </text>

          {/* Sushi emoji */}
          <text x="320" y="40" fontSize="16" textAnchor="middle" opacity="0.6">
            🍱
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 3,-5; 0,0"
              dur="3s"
              repeatCount="indefinite"
            />
          </text>

          {/* Drink emoji */}
          <text x="150" y="220" fontSize="16" textAnchor="middle" opacity="0.6">
            🥤
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; -4,4; 0,0"
              dur="3.8s"
              repeatCount="indefinite"
            />
          </text>

          {/* Salad emoji */}
          <text x="250" y="230" fontSize="18" textAnchor="middle" opacity="0.6">
            🥗
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 5,3; 0,0"
              dur="4.2s"
              repeatCount="indefinite"
            />
          </text>
        </g>

        {/* Success checkmark animation */}
        <g opacity="0">
          <circle cx="320" cy="130" r="15" fill="#10b981" opacity="0.9">
            <animate attributeName="opacity" values="0;0.9;0" dur="3s" begin="2.5s" repeatCount="indefinite" />
          </circle>
          <path
            d="M312 130 L317 135 L328 125"
            stroke="white"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0">
            <animate attributeName="opacity" values="0;1;0" dur="3s" begin="2.5s" repeatCount="indefinite" />
          </path>
        </g>
      </svg>
    </div>
  );
}