import { Bell, Settings, User, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Header = () => {
  return (
    <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
      {/* Logo and Title */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg treasury-ai-glow">
          <Shield className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gradient-purple">PrivacyTreasuryAI</h1>
          <p className="text-xs text-muted-foreground">DAO Treasury Management</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-8">
        <input
          type="text"
          placeholder="Search transactions, assets or proposals..."
          className="treasury-input w-full"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-warning-orange rounded-full text-xs flex items-center justify-center text-white">
            3
          </span>
        </Button>

        {/* Settings */}
        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button>

        {/* User Profile */}
        <div className="flex items-center space-x-2 pl-3 border-l border-border">
          <div className="text-right">
            <p className="text-sm font-medium">Rachel Williams</p>
            <p className="text-xs text-muted-foreground">Treasury Manager</p>
          </div>
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
