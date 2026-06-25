// ─── Draggable Card Component ───────────────────────────────────────────────

import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { Card as CardData, ZoneType } from '@vscp/shared-types';
import { useCanvasStore } from '../stores/canvasStore';
import { useUserStore } from '../stores/userStore';
import { snapToGrid } from '../utils/canvasMath';
import { canEditZone } from '../utils/permissions';
import { X, GripVertical, FileText, Image as ImageIcon, ExternalLink, Code } from 'lucide-react';
import { TextCard } from './cards/TextCard';
import { ImageCard } from './cards/ImageCard';
import { LinkCard } from './cards/LinkCard';
import { EmbedCard } from './cards/EmbedCard';

interface CardProps {
  card: CardData;
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

export const Card = React.memo(function Card({
  card,
  zoneType,
  zoom,
  onCardMove,
}: CardProps) {
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

  const handleUpdate = useCallback(
    (content: Record<string, unknown>) => {
      updateCardContent(card.id, content);
    },
    [card.id, updateCardContent],
  );

  const handleEditDone = useCallback(() => {
    setIsEditing(false);
  }, []);

  // Render type-specific content
  const renderContent = () => {
    switch (card.type) {
      case 'text':
        return (
          <TextCard
            card={card}
            isEditing={isEditing}
            editable={editable}
            onUpdate={handleUpdate}
            onEditDone={handleEditDone}
          />
        );
      case 'image':
        return (
          <ImageCard
            card={card}
            isEditing={isEditing}
            editable={editable}
            onUpdate={handleUpdate}
            onEditDone={handleEditDone}
          />
        );
      case 'link':
        return (
          <LinkCard
            card={card}
            isEditing={isEditing}
            editable={editable}
            onUpdate={handleUpdate}
            onEditDone={handleEditDone}
          />
        );
      case 'embed':
        return (
          <EmbedCard
            card={card}
            isEditing={isEditing}
            editable={editable}
            onUpdate={handleUpdate}
            onEditDone={handleEditDone}
          />
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
