import { useState } from 'react'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

const AddPaymentGateway = () => {
  const [selectedGateway, setSelectedGateway] = useState(null)

  const gateways = [
    {
      id: 'razorpay',
      name: 'Razorpay',
      description: "India's leading payments solution. Trusted by millions for secure and fast transactions.",
      status: 'configured',
      setupTime: 'ACTIVE SINCE JAN 2024',
      icon: '💳',
      features: ['UPI', 'Cards', 'Net Banking', 'Wallets']
    },
    {
      id: 'cashfree',
      name: 'Cashfree',
      description: 'Fastest way to collect payments and offer payouts. Optimized for high-volume transactions.',
      status: 'not_configured',
      setupTime: 'SETUP IN 2 MINS',
      icon: '💰',
      features: ['UPI', 'Cards', 'Net Banking']
    },
    {
      id: 'paytm',
      name: 'Paytm',
      description: 'Built for every business size. Seamless integration with India\'s most popular wallet.',
      status: 'not_configured',
      setupTime: 'ENTERPRISE GRADE',
      icon: '📱',
      features: ['Paytm Wallet', 'UPI', 'Cards']
    },
    {
      id: 'phonepe',
      name: 'PhonePe',
      description: 'Accept payments from 500M+ users. Superior success rates for UPI transactions.',
      status: 'not_configured',
      setupTime: 'BEST-IN-CLASS UPI',
      icon: '📞',
      features: ['PhonePe', 'UPI', 'Cards']
    }
  ]

  return (
    <AdminLayout title="Add Payment Gateway">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-text-primary mb-2">Add Payment Gateway</h1>
          <p className="text-text-secondary">
            Integrate secure payment channels to facilitate Bihar Recruitment Portal transactions.
          </p>
        </div>

        {/* Gateway Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gateways.map((gateway) => (
            <Card 
              key={gateway.id} 
              className={`cursor-pointer transition-all ${
                gateway.status === 'configured' 
                  ? 'border-green-200 bg-green-50' 
                  : 'hover:border-primary hover:shadow-md'
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{gateway.icon}</div>
                    <div>
                      <h3 className="font-semibold text-text-primary">{gateway.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        {gateway.status === 'configured' ? (
                          <Badge variant="success">✓ Configured</Badge>
                        ) : (
                          <Badge variant="info">✦ Not configured</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-text-secondary text-sm mb-4">
                  {gateway.description}
                </p>
                
                <div className="space-y-3">
                  <div className="text-xs text-text-secondary font-medium">
                    {gateway.setupTime}
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {gateway.features.map((feature) => (
                      <span 
                        key={feature}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <Button 
                    className="w-full mt-4"
                    variant={gateway.status === 'configured' ? 'secondary' : 'primary'}
                  >
                    {gateway.status === 'configured' ? '✏️ Edit' : '⚡ Enable'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Security Notice */}
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600">⚠️</span>
              </div>
              <div>
                <h3 className="font-semibold text-orange-800 mb-2">Institutional Security Protocol</h3>
                <p className="text-orange-700 text-sm">
                  All gateways must comply with PCI-DSS standards and Bihar Government digital security mandates before going live.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default AddPaymentGateway