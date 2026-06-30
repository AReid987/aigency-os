// ─── Draggable Card Component ───────────────────────────────────────────────

import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { Card as CardData, ZoneType } from '@vscp/shared-types';
import { useCanvasStore } from '../stores/canvasStore';
import { useAuthStore } from '../stores/authStore';
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

const typeLabels: Record<string, string> = {
  text: 'Text',
  image: 'Image',
  link: 'Link',
  embed: 'Embed',
  calculator: 'Calculator',
  preview: 'Preview',
};

export const Card = React.memo(function Card({
  card,
  zoneType,
  zoom,
  onCardMove,
}: CardProps) {
  const { selectedCards, selectCard, moveCard, deleteCard, updateCardContent } = useCanvasStore();
  const role = useAuthStore((s) => s.user?.role ?? 'domain_expert');
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
            <p className="text-xs text-fg-muted">Unknown card type: {card.type}</p>
          </div>
        );
    }
  };

  return (
    <div
      ref={cardRef}
      data-testid="canvas-card"
      className={`absolute select-none rounded-md border bg-surface/60 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.06)]
        ${isSelected ? 'ring-2 ring-primary shadow-[0_4px_16px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.06)] z-20' : 'z-10 hover:shadow-[0_1px_3px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.06)]'}
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
      <div className="flex items-center justify-between px-2 py-1 border-b border-border rounded-t-md bg-elevated/40 backdrop-blur-sm">
        <div className="flex items-center gap-1.5 text-fg-muted">
          <GripVertical size={12} />
          <span className="text-[11px] font-medium text-fg-muted">
            {typeLabels[card.type] ?? card.type}
          </span>
          {typeIcons[card.type]}
        </div>
        {isSelected && editable && (
          <button
            onClick={handleDelete}
            className="p-0.5 rounded hover:bg-error-muted text-fg-muted hover:text-error transition-colors"
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
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-surface/70 text-fg-muted">
            Read-only
          </span>
        </div>
      )}
    </div>
  );
});
