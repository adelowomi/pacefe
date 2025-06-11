import type { HttpHandler } from "msw";

import { http, HttpResponse } from "msw";

export const handlers: Array<HttpHandler> = [
	http.get("/demo/tanstack-query", () => {
		return HttpResponse.json([
			{ name: "John Doe" },
			{ name: "Jane Doe" },
			{ name: "Rasmus Doe" },
			{ name: "Jane Smith" },
		]);
	}),
	
	// 	http.post("https://api.example.com/todos", async ({ request }) => {
	// 		const newTodo = await request.json();
	// 		return HttpResponse.json(
	// 			{ id: String(Date.now()), ...newTodo as any },
	// 			{ status: 201 },
	// 		);
	// 	}),
];
