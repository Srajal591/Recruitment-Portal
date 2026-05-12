import { useState } from 'react'
import { Search, ArrowRight, Users, FileText, Award, Phone, ChevronDown } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import PublicLayout from '../../components/layouts/PublicLayout'
import { Card, CardContent } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import heroBg from '../../assets/herobg.jpg'

const Home = () => {
  const navigate = useNavigate()
  const [eligibilityForm, setEligibilityForm] = useState({
    qualification: '',
    age: '',
    category: ''
  })

  const handleEligibilityCheck = () => {
    // Navigate to OTP verification after eligibility check
    navigate('/auth/verify-otp')
  }

  const featuredJobs = [
    {
      id: 1,
      title: 'Assistant Section Officer (ASO)',
      department: 'Bihar State Secretariat',
      category: 'BPSC',
      vacancies: 45,
      lastDate: 'Nov 30, 2024',
      status: 'ACTIVE',
      applyFee: '₹750'
    },
    {
      id: 2,
      title: 'Junior Engineer (Mechanical)',
      department: 'Public Works Department',
      category: 'BSSC',
      vacancies: 120,
      lastDate: 'Dec 15, 2024',
      status: 'ACTIVE',
      applyFee: '₹500'
    }
  ]

  const quickStats = [
    { icon: '👥', label: 'New User?', desc: 'Create your account and start your job search experience.', action: 'Register Now →' },
    { icon: '📋', label: 'Already Applied?', desc: 'Check your application status and track your progress.', action: 'Login Here →' },
    { icon: '❓', label: 'Need Help?', desc: 'Get help from our support team for guidance and support.', action: 'Get Help →' }
  ]

  const supportFeatures = [
    { icon: '📞', title: 'Technical Helpline', desc: 'Our technical support team is available to resolve any issues.' },
    { icon: '📚', title: 'User Manual', desc: 'Step-by-step guidance for a seamless application experience.' },
    { icon: '🎯', title: 'Strategic Profile', desc: 'Optimize your profile to increase your chances of selection.' }
  ]

  const faqItems = [
    { question: 'How do I verify my eligibility for multiple exams?', answer: 'You can verify eligibility by using our Smart Eligibility Filter...' },
    { question: 'How can Smart Eligibility Filter on the home page, Enter your details, and the system will show relevant job openings for you.', answer: 'The Smart Eligibility Filter helps you find jobs...' },
    { question: 'Can I edit my application after submission?', answer: 'Applications can be edited before the final submission...' },
    { question: 'What documents are mandatory for registration?', answer: 'Basic documents include Aadhar card, educational certificates...' }
  ]

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section 
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            <div className="text-white">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Your Career in Public Service<br />
                Starts Here.
              </h1>
              <p className="text-xl mb-8 text-white/90 leading-relaxed">
                Transparent, accessible, and reliable government job opportunities for every citizen. Start your journey today.
              </p>
              
              <div className="mb-8">
                <div className="inline-flex items-center text-white text-sm font-medium">
                  🏛️ Official Government Employment Gateway
                </div>
              </div>
            </div>
            
            {/* Smart Eligibility Filter Card */}
            <div className="lg:ml-auto">
              <Card className="bg-orange-50 shadow-2xl max-w-xl w-full border border-orange-200">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <h3 className="font-bold text-xl text-gray-800 mb-2">Smart Eligibility Filter</h3>
                    <p className="text-sm text-gray-600">Find jobs that match your profile</p>
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Qualification
                      </label>
                      <select 
                        className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700 bg-white"
                        value={eligibilityForm.qualification}
                        onChange={(e) => setEligibilityForm({...eligibilityForm, qualification: e.target.value})}
                      >
                        <option value="">Select Highest Qualification</option>
                        <option value="10th">10th Pass</option>
                        <option value="12th">12th Pass</option>
                        <option value="graduation">Graduation</option>
                        <option value="post-graduation">Post Graduation</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age
                      </label>
                      <select 
                        className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700 bg-white"
                        value={eligibilityForm.age}
                        onChange={(e) => setEligibilityForm({...eligibilityForm, age: e.target.value})}
                      >
                        <option value="">Enter Age</option>
                        <option value="18-21">18-21 Years</option>
                        <option value="21-25">21-25 Years</option>
                        <option value="25-30">25-30 Years</option>
                        <option value="30-35">30-35 Years</option>
                        <option value="35-40">35-40 Years</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category (Optional)
                      </label>
                      <select 
                        className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700 bg-white"
                        value={eligibilityForm.category}
                        onChange={(e) => setEligibilityForm({...eligibilityForm, category: e.target.value})}
                      >
                        <option value="">Select</option>
                        <option value="general">General</option>
                        <option value="obc">OBC</option>
                        <option value="sc">SC</option>
                        <option value="st">ST</option>
                        <option value="ews">EWS</option>
                      </select>
                    </div>
                    
                    <Button 
                      onClick={handleEligibilityCheck}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-base font-medium mt-6"
                    >
                      Check Eligible Jobs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Notification Banner */}
      <div className="bg-orange-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-8">
              <span className="bg-orange-700 px-3 py-1 rounded">IMPORTANT</span>
              <span>Latest Govt Job Vacancies Manager from Bihar BSSC & other portals for download</span>
              <span>Last date for Application Submission for Junior Engineer (Civil) extended to 30th October</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow bg-white border border-orange-100">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800">New User?</h3>
                <p className="text-gray-600 mb-4">Create your account and start your job search experience.</p>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                  Register Now →
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow bg-white border border-orange-100">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Already Applied?</h3>
                <p className="text-gray-600 mb-4">Check your application status and track your progress.</p>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                  Login Here →
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow bg-white border border-orange-100">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Need Help?</h3>
                <p className="text-gray-600 mb-4">Get help from our support team for guidance and support.</p>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                  Get Help →
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Opportunities */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Featured Opportunities</h2>
              <p className="text-gray-600">Handpicked active recruitment notices</p>
            </div>
            <Button variant="outline" className="flex items-center space-x-2 text-orange-600 border-orange-600 hover:bg-orange-100">
              <span>View All Openings</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow border border-orange-200 bg-white">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Badge className="bg-green-100 text-green-800 text-xs font-medium">
                    BPSC
                  </Badge>
                  <span className="text-xs text-gray-500">45 Vacancies</span>
                </div>
                
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Assistant Section Officer (ASO)</h3>
                <p className="text-gray-600 text-sm mb-4">Bihar State Secretariat</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                  <div>
                    <span className="font-medium">Application Fee:</span>
                    <div className="text-gray-800 font-semibold">₹750</div>
                  </div>
                  <div>
                    <span className="font-medium">Last Date:</span>
                    <div className="text-red-600 font-semibold">Nov 30, 2024</div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button className="flex-1 bg-orange-600 hover:bg-orange-700">Apply Now</Button>
                  <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">View Details</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border border-orange-200 bg-white">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Badge className="bg-orange-100 text-orange-800 text-xs font-medium">
                    BSSC
                  </Badge>
                  <span className="text-xs text-gray-500">120 Vacancies</span>
                </div>
                
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Junior Engineer (Mechanical)</h3>
                <p className="text-gray-600 text-sm mb-4">Public Works Department</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                  <div>
                    <span className="font-medium">Application Fee:</span>
                    <div className="text-gray-800 font-semibold">₹500</div>
                  </div>
                  <div>
                    <span className="font-medium">Last Date:</span>
                    <div className="text-red-600 font-semibold">Dec 15, 2024</div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button className="flex-1 bg-orange-600 hover:bg-orange-700">Apply Now</Button>
                  <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">View Details</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Support & Guidance */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">SUPPORT & GUIDANCE</h2>
            <p className="text-gray-600">Comprehensive assistance throughout your recruitment journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {supportFeatures.map((feature, index) => (
              <Card key={index} className="text-center border border-orange-100 bg-orange-50">
                <CardContent className="p-8">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Technical Support Helpline */}
          <Card className="bg-orange-600 text-white border-0">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Phone className="w-8 h-8" />
                  <div>
                    <h3 className="text-xl font-bold">Technical Support Helpline</h3>
                    <p className="text-orange-100">Our technical support team is available to resolve any issues</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">1800-123-4567</div>
                  <p className="text-orange-100 text-sm">FREE HELPLINE</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <Card key={index} className="border border-orange-200 bg-white">
                <CardContent className="p-6">
                  <button className="w-full text-left flex justify-between items-center">
                    <h3 className="font-medium text-gray-800">{faq.question}</h3>
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}

export default Home