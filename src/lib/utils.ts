import type { AccessTokenResponse } from "@/api";
import type { HttpStatusCode } from "@/api/models/HttpStatusCode";
import type { ClassValue } from "clsx";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}



export type StandardResponseOfAccessTokenResponse = {
	Success?: boolean;
	Message?: string | null;
	Data?: AccessTokenResponse;
	StatusCode?: HttpStatusCode;
	Errors?: any;
	Timestamp?: string;
};

export type StandardResponseOfCapitalizedString = {
	Success?: boolean;
	Message?: string | null;
	Data?: string;
	StatusCode?: HttpStatusCode;
	Errors?: any;
	Timestamp?: string;
};

