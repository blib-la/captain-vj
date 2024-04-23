import Layout from "@/components/layout";
import Box from "@mui/joy/Box";
import Button, { ButtonProps } from "@mui/joy/Button";
import { ReactNode, useEffect, useRef, useState } from "react";
import Sheet from "@mui/joy/Sheet";
import { Except } from "type-fest";
import { palette } from "@captn/theme/palette";
import { VT323 as createVT323 } from "next/font/google";
import { CustomScrollbars } from "@captn/joy/custom-scrollbars";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import ToggleButtonGroup from "@mui/joy/ToggleButtonGroup";

const vt323 = createVT323({ weight: "400", subsets: ["latin"] });
export interface PadProps {
	id: string;
	label: string;
	info: string;
	color: keyof typeof palette;
	active?: boolean;
	selected?: boolean;
}

export function Frame({ children, color }: { children?: ReactNode; color?: keyof typeof palette }) {
	return (
		<Sheet
			variant="outlined"
			color={color}
			sx={{
				height: "100%",
				borderRadius: "md",
				p: 1,
			}}
		>
			{children}
		</Sheet>
	);
}

export function ButtonGrid({ children }: { children?: ReactNode }) {
	return (
		<Sheet
			sx={{
				height: "100%",
				position: "relative",
				mx: -1,
			}}
		>
			<CustomScrollbars>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
						gap: 2,
						px: 1,
					}}
				>
					{children}
				</Box>
			</CustomScrollbars>
		</Sheet>
	);
}

export function Canvas({ height, width }: { width: number; height: number }) {
	const reference = useRef<HTMLCanvasElement>(null);
	useEffect(() => {
		if (!reference.current) {
			return;
		}
		reference.current.height = height;
		reference.current.width = width;
		const context = reference.current.getContext("2d");
	}, [height, width]);
	return (
		<Sheet
			variant="soft"
			sx={{
				p: 1,
				borderRadius: "md",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				width: 690,
				height: 690,
			}}
		>
			<Box
				ref={reference}
				component="canvas"
				style={{ height, width }}
				sx={{ bgcolor: "common.black" }}
			/>
		</Sheet>
	);
}

export function Display({ text }: { text?: string }) {
	return (
		<Sheet variant="soft" sx={{ p: 1, borderRadius: "md", display: "flex" }}>
			<Box
				sx={{
					p: 0.5,
					flex: 1,
					bgcolor: "common.black",
					color: "lime.500",
					...vt323.style,
					fontSize: 20,
					lineHeight: 1.5,
					height: 68,
					whiteSpace: "pre-wrap",
				}}
			>
				{text}
			</Box>
		</Sheet>
	);
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
			}}
			{...properties}
		>
			{children}
		</Button>
	);
}

const colors = Object.keys(palette).filter(key => key !== "grey") as (keyof Except<
	typeof palette,
	"grey"
>)[];

export const defaultPads: PadProps[] = Array.from({ length: 400 }).map((_, index) => ({
	id: index.toString(),
	label: `Pad No ${index + 1}`,
	info: `Information about the Pad ${index + 1} can be added here`,
	color: colors[index % colors.length],
	active: false,
	selected: false,
}));

const defaultSizes: { id: string; height: number; width: number }[] = [
	{ id: "1", height: 512, width: 512 },
	{ id: "2", height: (640 / 5) * 3, width: 640 },
	{ id: "3", height: (672 / 16) * 9, width: 672 },
	{ id: "4", height: 640, width: (640 / 5) * 3 },
	{ id: "5", height: 672, width: (672 / 16) * 9 },
];

export default function Page() {
	const [pads, setPads] = useState<PadProps[]>(defaultPads);
	const [hoveredPadId, setHoveredPadId] = useState<null | string>(null);
	const [selectedPads, setSelectedPads] = useState("presets");
	const [sizeValue, setSizeValue] = useState("1");
	const [size, setSize] = useState({ height: 512, width: 512 });
	const [editMode, setEditMode] = useState(false);
	const hasSelection = pads.some(pad => pad.selected);
	const selectedPad = pads.find(pad => pad.selected);
	const hoveredPad = pads.find(pad => pad.id === hoveredPadId);
	return (
		<Layout title="Main Window">
			<Box sx={{ px: 3, py: 2, display: "flex", justifyContent: "center" }}>
				<Box
					sx={{
						flex: 1,
						display: "flex",
						flexWrap: "wrap",
						gap: 2,
						justifyContent: "center",
					}}
				>
					<Box>
						<Box sx={{ display: "flex", gap: 1, py: 1 }}>
							<Select
								variant="soft"
								value={sizeValue}
								sx={{ borderRadius: "md", width: 120 }}
								onChange={(_, value) => {
									if (value) {
										const nextSize = defaultSizes.find(
											defaultSize => defaultSize.id === value
										);
										const { height, width } = nextSize!;
										setSizeValue(value);
										setSize({ height, width });
									}
								}}
							>
								{defaultSizes.map(size_ => (
									<Option key={size_.id} value={size_.id}>
										{size_.height}x{size_.width}
									</Option>
								))}
							</Select>
						</Box>
						<Box data-skip-inverted-colors>
							<Frame>
								<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
									<Display text={hoveredPad?.label ?? selectedPad?.label ?? ""} />
									<Canvas height={size.height} width={size.width} />
								</Box>
							</Frame>
						</Box>
					</Box>
					<Box sx={{ flex: 1 }}>
						<Box sx={{ display: "flex", gap: 1, py: 1 }}>
							<ToggleButtonGroup
								value={selectedPads}
								sx={{ borderRadius: "md" }}
								onChange={(_, value) => {
									if (value) {
										setSelectedPads(value);
									}
								}}
							>
								<Button
									value="presets"
									sx={{
										borderTopLeftRadius: "inherit",
										borderBottomLeftRadius: "inherit",
									}}
								>
									Presets
								</Button>
								<Button value="prompts">Prompts</Button>
								<Button
									value="styles"
									sx={{
										borderTopRightRadius: "inherit",
										borderBottomRightRadius: "inherit",
									}}
								>
									Styles
								</Button>
							</ToggleButtonGroup>
							<Box sx={{ flex: 1 }} />
							<Button
								color={editMode ? "lime" : "grey"}
								variant={editMode ? "solid" : "soft"}
								sx={{ borderRadius: "md" }}
								onClick={() => {
									setPads(previousState =>
										previousState.map(pad_ => ({
											...pad_,
											selected: false,
										}))
									);
									setEditMode(previousState => !previousState);
								}}
							>
								Edit
							</Button>
							<Button
								disabled={!editMode || !hasSelection}
								sx={{ borderRadius: "md" }}
								onClick={() => {
									setPads(previousState =>
										previousState.map(pad_ => ({
											...pad_,
											selected: false,
										}))
									);
								}}
							>
								Cancel
							</Button>
						</Box>
						<Box data-skip-inverted-colors sx={{ flex: 1, height: 800 }}>
							<Frame color={editMode ? "lime" : "grey"}>
								<ButtonGrid>
									{pads.map((pad, index) => (
										<Pad
											disabled={hasSelection && !pad.selected}
											key={pad.id}
											active={pad.active}
											color={pad.color}
											label={pad.label}
											info={pad.info}
											onMouseEnter={() => {
												setHoveredPadId(pad.id);
											}}
											onMouseLeave={() => {
												setHoveredPadId(null);
											}}
											onClick={() => {
												if (editMode) {
													setPads(previousState =>
														previousState.map(pad_ =>
															pad_.id === pad.id
																? {
																		...pad_,
																		selected: !pad_.selected,
																	}
																: pad_
														)
													);
												} else {
													setPads(previousState =>
														previousState.map(pad_ =>
															pad_.id === pad.id
																? { ...pad_, active: !pad_.active }
																: { ...pad_, active: false }
														)
													);
												}
											}}
										/>
									))}
								</ButtonGrid>
							</Frame>
						</Box>
					</Box>
				</Box>
			</Box>
		</Layout>
	);
}
