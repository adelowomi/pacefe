import { createFileRoute } from '@tanstack/react-router'
import EmailConfirmation from '@/features/auth/components/email-confirmation'

export const Route = createFileRoute('/confirm-email')({
  component: EmailConfirmation,
  validateSearch: (search: Record<string, unknown>) => {
    const token = search.token as string;
    
    return {
      userId: search.userId as string,
      // Fix URL decoding issue: replace spaces with + characters
      // This happens because + characters in URLs are decoded as spaces
      token: token ? token.replace(/ /g, '+') : token,
    }
  },
})
