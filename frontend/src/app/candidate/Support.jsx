import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { HelpCircle, Plus, Eye, Loader2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import CandidateLayout from '../../components/layouts/CandidateLayout'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { candidateService } from '../../services/candidate.service'

const STATUS_COLORS = {
  open:        'bg-red-100 text-red-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  resolved:    'bg-green-100 text-green-700',
  closed:      'bg-gray-100 text-gray-700',
}

const CATEGORIES = ['Payment', 'Application', 'Technical', 'General', 'Document', 'Other']

const Support = () => {
  const queryClient = useQueryClient()
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ subject: '', category: 'General', description: '' })
  const [formErrors, setFormErrors] = useState({})

  const { data, isLoading } = useQuery({
    queryKey: ['candidate-tickets'],
    queryFn: () => candidateService.getMyTickets({ limit: 20 }),
  })

  const tickets = data?.tickets || []

  const { mutate: createTicket, isPending } = useMutation({
    mutationFn: candidateService.createTicket,
    onSuccess: () => {
      toast.success('Support ticket created')
      queryClient.invalidateQueries({ queryKey: ['candidate-tickets'] })
      setShowCreate(false)
      setForm({ subject: '', category: 'General', description: '' })
    },
    onError: (err) => toast.error(err.message || 'Failed to create ticket'),
  })

  const validate = () => {
    const e = {}
    if (!form.subject.trim()) e.subject = 'Subject is required'
    if (!form.description.trim()) e.description = 'Description is required'
    setFormErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    createTicket(form)
  }

  return (
    <CandidateLayout title="Support Center">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Help & Support</h1>
            <p className="text-gray-600 text-sm">Raise and track your support tickets</p>
          </div>
          <Button onClick={() => setShowCreate(true)} className="bg-orange-600 hover:bg-orange-700 text-white">
            <Plus className="w-4 h-4 mr-2" />New Ticket
          </Button>
        </div>

        {/* Create Ticket Modal */}
        {showCreate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-lg">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Create Support Ticket</h3>
                <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input type="text" placeholder="Brief description of your issue"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${formErrors.subject ? 'border-red-400' : 'border-gray-300'}`}
                    value={form.subject} onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))} />
                  {formErrors.subject && <p className="text-red-500 text-xs mt-1">{formErrors.subject}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea rows="4" placeholder="Describe your issue in detail..."
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${formErrors.description ? 'border-red-400' : 'border-gray-300'}`}
                    value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />
                  {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
                </div>
              </div>
              <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={isPending} className="bg-orange-600 hover:bg-orange-700 text-white">
                  {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</> : 'Submit Ticket'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tickets List */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-800">My Tickets ({tickets.length})</h3>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading && <div className="p-6 text-center text-gray-500">Loading tickets...</div>}
            {!isLoading && tickets.length === 0 && (
              <div className="p-8 text-center">
                <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No support tickets yet</p>
                <p className="text-gray-400 text-sm mt-1">Create a ticket if you need help</p>
              </div>
            )}
            {tickets.map((ticket) => (
              <div key={ticket._id} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-orange-50">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{ticket.subject}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-orange-600">{ticket.ticketId}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500 capitalize">{ticket.category}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-gray-400">
                      {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString('en-IN') : ''}
                    </p>
                  </div>
                  <Badge className={STATUS_COLORS[ticket.status] || 'bg-gray-100 text-gray-700'}>
                    {ticket.status?.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </CandidateLayout>
  )
}

export default Support
