
import React from 'react';
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface CategoryBadgeProps {
  name: string;
  className?: string;
}

const CategoryBadge = ({ name, className }: CategoryBadgeProps) => {
  return (
    <Badge 
      className={cn(
        "bg-primary-100 text-primary-700 hover:bg-primary-200", 
        className
      )}
    >
      {name}
    </Badge>
  );
};

export default CategoryBadge;
