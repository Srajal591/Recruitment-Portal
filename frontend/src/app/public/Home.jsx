import { useState } from 'react'
import { Search, ArrowRight, Users, FileText, Award, Phone, ChevronDown } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import PublicLayout from '../../components/layouts/PublicLayout'
import { Card, CardContent } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

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
      <section className="relative bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Institutional Clarity.<br />
                Your Future, Defined.
              </h1>
              <p className="text-xl mb-8 text-white/90">
                Navigate civil service opportunities with precision. Our eligibility engine helps you find the perfect fit for your career aspirations.
              </p>
              
              {/* Smart Eligibility Filter */}
              <Card className="bg-white text-text-primary p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-2 flex items-center">
                    🎯 SMART ELIGIBILITY FILTER
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">QUALIFICATION</label>
                    <select 
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      value={eligibilityForm.qualification}
                      onChange={(e) => setEligibilityForm({...eligibilityForm, qualification: e.target.value})}
                    >
                      <option value="">Select Highest Qualification</option>
                      <option value="graduation">Graduation</option>
                      <option value="post-graduation">Post Graduation</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">AGE RANGE</label>
                    <select 
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      value={eligibilityForm.age}
                      onChange={(e) => setEligibilityForm({...eligibilityForm, age: e.target.value})}
                    >
                      <option value="">Enter Age</option>
                      <option value="18-25">18-25 Years</option>
                      <option value="25-35">25-35 Years</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">CATEGORY</label>
                    <select 
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      value={eligibilityForm.category}
                      onChange={(e) => setEligibilityForm({...eligibilityForm, category: e.target.value})}
                    >
                      <option value="">Select</option>
                      <option value="general">General</option>
                      <option value="obc">OBC</option>
                      <option value="sc">SC</option>
                      <option value="st">ST</option>
                    </select>
                  </div>
                </div>
                
                <Button 
                  onClick={handleEligibilityCheck}
                  className="w-full bg-primary hover:bg-primary-dark"
                >
                  Check Eligible Jobs
                </Button>
              </Card>
            </div>
            
            <div className="hidden lg:block">
              <img 
                src="/api/placeholder/600/400" 
                alt="Government Building" 
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {quickStats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="text-4xl mb-4">{stat.icon}</div>
                  <h3 className="font-semibold text-lg mb-2">{stat.label}</h3>
                  <p className="text-text-secondary mb-4">{stat.desc}</p>
                  <Button variant="outline" className="text-primary border-primary hover:bg-primary hover:text-white">
                    {stat.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Current Openings */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-text-primary mb-2">Current Openings</h2>
              <p className="text-text-secondary">Handpicked active recruitment notices</p>
            </div>
            <Button variant="outline" className="flex items-center space-x-2">
              <span>View All Openings</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="success" className="text-xs">
                      {job.category} • {job.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {job.vacancies} Vacancies
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-lg text-text-primary mb-2">{job.title}</h3>
                  <p className="text-text-secondary text-sm mb-4">{job.department}</p>
                  
                  <div className="flex justify-between items-center text-sm text-text-secondary mb-4">
                    <span>Application Fee: <span className="font-medium text-text-primary">{job.applyFee}</span></span>
                    <span>Last Date: <span className="font-medium text-error">{job.lastDate}</span></span>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button size="sm" className="flex-1">Apply Now</Button>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support & Guidance */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">SUPPORT & GUIDANCE</h2>
            <p className="text-text-secondary">Comprehensive assistance throughout your recruitment journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {supportFeatures.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-8">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-text-secondary">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Technical Support Helpline */}
          <Card className="bg-primary text-white">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <Phone className="w-8 h-8" />
                <div>
                  <h3 className="text-2xl font-bold">Technical Support Helpline</h3>
                  <p className="text-primary-light">Our technical support team is available to resolve any issues</p>
                </div>
              </div>
              <div className="text-3xl font-bold mb-4">1800-123-4567</div>
              <p className="text-primary-light">FREE HELPLINE</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <button className="w-full text-left flex justify-between items-center">
                    <h3 className="font-medium text-text-primary">{faq.question}</h3>
                    <ChevronDown className="w-5 h-5 text-text-secondary" />
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