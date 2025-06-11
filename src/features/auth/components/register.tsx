import { Eye, EyeOff, User, Mail, Calendar, Image, FileText } from "lucide-react";
import { useRegister } from "../hooks/useRegister";

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

	const passwordStrength = getPasswordStrength(formData.password);

	return (
		<div 
			className="min-h-screen flex items-center justify-center px-4 py-8"
			style={{ 
				background: "linear-gradient(135deg, #F0F2F5 0%, #E8EBF0 100%)",
				fontFamily: "Inter, sans-serif"
			}}
		>
			{/* Background Pattern */}
			<div className="absolute inset-0 opacity-5">
				<div className="absolute inset-0" style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233A86FF' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
				}} />
			</div>

			{/* Main Registration Container */}
			<div className="relative w-full max-w-md">
				{/* Registration Card */}
				<div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 border border-gray-100">
					{/* Branding */}
					<div className="text-center mb-8">
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: "#3A86FF" }}>
							<svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
								<path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none"/>
							</svg>
						</div>
						<h1 className="text-3xl font-bold mb-2" style={{ color: "#333333" }}>
							Join Pace
						</h1>
						<p className="text-base" style={{ color: "#666666" }}>
							Create your account to get started
						</p>
					</div>

					{/* Registration Form */}
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Name Fields Row */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{/* First Name Field */}
							<div>
								<label 
									htmlFor="firstName" 
									className="block text-sm font-medium mb-2"
									style={{ color: "#333333" }}
								>
									First Name *
								</label>
								<div className="relative">
									<User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
									<input
										type="text"
										id="firstName"
										name="firstName"
										value={formData.firstName}
										onChange={handleInputChange}
										placeholder="Enter first name"
										className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 ${
											fieldErrors.firstName ? 'border-red-300' : 'border-gray-200'
										}`}
										style={{ outline: "none" }}
										onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px rgba(58, 134, 255, 0.2)`}
										onBlur={(e) => e.target.style.boxShadow = "none"}
										required
									/>
								</div>
								{fieldErrors.firstName && (
									<p className="mt-1 text-xs text-red-600">{fieldErrors.firstName}</p>
								)}
							</div>

							{/* Last Name Field */}
							<div>
								<label 
									htmlFor="lastName" 
									className="block text-sm font-medium mb-2"
									style={{ color: "#333333" }}
								>
									Last Name *
								</label>
								<div className="relative">
									<User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
									<input
										type="text"
										id="lastName"
										name="lastName"
										value={formData.lastName}
										onChange={handleInputChange}
										placeholder="Enter last name"
										className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 ${
											fieldErrors.lastName ? 'border-red-300' : 'border-gray-200'
										}`}
										style={{ outline: "none" }}
										onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px rgba(58, 134, 255, 0.2)`}
										onBlur={(e) => e.target.style.boxShadow = "none"}
										required
									/>
								</div>
								{fieldErrors.lastName && (
									<p className="mt-1 text-xs text-red-600">{fieldErrors.lastName}</p>
								)}
							</div>
						</div>

						{/* Email Field */}
						<div>
							<label 
								htmlFor="email" 
								className="block text-sm font-medium mb-2"
								style={{ color: "#333333" }}
							>
								Email Address *
							</label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
								<input
									type="email"
									id="email"
									name="email"
									value={formData.email}
									onChange={handleInputChange}
									placeholder="Enter your email"
									className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 ${
										fieldErrors.email ? 'border-red-300' : 'border-gray-200'
									}`}
									style={{ outline: "none" }}
									onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px rgba(58, 134, 255, 0.2)`}
									onBlur={(e) => e.target.style.boxShadow = "none"}
									required
								/>
							</div>
							{fieldErrors.email && (
								<p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
							)}
						</div>

						{/* Password Fields Row */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{/* Password Field */}
							<div>
								<label 
									htmlFor="password" 
									className="block text-sm font-medium mb-2"
									style={{ color: "#333333" }}
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
										className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 ${
											fieldErrors.password ? 'border-red-300' : 'border-gray-200'
										}`}
										style={{ outline: "none" }}
										onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px rgba(58, 134, 255, 0.2)`}
										onBlur={(e) => e.target.style.boxShadow = "none"}
										required
									/>
									<button
										type="button"
										onClick={togglePasswordVisibility}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
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
											<span className="text-xs text-gray-500">
												{passwordStrength.strength}/6
											</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-1.5">
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
									<p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
								)}
							</div>

							{/* Confirm Password Field */}
							<div>
								<label 
									htmlFor="confirmPassword" 
									className="block text-sm font-medium mb-2"
									style={{ color: "#333333" }}
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
										className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 ${
											fieldErrors.confirmPassword ? 'border-red-300' : 
											formData.confirmPassword && formData.password && formData.confirmPassword === formData.password ? 'border-green-300' : 'border-gray-200'
										}`}
										style={{ outline: "none" }}
										onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px rgba(58, 134, 255, 0.2)`}
										onBlur={(e) => e.target.style.boxShadow = "none"}
										required
									/>
									<button
										type="button"
										onClick={toggleConfirmPasswordVisibility}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
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
											<p className="text-xs text-red-600">{fieldErrors.confirmPassword}</p>
										) : formData.password && formData.confirmPassword === formData.password ? (
											<p className="text-xs text-green-600">✓ Passwords match</p>
										) : null}
									</div>
								)}
							</div>
						</div>

						{/* Optional Fields */}
						<div className="space-y-4">
							{/* Date of Birth Field */}
							<div>
								<label 
									htmlFor="dateOfBirth" 
									className="block text-sm font-medium mb-2"
									style={{ color: "#333333" }}
								>
									Date of Birth
								</label>
								<div className="relative">
									<Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
									<input
										type="date"
										id="dateOfBirth"
										name="dateOfBirth"
										value={formData.dateOfBirth}
										onChange={handleInputChange}
										className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 text-gray-900"
										style={{ outline: "none" }}
										onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px rgba(58, 134, 255, 0.2)`}
										onBlur={(e) => e.target.style.boxShadow = "none"}
									/>
								</div>
							</div>

							{/* Profile Picture URL Field */}
							<div>
								<label 
									htmlFor="profilePictureUrl" 
									className="block text-sm font-medium mb-2"
									style={{ color: "#333333" }}
								>
									Profile Picture URL
								</label>
								<div className="relative">
									<Image className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
									<input
										type="url"
										id="profilePictureUrl"
										name="profilePictureUrl"
										value={formData.profilePictureUrl}
										onChange={handleInputChange}
										placeholder="https://example.com/profile.jpg"
										className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
										style={{ outline: "none" }}
										onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px rgba(58, 134, 255, 0.2)`}
										onBlur={(e) => e.target.style.boxShadow = "none"}
									/>
								</div>
							</div>

							{/* Bio Field */}
							<div>
								<label 
									htmlFor="bio" 
									className="block text-sm font-medium mb-2"
									style={{ color: "#333333" }}
								>
									Bio
								</label>
								<div className="relative">
									<FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
									<textarea
										id="bio"
										name="bio"
										value={formData.bio}
										onChange={handleInputChange}
										placeholder="Tell us about yourself..."
										rows={3}
										className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none"
										style={{ outline: "none" }}
										onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px rgba(58, 134, 255, 0.2)`}
										onBlur={(e) => e.target.style.boxShadow = "none"}
									/>
								</div>
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
								className="w-4 h-4 mt-1 rounded border-gray-300 focus:ring-2 focus:ring-opacity-50"
								style={{ accentColor: "#3A86FF" }}
								required
							/>
							<label htmlFor="agreeToTerms" className="ml-3 text-sm" style={{ color: "#666666" }}>
								I agree to the{" "}
								<a href="#" className="font-medium hover:underline" style={{ color: "#3A86FF" }}>
									Terms of Service
								</a>{" "}
								and{" "}
								<a href="#" className="font-medium hover:underline" style={{ color: "#3A86FF" }}>
									Privacy Policy
								</a>
							</label>
						</div>

						{/* Error Message */}
						{error && (
							<div className="p-3 rounded-lg bg-red-50 border border-red-200">
								<p className="text-sm text-red-600">{error}</p>
							</div>
						)}

						{/* Success Message */}
						{success && (
							<div className="p-3 rounded-lg bg-green-50 border border-green-200">
								<p className="text-sm text-green-600">{success}</p>
							</div>
						)}

						{/* Register Button */}
						<button
							type="submit"
							disabled={isLoading}
							className="w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 focus:ring-4 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
							style={{ 
								backgroundColor: isLoading ? "#8BB5FF" : "#3A86FF"
							}}
						>
							{isLoading ? (
								<div className="flex items-center justify-center">
									<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Creating Account...
								</div>
							) : (
								"Create Account"
							)}
						</button>
					</form>

					{/* Sign In Link */}
					<div className="mt-8 text-center">
						<p className="text-sm" style={{ color: "#666666" }}>
							Already have an account?{" "}
							<button
								onClick={handleSignInClick}
								className="font-semibold hover:underline transition-all duration-200"
								style={{ color: "#3A86FF" }}
							>
								Sign In
							</button>
						</p>
					</div>
				</div>

				{/* Footer */}
				<div className="text-center mt-8">
					<p className="text-xs" style={{ color: "#666666" }}>
						© 2024 Pace. Secure payroll delegation made simple.
					</p>
				</div>
			</div>
		</div>
	);
}
