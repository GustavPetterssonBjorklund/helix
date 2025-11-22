export type Container = {
	id: string;
	x: number;
	y: number;
	width: number;
	height: number;
	title?: string;
	children: string[]; // ids of child containers
};

export type NodeBase = {
	id: string;
	x: number;
	y: number;
};

export type PropertyNode = NodeBase & {
	kind: 'property';
	propertyName: string;
	propertyType: string;
};

export type MethodNode = NodeBase & {
	kind: 'method';
	methodName: string;
	parameters: string[];
	returnType: string;
};

export type ClassNode = NodeBase & {
	kind: 'class';
	className: string;
	methods: MethodNode[];
	properties: PropertyNode[];
};

export type AnyNode = PropertyNode | MethodNode | ClassNode;

export type WorkspaceState = {
	containers: Array<{} & Container>;
	nodes: Array<{} & AnyNode>;
};
