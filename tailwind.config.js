/** @type {import('tailwindcss').Config} */
import { AspectUITheme } from "aspect-ui/AspectUITheme";

const config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	plugins: [],
};

export default AspectUITheme(config)