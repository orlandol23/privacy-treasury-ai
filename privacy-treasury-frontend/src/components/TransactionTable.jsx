import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const TransactionTable = ({ transactions = [], loading = false, lastUpdated, className = '' }) => {
  const getTransactionIcon = (type) => {
    switch (type) {
      case 'outgoing':
        return <ArrowUpRight className="w-4 h-4 text-error-red" />
      case 'incoming':
        return <ArrowDownLeft className="w-4 h-4 text-success-green" />
      default:
        return <Clock className="w-4 h-4 text-warning-orange" />
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success-green" />
      case 'pending':
        return <Clock className="w-4 h-4 text-warning-orange" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-error-red" />
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Concluída'
      case 'pending':
        return 'Pendente'
      case 'failed':
        return 'Falhou'
      default:
        return 'Desconhecido'
    }
  }

  const getAmountColor = (type) => {
    switch (type) {
      case 'outgoing':
        return 'text-error-red'
      case 'incoming':
        return 'text-success-green'
      default:
        return 'text-foreground'
    }
  }

  const defaultTransactions = [
    {
      id: '1',
      date: '22/04/2024',
      description: 'Treasury Token Purchase',
      type: 'outgoing',
      amount: 150000,
      asset: 'USDC',
      status: 'completed',
      hash: '0x1234...5678'
    },
    {
      id: '2',
      date: '20/04/2024',
      description: 'Grant Distribution',
      type: 'outgoing',
      amount: 20000,
      asset: 'ETH',
      status: 'completed',
      hash: '0x2345...6789'
    },
    {
      id: '3',
      date: '18/04/2024',
      description: 'ETH Swap',
      type: 'incoming',
      amount: 50000,
      asset: 'ETH',
      status: 'completed',
      hash: '0x3456...7890'
    },
    {
      id: '4',
      date: '15/04/2024',
      description: 'Stablecoin Deposit',
      type: 'incoming',
      amount: 10000,
      asset: 'USDC',
      status: 'pending',
      hash: '0x4567...8901'
    }
  ]

  const displayTransactions = !loading && transactions.length > 0 ? transactions : defaultTransactions

  return (
    <div className={`treasury-card ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Transações Recentes</h3>
        <div className="flex items-center space-x-3">
          {lastUpdated && !loading ? (
            <span className="text-xs text-muted-foreground">Updated {new Date(lastUpdated).toLocaleTimeString('en-US')}</span>
          ) : null}
          <Button variant="ghost" size="sm" className="text-xs">
            Ver Todas
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="treasury-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Value</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={index}>
                  <td colSpan={5}>
                    <Skeleton className="h-10 w-full bg-muted/20" />
                  </td>
                </tr>
              ))
            ) : (
              displayTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>
                    <div className="flex items-center space-x-2">
                      {getTransactionIcon(transaction.type)}
                      <span className="text-sm">{transaction.date}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <p className="text-sm font-medium">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Hash: {transaction.hash ?? '—'}
                      </p>
                    </div>
                  </td>
                  <td>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${getAmountColor(transaction.type)}`}>
                        {transaction.type === 'outgoing' ? '-' : '+'}
                        ${Math.abs(transaction.amount ?? 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">{transaction.asset}</p>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(transaction.status)}
                      <span className={`text-xs font-medium ${
                        transaction.status === 'completed' ? 'text-success-green' :
                        transaction.status === 'pending' ? 'text-warning-orange' :
                        'text-error-red'
                      }`}>
                        {getStatusText(transaction.status)}
                      </span>
                    </div>
                  </td>
                  <td>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Detalhes
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Mostrando {displayTransactions.length} transações</span>
          <span>{lastUpdated ? `Last update: ${new Date(lastUpdated).toLocaleTimeString('en-US')}` : 'Real-time updates'}</span>
        </div>
      </div>
    </div>
  )
}

export default TransactionTable
