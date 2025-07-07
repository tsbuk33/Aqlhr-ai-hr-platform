import React from 'react';

interface PartnerLogoProps {
  src: string;
  alt: string;
  href: string;
}

export const PartnerLogo: React.FC<PartnerLogoProps> = ({ src, alt, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center"
  >
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="
        h-12 w-auto
        object-contain
        grayscale
        hover:grayscale-0
        transition
        duration-200
        ease-in-out
        filter invert dark:invert-0
      "
    />
    <span className="sr-only">{alt}</span>
  </a>
);