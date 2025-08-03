interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = "", size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: '#0077b5', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: '#005885', stopOpacity: 1}} />
          </linearGradient>
        </defs>
        
        {/* Outer circle */}
        <circle 
          cx="50" 
          cy="50" 
          r="48" 
          fill="url(#logoGradient)"
          stroke="#ffffff"
          strokeWidth="2"
        />
        
        {/* Network nodes */}
        <circle cx="25" cy="25" r="6" fill="#ffffff" opacity="0.9" />
        <circle cx="75" cy="25" r="6" fill="#ffffff" opacity="0.9" />
        <circle cx="50" cy="45" r="8" fill="#ffffff" />
        <circle cx="25" cy="75" r="6" fill="#ffffff" opacity="0.9" />
        <circle cx="75" cy="75" r="6" fill="#ffffff" opacity="0.9" />
        
        {/* Connection lines */}
        <line x1="25" y1="25" x2="50" y2="45" stroke="#ffffff" strokeWidth="2" opacity="0.7" />
        <line x1="75" y1="25" x2="50" y2="45" stroke="#ffffff" strokeWidth="2" opacity="0.7" />
        <line x1="50" y1="45" x2="25" y2="75" stroke="#ffffff" strokeWidth="2" opacity="0.7" />
        <line x1="50" y1="45" x2="75" y2="75" stroke="#ffffff" strokeWidth="2" opacity="0.7" />
        <line x1="25" y1="75" x2="75" y2="75" stroke="#ffffff" strokeWidth="2" opacity="0.5" />
      </svg>
    </div>
  );
}