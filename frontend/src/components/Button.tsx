import React from 'react';
import './Button.module.css'; // Ensure module is imported

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}) => {
  return (
    <button
      className={`button button--${variant} button--${size} ${fullWidth ? 'button--fullWidth' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

