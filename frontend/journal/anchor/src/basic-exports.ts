import { PublicKey } from '@solana/web3.js';

export const PROGRAM_ADDRESS = new PublicKey('7ye3d3zdux6TAnMrrzW3PeKCXc5FeG7kqcTvJNUwTr6E');

export const INSTRUCTIONS = {
  createJournalEntry: {
    name: 'createJournalEntry',
    accounts: [
      { name: 'journalEntry', isMut: true, isSigner: false },
      { name: 'owner', isMut: true, isSigner: true },
      { name: 'systemProgram', isMut: false, isSigner: false },
    ],
    args: [
      { name: 'title', type: 'string' },
      { name: 'message', type: 'string' },
    ],
  },
  updateJournalEntry: {
    name: 'updateJournalEntry',
    accounts: [
      { name: 'journalEntry', isMut: true, isSigner: false },
      { name: 'owner', isMut: true, isSigner: true },
      { name: 'systemProgram', isMut: false, isSigner: false },
    ],
    args: [
      { name: 'title', type: 'string' },
      { name: 'message', type: 'string' },
    ],
  },
  deleteJournalEntry: {
    name: 'deleteJournalEntry',
    accounts: [
      { name: 'journalEntry', isMut: true, isSigner: false },
      { name: 'owner', isMut: true, isSigner: true },
      { name: 'systemProgram', isMut: false, isSigner: false },
    ],
    args: [
      { name: 'title', type: 'string' },
    ],
  },
};

export const ACCOUNT_TYPES = {
  JournalEntryState: {
    name: 'JournalEntryState',
    type: {
      kind: 'struct',
      fields: [
        { name: 'owner', type: 'PublicKey' },
        { name: 'title', type: 'string' },
        { name: 'message', type: 'string' },
      ],
    },
  },
};

export const ERRORS = {
  6000: { name: 'TitleTooLong', msg: 'Title length exceeds 50 characters.' },
  6001: { name: 'MessageTooLong', msg: 'Message length exceeds 1000 characters.' },
  6002: { name: 'Unauthorized', msg: 'Unauthorized access.' },
};
