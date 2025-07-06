'use client';

import * as React from "react";

type SelectProps = {
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
};

export function Select({ onValueChange, children }: SelectProps) {
  return (
    <div>
      {React.Children.map(children, child =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<unknown>, { onValueChange })
          : child
      )}
    </div>
  );
}

type SelectTriggerProps = React.ComponentProps<"button"> & {
  children: React.ReactNode;
};

export function SelectTrigger({ children, ...props }: SelectTriggerProps) {
  return (
    <button
      {...props}
      className="px-3 py-2 border rounded w-full bg-white dark:bg-black dark:border-gray-600"
      type="button"
    >
      {children}
    </button>
  );
}

type SelectValueProps = {
  placeholder?: string;
  children?: React.ReactNode;
};

export function SelectValue({ placeholder, children }: SelectValueProps) {
  return (
    <span className="text-gray-700 dark:text-gray-300">
      {children || placeholder}
    </span>
  );
}

type SelectContentProps = {
  children: React.ReactNode;
};

export function SelectContent({ children }: SelectContentProps) {
  return (
    <ul className="mt-2 border rounded bg-white dark:bg-black dark:border-gray-600">
      {children}
    </ul>
  );
}

type SelectItemProps = React.ComponentProps<"li"> & {
  value: string;
  children: React.ReactNode;
  onValueChange?: (value: string) => void;
};

export function SelectItem({
  value,
  children,
  onValueChange,
  ...props
}: SelectItemProps) {
  return (
    <li
      {...props}
      className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
      onClick={() => onValueChange && onValueChange(value)}
    >
      {children}
    </li>
  );
}
