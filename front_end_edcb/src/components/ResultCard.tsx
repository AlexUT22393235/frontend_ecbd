import React from 'react';

interface ResultCardProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  className?: string;
}

export default function ResultCard({ title, icon, children, className = '' }: ResultCardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <span className="text-2xl mr-2">{icon}</span>
        {title}
      </h2>
      {children}
    </div>
  );
}

interface MetricDisplayProps {
  value: string | number;
  label: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function MetricDisplay({ value, label, color = 'text-indigo-600', size = 'lg' }: MetricDisplayProps) {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl'
  };

  return (
    <div className="text-center mb-4">
      <div className={`font-bold mb-2 ${color} ${sizeClasses[size]}`}>
        {value}
      </div>
      <div className="text-lg font-medium text-gray-700">
        {label}
      </div>
    </div>
  );
}

interface StatusIndicatorProps {
  status: 'success' | 'warning' | 'error' | 'info';
  text: string;
  subtitle?: string;
}

export function StatusIndicator({ status, text, subtitle }: StatusIndicatorProps) {
  const statusConfig = {
    success: { icon: '✅', color: 'text-green-600' },
    warning: { icon: '⚠️', color: 'text-yellow-600' },
    error: { icon: '❌', color: 'text-red-600' },
    info: { icon: 'ℹ️', color: 'text-blue-600' }
  };

  const config = statusConfig[status];

  return (
    <div className="text-center mb-4">
      <div className={`text-4xl font-bold mb-2 ${config.color}`}>
        {config.icon}
      </div>
      <div className="text-lg font-medium text-gray-700">
        {text}
      </div>
      {subtitle && (
        <div className="text-sm text-gray-500">
          {subtitle}
        </div>
      )}
    </div>
  );
}

interface EmptyStateProps {
  icon: string;
  message: string;
}

export function EmptyState({ icon, message }: EmptyStateProps) {
  return (
    <div className="text-center py-8">
      <div className="text-gray-400 text-4xl mb-2">{icon}</div>
      <p className="text-gray-500">{message}</p>
    </div>
  );
} 