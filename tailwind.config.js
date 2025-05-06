/** @type {import('tailwindcss').Config} */
export const darkMode = ["class"];
export const content = [
	"./app/**/*.{ts,tsx}",
	"./components/**/*.{ts,tsx}",
	"./node_modules/@shadcn/ui/**/*.{js,ts,tsx}",
];
export const theme = {
	extend: {
		colors: {
			primary: "#1e3a8a",
			secondary: "#64748b",
			accent: "#fbbf24",
			background: "#f9fafb",
			text: "#111827",
			muted: "#6b7280",
			success: "#22c55e",
			error: "#ef4444",
			warning: "#f59e0b",
			info: "#3b82f6",
			'minfilia-pink': '#FF8FC7',
			'minfilia-purple': '#6B21A8',
			'minfilia-cream': '#FFF5E1',
			'minfilia-black': '#0F0F0F',
			'minfilia-silver':'#C0C0C0',
		},
	},
};
export const plugins = [
	require("tailwindcss-animate"),
	require("tailwind-scrollbar")({ nocompatible: true }),
	require("tailwindcss-children"),
	require("tailwindcss-animatecss")({
		infinite: true,
	}),
	require("@shadcn/ui/tailwind-plugins"),
];
export const safelist = [
	"bg-primary",
	"bg-secondary",
	"bg-accent",
	"bg-background",
	"bg-text",
	"bg-muted",
	"bg-success",
	"bg-error",
	"bg-warning",
	"bg-info