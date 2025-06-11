import { Store } from "@tanstack/react-store";

export type AppStoreState = {
	isDarkMode: boolean;
};
export const AppStore = new Store<AppStoreState>({
	isDarkMode: false,
});
