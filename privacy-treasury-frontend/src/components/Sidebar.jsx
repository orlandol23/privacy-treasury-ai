import { 
  LayoutDashboard, 
  PieChart, 
  ArrowUpDown, 
  Brain, 
  Settings, 
  Shield,
  Users,
  FileText,
  TrendingUp
} from 'lucide-react'
import { useState } from 'react'

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('dashboard')

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Visão geral do tesouro'
    },
    {
      id: 'portfolio',
      label: 'Portfólio',
      icon: PieChart,
      description: 'Asset allocation'
    },
    {
      id: 'transactions',
      label: 'Transações',
      icon: ArrowUpDown,
      description: 'Histórico e pendências'
    },
    {
      id: 'ai-insights',
      label: 'IA Insights',
      icon: Brain,
      description: 'Recomendações inteligentes'
    },
    {
      id: 'governance',
      label: 'Governança',
      icon: Users,
      description: 'Propostas e votações'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: TrendingUp,
      description: 'Métricas avançadas'
    },
    {
      id: 'privacy',
      label: 'Privacidade',
      icon: Shield,
      description: 'Configurações ZK'
    },
    {
      id: 'reports',
      label: 'Relatórios',
      icon: FileText,
      description: 'Documentos e auditorias'
    }
  ]

  const bottomItems = [
    {
      id: 'settings',
      label: 'Configurações',
      icon: Settings,
      description: 'Preferências do sistema'
    }
  ]

  const NavItem = ({ item, isActive, onClick }) => {
    const Icon = item.icon
    return (
      <div
        className={`treasury-nav-item ${isActive ? 'active' : ''} group`}
        onClick={() => onClick(item.id)}
      >
        <Icon className="w-5 h-5" />
        <div className="flex-1">
          <p className="text-sm font-medium">{item.label}</p>
          <p className="text-xs opacity-70 group-hover:opacity-100 transition-opacity">
            {item.description}
          </p>
        </div>
      </div>
    )
  }

  return (
    <aside className="treasury-sidebar flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-sidebar-primary rounded-lg treasury-ai-glow">
            <Shield className="w-6 h-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gradient-purple">PrivacyTreasuryAI</h2>
            <p className="text-xs text-sidebar-foreground-70">v1.0.0</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 space-y-1">
        {navigationItems.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            isActive={activeItem === item.id}
            onClick={setActiveItem}
          />
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-sidebar-border p-4 space-y-1">
        {bottomItems.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            isActive={activeItem === item.id}
            onClick={setActiveItem}
          />
        ))}
        
        {/* Status Indicator */}
        <div className="mt-4 p-3 bg-sidebar-accent rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success-green rounded-full animate-pulse"></div>
            <span className="text-xs text-sidebar-foreground">Sistema Online</span>
          </div>
          <p className="text-xs text-sidebar-foreground-70 mt-1">
            Midnight Network: Conectado
          </p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
