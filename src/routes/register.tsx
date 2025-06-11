import { createFileRoute } from "@tanstack/react-router";
import Register from "@/features/auth/components/register";

export const Route = createFileRoute("/register")({
	component: RegisterPage,
});

function RegisterPage() {
	return <Register />;
}
