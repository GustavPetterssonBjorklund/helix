export type NodeBase = {
	id: string;
	name: string;
	type: 'property' | 'method' | 'class' | 'container';
	x: number;
	y: number;
};

export type PropertyNode = NodeBase & {
	type: 'property';
	dataType: string;
};

export type MethodNode = NodeBase & {
	type: 'method';
	parameters: string[];
	returnType: string;
};

export type ClassNode = NodeBase & {
	type: 'class';
	methods: MethodNode[];
	properties: PropertyNode[];
};

export type ContainerNode = NodeBase & {
	type: 'container';
	width: number;
	height: number;
	title?: string;
	children: AnyNode[];
};

export type AnyNode = PropertyNode | MethodNode | ClassNode | ContainerNode;

export type WorkspaceState = {
	nodes: AnyNode[];
};
