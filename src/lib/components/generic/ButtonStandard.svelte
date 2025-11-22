<script lang="ts">
	export let variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'primary';
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let disabled = false;
	export let type: 'button' | 'submit' | 'reset' = 'button';

	const base =
		'inline-flex items-center justify-center rounded-xl font-medium ' +
		'transition-transform transition-colors duration-150 ' +
		'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
		'focus-visible:ring-sky-500 focus-visible:ring-offset-slate-900 ' +
		'disabled:opacity-50 disabled:pointer-events-none ' +
		'border border-white/10 shadow-sm active:scale-[0.98]';

	const variants = {
		primary:
			'bg-sky-500 text-slate-950 hover:bg-sky-400 ' +
			'hover:shadow-md',
		secondary:
			'bg-slate-800 text-slate-100 hover:bg-slate-700 ' +
			'hover:border-white/20',
		danger:
			'bg-rose-500 text-slate-950 hover:bg-rose-400 ' +
			'hover:shadow-md',
		ghost:
			'bg-transparent text-slate-100 hover:bg-slate-800/60 ' +
			'border-transparent hover:border-white/15'
	} as const;

	const sizes = {
		sm: 'px-3 py-1.5 text-xs gap-1',
		md: 'px-4 py-2 text-sm gap-1.5',
		lg: 'px-5 py-2.5 text-base gap-2'
	} as const;
</script>

<button
	type={type}
	disabled={disabled}
	class={`${base} ${variants[variant]} ${sizes[size]}`}
	on:click
	{...$$restProps}
>
	<slot />
</button>
