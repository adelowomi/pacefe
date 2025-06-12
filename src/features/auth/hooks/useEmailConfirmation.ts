import { useState, useCallback } from "react";
import { userService } from "@/lib/api-client";
import type { StandardResponseOfstring } from "@/api";
import type { StandardResponseOfCapitalizedString } from "@/lib/utils";

interface EmailConfirmationState {
	isLoading: boolean;
	isSuccess: boolean;
	error: string;
	message: string;
	isResending: boolean;
	resendSuccess: boolean;
	resendError: string;
}

export function useEmailConfirmation() {
	const [state, setState] = useState<EmailConfirmationState>({
		isLoading: false,
		isSuccess: false,
		error: "",
		message: "",
		isResending: false,
		resendSuccess: false,
		resendError: "",
	});

	const confirmEmail = useCallback(async (userId: string, token: string) => {
		if (!userId || !token) {
			setState(prev => ({
				...prev,
				error: "Missing userId or token parameters",
				isSuccess: false,
			}));
			return;
		}

		setState(prev => ({
			...prev,
			isLoading: true,
			error: "",
			message: "",
		}));

		try {
			console.log("Confirming email with:", { userId, token });
			console.log("Token length:", token.length);
			console.log("Token contains spaces:", token.includes(' '));
			console.log("Token contains plus signs:", token.includes('+'));

			// Call the API to confirm email
			const response = await userService.confirmEmailAlt({
				userId,
				token,
			}) as StandardResponseOfCapitalizedString;

			console.log("Email confirmation response:", response);

			setState(prev => ({
				...prev,
				isLoading: false,
				isSuccess: true,
				message: response.Data || "Email confirmed successfully! You can now log in.",
			}));

		} catch (err: any) {
			console.error("Email confirmation error:", err);

			let errorMessage = "Email confirmation failed. Please try again.";

			if (err?.status === 400) {
				errorMessage = "Invalid confirmation link or token has expired.";
			} else if (err?.message) {
				errorMessage = err.message;
			}

			setState(prev => ({
				...prev,
				isLoading: false,
				isSuccess: false,
				error: errorMessage,
			}));
		}
	}, []);

	const resendConfirmationEmail = useCallback(async (email: string) => {
		if (!email) {
			setState(prev => ({
				...prev,
				resendError: "Email address is required",
				resendSuccess: false,
			}));
			return;
		}

		setState(prev => ({
			...prev,
			isResending: true,
			resendError: "",
			resendSuccess: false,
		}));

		try {
			console.log("Resending confirmation email to:", email);

			// Call the API to resend confirmation email
			await userService.postApiAuthResendConfirmationEmail({
				requestBody: { email }
			});

			console.log("Resend confirmation email successful");

			setState(prev => ({
				...prev,
				isResending: false,
				resendSuccess: true,
				resendError: "",
			}));

		} catch (err: any) {
			console.error("Resend confirmation email error:", err);

			let errorMessage = "Failed to resend confirmation email. Please try again.";

			if (err?.status === 400) {
				errorMessage = "Invalid email address or user not found.";
			} else if (err?.message) {
				errorMessage = err.message;
			}

			setState(prev => ({
				...prev,
				isResending: false,
				resendSuccess: false,
				resendError: errorMessage,
			}));
		}
	}, []);

	const resetState = useCallback(() => {
		setState({
			isLoading: false,
			isSuccess: false,
			error: "",
			message: "",
			isResending: false,
			resendSuccess: false,
			resendError: "",
		});
	}, []);

	return {
		...state,
		confirmEmail,
		resendConfirmationEmail,
		resetState,
	};
}
