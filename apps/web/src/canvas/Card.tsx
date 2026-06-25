// ─── Draggable Card Component ───────────────────────────────────────────────

import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { Card as CardType, ZoneType } from '@vscp/shared-types';
import { useCanvasStore } from '../stores/canvasStore';
import { useUserStore } from '../stores/userStore';
import { snapToGrid } from '../utils/canvasMath';
import { canEditZone } from '../utils/permissions';
import { X, GripVertical, ExternalLink, Image as ImageIcon, FileText, Code } from 'lucide-react';

interface CanvasCardProps {
  card: CardType;
  zoneType: ZoneType;
  zoom: number;
  onCardMove?: (id: string, position: { x: number; y: number }) => void;
}

const typeIcons: Record<string, React.ReactNode> = {
  text: <FileText size={14} />,
  image: <ImageIcon size={14} />,
  link: <ExternalLink size={14} />,
  embed: <Code size={14} />,
};

const typeColors: Record<string, string> = {
  text: 'border-l-blue-400',
  image: 'border-l-green-400',
  link: 'border-l-purple-400',
  embed: 'border-l-orange-400',
  calculator: 'border-l-yellow-400',
  preview: 'border-l-cyan-400',
};

export const CanvasCard = React.memo(function CanvasCard({
  card,
  zoneType,
  zoom,
  onCardMove,
}: CanvasCardProps) {
  const { selectedCards, selectCard, moveCard, deleteCard, updateCardContent } = useCanvasStore();
  const { role } = useUserStore();
  const isSelected = selectedCards.includes(card.id);
  const editable = canEditZone(role, zoneType);

  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; cardX: number; cardY: number } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!editable) return;
      if (e.button !== 0) return;
      e.stopPropagation();
      e.preventDefault();

      setIsDragging(true);
      dragStartRef.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        cardX: card.position.x,
        cardY: card.position.y,
      };

      selectCard(card.id, e.shiftKey);
    },
    [editable, card.id, card.position, selectCard],
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return;
      const dx = (e.clientX - dragStartRef.current.mouseX) / zoom;
      const dy = (e.clientY - dragStartRef.current.mouseY) / zoom;
      const newPos = snapToGrid({
        x: dragStartRef.current.cardX + dx,
        y: dragStartRef.current.cardY + dy,
      });
      moveCard(card.id, newPos);
      onCardMove?.(card.id, newPos);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, card.id, zoom, moveCard, onCardMove]);

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!editable) return;
      e.stopPropagation();
      setIsEditing(true);
    },
    [editable],
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      deleteCard(card.id);
    },
    [card.id, deleteCard],
  );

  // Render content based on card type
  const renderContent = () => {
    const content = card.content as Record<string, string>;

    if (isEditing && editable) {
      return (
        <div className="space-y-2 p-3">
          <input
            autoFocus
            className="w-full text-sm font-semibold bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 px-0 py-1"
            defaultValue={(content.title as string) || ''}
            onBlur={(e) => {
              updateCardContent(card.id, { title: e.target.value });
              setIsEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateCardContent(card.id, { title: (e.target as HTMLInputElement).value });
                setIsEditing(false);
              }
            }}
          />
          <textarea
            className="w-full text-xs bg-transparent border border-gray-200 dark:border-gray-700 rounded p-1.5 focus:outline-none focus:border-blue-500 resize-none"
            rows={4}
            defaultValue={(content.text as string) || ''}
            onBlur={(e) => {
              updateCardContent(card.id, { text: e.target.value });
            }}
          />
          <button
            className="text-xs text-blue-600 hover:underline"
            onClick={() => setIsEditing(false)}
          >
            Done
          </button>
        </div>
      );
    }

    switch (card.type) {
      case 'text':
        return (
          <div className="p-3">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {(content.title as string) || 'Untitled'}
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              {(content.text as string) || 'Double-click to edit...'}
            </p>
          </div>
        );

      case 'image':
        return (
          <div className="p-2">
            {content.src ? (
              <img
                src={content.src as string}
                alt={(content.alt as string) || 'Card image'}
                className="w-full h-32 object-cover rounded"
              />
            ) : (
              <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                <ImageIcon size={24} className="text-gray-400" />
              </div>
            )}
            {content.caption && (
              <p className="text-xs text-gray-500 mt-1 px-1">{content.caption as string}</p>
            )}
          </div>
        );

      case 'link':
        return (
          <div className="p-3">
            <div className="flex items-start gap-2">
              <ExternalLink size={16} className="text-purple-500 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {(content.title as string) || 'Link'}
                </h4>
                {content.url && (
                  <a
                    href={content.url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-purple-600 hover:underline truncate block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {content.url as string}
                  </a>
                )}
                {content.description && (
                  <p className="text-xs text-gray-500 mt-1">
                    {content.description as string}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 'embed':
        return (
          <div className="p-2">
            <div className="flex items-center gap-1.5 mb-1.5 px-1">
              <Code size={14} className="text-orange-500" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {(content.title as string) || 'Embed'}
              </span>
            </div>
            {content.src ? (
              <iframe
                src={content.src as string}
                className="w-full h-48 rounded border border-gray-200 dark:border-gray-700"
                sandbox="allow-scripts allow-same-origin"
                title={(content.title as string) || 'Embedded content'}
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                <span className="text-xs text-gray-400">No URL configured</span>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="p-3">
            <p className="text-xs text-gray-500">Unknown card type: {card.type}</p>
          </div>
        );
    }
  };

  return (
    <div
      ref={cardRef}
      data-testid="canvas-card"
      className={`absolute select-none rounded-lg border bg-white dark:bg-gray-800 shadow-sm
        ${typeColors[card.type] || 'border-l-gray-400'} border-l-4
        ${isSelected ? 'ring-2 ring-blue-500 shadow-md z-20' : 'z-10 hover:shadow-md'}
        ${isDragging ? 'cursor-grabbing opacity-90 z-30' : editable ? 'cursor-grab' : 'cursor-default'}
        ${!editable ? 'opacity-80' : ''}
        transition-shadow duration-100
      `}
      style={{
        left: card.position.x,
        top: card.position.y,
        width: card.size.width,
        minHeight: card.size.height,
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {/* Card header with drag handle */}
      <div className="flex items-center justify-between px-2 py-1 border-b border-gray-100 dark:border-gray-700 rounded-t-lg bg-gray-50/50 dark:bg-gray-900/30">
        <div className="flex items-center gap-1.5 text-gray-400">
          <GripVertical size={12} />
          <span className="text-[10px] uppercase tracking-wider font-medium text-gray-500 dark:text-gray-400">
            {card.type}
          </span>
          {typeIcons[card.type]}
        </div>
        {isSelected && editable && (
          <button
            onClick={handleDelete}
            className="p-0.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Delete card"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Card content */}
      {renderContent()}

      {/* Read-only indicator */}
      {!editable && (
        <div className="absolute top-1 right-1">
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500">
            Read-only
          </span>
        </div>
      )}
    </div>
  );
});
