import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ApplicationLayout from '../../components/layouts/ApplicationLayout'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

const PostSelection = () => {
  const navigate = useNavigate()
  const [selectedPosts, setSelectedPosts] = useState([])

  const availablePosts = [
    {
      id: 1,
      title: 'Assistant Section Officer',
      department: 'General Administration Department',
      vacancies: 45,
      fee: 500,
      category: 'Group C',
      eligibility: 'Graduate',
      selected: true
    },
    {
      id: 2,
      title: 'Junior Engineer (Civil)',
      department: 'Public Works Department',
      vacancies: 32,
      fee: 750,
      category: 'Group C',
      eligibility: 'B.E./B.Tech Civil',
      selected: false
    },
    {
      id: 3,
      title: 'Revenue Officer',
      department: 'Revenue & Land Reforms',
      vacancies: 28,
      fee: 600,
      category: 'Group C',
      eligibility: 'Graduate',
      selected: false
    }
  ]

  const handlePostToggle = (postId) => {
    const post = availablePosts.find(p => p.id === postId)
    if (selectedPosts.find(p => p.id === postId)) {
      setSelectedPosts(selectedPosts.filter(p => p.id !== postId))
    } else {
      setSelectedPosts([...selectedPosts, post])
    }
  }

  const totalFee = selectedPosts.reduce((sum, post) => sum + post.fee, 0)

  const handleNext = () => {
    navigate('/application/payment')
  }

  const handlePrevious = () => {
    navigate('/application/review')
  }

  return (
    <ApplicationLayout currentStep={7} title="Post Selection & Application Fee">
      <div className="space-y-6">
        <Card className="shadow-sm">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-800">Select Posts to Apply</h2>
            <p className="text-gray-600">Choose the posts you want to apply for. You can select multiple posts.</p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {availablePosts.map((post) => (
              <div 
                key={post.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedPosts.find(p => p.id === post.id)
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300'
                }`}
                onClick={() => handlePostToggle(post.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedPosts.find(p => p.id === post.id) ? true : false}
                      onChange={() => handlePostToggle(post.id)}
                      className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{post.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{post.department}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {post.category}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Vacancies: {post.vacancies}
                        </span>
                        <span className="text-xs text-gray-500">
                          Eligibility: {post.eligibility}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-orange-600">₹{post.fee}</div>
                    <div className="text-xs text-gray-500">Application Fee</div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Fee Summary */}
        {selectedPosts.length > 0 && (
          <Card className="shadow-sm bg-orange-50 border-orange-200">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-800">Fee Summary</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedPosts.map((post) => (
                  <div key={post.id} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">{post.title}</span>
                    <span className="font-medium text-gray-800">₹{post.fee}</span>
                  </div>
                ))}
                <div className="border-t border-orange-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">Total Amount</span>
                    <span className="font-bold text-orange-600 text-lg">₹{totalFee}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Important Instructions */}
        <Card className="shadow-sm border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <h4 className="font-medium text-blue-800 mb-2">Important Instructions</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• You can apply for multiple posts with a single application</li>
              <li>• Application fee is non-refundable once payment is completed</li>
              <li>• Ensure you meet the eligibility criteria for selected posts</li>
              <li>• Fee payment must be completed within 24 hours of selection</li>
            </ul>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-green-600">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <span className="text-sm">Changes saved as draft 14:05</span>
          </div>
          
          <div className="flex space-x-4">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              className="px-6"
            >
              ← Back
            </Button>
            <Button variant="outline" className="px-6">
              Save
            </Button>
            <Button 
              onClick={handleNext}
              disabled={selectedPosts.length === 0}
              className="px-6 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400"
            >
              Proceed to Payment →
            </Button>
          </div>
        </div>
      </div>
    </ApplicationLayout>
  )
}

export default PostSelection