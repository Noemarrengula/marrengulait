import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center space-x-2 text-sm ${className}`}>
      <Link
        to="/"
        className="flex items-center text-muted-foreground hover:text-[#FF3131] transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {items.map((item, index) => (
        <div key={item.label + (item.href || '')} className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          {item.href ? (
            <Link
              to={item.href}
              className="text-muted-foreground hover:text-[#FF3131] transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
