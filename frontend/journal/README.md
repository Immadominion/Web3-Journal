# Journal dApp

A decentralized journaling application built on Solana blockchain that allows users to create, manage and store personal journal entries securely on-chain using Program Derived Addresses (PDAs).

## Overview

This dApp enables users to maintain a personal journal on Solana blockchain with full ownership and control over their entries. Users can create, update, and delete journal entries while maintaining complete privacy and security through PDA-based storage.

## Getting Started

### Prerequisites

- Node.js v18.18.0 or higher for frontend development
- Rust v1.77.2 or higher for Solana program development
- Anchor CLI v0.30.1 or higher for smart contract deployment
- Solana CLI v1.18.17 or higher for blockchain interaction

### Installation

#### Clone the Repository

```shell
git clone <repo-url>
cd <repo-name>
```

#### Install Dependencies

```shell
pnpm install
```

#### Start the Development Server

```shell
pnpm dev
```

## Project Structure

The project consists of two main components:

### 1. Anchor Program (`/anchor`)

The core Solana program written in Rust using the Anchor framework.

#### Key Features
- PDA-based account system for secure storage
- Owner-based access control
- Journal entry management (create, update, delete)
- Custom error handling

#### Development Commands

```shell
# Sync program ID
pnpm anchor keys sync

# Build the program
pnpm anchor-build

# Start local validator
pnpm anchor-localnet

# Run test suite
pnpm anchor-test

# Deploy to devnet
pnpm anchor deploy --provider.cluster devnet
```

### 2. Web Frontend (`/web`)

A React-based frontend application for interacting with the Solana program.

#### Features
- Wallet integration (Phantom, Solflare, etc.)
- Real-time entry management
- Responsive design
- Error handling & user feedback

#### Development Commands

```shell
# Start development server
pnpm dev

# Build for production
pnpm build
```

## Testing

The project includes comprehensive tests for both the Anchor program and frontend:

- Unit tests for all program instructions
- Integration tests for end-to-end workflows
- Error case validation
- Frontend component testing

## Deployment

### Program Deployment
1. Build the program: `pnpm anchor-build`
2. Deploy to devnet: `pnpm anchor deploy --provider.cluster devnet`

### Frontend Deployment
1. Build the frontend: `pnpm build`
2. Deploy using your preferred hosting service (Vercel, Netlify, etc.)

## Resources
- [Solana Documentation](https://docs.solana.com)
- [Anchor Documentation](https://www.anchor-lang.com/)
- [Solana Cookbook](https://solanacookbook.com)

## License
MIT License

