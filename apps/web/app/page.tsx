'use client';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import PasswordList from '../components/PasswordList';

interface PasswordEntry {
  id: string;
  website: string;
  username: string;
  password: string;
}

export default function Home() {
  const [code, setCode] = useState('');
  const [search, setSearch] = useState('');
  const [newEntry, setNewEntry] = useState({
    website: '',
    username: '',
    password: ''
  });

  // Fetch passwords
  const { data: passwords = [], refetch } = useQuery({
    queryKey: ['passwords', code],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:8080/api/passwords?code=${code}`);
      return response.data;
    },
    enabled: !!code
  });

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post('http://localhost:8080/api/signup');
      return response.data;
    }
  });

  // Add password mutation
  const addPasswordMutation = useMutation({
    mutationFn: async () => {
      await axios.post('http://localhost:8080/api/passwords', {
        code,
        ...newEntry
      });
    },
    onSuccess: () => {
      setNewEntry({ website: '', username: '', password: '' });
      refetch();
    }
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Password Manager</h1>
      
      {/* Code Input Section */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Enter 6-digit code"
          className="border p-2 mr-2"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => signupMutation.mutate()}
        >
          {signupMutation.isPending ? 'Generating...' : 'Sign Up'}
        </button>
      </div>

      {/* Add Password Form */}
      {code && (
        <div className="mb-6">
          <h2 className="text-xl mb-2">Add New Password</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Website"
              className="border p-2 flex-1"
              value={newEntry.website}
              onChange={(e) => setNewEntry({ ...newEntry, website: e.target.value })}
            />
            <input
              type="text"
              placeholder="Username"
              className="border p-2 flex-1"
              value={newEntry.username}
              onChange={(e) => setNewEntry({ ...newEntry, username: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              className="border p-2 flex-1"
              value={newEntry.password}
              onChange={(e) => setNewEntry({ ...newEntry, password: e.target.value })}
            />
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => addPasswordMutation.mutate()}
            >
              {addPasswordMutation.isPending ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>
      )}

      {/* Password List */}
      {code && (
        <div>
          <input
            type="text"
            placeholder="Search passwords..."
            className="border p-2 mb-4 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <PasswordList 
            passwords={passwords.filter(p => 
              p.website.toLowerCase().includes(search.toLowerCase()) ||
              p.username.toLowerCase().includes(search.toLowerCase())
            )} 
          />
        </div>
      )}
    </div>
  );
}