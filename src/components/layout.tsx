import { AppFrame } from "@captn/joy/app-frame";
import { CustomScrollbars } from "@captn/joy/custom-scrollbars";
import { TitleBar } from "@captn/joy/title-bar";
import type { ReactNode } from "react";

import Head from "next/head";

export default function Layout({ children, title }: { children?: ReactNode; title: string }) {
	return (
		<AppFrame titleBar={<TitleBar>{title}</TitleBar>}>
			<Head>
				<title>{title}</title>
			</Head>
			<CustomScrollbars>{children}</CustomScrollbars>
		</AppFrame>
	);
}
