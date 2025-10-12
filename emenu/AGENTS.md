# Agent Guidelines

## Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run all tests once
- `npm run test:unit` - Run unit tests (vitest)
- `npm run test:unit [file]` - Run single test file
- `npm run check` - Type checking with svelte-check
- `npm run lint` - Check formatting with prettier
- `npm run format` - Format code with prettier

## Code Style

- Use tabs for indentation, single quotes, no trailing commas
- 100 character line width
- TypeScript strict mode enabled
- Svelte components with .svelte extension, markdown with .svx
- Import from $lib alias for src/lib
- Use clsx and tailwind-merge for conditional styling
- Follow Radix UI and bits-ui component patterns
