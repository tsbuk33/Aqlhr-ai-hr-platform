import React from 'react';

interface PartnerLogoProps {
  src: string;
  alt: string;
  href: string;
  className?: string;
}

export const PartnerLogo: React.FC<PartnerLogoProps> = ({ 
  src, 
  alt, 
  href, 
  className = "h-12" 
}) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group transition-all duration-300 hover:scale-105"
    >
      <img
        src={src}
        alt={alt}
        className={`${className} w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300`}
      />
      <span className="sr-only">{alt}</span>
    </a>
  );
};