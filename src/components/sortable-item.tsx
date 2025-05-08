"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

interface SortableItemProps {
  id: string;
  member: {
    id: number;
    fullName: string;
  };
}

export default function SortableItem({ id, member }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-2 border border-border rounded bg-card hover:bg-card-foreground/10"
    >
      {member.fullName}
    </div>
  );
}
