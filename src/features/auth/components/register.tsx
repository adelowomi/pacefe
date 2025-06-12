import { Eye, EyeOff, User, Mail, Calendar, Image, FileText, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useState } from "react";
import { useRegister } from "../hooks/useRegister";
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle";

export default function Register() {
	const {
		formData,
		showPassword,
		showConfirmPassword,
		isLoading,
		error,
		success,
		fieldErrors,
		handleInputChange,
		togglePasswordVisibility,
		toggleConfirmPasswordVisibility,
		handleSubmit,
		handleSignInClick,
		getPasswordStrength,
	} = useRegister();

	const [currentStep, setCurrentStep] = useState(1);
	const totalSteps = 3;

	const passwordStrength = getPasswordStrength(formData.password);

	// Validation for each step
	const isStep1Valid = () => {
		return formData.firstName.trim() !== '' && 
			   formData.lastName.trim() !== '' && 
			   formData.email.trim() !== '' && 
			   !fieldErrors.firstName && 
			   !fieldErrors.lastName && 
			   !fieldErrors.email;
	};

	const isStep2Valid = () => {
		return formData.password.trim() !== '' && 
			   formData.confirmPassword.trim() !== '' && 
			   formData.password === formData.confirmPassword && 
			   !fieldErrors.password && 
			   !fieldErrors.confirmPassword;
	};

	const nextStep = () => {
		if (currentStep < totalSteps) {
			setCurrentStep(currentStep + 1);
		}
	};

	const prevStep = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	const getStepTitle = () => {
		switch (currentStep) {
			case 1: return "Personal Information";
			case 2: return "Security Setup";
			case 3: return "Additional Details";
			default: return "Registration";
		}
	};

	const getStepDescription = () => {
		switch (currentStep) {
			case 1: return "Let's start with your basic information";
			case 2: return "Create a secure password for your account";
			case 3: return "Complete your profile (optional)";
			default: return "Create your account to get started";
		}
	};

	return (
		<div 
			className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20"
			style={{ fontFamily: "Inter, sans-serif" }}
		>
			{/* Dark Mode Toggle */}
			<div className="absolute top-4 right-4">
				<DarkModeToggle />
			</div>

			{/* Background Pattern */}
			<div className="absolute inset-0 opacity-30 dark:opacity-10">
				<div 
					className="absolute inset-0"
					style={{
						backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.05'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
					}} 
				/>
			</div>

			{/* Main Registration Container */}
			<div className="relative w-full max-w-lg">
				{/* Registration Card */}
				<div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10 border border-white/20 dark:border-gray-700/50">
					{/* Progress Bar */}
					<div className="mb-8">
						<div className="flex items-center justify-between mb-4">
							{[1, 2, 3].map((step) => (
								<div key={step} className="flex items-center">
									<div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
										step < currentStep 
											? 'bg-green-500 text-white' 
											: step === currentStep 
											? 'bg-blue-600 text-white' 
											: 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
									}`}>
										{step < currentStep ? <Check className="w-5 h-5" /> : step}
									</div>
									{step < totalSteps && (
										<div className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${
											step < currentStep ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-600'
										}`} />
									)}
								</div>
							))}
						</div>
						<div className="text-center">
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Step {currentStep} of {totalSteps}
							</p>
						</div>
					</div>

					{/* Branding */}
					<div className="text-center mb-8">
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
							<svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
								<path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none"/>
							</svg>
						</div>
						<h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							Join Pace
						</h1>
						<h2 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">
							{getStepTitle()}
						</h2>
						<p className="text-sm text-gray-600 dark:text-gray-300">
							{getStepDescription()}
						</p>
					</div>

					{/* Registration Form */}
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Step 1: Personal Information */}
						{currentStep === 1 && (
							<div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
								{/* Name Fields Row */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									{/* First Name Field */}
									<div>
										<label 
											htmlFor="firstName" 
											className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
										>
											First Name *
										</label>
										<div className="relative">
											<User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
											<input
												type="text"
												id="firstName"
												name="firstName"
												value={formData.firstName}
												onChange={handleInputChange}
												placeholder="Enter first name"
												className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700 ${
													fieldErrors.firstName ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'
												}`}
												required
											/>
										</div>
										{fieldErrors.firstName && (
											<p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.firstName}</p>
										)}
									</div>

									{/* Last Name Field */}
									<div>
										<label 
											htmlFor="lastName" 
											className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
										>
											Last Name *
										</label>
										<div className="relative">
											<User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
											<input
												type="text"
												id="lastName"
												name="lastName"
												value={formData.lastName}
												onChange={handleInputChange}
												placeholder="Enter last name"
												className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700 ${
													fieldErrors.lastName ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'
												}`}
												required
											/>
										</div>
										{fieldErrors.lastName && (
											<p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.lastName}</p>
										)}
									</div>
								</div>

								{/* Email Field */}
								<div>
									<label 
										htmlFor="email" 
										className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
									>
										Email Address *
									</label>
									<div className="relative">
										<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
										<input
											type="email"
											id="email"
											name="email"
											value={formData.email}
											onChange={handleInputChange}
											placeholder="Enter your email"
											className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700 ${
												fieldErrors.email ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'
											}`}
											required
										/>
									</div>
									{fieldErrors.email && (
										<p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.email}</p>
									)}
								</div>
							</div>
						)}

						{/* Step 2: Security Setup */}
						{currentStep === 2 && (
							<div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
								{/* Password Field */}
								<div>
									<label 
										htmlFor="password" 
										className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
									>
										Password *
									</label>
									<div className="relative">
										<input
											type={showPassword ? "text" : "password"}
											id="password"
											name="password"
											value={formData.password}
											onChange={handleInputChange}
											placeholder="Enter password"
											className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700 ${
												fieldErrors.password ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'
											}`}
											required
										/>
										<button
											type="button"
											onClick={togglePasswordVisibility}
											className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
											tabIndex={-1}
										>
											{showPassword ? (
												<EyeOff className="w-5 h-5" />
											) : (
												<Eye className="w-5 h-5" />
											)}
										</button>
									</div>
									{/* Password Strength Indicator */}
									{formData.password && (
										<div className="mt-2">
											<div className="flex items-center justify-between mb-1">
												<span className="text-xs font-medium" style={{ color: passwordStrength.color }}>
													{passwordStrength.label}
												</span>
												<span className="text-xs text-gray-500 dark:text-gray-400">
													{passwordStrength.strength}/6
												</span>
											</div>
											<div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
												<div 
													className="h-1.5 rounded-full transition-all duration-300"
													style={{ 
														backgroundColor: passwordStrength.color,
														width: `${(passwordStrength.strength / 6) * 100}%`
													}}
												/>
											</div>
										</div>
									)}
									{fieldErrors.password && (
										<p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.password}</p>
									)}
								</div>

								{/* Confirm Password Field */}
								<div>
									<label 
										htmlFor="confirmPassword" 
										className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
									>
										Confirm Password *
									</label>
									<div className="relative">
										<input
											type={showConfirmPassword ? "text" : "password"}
											id="confirmPassword"
											name="confirmPassword"
											value={formData.confirmPassword}
											onChange={handleInputChange}
											placeholder="Confirm password"
											className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700 ${
												fieldErrors.confirmPassword ? 'border-red-300 dark:border-red-600' : 
												formData.confirmPassword && formData.password && formData.confirmPassword === formData.password ? 'border-green-300 dark:border-green-600' : 'border-gray-200 dark:border-gray-600'
											}`}
											required
										/>
										<button
											type="button"
											onClick={toggleConfirmPasswordVisibility}
											className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
											tabIndex={-1}
										>
											{showConfirmPassword ? (
												<EyeOff className="w-5 h-5" />
											) : (
												<Eye className="w-5 h-5" />
											)}
										</button>
									</div>
									{/* Password Match Indicator */}
									{formData.confirmPassword && (
										<div className="mt-1">
											{fieldErrors.confirmPassword ? (
												<p className="text-xs text-red-600 dark:text-red-400">{fieldErrors.confirmPassword}</p>
											) : formData.password && formData.confirmPassword === formData.password ? (
												<p className="text-xs text-green-600 dark:text-green-400">✓ Passwords match</p>
											) : null}
										</div>
									)}
								</div>
							</div>
						)}

						{/* Step 3: Additional Details */}
						{currentStep === 3 && (
							<div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
								{/* Date of Birth Field */}
								<div>
									<label 
										htmlFor="dateOfBirth" 
										className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
									>
										Date of Birth
									</label>
									<div className="relative">
										<Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
										<input
											type="date"
											id="dateOfBirth"
											name="dateOfBirth"
											value={formData.dateOfBirth}
											onChange={handleInputChange}
											className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
										/>
									</div>
								</div>

								{/* Profile Picture URL Field */}
								<div>
									<label 
										htmlFor="profilePictureUrl" 
										className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
									>
										Profile Picture URL
									</label>
									<div className="relative">
										<Image className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
										<input
											type="url"
											id="profilePictureUrl"
											name="profilePictureUrl"
											value={formData.profilePictureUrl}
											onChange={handleInputChange}
											placeholder="https://example.com/profile.jpg"
											className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700"
										/>
									</div>
								</div>

								{/* Bio Field */}
								<div>
									<label 
										htmlFor="bio" 
										className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
									>
										Bio
									</label>
									<div className="relative">
										<FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400 dark:text-gray-500" />
										<textarea
											id="bio"
											name="bio"
											value={formData.bio}
											onChange={handleInputChange}
											placeholder="Tell us about yourself..."
											rows={3}
											className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700 resize-none"
										/>
									</div>
								</div>

								{/* Terms and Conditions */}
								<div className="flex items-start">
									<input
										type="checkbox"
										id="agreeToTerms"
										name="agreeToTerms"
										checked={formData.agreeToTerms}
										onChange={handleInputChange}
										className="w-4 h-4 mt-1 rounded border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 text-blue-600 bg-white dark:bg-gray-700"
										required
									/>
									<label htmlFor="agreeToTerms" className="ml-3 text-sm text-gray-600 dark:text-gray-400">
										I agree to the{" "}
										<a href="#" className="font-medium hover:underline text-blue-600 dark:text-blue-400">
											Terms of Service
										</a>{" "}
										and{" "}
										<a href="#" className="font-medium hover:underline text-blue-600 dark:text-blue-400">
											Privacy Policy
										</a>
									</label>
								</div>
							</div>
						)}

						{/* Error Message */}
						{error && (
							<div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
								<p className="text-sm text-red-600 dark:text-red-400">{error}</p>
							</div>
						)}

						{/* Success Message */}
						{success && (
							<div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
								<p className="text-sm text-green-600 dark:text-green-400">{success}</p>
							</div>
						)}

						{/* Navigation Buttons */}
						<div className="flex justify-between space-x-4">
							{/* Previous Button */}
							{currentStep > 1 && (
								<button
									type="button"
									onClick={prevStep}
									className="flex items-center px-6 py-3 rounded-xl font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 focus:ring-2 focus:ring-gray-500/50"
								>
									<ChevronLeft className="w-4 h-4 mr-2" />
									Previous
								</button>
							)}

							{/* Next/Submit Button */}
							{currentStep < totalSteps ? (
								<button
									type="button"
									onClick={nextStep}
									disabled={
										(currentStep === 1 && !isStep1Valid()) ||
										(currentStep === 2 && !isStep2Valid())
									}
									className="flex items-center px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 focus:ring-4 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 ml-auto"
								>
									Next
									<ChevronRight className="w-4 h-4 ml-2" />
								</button>
							) : (
								<button
									type="submit"
									disabled={isLoading || !formData.agreeToTerms}
									className="flex items-center px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 focus:ring-4 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 ml-auto"
								>
									{isLoading ? (
										<>
											<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
												<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
											Creating Account...
										</>
									) : (
										"Create Account"
									)}
								</button>
							)}
						</div>
					</form>

					{/* Sign In Link */}
					<div className="mt-8 text-center">
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Already have an account?{" "}
							<button
								onClick={handleSignInClick}
								className="font-semibold hover:underline transition-all duration-200 text-purple-600 dark:text-purple-400"
							>
								Sign In
							</button>
						</p>
					</div>
				</div>

				{/* Footer */}
				<div className="text-center mt-8">
					<p className="text-xs text-gray-600 dark:text-gray-400">
						© 2024 Pace. Secure payroll delegation made simple.
					</p>
				</div>
			</div>
		</div>
	);
}
