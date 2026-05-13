import React, { useState } from 'react'
import { Eye, FileText, Plus, CreditCard, DollarSign, Building, Shield, Lock, RefreshCw, CheckCircle } from 'lucide-react'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

const PaymentSettings = () => {
  const [gateways] = useState([
    {
      id: 1,
      name: 'Razorpay',
      status: 'ACTIVE',
      mode: 'Live Mode',
      lastUpdated: 'Oct 24, 2023',
      settlement: '1-2 Days',
      icon: CreditCard,
      statusColor: 'success'
    },
    {
      id: 2,
      name: 'Cashfree',
      status: 'INACTIVE',
      mode: 'Test Mode',
      lastUpdated: 'Sep 12, 2023',
      settlement: '1-1 Day',
      icon: DollarSign,
      statusColor: 'warning'
    },
    {
      id: 3,
      name: 'BillDesk',
      status: 'ACTIVE',
      mode: 'Live Mode',
      lastUpdated: 'Nov 05, 2023',
      settlement: '1-3 Days',
      icon: Building,
      statusColor: 'success'
    },
    {
      id: 4,
      name: 'CCAvenue',
      status: 'LIMITED',
      mode: 'Live Mode',
      lastUpdated: 'Aug 30, 2023',
      settlement: '1-2 Days',
      icon: Lock,
      statusColor: 'warning'
    }
  ])

  const getStatusBadge = (status) => {
    const variants = {
      ACTIVE: 'success',
      INACTIVE: 'error',
      LIMITED: 'warning'
    }
    return <Badge variant={variants[status]}>{status}</Badge>
  }

  return (
    <AdminLayout title="Payment Settings">
      <div className="p-6">
        <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary mb-2">Payment Settings</h1>
            <p className="text-text-secondary">
              Manage institutional payment gateways, API integrations, and settlement configurations for recruitment fee collections.
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>View Audit Log</span>
            </Button>
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add New Gateway</span>
            </Button>
          </div>
        </div>

        {/* Payment Gateways Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {gateways.map((gateway) => (
            <Card key={gateway.id} className="relative">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="text-2xl">
                    {(() => {
                      const IconComponent = gateway.icon
                      return <IconComponent className="w-8 h-8 text-orange-600" />
                    })()}
                  </div>
                  <div className="text-right">
                    {gateway.status === 'ACTIVE' && (
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    )}
                    {gateway.status === 'INACTIVE' && (
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    )}
                    {gateway.status === 'LIMITED' && (
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">{gateway.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    {getStatusBadge(gateway.status)}
                    <span className="text-xs text-text-secondary">• {gateway.mode}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Last Updated:</span>
                    <span className="text-text-primary">{gateway.lastUpdated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Settlement:</span>
                    <span className="text-text-primary">{gateway.settlement}</span>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <Button 
                    className="w-full" 
                    variant={gateway.status === 'INACTIVE' ? 'success' : 'primary'}
                  >
                    {gateway.status === 'INACTIVE' ? 'Activate' : 'Configure'}
                  </Button>
                  <Button variant="outline" className="w-full">
                    {gateway.status === 'ACTIVE' ? 'Deactivate' : 'Deactivate'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Settlement Progress */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-text-primary">Settlement Target Completion</h3>
                <p className="text-sm text-text-secondary">Monthly reconciliation progress across all gateways</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">82%</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-primary to-primary-light h-2 rounded-full" style={{ width: '82%' }}></div>
              </div>
              <div className="flex justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-text-secondary">RECONCILED</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <span className="text-text-secondary">PENDING</span>
                </div>
                <div className="text-text-secondary">NEXT BATCH: 06:00 AM IST</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Protocol */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-2">Institutional Security Protocol</h3>
                    <p className="text-text-secondary text-sm">
                      All transactions are encrypted using AES-256 standards. Our gateways comply with PCI-DSS Level 1 
                      ensuring institutional-grade protection for candidate financial data and government revenue collection.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-secondary text-white">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold">Encryption Status</h3>
                </div>
                <div className="space-y-2">
                  <div className="text-sm opacity-90">Environment: Production</div>
                  <div className="text-sm opacity-90">SSL Cert Valid (Expires 2025)</div>
                </div>
                <Button variant="outline" className="w-full text-white border-white hover:bg-white hover:text-secondary">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  REFRESH CREDENTIALS
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default PaymentSettings