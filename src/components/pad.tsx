import { Except } from "type-fest";
import Button, { ButtonProps } from "@mui/joy/Button";
import { Palette } from "@captn/theme/types";

export interface PadProps {
	id: string;
	label: string;
	info: string;
	color: keyof Palette;
	active?: boolean;
	selected?: boolean;
}

export function Pad({
	active,
	children,
	color,
	disabled,
	...properties
}: Except<ButtonProps, "sx"> & Except<PadProps, "id">) {
	return (
		<Button
			fullWidth
			disabled={disabled}
			color={color}
			variant={active ? "solid" : "outlined"}
			sx={{
				aspectRatio: 1,
				"--variant-borderWidth": "4px",
				borderRadius: "md",
				bgcolor: active ? undefined : "background.surface",
			}}
			{...properties}
		>
			{children}
		</Button>
	);
}
