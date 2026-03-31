import { NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface BottomNavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

interface BottomNavigationProps {
  items: BottomNavItem[];
}

const BottomNavigation = ({ items }: BottomNavigationProps) => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {items.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <RouterNavLink
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center flex-1 h-full gap-0.5"
            >
              <item.icon
                className={`h-5 w-5 transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </span>
            </RouterNavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
