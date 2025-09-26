import { Users, CheckCircle, Clock, X, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const MultiSigApproval = ({ pendingTransactions = [], loading = false, lastUpdated, className = '' }) => {
  const defaultTransactions = [
    {
      id: 'ABCDEFGHIJKLMPXVZZ',
      amount: 250,
      asset: 'ETH',
      description: 'Rebalanceamento de portfólio',
      requiredSignatures: 3,
      currentSignatures: 2,
      signers: [
        { address: '0x1234...5678', signed: true, name: 'Alice' },
        { address: '0x2345...6789', signed: true, name: 'Bob' },
        { address: '0x3456...7890', signed: false, name: 'Carol' }
      ],
      createdAt: '2024-04-22 14:30',
      expiresAt: '2024-04-25 14:30'
    },
    {
      id: 'ZBCDEFGHIJKLMNOPRSTUD',
      amount: 1200,
      asset: 'USDC',
      description: 'Distribuição de grants Q2',
      requiredSignatures: 3,
      currentSignatures: 1,
      signers: [
        { address: '0x4567...8901', signed: true, name: 'David' },
        { address: '0x5678...9012', signed: false, name: 'Eve' },
        { address: '0x6789...0123', signed: false, name: 'Frank' }
      ],
      createdAt: '2024-04-21 09:15',
      expiresAt: '2024-04-24 09:15'
    }
  ]

  const displayTransactions = !loading && pendingTransactions.length > 0 ? pendingTransactions : defaultTransactions

  const getProgressPercentage = (current, required) => {
    if (!required) return 0
    return (current / required) * 100
  }

  const SignerStatus = ({ signer }) => (
    <div className="flex items-center space-x-2">
      {signer.signed ? (
        <CheckCircle className="w-4 h-4 text-success-green" />
      ) : (
        <Clock className="w-4 h-4 text-muted-foreground" />
      )}
      <span className="text-xs text-muted-foreground">
        {signer.name || signer.address}
      </span>
    </div>
  )

  return (
    <div className={`treasury-card ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-warning-orange/20 rounded-lg">
            <Users className="w-6 h-6 text-warning-orange" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Aprovação Multi-Signature</h3>
            <p className="text-sm text-muted-foreground">Transações pendentes de aprovação</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {loading ? (
            <Skeleton className="h-3 w-12 bg-muted/40" />
          ) : (
            <>
              <div className="w-2 h-2 bg-warning-orange rounded-full animate-pulse"></div>
              <span className="text-xs text-muted-foreground">{displayTransactions.length} pendentes</span>
            </>
          )}
        </div>
      </div>

      {/* Pending Transactions */}
      <div className="space-y-4">
        {loading && (
          <>
            <Skeleton className="h-32 w-full bg-muted/20" />
            <Skeleton className="h-32 w-full bg-muted/20" />
          </>
        )}

        {!loading && displayTransactions.map((transaction) => (
          <div 
            key={transaction.id}
            className="p-4 bg-muted/30 rounded-lg border border-border"
          >
            {/* Transaction Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-sm font-medium text-foreground">
                    {transaction.description}
                  </h4>
                  <span className="text-xs bg-warning-orange/20 text-warning-orange px-2 py-1 rounded-full">
                    ID: {transaction.id.slice(0, 8)}...
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span>Value: {transaction.amount?.toLocaleString?.('en-US', { maximumFractionDigits: 2 }) ?? transaction.amount} {transaction.asset}</span>
                  <span>Criado: {transaction.createdAt}</span>
                  <span>Expira: {transaction.expiresAt}</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">
                  Assinaturas: {transaction.currentSignatures}/{transaction.requiredSignatures}
                </span>
                <span className="text-xs text-muted-foreground">
                  {Math.round(getProgressPercentage(transaction.currentSignatures, transaction.requiredSignatures))}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min(100, getProgressPercentage(transaction.currentSignatures, transaction.requiredSignatures))}%` 
                  }}
                />
              </div>
            </div>

            {/* Signers */}
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2">Signatários:</p>
              <div className="grid grid-cols-3 gap-2">
                {transaction.signers?.map((signer, index) => (
                  <SignerStatus key={index} signer={signer} />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button 
                  size="sm" 
                  className="treasury-button-primary h-8 px-4 text-xs"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  Aprovar
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-4 text-xs text-error-red hover:text-error-red"
                >
                  <X className="w-3 h-3 mr-1" />
                  Rejeitar
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="h-8 px-4 text-xs">
                Ver Detalhes
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">
              Midnight Network: Transações privadas habilitadas
            </span>
          </div>
          <div className="flex items-center space-x-3">
            {lastUpdated && !loading ? (
              <span className="text-xs text-muted-foreground">Updated {new Date(lastUpdated).toLocaleTimeString('en-US')}</span>
            ) : null}
            <Button variant="ghost" size="sm" className="text-xs">
              Histórico de Aprovações
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MultiSigApproval
