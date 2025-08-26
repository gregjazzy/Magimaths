import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

interface LazyNavigationProps {
  items: NavigationItem[];
  className?: string;
}

export default function LazyNavigation({ items, className = '' }: LazyNavigationProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={`relative ${className}`}>
      <motion.div
        initial={false}
        animate={isOpen ? "open" : "closed"}
        className="flex flex-col space-y-2"
      >
        {items.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center p-2 rounded-lg transition-colors
              ${pathname === item.href ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
          >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            <span>{item.label}</span>
          </Link>
        ))}
      </motion.div>
    </nav>
  );
}

