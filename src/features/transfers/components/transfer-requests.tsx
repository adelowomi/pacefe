import TransferRequestsEnhanced from './transfer-requests-enhanced';

interface TransferRequestsProps {
  organizationId: string;
}

export default function TransferRequests({ organizationId }: TransferRequestsProps) {
  return <TransferRequestsEnhanced organizationId={organizationId} />;
}
