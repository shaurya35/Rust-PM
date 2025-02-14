'use client';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../lib/api';
import PasswordList from '../components/PasswordList';

interface PasswordEntry {
  id: string;
  website: string;
  username: string;
  password: string;
}


export default function Home() {
  const [code, setCode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newEntry, setNewEntry] = useState({
    website: '',
    username: '',
    password: ''
  });

  // Fetch passwords query
  const { 
    data: passwords = [], 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['passwords', code],
    queryFn: async () => {
      const response = await api.get('/passwords', { params: { code: code } });
      return response.data;
    },
    enabled: !!code,
  });

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/signup');
      return response.data;
    },
    onSuccess: (newCode) => {
      setCode(newCode);
      alert(`Your access code: ${newCode}\nSave this code!`);
    }
  });

  // Add password mutation
  const addPasswordMutation = useMutation({
    mutationFn: async () => {
      await api.post('/passwords', {
        code: code,
        website: newEntry.website,
        username: newEntry.username,
        password: newEntry.password
    });
    },
    onSuccess: () => {
      setNewEntry({ website: '', username: '', password: '' });
      refetch();
    }
  });

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
       Password Manager
      </h1>

      {/* Code Input Section */}
      <div className="bg-blue-50 p-6 rounded-lg mb-8 shadow-md">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="Enter 6-digit code"
            className="border p-3 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto disabled:bg-gray-400"
            onClick={() => signupMutation.mutate()}
            disabled={signupMutation.isPending}
          >
            {signupMutation.isPending ? 'Generating...' : 'Get New Code'}
          </button>
        </div>
      </div>

      {/* Add Password Form */}
      {code && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Add New Password
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Website"
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newEntry.website}
              onChange={(e) => setNewEntry(p => ({...p, website: e.target.value}))}
            />
            <input
              type="text"
              placeholder="Username"
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newEntry.username}
              onChange={(e) => setNewEntry(p => ({...p, username: e.target.value}))}
            />
            <input
              type="password"
              placeholder="Password"
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newEntry.password}
              onChange={(e) => setNewEntry(p => ({...p, password: e.target.value}))}
            />
          </div>
          <button
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors w-full disabled:bg-gray-400"
            onClick={() => addPasswordMutation.mutate()}
            disabled={addPasswordMutation.isPending}
          >
            {addPasswordMutation.isPending ? 'Adding...' : 'Add Password'}
          </button>
        </div>
      )}

      {/* Password List */}
      {code && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search passwords..."
              className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {isLoading ? (
            <p className="text-gray-500 text-center">Loading passwords...</p>
          ) : (
            <PasswordList 
              passwords={passwords.filter((p: PasswordEntry) => 
                p.website.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.username.toLowerCase().includes(searchQuery.toLowerCase())
          )} 
            />
          )}
        </div>
      )}
    </div>
  );
}