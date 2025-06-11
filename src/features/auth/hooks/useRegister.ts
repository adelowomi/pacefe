import { useState, useCallback } from "react";
import { userService } from "@/lib/api-client";
import type { RegisterRequest } from "@/api/models/RegisterRequest";

interface RegisterFormData {
	email: string;
	password: string;
	confirmPassword: string;
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	profilePictureUrl: string;
	bio: string;
	agreeToTerms: boolean;
}

export function useRegister() {
	const [formData, setFormData] = useState<RegisterFormData>({
		email: "",
		password: "",
		confirmPassword: "",
		firstName: "",
		lastName: "",
		dateOfBirth: "",
		profilePictureUrl: "",
		bio: "",
		agreeToTerms: false,
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [fieldErrors, setFieldErrors] = useState({
		email: "",
		password: "",
		confirmPassword: "",
		firstName: "",
		lastName: "",
	});

	const validateField = useCallback((name: string, value: string, currentFormData: RegisterFormData) => {
		let fieldError = "";
		
		switch (name) {
			case "email":
				if (value && !value.includes("@")) {
					fieldError = "Please enter a valid email address";
				}
				break;
			case "firstName":
				if (value && value.length < 2) {
					fieldError = "First name must be at least 2 characters";
				}
				break;
			case "lastName":
				if (value && value.length < 2) {
					fieldError = "Last name must be at least 2 characters";
				}
				break;
			case "password":
				if (value) {
					if (value.length < 6) {
						fieldError = "Password must be at least 6 characters";
					} else if (!/(?=.*[a-z])/.test(value)) {
						fieldError = "Password must contain at least one lowercase letter";
					} else if (!/(?=.*[A-Z])/.test(value)) {
						fieldError = "Password must contain at least one uppercase letter";
					} else if (!/(?=.*\d)/.test(value)) {
						fieldError = "Password must contain at least one number";
					}
				}
				break;
			case "confirmPassword":
				if (value && value !== currentFormData.password) {
					fieldError = "Passwords do not match";
				}
				break;
		}
		
		return fieldError;
	}, []);

	const getPasswordStrength = useCallback((password: string) => {
		if (!password) return { strength: 0, label: "", color: "" };
		
		let strength = 0;
		const checks = [
			password.length >= 6,
			/(?=.*[a-z])/.test(password),
			/(?=.*[A-Z])/.test(password),
			/(?=.*\d)/.test(password),
			/(?=.*[@$!%*?&])/.test(password),
			password.length >= 12
		];
		
		strength = checks.filter(Boolean).length;
		
		if (strength <= 2) return { strength, label: "Weak", color: "#EF4444" };
		if (strength <= 4) return { strength, label: "Medium", color: "#F59E0B" };
		return { strength, label: "Strong", color: "#10B981" };
	}, []);

	const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value, type } = e.target;
		const checked = (e.target as HTMLInputElement).checked;
		
		const newFormData = {
			...formData,
			[name]: type === "checkbox" ? checked : value,
		};
		
		setFormData(newFormData);
		
		// Real-time field validation
		if (name in fieldErrors) {
			const fieldError = validateField(name, value, newFormData);
			setFieldErrors(prev => ({
				...prev,
				[name]: fieldError,
			}));
			
			// Also validate confirm password when password changes
			if (name === "password" && newFormData.confirmPassword) {
				const confirmPasswordError = validateField("confirmPassword", newFormData.confirmPassword, newFormData);
				setFieldErrors(prev => ({
					...prev,
					confirmPassword: confirmPasswordError,
				}));
			}
		}
		
		// Clear error when user starts typing
		if (error) setError("");
		if (success) setSuccess("");
	}, [formData, fieldErrors, validateField, error, success]);

	const togglePasswordVisibility = useCallback(() => {
		setShowPassword(prev => !prev);
	}, []);

	const toggleConfirmPasswordVisibility = useCallback(() => {
		setShowConfirmPassword(prev => !prev);
	}, []);

	const validateForm = useCallback(() => {
		// Basic validation
		if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
			setError("Please fill in all required fields");
			return false;
		}

		if (!formData.email.includes("@")) {
			setError("Please enter a valid email address");
			return false;
		}

		if (formData.password.length < 6) {
			setError("Password must be at least 6 characters long");
			return false;
		}

		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match");
			return false;
		}

		if (!formData.agreeToTerms) {
			setError("Please agree to the terms and conditions");
			return false;
		}

		return true;
	}, [formData]);

	const handleSubmit = useCallback(async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!validateForm()) {
			return;
		}

		setIsLoading(true);
		setError("");
		setSuccess("");

		try {
			// Prepare registration request
			const registerRequest: RegisterRequest = {
				email: formData.email,
				password: formData.password,
				firstName: formData.firstName,
				lastName: formData.lastName,
				dateOfBirth: formData.dateOfBirth || null,
				profilePictureUrl: formData.profilePictureUrl || null,
				bio: formData.bio || null,
			};

			console.log("Registration attempt:", { 
				email: formData.email,
				firstName: formData.firstName,
				lastName: formData.lastName
			});

			// Call the API
			const response = await userService.registerAlt({
				requestBody: registerRequest,
			});

			console.log("Registration successful!", response);
			
			setSuccess("Registration successful! Please check your email to confirm your account.");
			
			// Reset form
			setFormData({
				email: "",
				password: "",
				confirmPassword: "",
				firstName: "",
				lastName: "",
				dateOfBirth: "",
				profilePictureUrl: "",
				bio: "",
				agreeToTerms: false,
			});
			
		} catch (err: any) {
			console.error("Registration error:", err);
			
			// Handle different types of errors
			if (err?.status === 400) {
				setError("Registration failed. Please check your information and try again.");
			} else if (err?.message) {
				setError(err.message);
			} else {
				setError("Registration failed. Please try again.");
			}
		} finally {
			setIsLoading(false);
		}
	}, [formData, validateForm]);

	const handleSignInClick = useCallback(() => {
		window.location.href = "/";
	}, []);

	return {
		// State
		formData,
		showPassword,
		showConfirmPassword,
		isLoading,
		error,
		success,
		fieldErrors,
		
		// Handlers
		handleInputChange,
		togglePasswordVisibility,
		toggleConfirmPasswordVisibility,
		handleSubmit,
		handleSignInClick,
		getPasswordStrength,
	};
}
