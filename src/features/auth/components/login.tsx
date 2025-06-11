import { Eye, EyeOff } from "lucide-react";
import { useLogin } from "../hooks/useLogin";

export default function Login() {
	const {
		formData,
		showPassword,
		isLoading,
		error,
		handleInputChange,
		togglePasswordVisibility,
		handleSubmit,
		handleSignUpClick,
		handleForgotPasswordClick,
	} = useLogin();

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

			{/* Main Login Container */}
			<div className="relative w-full max-w-md">
				{/* Login Card */}
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
							Pace
						</h1>
						<p className="text-base" style={{ color: "#666666" }}>
							Secure your Payroll. Simplify your Approvals.
						</p>
					</div>

					{/* Login Form */}
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Email Field */}
						<div>
							<label 
								htmlFor="email" 
								className="block text-sm font-medium mb-2"
								style={{ color: "#333333" }}
							>
								Email Address
							</label>
							<input
								type="email"
								id="email"
								name="email"
								value={formData.email}
								onChange={handleInputChange}
								placeholder="Enter your email"
								className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
								style={{ 
									outline: "none"
								}}
								onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px rgba(58, 134, 255, 0.2)`}
								onBlur={(e) => e.target.style.boxShadow = "none"}
								required
							/>
						</div>

						{/* Password Field */}
						<div>
							<label 
								htmlFor="password" 
								className="block text-sm font-medium mb-2"
								style={{ color: "#333333" }}
							>
								Password
							</label>
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									id="password"
									name="password"
									value={formData.password}
									onChange={handleInputChange}
									placeholder="Enter your password"
									className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
									style={{ 
										outline: "none"
									}}
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
						</div>

						{/* Remember Me & Forgot Password */}
						<div className="flex items-center justify-between">
							<label className="flex items-center">
								<input
									type="checkbox"
									name="rememberMe"
									checked={formData.rememberMe}
									onChange={handleInputChange}
									className="w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-opacity-50"
									style={{ 
										accentColor: "#3A86FF"
									}}
								/>
								<span className="ml-2 text-sm" style={{ color: "#666666" }}>
									Remember me
								</span>
							</label>
							<button
								type="button"
								onClick={handleForgotPasswordClick}
								className="text-sm font-medium hover:underline transition-all duration-200"
								style={{ color: "#3A86FF" }}
							>
								Forgot password?
							</button>
						</div>

						{/* Error Message */}
						{error && (
							<div className="p-3 rounded-lg bg-red-50 border border-red-200">
								<p className="text-sm text-red-600">{error}</p>
							</div>
						)}

						{/* Login Button */}
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
									Logging in...
								</div>
							) : (
								"Sign In"
							)}
						</button>
					</form>

					{/* Sign Up Link */}
					<div className="mt-8 text-center">
						<p className="text-sm" style={{ color: "#666666" }}>
							Don't have an account?{" "}
							<button
								onClick={handleSignUpClick}
								className="font-semibold hover:underline transition-all duration-200"
								style={{ color: "#8338EC" }}
							>
								Sign Up
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
