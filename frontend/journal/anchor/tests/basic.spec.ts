// import * as anchor from '@coral-xyz/anchor';
// import { Program } from '@coral-xyz/anchor';
// import { Basic } from '../target/types/basic';

// describe('basic', () => {
//   // Configure the client to use the local cluster.
//   anchor.setProvider(anchor.AnchorProvider.env());

//   const program = anchor.workspace.Basic as Program<Basic>;

//   it('should run the program', async () => {
//     // Add your test here.
//     const tx = await program.methods.greet().rpc();
//     console.log('Your transaction signature', tx);
//   });

//   it('should have the correct program ID', () => {
//     expect(program.programId.toString()).toBe('YourExpectedProgramID');
//   });

//   it('should have the correct version', () => {
//     expect(program.idl.version).toBe('0.1.0');
//   });

//   it('should have the greet instruction', () => {
//     const instruction = program.idl.instructions.find(i => i.name === 'greet');
//     expect(instruction).toBeDefined();
//   });
// });
