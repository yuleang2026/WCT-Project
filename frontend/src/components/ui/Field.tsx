"use client";

import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

const baseFieldClasses =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 disabled:bg-gray-50 disabled:text-gray-500";

export function Label({ children, htmlFor, required }: { children: React.ReactNode; htmlFor?: string; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-gray-700">
      {children}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
  );
}

export function ErrorText({ children }: { children?: string | null }) {
  if (!children) return null;
  return <p className="mt-1 text-xs text-red-600">{children}</p>;
}

export function Input({ className, error, ...props }: InputHTMLAttributes<HTMLInputElement> & { error?: string | null }) {
  return (
    <input
      className={cn(baseFieldClasses, error && "border-red-400 focus:border-red-500 focus:ring-red-500", className)}
      {...props}
    />
  );
}

export function Textarea({ className, error, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string | null }) {
  return (
    <textarea
      className={cn(baseFieldClasses, "min-h-24", error && "border-red-400 focus:border-red-500 focus:ring-red-500", className)}
      {...props}
    />
  );
}

export function Select({ className, error, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { error?: string | null }) {
  return (
    <select
      className={cn(baseFieldClasses, error && "border-red-400 focus:border-red-500 focus:ring-red-500", className)}
      {...props}
    >
      {children}
    </select>
  );
}
