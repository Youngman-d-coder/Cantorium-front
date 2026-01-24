import { type ReactNode } from "react";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`animate-pulse rounded bg-slate-700/50 ${className}`} />
  );
}

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Spinner({ size = "md", className = "" }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-10 w-10 border-3",
  };

  return (
    <div
      className={`animate-spin rounded-full border-cyan-400/30 border-t-cyan-400 ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = "Loading..." }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-cyan-400/20 bg-slate-900/90 px-8 py-6 shadow-xl">
        <Spinner size="lg" />
        <p className="text-sm text-slate-300">{message}</p>
      </div>
    </div>
  );
}

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "success" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  onClick,
}: ButtonProps) {
  const baseClasses = "relative inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0";

  const variantClasses = {
    primary: "border border-cyan-400/40 bg-cyan-500/10 text-cyan-100 hover:border-cyan-300 hover:bg-cyan-500/20 focus:ring-cyan-500/50",
    secondary: "border border-slate-700 bg-slate-800/80 text-slate-200 hover:border-cyan-400/40 hover:text-cyan-100 focus:ring-slate-500/50",
    danger: "border border-rose-400/40 bg-rose-500/10 text-rose-100 hover:border-rose-300 hover:bg-rose-500/20 focus:ring-rose-500/50",
    success: "border border-emerald-400/40 bg-emerald-500/10 text-emerald-100 hover:border-emerald-300 hover:bg-emerald-500/20 focus:ring-emerald-500/50",
    ghost: "border border-transparent bg-transparent text-slate-300 hover:bg-slate-800/50 hover:text-slate-100 focus:ring-slate-500/50",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {loading && <Spinner size="sm" />}
      <span className={loading ? "opacity-0" : ""}>{children}</span>
      {loading && <span className="absolute inset-0 flex items-center justify-center"><Spinner size="sm" /></span>}
    </button>
  );
}

interface InputProps {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
  className?: string;
  inputClassName?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  id?: string;
  autoComplete?: string;
}

export function Input({
  label,
  error,
  hint,
  icon,
  rightElement,
  className = "",
  inputClassName = "",
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  disabled,
  name,
  id,
  autoComplete,
}: InputProps) {
  const inputId = id || name || `input-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-xs uppercase tracking-wide text-slate-500">
          {label}
          {required && <span className="text-rose-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={`w-full rounded-2xl border bg-slate-950/60 px-4 py-2.5 text-sm text-slate-100 outline-none transition-all duration-200 placeholder:text-slate-500 focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            error
              ? "border-rose-400/50 focus:border-rose-400 focus:ring-rose-500/30"
              : "border-slate-800 focus:border-cyan-400/50 focus:ring-cyan-500/30"
          } ${icon ? "pl-10" : ""} ${rightElement ? "pr-12" : ""} ${inputClassName}`}
        />
        {rightElement && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </span>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-rose-400 flex items-center gap-1" role="alert">
          <span>⚠</span> {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-xs text-slate-500">
          {hint}
        </p>
      )}
    </div>
  );
}

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon = "📭", title, description, action, className = "" }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
      <span className="mb-4 text-5xl opacity-50">{icon}</span>
      <h3 className="text-lg font-semibold text-slate-200">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-slate-400">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "cyan" | "emerald" | "violet" | "amber" | "rose";
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  size = "md",
  color = "cyan",
  className = "",
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const colorClasses = {
    cyan: "from-cyan-400 to-blue-500",
    emerald: "from-emerald-400 to-teal-500",
    violet: "from-violet-400 to-fuchsia-500",
    amber: "from-amber-400 to-orange-500",
    rose: "from-rose-400 to-pink-500",
  };

  return (
    <div className={className}>
      <div className={`w-full overflow-hidden rounded-full bg-slate-800 ${sizeClasses[size]}`} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
        <div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-r ${colorClasses[color]} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="mt-1 text-xs text-slate-400">{Math.round(percentage)}%</p>
      )}
    </div>
  );
}

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const variantClasses = {
    default: "border-slate-700 bg-slate-800/70 text-slate-300",
    success: "border-emerald-400/40 bg-emerald-500/10 text-emerald-100",
    warning: "border-amber-400/40 bg-amber-500/10 text-amber-100",
    danger: "border-rose-400/40 bg-rose-500/10 text-rose-100",
    info: "border-cyan-400/40 bg-cyan-500/10 text-cyan-100",
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}

interface CardProps {
  children: ReactNode;
  accent?: "cyan" | "emerald" | "violet" | "amber" | "blue";
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, accent = "cyan", hover = false, className = "", onClick }: CardProps) {
  const accentMap = {
    cyan: "border-cyan-400/20 shadow-cyan-900/30",
    emerald: "border-emerald-400/20 shadow-emerald-900/30",
    violet: "border-violet-400/20 shadow-violet-900/30",
    amber: "border-amber-400/20 shadow-amber-900/30",
    blue: "border-blue-400/20 shadow-blue-900/30",
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-3xl border bg-slate-900/70 shadow-xl transition-all duration-300 ${accentMap[accent]} ${
        hover ? "cursor-pointer hover:-translate-y-1 hover:shadow-2xl" : ""
      } ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

export function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={`relative w-full ${sizeClasses[size]} animate-scale-in rounded-3xl border border-cyan-400/20 bg-slate-900/95 p-6 shadow-2xl shadow-cyan-900/30`}>
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-50">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({ children, content, position = "top" }: TooltipProps) {
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div className="group relative inline-flex">
      {children}
      <span className={`pointer-events-none absolute ${positionClasses[position]} z-50 whitespace-nowrap rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 opacity-0 shadow-lg transition-opacity group-hover:opacity-100`}>
        {content}
      </span>
    </div>
  );
}
