import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  ArrowLeft, CreditCard, DollarSign, Building, Lock,
  CheckCircle, Loader2, Eye, EyeOff, AlertTriangle,
} from 'lucide-react'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { adminService } from '../../services/admin.service'

const GATEWAYS = [
  {
    name: 'Razorpay',
    icon: CreditCard,
    description: "India's leading payments solution. Supports UPI, Cards, Net Banking, and Wallets.",
    features: ['UPI', 'Cards', 'Net Banking', 'Wallets', 'EMI'],
    color: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-600 bg-blue-100',
  },
  {
    name: 'Cashfree',
    icon: DollarSign,
    description: 'Fastest way to collect payments. Optimized for high-volume government transactions.',
    features: ['UPI', 'Cards', 'Net Banking', 'Payout'],
    color: 'bg-green-50 border-green-200',
    iconColor: 'text-green-600 bg-green-100',
  },
  {
    name: 'BillDesk',
    icon: Building,
    description: 'Trusted by government institutions. Specialized for large-scale fee collection.',
    features: ['Net Banking', 'Cards', 'UPI', 'NEFT'],
    color: 'bg-purple-50 border-purple-200',
    iconColor: 'text-purple-600 bg-purple-100',
  },
  {
    name: 'CCAvenue',
    icon: Lock,
    description: 'Enterprise-grade payment gateway with multi-currency support.',
    features: ['Cards', 'Net Banking', 'UPI', 'Wallets'],
    color: 'bg-orange-50 border-orange-200',
    iconColor: 'text-orange-600 bg-orange-100',
  },
]

const ConfigForm = ({ gateway, existing, onSave, isSaving, onCancel }) => {
  const [showSecret, setShowSecret] = useState(false)
  const [showWebhook, setShowWebhook] = useState(false)
  const [form, setForm] = useState({
    status: existing?.status || 'INACTIVE',
    mode: existing?.mode || 'Test',
    apiKey: '',
    secretKey: '',
    webhookSecret: '',
    settlementDays: existing?.settlementDays || '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${gateway.iconColor}`}>
          <gateway.icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{gateway.name}</h3>
          <p className="text-sm text-gray-500">{gateway.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            value={form.status}
            onChange={(e) => set('status', e.target.value)}
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="LIMITED">Limited</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            value={form.mode}
            onChange={(e) => set('mode', e.target.value)}
          >
            <option value="Test">Test Mode</option>
            <option value="Live">Live Mode</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          API Key <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder={`Enter ${gateway.name} API key`}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-mono"
          value={form.apiKey}
          onChange={(e) => set('apiKey', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Secret Key <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showSecret ? 'text' : 'password'}
            placeholder="Enter secret key"
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-mono"
            value={form.secretKey}
            onChange={(e) => set('secretKey', e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowSecret(!showSecret)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Webhook Secret</label>
        <div className="relative">
          <input
            type={showWebhook ? 'text' : 'password'}
            placeholder="Enter webhook secret (optional)"
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-mono"
            value={form.webhookSecret}
            onChange={(e) => set('webhookSecret', e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowWebhook(!showWebhook)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showWebhook ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Settlement Days</label>
        <input
          type="text"
          placeholder="e.g. 1-2 Days"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
          value={form.settlementDays}
          onChange={(e) => set('settlementDays', e.target.value)}
        />
      </div>

      {/* Security Warning */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          API keys are encrypted with AES-256 before storage. Never share your secret keys.
          If compromised, rotate them immediately in your gateway dashboard.
        </p>
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button
          onClick={() => onSave(form)}
          disabled={isSaving || !form.apiKey.trim() || !form.secretKey.trim()}
          className="bg-orange-600 hover:bg-orange-700 text-white"
        >
          {isSaving
            ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
            : <><CheckCircle className="w-4 h-4 mr-2" />Save Configuration</>
          }
        </Button>
      </div>
    </div>
  )
}

const AddPaymentGateway = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedGateway, setSelectedGateway] = useState(null)

  const { data: gatewaysData } = useQuery({
    queryKey: ['admin-payment-gateways'],
    queryFn: adminService.getPaymentGateways,
  })

  const { mutate: upsertGateway, isPending } = useMutation({
    mutationFn: ({ name, data }) => adminService.upsertPaymentGateway(name, data),
    onSuccess: (_, vars) => {
      toast.success(`${vars.name} configured successfully`)
      queryClient.invalidateQueries({ queryKey: ['admin-payment-gateways'] })
      navigate('/admin/payment-settings')
    },
    onError: (err) => toast.error(err.message || 'Failed to save gateway'),
  })

  const apiGateways = gatewaysData?.gateways || []
  const getExisting = (name) => apiGateways.find(g => g.name === name)

  if (selectedGateway) {
    const gwDef = GATEWAYS.find(g => g.name === selectedGateway)
    return (
      <AdminLayout title="Configure Gateway">
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setSelectedGateway(null)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Configure {selectedGateway}</h1>
              <p className="text-gray-500 text-sm">Enter your API credentials to activate this gateway.</p>
            </div>
          </div>
          <Card>
            <CardContent className="p-6">
              <ConfigForm
                gateway={gwDef}
                existing={getExisting(selectedGateway)}
                onSave={(form) => upsertGateway({ name: selectedGateway, data: form })}
                isSaving={isPending}
                onCancel={() => setSelectedGateway(null)}
              />
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Add Payment Gateway">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/payment-settings')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Payment Gateways</h1>
            <p className="text-gray-600 text-sm">Select a gateway to configure API credentials.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {GATEWAYS.map((gw) => {
            const existing = getExisting(gw.name)
            const isActive = existing?.status === 'ACTIVE'
            const isConfigured = !!existing

            return (
              <Card
                key={gw.name}
                className={`border-2 transition-all cursor-pointer hover:shadow-md ${
                  isActive ? 'border-green-300 bg-green-50' : gw.color
                }`}
                onClick={() => setSelectedGateway(gw.name)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${gw.iconColor}`}>
                        <gw.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{gw.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {isActive ? (
                            <Badge className="bg-green-100 text-green-800">✓ Active</Badge>
                          ) : isConfigured ? (
                            <Badge className="bg-gray-100 text-gray-700">Configured</Badge>
                          ) : (
                            <Badge className="bg-blue-100 text-blue-700">Not Configured</Badge>
                          )}
                          {existing?.mode && (
                            <span className="text-xs text-gray-500">{existing.mode} Mode</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 mb-3">{gw.description}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {gw.features.map(f => (
                      <span key={f} className="px-2 py-0.5 bg-white border border-gray-200 text-gray-600 text-xs rounded-full">
                        {f}
                      </span>
                    ))}
                  </div>
                  <Button
                    className={`w-full ${isActive ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-orange-600 hover:bg-orange-700 text-white'}`}
                    onClick={(e) => { e.stopPropagation(); setSelectedGateway(gw.name) }}
                  >
                    {isConfigured ? '✏️ Edit Configuration' : '⚡ Configure Gateway'}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Security Notice */}
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-800 mb-1">Institutional Security Protocol</h3>
                <p className="text-amber-700 text-sm">
                  All gateways must comply with PCI-DSS standards. API credentials are encrypted with AES-256-GCM before storage.
                  Only activate gateways in Live mode after thorough testing in Test mode.
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
