import { Link } from 'react-router-dom'
import { CheckCircle, User, GraduationCap, FileText, MapPin, Upload, Eye } from 'lucide-react'

const ApplicationLayout = ({ children, currentStep = 1, title }) => {
  
  const steps = [
    { id: 1, name: 'Personal Details', icon: User, path: '/application/personal-details' },
    { id: 2, name: 'Educational Info', icon: GraduationCap, path: '/application/education' },
    { id: 3, name: 'Additional Information', icon: FileText, path: '/application/additional-info' },
    { id: 4, name: 'Address Details', icon: MapPin, path: '/application/address' },
    { id: 5, name: 'Document Upload', icon: Upload, path: '/application/documents' },
    { id: 6, name: 'Final Review', icon: Eye, path: '/application/review' }
  ]

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <header className="bg-white border-b border-orange-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">RP</span>
            </div>
            <div>
              <div className="font-bold text-gray-800">Recruitment Portal</div>
              <div className="text-sm text-gray-600">GOVERNMENT OF INDIA</div>
            </div>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/auth/candidate-login" className="text-gray-600 hover:text-gray-800">Login</Link>
            <Link 
              to="/auth/register" 
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b border-orange-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    step.id < currentStep 
                      ? 'bg-orange-600 border-orange-600 text-white' 
                      : step.id === currentStep
                      ? 'bg-orange-600 border-orange-600 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {step.id < currentStep ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-medium">{step.id}</span>
                    )}
                  </div>
                  <div className="ml-3 hidden md:block">
                    <div className={`text-sm font-medium ${
                      step.id <= currentStep ? 'text-orange-600' : 'text-gray-400'
                    }`}>
                      {step.name}
                    </div>
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    step.id < currentStep ? 'bg-orange-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 p-6 flex-shrink-0">
          <div className="bg-gray-800 rounded-lg shadow-lg h-fit sticky top-6">
            <div className="p-6">
              <h2 className="text-white font-semibold mb-2">Application Steps</h2>
              <p className="text-gray-400 text-sm">Post: Junior Engineer</p>
            </div>
            
            <nav className="px-4 pb-4 space-y-1">
              {steps.map((step) => {
                const Icon = step.icon
                const isActive = step.id === currentStep
                const isCompleted = step.id < currentStep
                
                return (
                  <Link
                    key={step.id}
                    to={step.path}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors whitespace-nowrap ${
                      isActive 
                        ? 'bg-orange-600 text-white' 
                        : isCompleted
                        ? 'text-green-400 hover:bg-gray-700'
                        : 'text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    ) : (
                      <Icon className="w-5 h-5 flex-shrink-0" />
                    )}
                    <span className="text-sm font-medium">{step.name}</span>
                  </Link>
                )
              })}
              
              <div className="pt-4 mt-4 border-t border-gray-700">
                <div className="text-xs font-medium text-gray-500 mb-2 px-3">APPLICATION STATUS</div>
                <div className="px-3 py-2">
                  <div className="text-orange-400 text-sm font-medium whitespace-nowrap">In Progress (Step {currentStep}/6)</div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(currentStep / 6) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <main className="p-6">
            <div className="max-w-4xl mx-auto">
              {title && (
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                </div>
              )}
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default ApplicationLayout