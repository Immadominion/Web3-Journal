'use client';

import { useJournalProgram } from './basic-data-access';
import { useWallet } from '@solana/wallet-adapter-react'; // Import wallet adapter
import { useState } from 'react';

export function BasicCreate() {
  const { publicKey } = useWallet();
  const { createEntry } = useJournalProgram();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleCreate = async () => {
    if (!title || !message) {
      return alert("Please provide both a title and a message.");
    }

    if (!publicKey) {
      return alert("Wallet not connected. Please connect your wallet.");
    }

    try {
      // Pass the publicKey as the owner
      await createEntry.mutateAsync({ title, message, owner: publicKey });
      alert("Journal entry created successfully!");
      setTitle("");
      setMessage("");
    } catch (err: any) {
      alert(`Error creating journal entry: ${err.message}`);
    }
  };

  return (
    <div className="card bg-base-100 shadow-md p-4">
      <h3 className="text-lg font-bold mb-4">Create a New Journal Entry</h3>
      <input
        className="input input-bordered w-full mb-4"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="textarea textarea-bordered w-full mb-4"
        placeholder="Message"
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        className={`btn btn-primary w-full ${createEntry.status === 'pending' && 'loading'}`}
        onClick={handleCreate}
        disabled={createEntry.status === 'pending'}
      >
        {createEntry.status === 'pending' ? 'Creating...' : 'Create Entry'}
      </button>
    </div>
  );
}

export function BasicProgram() {
  const { getProgramAccount } = useJournalProgram();

  if (getProgramAccount.isLoading) {
    return (
      <div className="flex justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-warning text-center">
        <p>No program account found. Ensure the program is deployed correctly.</p>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-md p-4">
      <h3 className="text-lg font-bold mb-4">Program Account Data</h3>
      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
        {JSON.stringify(getProgramAccount.data.value, null, 2)}
      </pre>
    </div>
  );
}

export function BasicAllEntries() {
  const { publicKey } = useWallet();
  const { getAllEntries } = useJournalProgram();

  console.log("Wallet connected:", publicKey?.toString());
  console.log("Entries loading:", getAllEntries.isLoading);
  console.log("Entries error:", getAllEntries.error);
  console.log("Entries data:", getAllEntries.data);

  if (getAllEntries.isLoading) {
    return (
      <div className="flex justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (getAllEntries.isError) {
    return (
      <div className="alert alert-error text-center">
        <p>Failed to fetch journal entries: {getAllEntries.error.message}</p>
      </div>
    );
  }

  if (!getAllEntries.data || getAllEntries.data.length === 0) {
    return (
      <div className="alert alert-warning text-center">
        <p>No journal entries found for your wallet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold mb-4">Your Journal Entries</h3>
      {getAllEntries.data.map((entry) => (
        <div key={entry.publicKey} className="card bg-base-100 shadow-md p-4">
          <h4 className="text-md font-semibold">{entry.data.title}</h4>
          <p className="text-sm text-gray-600">{entry.data.message}</p>
        </div>
      ))}
    </div>
  );
}
