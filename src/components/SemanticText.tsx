'use client';

import React from 'react';
import { SemanticWrap } from '@semantic-wrap/react';
import { koTitleModel } from '@semantic-wrap/ko';

interface SemanticTextProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  className?: string;
  style?: React.CSSProperties;
  children: string;
}

/**
 * Wraps Korean text with @semantic-wrap for natural, grammatically correct line breaks
 */
export function SemanticText({
  as: Component = 'p',
  className,
  style,
  children,
}: SemanticTextProps) {
  if (typeof children !== 'string' || !children.trim()) {
    return (
      <Component className={className} style={style}>
        {children}
      </Component>
    );
  }

  return (
    <SemanticWrap model={koTitleModel} initial="native" resize="settled">
      <Component className={className} style={style}>
        {children}
      </Component>
    </SemanticWrap>
  );
}

export default SemanticText;
