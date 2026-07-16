'use client';

import React from 'react';
import { motion } from 'framer-motion';

type TextToken = string | { text: string; className?: string };
type TextLine = string | TextToken[] | React.ReactElement;

export const TextReveal: React.FC<{
  lines: TextLine[];
  as?: 'h1' | 'h2' | 'span';
  className?: string;
  mode?: 'word' | 'line';
  delay?: number;
}> = ({ lines, as: Tag = 'span', className, mode = 'word', delay = 0 }) => {
  const renderWordLine = (line: string | TextToken[], lineIndex: number) => {
    const words: TextToken[] = typeof line === 'string'
      ? line.split(/\s+/).filter(Boolean)
      : line;

    return (
      <span key={lineIndex} style={{ display: 'block' }}>
        {words.map((word, wordIndex) => {
          const text = typeof word === 'string' ? word : word.text;
          const tokenClassName = typeof word === 'string' ? undefined : word.className;

          return (
            <span
              key={`${lineIndex}-${wordIndex}-${text}`}
              style={{
                display: 'inline-block',
                overflow: 'hidden',
                verticalAlign: 'top',
                marginRight: wordIndex === words.length - 1 ? 0 : '0.22em'
              }}
            >
              <motion.span
                className={tokenClassName}
                initial={{ y: '100%' }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  delay: delay + lineIndex * 0.12 + wordIndex * 0.07,
                  duration: 0.75,
                  ease: [0.22, 1, 0.36, 1]
                }}
                style={{ display: 'inline-block' }}
              >
                {text}
              </motion.span>
            </span>
          );
        })}
      </span>
    );
  };

  const renderLine = (line: TextLine, lineIndex: number) => {
    if (mode === 'word' && (typeof line === 'string' || Array.isArray(line))) {
      return renderWordLine(line, lineIndex);
    }

    const lineContent = Array.isArray(line)
      ? line.map((token) => typeof token === 'string' ? token : token.text).join(' ')
      : line;

    return (
      <span key={lineIndex} style={{ display: 'block', overflow: 'hidden' }}>
        <motion.span
          initial={{ y: '100%' }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{
            delay: delay + lineIndex * 0.12,
            duration: 0.75,
            ease: [0.22, 1, 0.36, 1]
          }}
          style={{ display: 'inline-block' }}
        >
          {lineContent}
        </motion.span>
      </span>
    );
  };

  return <Tag className={className}>{lines.map(renderLine)}</Tag>;
};

// Page Transition Wrapper
export const PageTransition: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Scroll Reveal Wrapper (triggers animation when entering viewport)
export const ScrollReveal: React.FC<{ 
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  className?: string;
}> = ({ children, delay = 0, direction = 'up', distance = 30, className }) => {
  
  const getInitialDirection = () => {
    switch(direction) {
      case 'up': return { y: distance };
      case 'down': return { y: -distance };
      case 'left': return { x: distance };
      case 'right': return { x: -distance };
      default: return { y: distance };
    }
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...getInitialDirection()
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ 
        duration: 0.7, 
        delay: delay, 
        ease: [0.215, 0.610, 0.355, 1.000] // Cubic Bezier equivalent to easeOutCubic
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Stagger Container for list animations
export const StaggerContainer: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.15,
            delayChildren: delay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Stagger Item (must be nested within StaggerContainer)
export const StaggerItem: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.5, ease: 'easeOut' }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
