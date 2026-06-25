// ─── Background Grid ────────────────────────────────────────────────────────

import React from 'react';

interface GridProps {
  zoom: number;
  panX: number;
  panY: number;
}

const GRID_SIZE = 20;

export const Grid = React.memo(function Grid({ zoom, panX, panY }: GridProps) {
  const scaledGrid = GRID_SIZE * zoom;
  const offsetX = panX % scaledGrid;
  const offsetY = panY % scaledGrid;

  // Show major grid lines every 5 cells
  const majorGrid = scaledGrid * 5;
  const majorOffsetX = panX % majorGrid;
  const majorOffsetY = panY % majorGrid;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <defs>
        <pattern
          id="minor-grid"
          width={scaledGrid}
          height={scaledGrid}
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d={`M ${scaledGrid} 0 L 0 0 0 ${scaledGrid}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-gray-200 dark:text-fg-secondary"
            opacity="0.5"
          />
        </pattern>
        <pattern
          id="major-grid"
          width={majorGrid}
          height={majorGrid}
          patternUnits="userSpaceOnUse"
          x={majorOffsetX}
          y={majorOffsetY}
        >
          <rect width={majorGrid} height={majorGrid} fill="url(#minor-grid)" />
          <path
            d={`M ${majorGrid} 0 L 0 0 0 ${majorGrid}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-fg-secondary dark:text-fg-secondary"
            opacity="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#major-grid)" />
    </svg>
  );
});
