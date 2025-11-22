<script lang="ts">
    export let variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'primary';
    export let size: 'sm' | 'md' | 'lg' = 'md';
    export let disabled = false;
    export let type: 'button' | 'submit' | 'reset' = 'button';
    export let fullWidth = false;
    
    const base =
        'items-center justify-center rounded font-medium ' +
        'transition-colors duration-150 ' +
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
        'focus-visible:ring-sky-500 focus-visible:ring-offset-slate-900 ' +
        'disabled:opacity-50 disabled:pointer-events-none';
    
    const variants = {
        primary: 'bg-sky-600 text-white hover:bg-sky-500',
        secondary: 'border border-slate-600 text-slate-100 hover:bg-slate-800',
        danger: 'bg-rose-600 text-white hover:bg-rose-500',
        ghost: 'text-slate-100 hover:bg-slate-800'
    } as const;
    
    const sizes = {
        sm: 'px-3 py-1 text-xs gap-1.5',
        md: 'px-4 py-2 text-sm gap-2',
        lg: 'px-5 py-2.5 text-base gap-2.5'
    } as const;
</script>

<button
    {type}
    {disabled}
    class={`${fullWidth ? 'flex w-full' : 'inline-flex'} ${base} ${variants[variant]} ${sizes[size]}`}
    on:click
    {...$$restProps}
>
    <slot />
</button>