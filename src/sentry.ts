import * as Sentry from "@sentry/react";

export function initializeSentry(router: any) {
	// Only initialize Sentry if DSN is provided
	const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
	
	if (!sentryDsn) {
		console.warn('Sentry DSN not provided. Sentry will not be initialized.');
		return;
	}

	Sentry.init({
		dsn: sentryDsn,
		environment: import.meta.env.VITE_ENVIRONMENT || 'development',
		integrations: [
			Sentry.tanstackRouterBrowserTracingIntegration(router),
			Sentry.replayIntegration({
				maskAllText: false,
				blockAllMedia: false,
			}),
		],
		// Set tracesSampleRate to 1.0 to capture 100%
		// of transactions for tracing.
		// We recommend adjusting this value in production.
		// Learn more at https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
		tracesSampleRate: 1.0,
		// Capture Replay for 10% of all sessions,
		// plus for 100% of sessions with an error.
		// Learn more at https://docs.sentry.io/platforms/javascript/session-replay/configuration/#general-integration-configuration
		replaysSessionSampleRate: 0.1,
		replaysOnErrorSampleRate: 1.0,
		// debug: true, // Enable debug mode for development
	});
}
