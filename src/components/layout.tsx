import { AppFrame } from "@captn/joy/app-frame";
import { CustomScrollbars } from "@captn/joy/custom-scrollbars";
import { TitleBar } from "@captn/joy/title-bar";
import type { ReactNode } from "react";

import Head from "next/head";
import Typography from "@mui/joy/Typography";

export default function Layout({ children, title }: { children?: ReactNode; title: string }) {
	return (
		<AppFrame
			titleBar={
				<TitleBar disableTypography>
					<Typography
						sx={{
							flex: 1,
							textAlign: "center",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						{title}
					</Typography>
				</TitleBar>
			}
		>
			<Head>
				<title>{title}</title>
			</Head>
			<CustomScrollbars>{children}</CustomScrollbars>
		</AppFrame>
	);
}
