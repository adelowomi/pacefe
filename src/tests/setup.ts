import "@testing-library/jest-dom";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll } from "vitest";

import { handlers } from "./__mocks__/handlers";

export const server = setupServer(...handlers);

// Start MSW server before all tests
beforeAll(() => {
	server.listen({ onUnhandledRequest: "error" });
});

// Reset any request handlers that may be added during the tests,
// so they don't affect other tests.
afterEach(() => {
	server.resetHandlers();
	// Optional: Clean up other global states if necessary, e.g.,
	// localStorage.clear();
});

afterAll(() => {
	server.close();
});

// Ensure that any unhandled promise rejections in tests are caught and fail the test.
// Vitest usually handles this well, but it's good practice.
if (typeof process !== "undefined") {
	process.on("unhandledRejection", (reason, promise) => {
		console.error("Unhandled Rejection at:", promise, "reason:", reason);
	});
}
