import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  CreditCard, DollarSign, Building, Lock, RefreshCw,
  Shield, Loader2, TrendingUp,
} from 'lucide-react'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { adminService } from '../../services/admin.service'

const GATEWAY_ICONS = {
  Razorpay: CreditCard,
  Cashfree: DollarSign,
  BillDesk: Building,
  CCAvenue: Lock,
}

const STATUS_COLORS = {
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-gray-100 text-gray-800',
  LIMITED: 'bg-yellow-100 text-yellow-800',
}

const STATUS_DOT = {
  ACTIVE: 'bg-green-500',
  INACTIVE: 'bg-gray-400',
  LIMITED: 'bg-yellow-500',
}

const DEFAULT_GATEWAYS = [
  { name: 'Razorpay', status: 'INACTIVE', mode: 'Test', settlementDays: '1-2 Days' },
  { name: 'Cashfree', status: 'INACTIVE', mode: 'Test', settlementDays: '1 Day' },
  { name: 'BillDesk', status: 'INACTIVE', mode: 'Test', settlementDays: '1-3 Days' },
  { name: 'CCAvenue', status: 'INACTIVE', mode: 'Test', settlementDays: '1-2 Days' },
]

const PaymentSettings = () => {
  const queryClient = useQueryClient()
  const [configModal, setConfigModal] = useState(null) // { gateway }
  const [configForm, setConfigForm] = useState({})

  const { data: gatewaysData, isLoading: gatewaysLoading } = useQuery({
    queryKey: ['admin-payment-gateways'],
    queryFn: adminService.getPaymentGateways,
  })

  const { data: statsData } = useQuery({
    queryKey: ['admin-payment-stats'],
    queryFn: adminService.getPaymentStats,
  })

  const { mutate: upsertGateway, isPending: isSaving } = useMutation({
    mutationFn: ({ name, data }) => adminService.upsertPaymentGateway(name, data),
    onSuccess: () => {
      toast.success('Gateway configuration saved')
      queryClient.invalidateQueries({ queryKey: ['admin-payment-gateways'] })
      setConfigModal(null)
    },
    onError: (err) => toast.error(err.message || 'Failed to save gateway'),
  })

  // Merge API gateways with defaults so all 4 always show
  const apiGateways = gatewaysData?.gateways || []
  const gateways = DEFAULT_GATEWAYS.map(def => {
    const found = apiGateways.find(g => g.name === def.name)
    return found ? { ...def, ...found } : def
  })

  const stats = statsData || {}
  const totalRevenue = stats.totalRevenue || 0
  const statusStats = stats.statusStats || []
  const gatewayStats = stats.gatewayStats || []

  const countByStatus = (s) => statusStats.find(x => x._id === s)?.count || 0
  const amountByStatus = (s) => statusStats.find(x => x._id === s)?.total || 0

  const openConfig = (gateway) => {
    setConfigForm({
      status: gateway.status || 'INACTIVE',
      mode: gateway.mode || 'Test',
      apiKey: '',
      secretKey: '',
      webhookSecret: '',
      settlementDays: gateway.settlementDays || '',
    })
    setConfigModal(gateway)
  }

  const handleSave = () => {
    upsertGateway({ name: configModal.name, data: configForm })
  }

  const handleToggle = (gateway) => {
    const newStatus = gateway.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    upsertGateway({ name: gateway.name, data: { status: newStatus } })
  }

  return (
    <AdminLayout title="Payment Settings">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-1">Payment Settings</h1>
            <p className="text-gray-600 text-sm">
              Manage payment gateways, API integrations, and settlement configurations.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-green-500 bg-white">
            <div className="p-6">
              <p className="text-xs font-medium text-gray-500 mb-1">TOTAL REVENUE</p>
              <p className="text-2xl font-bold text-gray-800">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </p>
            </div>
          </Card>
          <Card className="border-l-4 border-l-blue-500 bg-white">
            <div className="p-6">
              <p className="text-xs font-medium text-gray-500 mb-1">SUCCESSFUL</p>
              <p className="text-2xl font-bold text-gray-800">{countByStatus('success').toLocaleString('en-IN')}</p>
              <p className="text-xs text-gray-500">₹{amountByStatus('success').toLocaleString('en-IN')}</p>
            </div>
          </Card>
          <Card className="border-l-4 border-l-yellow-500 bg-white">
            <div className="p-6">
              <p className="text-xs font-medium text-gray-500 mb-1">PENDING</p>
              <p className="text-2xl font-bold text-gray-800">{countByStatus('pending').toLocaleString('en-IN')}</p>
            </div>
          </Card>
          <Card className="border-l-4 border-l-red-500 bg-white">
            <div className="p-6">
              <p className="text-xs font-medium text-gray-500 mb-1">FAILED</p>
              <p className="text-2xl font-bold text-gray-800">{countByStatus('failed').toLocaleString('en-IN')}</p>
            </div>
          </Card>
        </div>

        {/* Gateway Cards */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Gateways</h2>
          {gatewaysLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {gateways.map((gateway) => {
                const Icon = GATEWAY_ICONS[gateway.name] || CreditCard
                const gwStat = gatewayStats.find(g => g._id === gateway.name)
                return (
                  <Card key={gateway.name} className="bg-white">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className={`w-3 h-3 rounded-full ${STATUS_DOT[gateway.status] || 'bg-gray-400'}`} />
                      </div>
                      <div className="mt-3">
                        <h3 className="font-semibold text-gray-800">{gateway.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={STATUS_COLORS[gateway.status] || 'bg-gray-100 text-gray-800'}>
                            {gateway.status || 'INACTIVE'}
                          </Badge>
                          <span className="text-xs text-gray-500">{gateway.mode || 'Test'}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-3">
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between text-gray-600">
                          <span>Settlement:</span>
                          <span className="font-medium text-gray-800">{gateway.settlementDays || '—'}</span>
                        </div>
                        {gwStat && (
                          <div className="flex justify-between text-gray-600">
                            <span>Revenue:</span>
                            <span className="font-medium text-green-700">₹{(gwStat.total || 0).toLocaleString('en-IN')}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2 pt-1">
                        <Button
                          onClick={() => openConfig(gateway)}
                          className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm"
                        >
                          Configure
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleToggle(gateway)}
                          className={`w-full text-sm ${gateway.status === 'ACTIVE' ? 'text-red-600 border-red-200 hover:bg-red-50' : 'text-green-600 border-green-200 hover:bg-green-50'}`}
                        >
                          {gateway.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Gateway Revenue Breakdown */}
        {gatewayStats.length > 0 && (
          <Card className="bg-white">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-gray-800">Gateway Revenue Breakdown</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gatewayStats.map((gw) => {
                  const maxRevenue = Math.max(...gatewayStats.map(g => g.total || 0), 1)
                  const pct = Math.round(((gw.total || 0) / maxRevenue) * 100)
                  return (
                    <div key={gw._id}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-800">{gw._id}</span>
                        <div className="text-right">
                          <span className="text-sm font-bold text-gray-800">₹{(gw.total || 0).toLocaleString('en-IN')}</span>
                          <span className="text-xs text-gray-500 ml-2">({gw.count} txns)</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Institutional Security Protocol</h3>
                    <p className="text-gray-600 text-sm">
                      All transactions are encrypted using AES-256 standards. Gateways comply with PCI-DSS Level 1,
                      ensuring institutional-grade protection for candidate financial data and government revenue collection.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="bg-gray-800 text-white">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold">Encryption Status</h3>
              </div>
              <div className="space-y-2 text-sm opacity-90">
                <div>Environment: Production</div>
                <div>SSL Cert Valid</div>
              </div>
              <Button variant="outline" className="w-full text-white border-white hover:bg-white hover:text-gray-800">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Credentials
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Configure Modal */}
      {configModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Configure {configModal.name}</h3>
              <p className="text-sm text-gray-500 mt-1">Update gateway settings and API credentials.</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={configForm.status}
                    onChange={(e) => setConfigForm(f => ({ ...f, status: e.target.value }))}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="LIMITED">Limited</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={configForm.mode}
                    onChange={(e) => setConfigForm(f => ({ ...f, mode: e.target.value }))}
                  >
                    <option value="Test">Test</option>
                    <option value="Live">Live</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                <input
                  type="text"
                  placeholder="Enter API key"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={configForm.apiKey}
                  onChange={(e) => setConfigForm(f => ({ ...f, apiKey: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
                <input
                  type="password"
                  placeholder="Enter secret key"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={configForm.secretKey}
                  onChange={(e) => setConfigForm(f => ({ ...f, secretKey: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Webhook Secret</label>
                <input
                  type="password"
                  placeholder="Enter webhook secret"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={configForm.webhookSecret}
                  onChange={(e) => setConfigForm(f => ({ ...f, webhookSecret: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Settlement Days</label>
                <input
                  type="text"
                  placeholder="e.g. 1-2 Days"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={configForm.settlementDays}
                  onChange={(e) => setConfigForm(f => ({ ...f, settlementDays: e.target.value }))}
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setConfigModal(null)}>Cancel</Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : 'Save Configuration'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default PaymentSettings
