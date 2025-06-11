import { useEffect, useState } from "react";
import { Link, useSearch } from "@tanstack/react-router";
import { useEmailConfirmation } from "../hooks/useEmailConfirmation";
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle";

interface EmailConfirmationSearchParams {
	userId?: string;
	token?: string;
}

export default function EmailConfirmation() {
	const search = useSearch({ from: "/confirm-email" }) as EmailConfirmationSearchParams;
	const { 
		isLoading, 
		isSuccess, 
		error, 
		message, 
		confirmEmail,
		isResending,
		resendSuccess,
		resendError,
		resendConfirmationEmail
	} = useEmailConfirmation();
	const [email, setEmail] = useState("");
	const [showResendForm, setShowResendForm] = useState(false);

	useEffect(() => {
		const { userId, token } = search;
		
		if (userId && token) {
			// Token is already properly decoded at the route level
			confirmEmail(userId, token);
		}
	}, [search, confirmEmail]);

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
				{/* Dark Mode Toggle */}
				<div className="absolute top-4 right-4">
					<DarkModeToggle />
				</div>
				
				<div className="max-w-md w-full space-y-8 p-8">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
						<h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
							Confirming your email...
						</h2>
						<p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
							Please wait while we verify your email address.
						</p>
					</div>
				</div>
			</div>
		);
	}

	if (isSuccess) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
				{/* Dark Mode Toggle */}
				<div className="absolute top-4 right-4">
					<DarkModeToggle />
				</div>
				
				<div className="max-w-md w-full space-y-8 p-8">
					<div className="text-center">
						<div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20">
							<svg
								className="h-6 w-6 text-green-600 dark:text-green-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M5 13l4 4L19 7"
								></path>
							</svg>
						</div>
						<h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
							Email Confirmed!
						</h2>
						<p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
							{message}
						</p>
						<div className="mt-6">
							<Link
								to="/"
								className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
							>
								Continue to Login
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		const handleResendSubmit = (e: React.FormEvent) => {
			e.preventDefault();
			if (email.trim()) {
				resendConfirmationEmail(email.trim());
			}
		};

		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="max-w-md w-full space-y-8 p-8">
					<div className="text-center">
						<div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
							<svg
								className="h-6 w-6 text-red-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M6 18L18 6M6 6l12 12"
								></path>
							</svg>
						</div>
						<h2 className="mt-6 text-3xl font-extrabold text-gray-900">
							Confirmation Failed
						</h2>
						<p className="mt-2 text-sm text-red-600">
							{error}
						</p>

						{/* Resend Success Message */}
						{resendSuccess && (
							<div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
								<p className="text-sm">
									Confirmation email sent successfully! Please check your inbox and spam folder.
								</p>
							</div>
						)}

						{/* Resend Error Message */}
						{resendError && (
							<div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
								<p className="text-sm">{resendError}</p>
							</div>
						)}

						<div className="mt-6 space-y-3">
							{!showResendForm ? (
								<>
									<button
										onClick={() => setShowResendForm(true)}
										className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
									>
										Resend Confirmation Email
									</button>
									<Link
										to="/register"
										className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
									>
										Register Again
									</Link>
									<Link
										to="/"
										className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
									>
										Back to Login
									</Link>
								</>
							) : (
								<>
									<form onSubmit={handleResendSubmit} className="space-y-3">
										<div>
											<label htmlFor="email" className="sr-only">
												Email address
											</label>
											<input
												id="email"
												name="email"
												type="email"
												autoComplete="email"
												required
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
												placeholder="Enter your email address"
											/>
										</div>
										<button
											type="submit"
											disabled={isResending || !email.trim()}
											className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
										>
											{isResending ? (
												<>
													<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
													Sending...
												</>
											) : (
												'Send Confirmation Email'
											)}
										</button>
									</form>
									<button
										onClick={() => {
											setShowResendForm(false);
											setEmail("");
										}}
										className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
									>
										Cancel
									</button>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		);
	}

	// No userId or token in URL
	const handleResendSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (email.trim()) {
			resendConfirmationEmail(email.trim());
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full space-y-8 p-8">
				<div className="text-center">
					<div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
						<svg
							className="h-6 w-6 text-yellow-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
							></path>
						</svg>
					</div>
					<h2 className="mt-6 text-3xl font-extrabold text-gray-900">
						Invalid Confirmation Link
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						The confirmation link appears to be invalid or incomplete. Please check your email for the correct link.
					</p>

					{/* Resend Success Message */}
					{resendSuccess && (
						<div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
							<p className="text-sm">
								Confirmation email sent successfully! Please check your inbox and spam folder.
							</p>
						</div>
					)}

					{/* Resend Error Message */}
					{resendError && (
						<div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
							<p className="text-sm">{resendError}</p>
						</div>
					)}

					<div className="mt-6 space-y-3">
						{!showResendForm ? (
							<>
								<button
									onClick={() => setShowResendForm(true)}
									className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
								>
									Resend Confirmation Email
								</button>
								<Link
									to="/register"
									className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
								>
									Register Again
								</Link>
								<Link
									to="/"
									className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
								>
									Back to Login
								</Link>
							</>
						) : (
							<>
								<form onSubmit={handleResendSubmit} className="space-y-3">
									<div>
										<label htmlFor="email-invalid" className="sr-only">
											Email address
										</label>
										<input
											id="email-invalid"
											name="email"
											type="email"
											autoComplete="email"
											required
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
											placeholder="Enter your email address"
										/>
									</div>
									<button
										type="submit"
										disabled={isResending || !email.trim()}
										className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{isResending ? (
											<>
												<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
												Sending...
											</>
										) : (
											'Send Confirmation Email'
										)}
									</button>
								</form>
								<button
									onClick={() => {
										setShowResendForm(false);
										setEmail("");
									}}
									className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
								>
									Cancel
								</button>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
