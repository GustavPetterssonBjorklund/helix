export type Container = {
	id: string;
	x: number;
	y: number;
	width: number;
	height: number;
	title?: string;
	children: string[]; // ids of child containers
};

export type Node = {
	id: string;
	x: number;
	y: number;
	label: string;
};

export type WorkspaceState = {
	containers: Array<{} & Container>;
	nodes: Array<{} & Node>;
};
