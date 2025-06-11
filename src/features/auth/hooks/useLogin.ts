import { useState, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { setAuthToken, userService } from "@/lib/api-client";
import type { LoginRequest } from "@/api/models/LoginRequest";
import type { AccessTokenResponse } from "@/api/models/AccessTokenResponse";
import type { StandardResponseOfAccessTokenResponse } from "@/lib/utils";
import { AuthConfig } from "@/lib/auth-config";

interface LoginFormData {
	email: string;
	password: string;
	rememberMe: boolean;
}

export function useLogin() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState<LoginFormData>({
		email: "",
		password: "",
		rememberMe: false,
	});
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
		// Clear error when user starts typing
		if (error) setError("");
	}, [error]);

	const togglePasswordVisibility = useCallback(() => {
		setShowPassword(prev => !prev);
	}, []);

	const handleSubmit = useCallback(async (e: React.FormEvent) => {
		e.preventDefault();
		
		// Basic validation
		if (!formData.email || !formData.password) {
			setError("Please fill in all fields");
			return;
		}

		if (!formData.email.includes("@")) {
			setError("Please enter a valid email address");
			return;
		}

		setIsLoading(true);
		setError("");

		try {
			// Prepare login request
			const loginRequest: LoginRequest = {
				email: formData.email,
				password: formData.password,
			};

			console.log("Login attempt:", { 
				email: formData.email, 
				rememberMe: formData.rememberMe 
			});

			// Call the API
			const response = await userService.postApiAuthLogin({
				requestBody: loginRequest,
				useCookies: formData.rememberMe,
			}) as StandardResponseOfAccessTokenResponse;

			console.log("API response:", response);
			console.log("Response data:", response.Data);

			if (!response.Success) {
				setError(response.Message || "Login failed");
				return;
			}

			const data = response.Data as AccessTokenResponse;

			// Validate that we have the required token data
			if (!data || !data.accessToken || !data.refreshToken) {
				setError("Invalid response from server");
				return;
			}

			// Success - store tokens and redirect
			console.log("Login successful!", response.Data);
			
			setAuthToken(data.accessToken);
			// Store tokens using AuthConfig
			AuthConfig.setTokens({
				accessToken: data.accessToken,
				refreshToken: data.refreshToken,
				tokenType: data.tokenType || "Bearer",
				expiresIn: data.expiresIn,
			});
			
			// Redirect to dashboard
			navigate({ to: "/dashboard" });
			
		} catch (err: any) {
			console.error("Login error:", err);
			
			// Handle different types of errors
			if (err?.status === 401) {
				setError("Invalid email or password");
			} else if (err?.status === 400) {
				setError("Please check your email and password");
			} else if (err?.message) {
				setError(err.message);
			} else {
				setError("Login failed. Please try again.");
			}
		} finally {
			setIsLoading(false);
		}
	}, [formData, navigate]);

	const handleSignUpClick = useCallback(() => {
		window.location.href = "/register";
	}, []);

	const handleForgotPasswordClick = useCallback(() => {
		console.log("Navigate to forgot password page");
	}, []);

	return {
		// State
		formData,
		showPassword,
		isLoading,
		error,
		
		// Handlers
		handleInputChange,
		togglePasswordVisibility,
		handleSubmit,
		handleSignUpClick,
		handleForgotPasswordClick,
	};
}
