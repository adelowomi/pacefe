import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import Calendar from "@/features/calendar/components/calendar";
import AppLayout from "@/components/layout/app-layout";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import { useOrganizationOwnerCalendar } from "@/features/calendar/hooks/useCalendar";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import CreateCalendarModal from "@/features/calendar/components/create-calendar-modal";

export const Route = createFileRoute("/calendar")({
	component: CalendarPage,
});

function CalendarPage() {
	const [selectedOrganizationId, setSelectedOrganizationId] = useState<string | undefined>();
	const [calendarId, setCalendarId] = useState<string>("");
	const [showCreateCalendarModal, setShowCreateCalendarModal] = useState(false);
	
	const { data: dashboardData, isLoading: isDashboardLoading } = useDashboard(selectedOrganizationId);

	// Get the actual organization ID
	const organizationId = selectedOrganizationId || dashboardData?.currentOrganization?.id;
	const currentUserId = dashboardData?.currentUser?.id;

	// Fetch the organization owner's default calendar
	const { data: ownerCalendarData, isLoading: isOwnerCalendarLoading } = useOrganizationOwnerCalendar(organizationId || "");

	// Auto-set the calendar ID when the owner calendar is loaded and no calendar is currently selected
	useEffect(() => {
		if (ownerCalendarData?.data?.id && !calendarId) {
			setCalendarId(ownerCalendarData.data.id);
		}
	}, [ownerCalendarData, calendarId]);

	// Reset calendar ID when organization changes
	useEffect(() => {
		setCalendarId("");
	}, [organizationId]);

	const handleCreateCalendar = () => {
		setShowCreateCalendarModal(true);
	};

	const handleCalendarCreated = (newCalendarId: string) => {
		setCalendarId(newCalendarId);
		setShowCreateCalendarModal(false);
	};

	if (isDashboardLoading || isOwnerCalendarLoading) {
		return (
			<AppLayout selectedOrganizationId={selectedOrganizationId}>
				<div className="flex-1 flex items-center justify-center">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
						<p className="mt-4 text-muted-foreground">Loading calendar...</p>
					</div>
				</div>
			</AppLayout>
		);
	}

	if (!organizationId || !currentUserId) {
		return (
			<AppLayout selectedOrganizationId={selectedOrganizationId}>
				<div className="flex-1 flex items-center justify-center">
					<div className="text-center">
						<h2 className="text-xl font-semibold text-foreground mb-2">No Organization Selected</h2>
						<p className="text-muted-foreground">Please select an organization to view calendars.</p>
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
						<div>
							<h1 className="text-2xl font-bold text-card-foreground">Calendar</h1>
							<p className="text-muted-foreground">
								Manage your events and schedules
							</p>
						</div>

						<div className="flex items-center space-x-4">
							{/* Calendar ID Input */}
							<div>
								<label className="block text-sm font-medium text-foreground mb-2">
									Calendar ID
								</label>
								<input
									type="text"
									value={calendarId}
									onChange={(e) => setCalendarId(e.target.value)}
									placeholder="Enter calendar ID"
									className="block w-full max-w-xs px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground"
								/>
							</div>

							{/* Organization Selector */}
							{dashboardData?.organizations && dashboardData.organizations.length > 1 && (
								<div>
									<label className="block text-sm font-medium text-foreground mb-2">
										Organization
									</label>
									<select
										value={selectedOrganizationId || ''}
										onChange={(e) => {
											setSelectedOrganizationId(e.target.value || undefined);
											setCalendarId(""); // Reset calendar ID
										}}
										className="block w-full max-w-xs px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
									>
										<option value="">Select Organization</option>
										{dashboardData.organizations.map((org) => (
											<option key={org.id} value={org.id}>
												{org.name}
											</option>
										))}
									</select>
								</div>
							)}

							{/* Create Calendar Button */}
							<div className="pt-6">
								<button
									onClick={handleCreateCalendar}
									className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
								>
									<Plus className="w-4 h-4 mr-2" />
									New Calendar
								</button>
							</div>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content Area */}
			<main className="flex-1 overflow-auto p-6">
				{!calendarId ? (
					<div className="text-center py-12">
						<CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-lg font-medium text-foreground mb-2">No Default Calendar Found</h3>
						<p className="text-muted-foreground mb-4">
							{ownerCalendarData && !ownerCalendarData.data 
								? "No default calendar exists for this organization. Create one to get started."
								: "Create a new calendar or enter a calendar ID to get started."
							}
						</p>
						<button
							onClick={handleCreateCalendar}
							className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
						>
							<Plus className="w-4 h-4 mr-2" />
							Create Calendar
						</button>
					</div>
				) : (
					<Calendar
						organizationId={organizationId}
						calendarId={calendarId}
						currentUserId={currentUserId}
					/>
				)}
			</main>

			{/* Create Calendar Modal */}
			<CreateCalendarModal
				isOpen={showCreateCalendarModal}
				onClose={() => setShowCreateCalendarModal(false)}
				organizationId={organizationId}
				currentUserId={currentUserId}
				onCalendarCreated={handleCalendarCreated}
			/>
		</AppLayout>
	);
}
