# Journal Program

A decentralized journaling application built on Solana blockchain that allows users to create, manage and store personal journal entries on-chain using Program Derived Addresses (PDAs).

## Overview

This program enables users to maintain a personal journal on Solana blockchain with full ownership and control over their entries. Each entry is securely stored using PDAs derived from the entry title and owner's public key.

## Features

### Core Functionality
- Create journal entries with unique titles and messages
- Update existing entry content while maintaining entry history
- Delete entries with proper owner authorization
- Secure PDA-based storage with owner-title derivation
- Entry ownership validation and access control

### Security
- Entry ownership verification on all operations
- PDA-based unique storage allocation
- Signer validation for sensitive operations

## Technical Architecture

### Program Design
- Uses Anchor framework for Solana program development
- PDA-based account system for efficient storage
- Owner-based access control system
- Custom error handling for better UX

### Account Structure
- Journal Entry Account:
    - Owner: Pubkey
    - Title: String
    - Content: String
    - Timestamp: i64

### PDAs
Entries are stored at addresses derived from:
- Program ID
- Entry title (as seeds)
- Owner's public key (as seeds)

## Build and Deployment

### Prerequisites
- Rust v1.77.2+
- Solana CLI v1.18.17+
- Anchor CLI v0.30.1+
- Node.js v18.18.0+

### Build Instructions
```bash
# Build the program
anchor build

# Run test suite
anchor test

# Deploy to devnet
anchor deploy --provider.cluster devnet
```

## Testing

### Test Coverage
- Unit tests for all instructions
- Integration tests for E2E workflows
- Error case validation
- PDA derivation verification

### Test Categories
1. Account Creation Tests
2. Entry Modification Tests
3. Authorization Tests
4. Error Handling Tests

## Program Instructions

### create_journal_entry
Creates new journal entries with:
- Title validation
- PDA generation
- Owner assignment

### update_journal_entry
Updates existing entries with:
- Owner verification
- Content modification
- Timestamp updates

### delete_journal_entry
Removes entries with:
- Owner authorization
- Account cleanup
- PDA handling

## Frontend Integration

### Features
- Seamless Solana wallet integration
- Real-time entry management
- Responsive design
- Error handling & feedback

### Components
```
/src
    /components
        /basic        # Core journal logic
        /solana      # Wallet integration
        /ui          # Interface elements
```

## Resources
- [Solana Cookbook](https://solanacookbook.com)
- [Anchor Documentation](https://www.anchor-lang.com/)
- [Solana Documentation](https://docs.solana.com)

## License
MIT License
