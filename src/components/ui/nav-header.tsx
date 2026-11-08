"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

export interface NavItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface NavHeaderProps {
  items?: NavItem[];
  className?: string;
}

export function NavHeader({ items, className = "" }: NavHeaderProps) {
  const [position, setPosition] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const defaultItems: NavItem[] = [
    { label: "Home", href: "#beranda" },
    { label: "Pricing", href: "#katalog" },
    { label: "About", href: "#tentang" },
    { label: "Services", href: "#keunggulan" },
    { label: "Contact", href: "#kontak" },
  ];

  const navItems: NavItem[] = items || defaultItems;

  return (
    <ul
      className={`relative mx-auto flex w-fit items-center rounded-full border border-forest/20 bg-white/95 p-1 shadow-sm backdrop-blur-md ${className}`}
      onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
    >
      {navItems.map((item, index) => (
        <Tab key={index} setPosition={setPosition} href={item.href} onClick={item.onClick}>
          {item.label}
        </Tab>
      ))}

      <Cursor position={position} />
    </ul>
  );
}

const Tab = ({
  children,
  setPosition,
  href,
  onClick,
}: {
  children: React.ReactNode;
  setPosition: React.Dispatch<React.SetStateAction<{ left: number; width: number; opacity: number }>>;
  href?: string;
  onClick?: () => void;
}) => {
  const ref = useRef<HTMLLIElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;
        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          width,
          opacity: 1,
          left: ref.current.offsetLeft,
        });
      }}
      className="relative z-10 block cursor-pointer px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-charcoal transition-colors hover:text-white md:px-4 md:py-1.5 md:text-xs"
    >
      {href ? (
        <a href={href} onClick={handleClick} className="block whitespace-nowrap">
          {children}
        </a>
      ) : (
        <button onClick={handleClick} type="button" className="block whitespace-nowrap focus:outline-none">
          {children}
        </button>
      )}
    </li>
  );
};

const Cursor = ({ position }: { position: { left: number; width: number; opacity: number } }) => {
  return (
    <motion.li
      animate={position}
      transition={{ type: "spring", stiffness: 450, damping: 32 }}
      className="absolute z-0 h-7 md:h-7 rounded-full bg-forest text-white"
    />
  );
};

export default NavHeader;
