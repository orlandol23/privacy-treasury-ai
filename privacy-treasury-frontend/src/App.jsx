import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-background treasury-gradient-bg lg:flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <Header />
        
        {/* Page Content */}
        <main className="min-h-screen px-4 sm:px-6 lg:px-8 pb-10">
          <Dashboard />
        </main>
      </div>
    </div>
  )
}

export default App
