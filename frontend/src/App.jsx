import { BrowserRouter as Router } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AppRoutes from './routes'
import DevNavigation from './components/common/DevNavigation'

function App() {
  return (
    <Router>
      <div className="App">
        <AppRoutes />
        
        {/* Development Navigation - Remove in production */}
        {process.env.NODE_ENV === 'development' && <DevNavigation />}
        
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App