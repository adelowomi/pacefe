import { useState } from "react";
import { 
	BarChart3, 
	Users, 
	TrendingUp, 
	Bell, 
	Search,
	Filter,
	Download,
	Plus,
	Calendar,
	ArrowUpDown,
	Clock,
	CheckCircle,
	XCircle,
	AlertCircle
} from "lucide-react";
import { useDashboard } from "../hooks/useDashboard";
import AppLayout from "@/components/layout/app-layout";

export default function Dashboard() {
	const [selectedOrganizationId, setSelectedOrganizationId] = useState<string | undefined>();
	const { data: dashboardData, isLoading, error } = useDashboard(selectedOrganizationId);

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-NG', {
			style: 'currency',
			currency: 'NGN',
		}).format(amount);
	};

	const getTransferStatusIcon = (status?: string) => {
		switch (status?.toLowerCase()) {
			case 'pending':
				return <Clock className="w-4 h-4 text-yellow-600" />;
			case 'approved':
			case 'completed':
			case 'successful':
				return <CheckCircle className="w-4 h-4 text-green-600" />;
			case 'rejected':
			case 'failed':
				return <XCircle className="w-4 h-4 text-red-600" />;
			default:
				return <AlertCircle className="w-4 h-4 text-gray-600" />;
		}
	};

	const getTransferStatusColor = (status?: string) => {
		switch (status?.toLowerCase()) {
			case 'pending':
				return 'text-yellow-700 bg-yellow-50 border-yellow-200';
			case 'approved':
			case 'completed':
			case 'successful':
				return 'text-green-700 bg-green-50 border-green-200';
			case 'rejected':
			case 'failed':
				return 'text-red-700 bg-red-50 border-red-200';
			default:
				return 'text-gray-700 bg-gray-50 border-gray-200';
		}
	};

	const formatDate = (dateString?: string) => {
		if (!dateString) return 'N/A';
		const date = new Date(dateString);
		const now = new Date();
		const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
		
		if (diffInHours < 1) {
			return 'Just now';
		} else if (diffInHours < 24) {
			return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
		} else if (diffInHours < 48) {
			return 'Yesterday';
		} else {
			return date.toLocaleDateString();
		}
	};

	if (isLoading || error) {
		return (
			<AppLayout selectedOrganizationId={selectedOrganizationId}>
				<div className="flex-1 flex items-center justify-center">
					<div className="text-center">
						{isLoading ? (
							<>
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
								<p className="mt-4 text-muted-foreground">Loading dashboard...</p>
							</>
						) : (
							<>
								<XCircle className="w-12 h-12 text-destructive mx-auto" />
								<p className="mt-4 text-muted-foreground">Failed to load dashboard data</p>
								<button 
									onClick={() => window.location.reload()} 
									className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
								>
									Retry
								</button>
							</>
						)}
					</div>
				</div>
			</AppLayout>
		);
	}

	return (
		<AppLayout 
			selectedOrganizationId={selectedOrganizationId}
			onOrganizationChange={setSelectedOrganizationId}
		>
			{/* Header */}
			<header className="bg-card shadow-sm border-b border-border">
				<div className="px-6 py-4">
					<div className="flex justify-between items-center">
						{/* Page Title */}
						<div>
							<h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
							<p className="text-muted-foreground">
								Welcome back, {dashboardData?.currentUser?.firstName || 'User'}!
							</p>
						</div>

						{/* Search and Actions */}
						<div className="flex items-center space-x-4">
							<div className="relative">
								<Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
								<input
									type="text"
									placeholder="Search transfers..."
									className="pl-10 pr-4 py-2 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
								/>
							</div>
							
							<button className="p-2 text-muted-foreground hover:text-foreground relative">
								<Bell className="w-5 h-5" />
								{(dashboardData?.pendingTransfersCount || 0) > 0 && (
									<span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></span>
								)}
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content Area */}
			<main className="flex-1 overflow-auto p-6">
					{/* Organization Selector */}
					{dashboardData?.organizations && dashboardData.organizations.length > 1 && (
						<div className="mb-6">
							<label className="block text-sm font-medium text-foreground mb-2">
								Select Organization
							</label>
							<select
								value={selectedOrganizationId || ''}
								onChange={(e) => setSelectedOrganizationId(e.target.value || undefined)}
								className="block w-full max-w-xs px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
							>
								<option value="">All Organizations</option>
								{dashboardData.organizations.map((org) => (
									<option key={org.id} value={org.id}>
										{org.name}
									</option>
								))}
							</select>
						</div>
					)}

					{/* Stats Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
						<div className="bg-card rounded-xl shadow-sm p-6 border border-border">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-muted-foreground">Total Transfers</p>
									<p className="text-3xl font-bold text-card-foreground">
										{formatCurrency(dashboardData?.totalTransfersAmount || 0)}
									</p>
								</div>
								<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
									<ArrowUpDown className="w-6 h-6 text-primary" />
								</div>
							</div>
							<div className="mt-4 flex items-center">
								<TrendingUp className="w-4 h-4 text-green-500 mr-1" />
								<span className="text-sm text-green-600">Total amount transferred</span>
							</div>
						</div>

						<div className="bg-card rounded-xl shadow-sm p-6 border border-border">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-muted-foreground">Pending Transfers</p>
									<p className="text-3xl font-bold text-card-foreground">
										{dashboardData?.pendingTransfersCount || 0}
									</p>
								</div>
								<div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
									<Clock className="w-6 h-6 text-yellow-600" />
								</div>
							</div>
							<div className="mt-4 flex items-center">
								<span className="text-sm text-muted-foreground">Awaiting approval</span>
							</div>
						</div>

						<div className="bg-card rounded-xl shadow-sm p-6 border border-border">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-muted-foreground">Successful Transfers</p>
									<p className="text-3xl font-bold text-card-foreground">
										{dashboardData?.successfulTransfersCount || 0}
									</p>
								</div>
								<div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
									<CheckCircle className="w-6 h-6 text-green-600" />
								</div>
							</div>
							<div className="mt-4 flex items-center">
								<TrendingUp className="w-4 h-4 text-green-500 mr-1" />
								<span className="text-sm text-green-600">Completed transfers</span>
							</div>
						</div>

						<div className="bg-card rounded-xl shadow-sm p-6 border border-border">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-muted-foreground">Team Members</p>
									<p className="text-3xl font-bold text-card-foreground">
										{dashboardData?.teamMembers?.length || 0}
									</p>
								</div>
								<div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
									<Users className="w-6 h-6 text-purple-600" />
								</div>
							</div>
							<div className="mt-4 flex items-center">
								<span className="text-sm text-muted-foreground">Active members</span>
							</div>
						</div>
					</div>

					{/* Direct Debit Info */}
					{dashboardData?.hasActiveDirectDebit && (
						<div className="mb-8">
							<div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
								<div className="flex items-center justify-between">
									<div>
										<h3 className="text-lg font-semibold text-primary">Active Direct Debit</h3>
										<p className="text-primary/80">
											Last debit: {formatCurrency(dashboardData.lastDirectDebitAmount || 0)} on{' '}
											{dashboardData.lastDirectDebitDate ? 
												new Date(dashboardData.lastDirectDebitDate).toLocaleDateString() : 
												'N/A'
											}
										</p>
									</div>
									<div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
										<Calendar className="w-6 h-6 text-primary" />
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Main Content Grid */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Recent Transfers */}
						<div className="lg:col-span-2">
							<div className="bg-card rounded-xl shadow-sm border border-border">
								<div className="p-6 border-b border-border">
									<div className="flex items-center justify-between">
										<h3 className="text-lg font-semibold text-card-foreground">Recent Transfers</h3>
										<div className="flex items-center space-x-2">
											<button className="p-2 text-muted-foreground hover:text-foreground">
												<Filter className="w-4 h-4" />
											</button>
											<button className="p-2 text-muted-foreground hover:text-foreground">
												<Download className="w-4 h-4" />
											</button>
										</div>
									</div>
								</div>
								<div className="p-6">
									{dashboardData?.recentTransfers && dashboardData.recentTransfers.length > 0 ? (
										<div className="space-y-4">
											{dashboardData.recentTransfers.map((transfer) => (
												<div key={transfer.id} className="flex items-start space-x-3 p-4 border border-border rounded-lg">
													<div className="flex-shrink-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center">
														{getTransferStatusIcon(transfer.status)}
													</div>
													<div className="flex-1 min-w-0">
														<div className="flex items-center justify-between">
															<p className="text-sm font-medium text-card-foreground">
																{transfer.recipient?.name || 'Unknown Recipient'}
															</p>
															<p className="text-sm font-semibold text-card-foreground">
																{formatCurrency(transfer.amount || 0)}
															</p>
														</div>
														<p className="text-xs text-muted-foreground mt-1">
															{transfer.reason || 'No reason provided'}
														</p>
														<p className="text-xs text-muted-foreground mt-1">
															{formatDate(transfer.dateCreated)}
														</p>
													</div>
													<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTransferStatusColor(transfer.status)}`}>
														{transfer.status || 'Unknown'}
													</span>
												</div>
											))}
										</div>
									) : (
										<div className="text-center py-8">
											<ArrowUpDown className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
											<p className="text-muted-foreground">No recent transfers</p>
										</div>
									)}
								</div>
							</div>
						</div>

						{/* Quick Actions & Team Members */}
						<div className="space-y-6">
							{/* Quick Actions */}
							<div className="bg-card rounded-xl shadow-sm border border-border">
								<div className="p-6 border-b border-border">
									<h3 className="text-lg font-semibold text-card-foreground">Quick Actions</h3>
								</div>
								<div className="p-6">
									<div className="space-y-3">
										<button className="w-full flex items-center justify-between p-3 text-left border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors">
											<div className="flex items-center">
												<Plus className="w-5 h-5 text-primary mr-3" />
												<span className="text-sm font-medium">New Transfer</span>
											</div>
										</button>
										<button className="w-full flex items-center justify-between p-3 text-left border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors">
											<div className="flex items-center">
												<Users className="w-5 h-5 text-green-600 mr-3" />
												<span className="text-sm font-medium">Manage Recipients</span>
											</div>
										</button>
										<button className="w-full flex items-center justify-between p-3 text-left border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors">
											<div className="flex items-center">
												<Calendar className="w-5 h-5 text-purple-600 mr-3" />
												<span className="text-sm font-medium">Schedule Transfer</span>
											</div>
										</button>
										<button className="w-full flex items-center justify-between p-3 text-left border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors">
											<div className="flex items-center">
												<BarChart3 className="w-5 h-5 text-orange-600 mr-3" />
												<span className="text-sm font-medium">View Reports</span>
											</div>
										</button>
									</div>
								</div>
							</div>

							{/* Team Members */}
							{dashboardData?.teamMembers && dashboardData.teamMembers.length > 0 && (
								<div className="bg-card rounded-xl shadow-sm border border-border">
									<div className="p-6 border-b border-border">
										<h3 className="text-lg font-semibold text-card-foreground">Team Members</h3>
									</div>
									<div className="p-6">
										<div className="space-y-3">
											{dashboardData.teamMembers.slice(0, 5).map((member) => (
												<div key={member.id} className="flex items-center space-x-3">
													<div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
														<span className="text-primary-foreground text-sm font-medium">
															{member.user?.firstName?.charAt(0) || member.user?.email?.charAt(0) || 'U'}
														</span>
													</div>
													<div className="flex-1 min-w-0">
														<p className="text-sm font-medium text-card-foreground truncate">
															{member.user?.firstName && member.user?.lastName 
																? `${member.user.firstName} ${member.user.lastName}`
																: member.user?.email || 'Unknown User'
															}
														</p>
														<p className="text-xs text-muted-foreground truncate">
															{member.role || 'Member'}
														</p>
													</div>
												</div>
											))}
											{dashboardData.teamMembers.length > 5 && (
												<p className="text-xs text-muted-foreground text-center pt-2">
													+{dashboardData.teamMembers.length - 5} more members
												</p>
											)}
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</main>
		</AppLayout>
	);
}
