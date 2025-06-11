import { createFileRoute } from '@tanstack/react-router'
import EmailConfirmation from '@/features/auth/components/email-confirmation'

export const Route = createFileRoute('/confirm-email')({
  component: EmailConfirmation,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      userId: search.userId as string,
      token: search.token as string,
    }
  },
})
