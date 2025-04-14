
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14'
  };

  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <img 
        src="/lovable-uploads/2bd95b33-f6fc-4e47-b6e6-a247fb042769.png" 
        alt="Lovely Professional University" 
        className={`${sizeClasses[size]}`}
      />
    </Link>
  );
};

export default Logo;
