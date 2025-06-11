import { useState } from 'react';
import { ArrowUpRight, Users } from 'lucide-react';
import TransferRequests from './transfer-requests';
import TransferRecipients from './transfer-recipients';

interface TransfersProps {
  organizationId: string;
}

export default function Transfers({ organizationId }: TransfersProps) {
  const [activeTab, setActiveTab] = useState<'requests' | 'recipients'>('requests');

  return (
    <div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center">
            <ArrowUpRight className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Transfers</h1>
            <p className="text-muted-foreground mt-1">
              Manage transfer requests and recipients for your organization
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'requests', label: 'Transfer Requests', icon: ArrowUpRight },
            { id: 'recipients', label: 'Recipients', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'requests' && (
        <TransferRequests organizationId={organizationId} />
      )}

      {activeTab === 'recipients' && (
        <TransferRecipients organizationId={organizationId} />
      )}
    </div>
  );
}
