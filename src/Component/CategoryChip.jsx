import React from "react";
import { ChevronRight } from "lucide-react";
import "./CategoryChip.scss";

export function CategoryChip({ name, color }) {
  return (
    <button className={`category-chip ${color}`}>
      <span className="chip-name">{name}</span>
      <ChevronRight className="chip-icon" />
    </button>
  );
}
