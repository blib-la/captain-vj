import {
	DndContext,
	DragOverlay,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	rectSortingStrategy,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Portal } from "@mui/base";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import { type ReactNode, useMemo } from "react";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core/dist/types";
import { Pad, PadProps } from "@/components/pad";
import IconButton from "@mui/joy/IconButton";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

export function AutoGrid({ children, minWidth }: { children?: ReactNode; minWidth: number }) {
	return (
		<Box
			sx={{
				display: "grid",
				gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}px, 1fr))`,
				gap: 1,
				overflow: "hidden",
			}}
		>
			{children}
		</Box>
	);
}

export function SortableItem({
	id,
	children,
	disabled,
}: {
	id: string;
	children?: ReactNode;
	disabled?: boolean;
}) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id,
		disabled,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0 : 1,
	};

	return (
		<Box ref={setNodeRef} style={style} {...attributes} sx={{ position: "relative" }}>
			{children}

			{!disabled && (
				<IconButton {...listeners} sx={{ position: "absolute", top: 0, right: 0 }}>
					<DragIndicatorIcon />
				</IconButton>
			)}
		</Box>
	);
}

export function Pads({
	pads,
	onPadClick,
	activeId,
	editMode,
	onDragEnd,
	onDragStart,
}: {
	pads: PadProps[];
	editMode?: boolean;
	activeId?: string | number | null;
	onDragStart?(event: DragStartEvent): void;
	onDragEnd?(event: DragEndEvent): void;
	onPadClick?(pad: PadProps): void;
}) {
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 10,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const activeItem = useMemo(() => pads.find(pad => pad.id === activeId), [pads, activeId]);
	const someSelectedItem = useMemo(() => pads.some(pad => pad.selected), [pads]);

	return (
		<DndContext sensors={sensors} onDragEnd={onDragEnd} onDragStart={onDragStart}>
			<Portal>
				<DragOverlay>
					{activeItem && (
						<Box key={activeItem.id} sx={{ position: "relative" }}>
							<Pad
								active={activeItem.active}
								label={activeItem.label}
								info={activeItem.info}
								color={activeItem.color}
							/>
							<IconButton sx={{ position: "absolute", top: 0, right: 0 }}>
								<DragIndicatorIcon />
							</IconButton>
						</Box>
					)}
				</DragOverlay>
			</Portal>
			<SortableContext strategy={rectSortingStrategy} items={pads.map(({ id }) => id)}>
				<Box sx={{ overflow: "auto", height: "100%", mr: -1 }}>
					<AutoGrid minWidth={100}>
						{pads.map(pad => (
							<SortableItem key={pad.id} id={pad.id} disabled={!editMode}>
								<Pad
									disabled={someSelectedItem && !pad.selected}
									active={pad.active}
									label={pad.label}
									info={pad.info}
									color={pad.color}
									style={{ opacity: activeId === pad.id ? 0 : 1 }}
									onClick={() => {
										if (onPadClick) {
											onPadClick(pad);
										}
									}}
								/>
							</SortableItem>
						))}
					</AutoGrid>
				</Box>
			</SortableContext>
		</DndContext>
	);
}
