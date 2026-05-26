import { LogOut, X, AlertTriangle } from 'lucide-react'

/**
 * Reusable logout confirmation modal.
 * Props:
 *   isOpen   — boolean
 *   onConfirm — () => void
 *   onCancel  — () => void
 *   isPending — boolean (optional)
 */
const LogoutModal = ({ isOpen, onConfirm, onCancel, isPending = false }) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={onCancel}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Top accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-red-500 via-orange-500 to-red-500" />

        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
              <LogOut className="w-8 h-8 text-red-500" />
            </div>
          </div>

          {/* Text */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Sign Out?</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              You'll be logged out of your account. Any unsaved progress may be lost.
            </p>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              Make sure you've saved your work before signing out.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Stay Logged In
            </button>
            <button
              onClick={onConfirm}
              disabled={isPending}
              className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isPending ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              {isPending ? 'Signing out...' : 'Yes, Sign Out'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LogoutModal
