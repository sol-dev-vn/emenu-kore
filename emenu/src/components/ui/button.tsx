import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
	'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
	{
		variants: {
			variant: {
				default: 'bg-accent text-brand-nav hover:bg-accent/90 hover:text-brand-primary',
				destructive: 'bg-red-600 text-white hover:bg-red-500',
				outline: 'border border-brand-primary/50 text-brand-text hover:text-accent hover:border-accent',
				secondary: 'bg-brand-primary text-brand-nav hover:bg-brand-primary/80',
				ghost: 'bg-transparent text-brand-text hover:bg-gray-100',
				link: 'text-brand-text underline-offset-4 hover:text-accent',
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-9 rounded-md px-3',
				lg: 'h-11 rounded-md px-8',
				icon: 'size-10 p-0',
			},
			block: {
				true: 'w-full',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	block?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, block = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button';

		return <Comp className={cn(buttonVariants({ variant, size, className, block }))} ref={ref} {...props} />;
	},
);
Button.displayName = 'Button';

export { Button, buttonVariants };
