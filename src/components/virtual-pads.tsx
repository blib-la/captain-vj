import { CSSProperties, forwardRef, LegacyRef, useCallback } from "react";
import Box from "@mui/joy/Box";
import Scrollbars from "react-custom-scrollbars";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeGrid } from "react-window";
import { Pad, PadProps } from "@/components/pad";

export function PadCell({
	item,
	style,
	disabled,
}: {
	disabled?: boolean;
	item?: PadProps;
	style: CSSProperties;
}) {
	return (
		item && (
			<Box style={style} sx={{ p: 1 }}>
				<Pad
					disabled={disabled}
					key={item.id}
					active={item.active}
					color={item.color}
					label={item.label}
					info={item.info}
				/>
			</Box>
		)
	);
}

export function LegacyCustomScrollbars({
	onScroll,
	forwardedRef,
	style,
	children,
}: {
	onScroll?: any;
	forwardedRef?: any;
	style?: any;
	children?: any;
}) {
	const referenceSetter: LegacyRef<any> = useCallback(
		(scrollbarsReference: { view: any }) => {
			if (forwardedRef) {
				if (scrollbarsReference) {
					forwardedRef(scrollbarsReference.view);
				} else {
					forwardedRef(null);
				}
			}
		},
		[forwardedRef]
	);

	return (
		<Scrollbars
			ref={referenceSetter}
			autoHide
			universal
			style={{ ...style, overflow: "hidden" }}
			renderThumbVertical={properties => (
				<Box
					{...properties}
					className="thumb-vertical"
					style={{ ...properties.style }}
					sx={theme => ({
						bgcolor: "text.secondary",
						zIndex: theme.zIndex.badge + 1,
					})}
				/>
			)}
			onScroll={onScroll}
		>
			{children}
		</Scrollbars>
	);
}

export const CustomScrollbarsVirtualList = forwardRef<
	HTMLDivElement,
	{ onScroll: any; forwardedRef: any; style: any; children: any }
>((properties, reference) => <LegacyCustomScrollbars {...properties} forwardedRef={reference} />);

CustomScrollbarsVirtualList.displayName = "CustomScrollbarsVirtualList";

export function VirtualGrid({
	items,
	targetWidth = 150,
}: {
	items: PadProps[];
	targetWidth: number;
}) {
	const hasSelection = items.some(item => item.selected);

	return (
		<AutoSizer>
			{({ height, width }) => {
				const columnCount = Math.floor(width / targetWidth);
				const columnWidth = width / columnCount;

				return (
					<FixedSizeGrid
						outerElementType={CustomScrollbarsVirtualList}
						className="react-window"
						columnCount={columnCount}
						height={height}
						columnWidth={columnWidth}
						rowHeight={columnWidth}
						width={width}
						rowCount={Math.ceil(items.length / columnCount)}
					>
						{({ columnIndex, rowIndex, style }) => (
							<PadCell
								disabled={hasSelection}
								style={style}
								item={items[rowIndex * columnCount + columnIndex]}
							/>
						)}
					</FixedSizeGrid>
				);
			}}
		</AutoSizer>
	);
}
