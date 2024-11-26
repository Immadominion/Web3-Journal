# Journal Web App

Next.js frontend for interacting with the Journal Solana program - a decentralized journaling application that enables users to create, manage and store personal entries securely on the Solana blockchain.

## Overview

This frontend application provides an intuitive interface for users to interact with the Journal Solana program. Users can create, view, update and delete journal entries, with all data being stored securely on-chain using Program Derived Addresses (PDAs).

## Getting Started

### Prerequisites

- Node.js v18.18.0 or higher
- Rust v1.77.2 or higher
- Anchor CLI 0.30.1 or higher 
- Solana CLI 1.18.17 or higher
- Phantom or other Solana wallet

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Key Features

- **Wallet Integration**
    - Seamless connection using Solana Wallet Adapter
    - Support for multiple wallet providers
    - Real-time balance and network status

- **Journal Management**
    - Create new journal entries with title and content
    - View all entries associated with connected wallet
    - Update existing entries
    - Delete unwanted entries
    - PDA-based secure storage

- **User Experience**
    - Real-time updates using React Query
    - Responsive UI with Tailwind CSS
    - Error handling and feedback
    - Loading states and animations

## Project Structure

```
/src
    /components
        /basic        # Core journal functionality
            Entry.tsx   # Entry display component
            Create.tsx  # Entry creation form
            Update.tsx  # Entry modification
        /solana      # Wallet & blockchain integration  
            Provider.tsx
            Actions.tsx
        /ui          # Reusable components
            Button.tsx
            Input.tsx
    /hooks         # Custom React hooks
    /utils         # Helper functions
    /styles        # CSS and Tailwind config
```

## Development

### Available Commands

```bash
# Start development server
pnpm dev

# Build production bundle
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint
```

### Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_RPC_URL=<your-rpc-url>
NEXT_PUBLIC_PROGRAM_ID=<program-id>
```

## Deployment

1. Build the application: `pnpm build`
2. Deploy using Vercel or your preferred hosting service
3. Configure environment variables on hosting platform

## Resources

- [Solana Documentation](https://docs.solana.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Anchor Documentation](https://www.anchor-lang.com/)

## License

MIT License