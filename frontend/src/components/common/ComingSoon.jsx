import { ArrowLeft, Construction } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'

const ComingSoon = ({ 
  title = "Coming Soon", 
  description = "This page is under development and will be available soon.",
  backLink = "/",
  backText = "Go Back Home"
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Construction className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
          <p className="text-gray-600 mb-8">{description}</p>
        </div>
        
        <Button asChild className="inline-flex items-center space-x-2">
          <Link to={backLink}>
            <ArrowLeft className="w-4 h-4" />
            <span>{backText}</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default ComingSoon