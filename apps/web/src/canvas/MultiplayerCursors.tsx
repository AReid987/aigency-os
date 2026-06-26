// ─── Multiplayer Cursors ────────────────────────────────────────────────────

import React from 'react';
import { useCanvasStore } from '../stores/canvasStore';

export const MultiplayerCursors = React.memo(function MultiplayerCursors() {
  const cursors = useCanvasStore((s) => s.cursors);

  if (cursors.size === 0) return null;

  return (
    <>
      {Array.from(cursors.values()).map((cursor) => (
        <div
          key={cursor.userId}
          className="absolute pointer-events-none z-50 transition-all duration-75"
          style={{
            left: cursor.position.x,
            top: cursor.position.y,
            transform: 'translate(-2px, -2px)',
          }}
        >
          {/* Cursor arrow */}
          <svg
            className="text-fg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 1L17 10L10 11L7 18L3 1Z"
              fill={cursor.color}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>

          {/* Name label */}
          <div
            className="absolute left-4 top-4 px-2 py-0.5 rounded text-[10px] font-medium text-fg whitespace-nowrap shadow-sm"
            style={{ backgroundColor: cursor.color }}
          >
            {cursor.userName}
          </div>
        </div>
      ))}
    </>
  );
});
