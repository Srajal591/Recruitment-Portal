import { cn } from '../../lib/utils'

const Card = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'bg-surface rounded-2xl shadow-soft border border-border',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const CardHeader = ({ className, children, ...props }) => {
  return (
    <div
      className={cn('p-6 pb-0', className)}
      {...props}
    >
      {children}
    </div>
  )
}

const CardContent = ({ className, children, ...props }) => {
  return (
    <div
      className={cn('p-6', className)}
      {...props}
    >
      {children}
    </div>
  )
}

const CardFooter = ({ className, children, ...props }) => {
  return (
    <div
      className={cn('p-6 pt-0', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { Card, CardHeader, CardContent, CardFooter }