import React from 'react';

export const Button = ({ children, variant = 'primary', onClick, style, type = 'button', disabled = false }) => {
  const baseStyle = {
    padding: '8px 16px',
    borderRadius: '0px', // Strict HUD requirement
    border: '1px solid transparent',
    fontWeight: '700',
    fontFamily: 'var(--font-mono)', // Buttons use monospace
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '0.75rem',
    transition: 'all 0.15s ease',
    opacity: disabled ? 0.5 : 1,
    outline: 'none',
    ...style
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--accent-gold)',
      color: 'var(--bg-dark-navy)',
      border: '1px solid var(--accent-gold)'
    },
    secondary: {
      backgroundColor: 'transparent',
      color: '#E2E8F0',
      border: '1px solid var(--border-medium)'
    },
    danger: {
      backgroundColor: 'transparent',
      color: 'var(--status-danger)',
      border: '1px solid var(--status-danger)'
    }
  };

  // Hover states via React state
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseEnter = () => !disabled && setIsHovered(true);
  const handleMouseLeave = () => !disabled && setIsHovered(false);

  let hoverStyle = {};
  if (isHovered) {
    if (variant === 'primary') {
      hoverStyle = {
        backgroundColor: '#E0B54A' /* Lighter gold for hover */
      };
    } else if (variant === 'secondary') {
      hoverStyle = {
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--accent-gold)',
        color: 'var(--accent-gold)'
      };
    } else if (variant === 'danger') {
      hoverStyle = {
        backgroundColor: 'var(--status-danger)',
        color: 'var(--bg-dark-navy)'
      };
    }
  }

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ ...baseStyle, ...variants[variant], ...hoverStyle }}
    >
      {children}
    </button>
  );
};
