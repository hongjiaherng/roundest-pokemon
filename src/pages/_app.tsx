import type { AppProps } from "next/app";
import { withTRPC } from "@trpc/next";
import type { AppRouter } from "../backend/router";
import "../styles/globals.css";


function getBaseUrl() {
	if (typeof window !== "undefined") return "";
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
	return `http://localhost:${process.env.PORT ?? 3000}`
}

function MyApp({ Component, pageProps }: AppProps) {
	// console.log(getBaseUrl());
	return <Component {...pageProps} />;
}


export default withTRPC<AppRouter>({
	config({ ctx }) {
		/**
		 * If you want to use SSR, you need to use the server's full URL
		 * @link https://trpc.io/docs/ssr
		 */
		const url = `${getBaseUrl()}/api/trpc`;
		// const url = process.env.VERCEL_URL
		// 	? `https://${process.env.VERCEL_URL}/api/trpc`
		// 	: "http://localhost:3000/api/trpc";

		return {
			url
			/**
			 * @link https://react-query.tanstack.com/reference/QueryClient
			 */
			// queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
		};
	},
	/**
	 * @link https://trpc.io/docs/ssr
	 */
	ssr: false,
})(MyApp);
