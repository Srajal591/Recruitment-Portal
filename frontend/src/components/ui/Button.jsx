import { forwardRef, cloneElement } from 'react'
import { cn } from '../../lib/utils'

const Button = forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'default', 
  children, 
  disabled,
  asChild = false,
  ...props 
}, ref) => {
  const variants = {
    primary: 'bg-primary hover:bg-primary-dark text-white shadow-sm',
    secondary: 'bg-secondary hover:bg-secondary-light text-white shadow-sm',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700 bg-white',
    ghost: 'hover:bg-gray-100 text-gray-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-sm',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-sm',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    default: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  }

  const baseClasses = cn(
    'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
    variants[variant],
    sizes[size],
    className
  )

  if (asChild && children) {
    return cloneElement(children, {
      className: cn(baseClasses, children.props.className),
      ref,
      ...props
    })
  }

  return (
    <button
      className={baseClasses}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = 'Button'

export default Button