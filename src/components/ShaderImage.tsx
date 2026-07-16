'use client';

import { HalftoneDots } from '@paper-design/shaders-react';

const shaderProps = {
  colorBack: '#ffffff',
  colorFront: '#58dfcf',
  originalColors: false,
  type: 'gooey',
  grid: 'hex',
  inverted: false,
  size: 0.5,
  radius: 1.25,
  contrast: 0.4,
  grainMixer: 0.2,
  grainOverlay: 0.2,
  grainSize: 0.5,
  fit: 'cover',
} as const;

type ShaderImageProps = {
  image: string;
  alt?: string;
  className?: string;
};

export function ShaderImage({ image, alt, className }: ShaderImageProps) {
  return (
    <div className={className} role={alt ? 'img' : undefined} aria-label={alt}>
      <HalftoneDots {...shaderProps} image={image} width="100%" height="100%" maxPixelCount={1800000} />
    </div>
  );
}

type ShaderBackgroundProps = {
  image: string;
  overlay?: string;
};

export function ShaderBackground({ image, overlay }: ShaderBackgroundProps) {
  return (
    <div className="shader-background" aria-hidden="true">
      <HalftoneDots {...shaderProps} image={image} width="100%" height="100%" maxPixelCount={2400000} />
      {overlay && <div className="shader-background-overlay" style={{ background: overlay }} />}
      <style jsx>{`
        .shader-background {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
        }

        .shader-background-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
