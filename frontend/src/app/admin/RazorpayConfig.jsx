import { useState } from 'react'
import { Eye, EyeOff, Copy, AlertTriangle } from 'lucide-react'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'

const RazorpayConfig = () => {
  const [showApiSecret, setShowApiSecret] = useState(false)
  const [showWebhookSecret, setShowWebhookSecret] = useState(false)
  const [formData, setFormData] = useState({
    apiKeyId: 'rzp_live_G9v7LzXBNiuSL',
    apiSecret: '••••••••••••••',
    webhookSecret: '••••••••••••••'
  })

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    // Add toast notification here
  }

  return (
    <AdminLayout title="Razorpay Configuration">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">R</span>
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-text-primary">Razorpay</h1>
              <div className="flex items-center space-x-4 mt-1">
                <Badge variant="success">Status: Active</Badge>
                <Badge variant="warning">🔴 Mode: Live</Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-sm text-text-secondary">GATEWAY MODE</div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">TEST</Button>
              <Button variant="primary" size="sm">LIVE</Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <span className="text-primary">🔑</span>
                  <h3 className="font-semibold text-text-primary">API Configuration</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    API KEY ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.apiKeyId}
                      onChange={(e) => setFormData({...formData, apiKeyId: e.target.value})}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      API SECRET
                    </label>
                    <div className="relative">
                      <input
                        type={showApiSecret ? 'text' : 'password'}
                        value={formData.apiSecret}
                        onChange={(e) => setFormData({...formData, apiSecret: e.target.value})}
                        className="w-full px-3 py-2 pr-10 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiSecret(!showApiSecret)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
                      >
                        {showApiSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      WEBHOOK SECRET
                    </label>
                    <div className="relative">
                      <input
                        type={showWebhookSecret ? 'text' : 'password'}
                        value={formData.webhookSecret}
                        onChange={(e) => setFormData({...formData, webhookSecret: e.target.value})}
                        className="w-full px-3 py-2 pr-10 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
                      >
                        {showWebhookSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Webhook Configuration */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-600">🔗</span>
                  <h3 className="font-semibold text-text-primary">Webhook Endpoint</h3>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary text-sm mb-4">
                  Configure this URL in your Razorpay Dashboard under Settings &gt; Webhooks to receive real-time 
                  notifications for payment successes, failures, and refunds.
                </p>
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <code className="flex-1 text-sm text-text-primary">
                    https://api.bihar-recruitment.gov.in/v1/payments/razorpay/webhook
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy('https://api.bihar-recruitment.gov.in/v1/payments/razorpay/webhook')}
                  >
                    <Copy className="w-4 h-4" />
                    COPY
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security Alert */}
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800 mb-1">SECURITY PROTOCOL ALERT</h4>
                    <p className="text-red-700 text-sm">
                      Your API Secret and Webhook Secret are extremely sensitive. Never share them or commit them to public repositories. Bihar Recruitment 
                      Portal encrypts these keys using AES-256-GCM before storage. If you suspect a compromise, rotate your keys immediately in the Razorpay 
                      dashboard.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Panel */}
          <div className="space-y-6">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="font-semibold text-green-800 mb-2">Connectivity</h3>
                <p className="text-green-700 text-sm mb-4">
                  Validate your API credentials with Razorpay servers.
                </p>
                <Badge variant="success" className="mb-4">✓ Connection Successful</Badge>
                <div className="text-xs text-green-600">LAST CHECKED: 2 MINS AGO</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-text-primary mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    🔄 Auto-Validate Aadhar
                    <Badge variant="success" className="ml-auto">ENABLE</Badge>
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    🌐 Hindi Support
                    <Badge variant="success" className="ml-auto">ENABLE</Badge>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <div></div>
          <div className="flex space-x-3">
            <Button variant="outline">Save Configuration</Button>
            <Button>Activate Gateway</Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default RazorpayConfig