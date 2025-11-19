import React from 'react';

type SplitTextProps = {
  children: string;
};

const SplitText: React.FC<SplitTextProps> = ({ children }) => {
  return (
    <>
      {children.split('').map((char, index) => (
        <span
          key={index}
          className="animated-char"
          style={{ animationDelay: `${index * 50}ms` }}
          aria-hidden="true"
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </>
  );
};

export default SplitText;
