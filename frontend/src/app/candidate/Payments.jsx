import { useQuery } from '@tanstack/react-query'
import { CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react'
import CandidateLayout from '../../components/layouts/CandidateLayout'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { candidateService } from '../../services/candidate.service'

const STATUS_CONFIG = {
  paid:    { color: 'bg-green-100 text-green-700', icon: CheckCircle },
  failed:  { color: 'bg-red-100 text-red-700',    icon: XCircle },
  pending: { color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  refunded:{ color: 'bg-blue-100 text-blue-700',  icon: CheckCircle },
}

const Payments = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['candidate-payments'],
    queryFn: () => candidateService.getMyPayments({ limit: 20 }),
  })

  const payments = data?.payments || []
  const totalPaid = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + (p.amount || p.totalFee || 0), 0)

  return (
    <CandidateLayout title="Payment History">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Payment History</h1>
          <p className="text-gray-600 text-sm">All your application fee transactions</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-medium text-gray-500 mb-1">TOTAL PAID</p>
              <p className="text-2xl font-bold text-green-600">₹{totalPaid.toLocaleString('en-IN')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-medium text-gray-500 mb-1">TRANSACTIONS</p>
              <p className="text-2xl font-bold text-gray-800">{payments.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-medium text-gray-500 mb-1">SUCCESSFUL</p>
              <p className="text-2xl font-bold text-orange-600">
                {payments.filter(p => p.status === 'paid').length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-800">Transactions</h3>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading && <div className="p-6 text-center text-gray-500">Loading payments...</div>}
            {!isLoading && payments.length === 0 && (
              <div className="p-8 text-center">
                <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No payment records yet</p>
                <p className="text-gray-400 text-sm mt-1">Payments will appear here after you apply for jobs</p>
              </div>
            )}
            {payments.map((payment) => {
              const cfg = STATUS_CONFIG[payment.status] || STATUS_CONFIG.pending
              const StatusIcon = cfg.icon
              return (
                <div key={payment._id} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-orange-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">
                        {payment.applicationId?.jobId?.title || 'Application Fee'}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {payment.transactionId || payment._id}
                      </p>
                      {payment.gateway && (
                        <p className="text-xs text-orange-600 mt-0.5 capitalize">{payment.gateway}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-gray-800">
                        ₹{(payment.amount || payment.totalFee || 0).toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-gray-400">
                        {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString('en-IN') : ''}
                      </p>
                    </div>
                    <Badge className={cfg.color}>
                      <StatusIcon className="w-3 h-3 mr-1 inline" />
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </CandidateLayout>
  )
}

export default Payments
