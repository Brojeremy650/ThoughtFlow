import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { FiLogOut, FiPlus } from 'react-icons/fi';
import axios from 'axios';

interface Thought {
  _id: string;
  content: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [newThought, setNewThought] = useState('');
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('secular');

  useEffect(() => {
    fetchThoughts();
  }, []);

  const fetchThoughts = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('/api/thoughts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setThoughts(data);
    } catch (error) {
      console.error('Failed to fetch thoughts:', error);
    }
  };

  const handleAddThought = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThought.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        '/api/thoughts',
        { content: newThought, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setThoughts([data, ...thoughts]);
      setNewThought('');
    } catch (error) {
      console.error('Failed to add thought:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">ThoughtFlow</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user?.firstName}</span>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Add Thought Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Dump Your Thoughts</h2>
          <form onSubmit={handleAddThought}>
            <div className="flex gap-4">
              <input
                type="text"
                value={newThought}
                onChange={(e) => setNewThought(e.target.value)}
                placeholder="What's on your mind?..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="secular">Secular</option>
                <option value="spiritual">Spiritual</option>
                <option value="tasks">Tasks</option>
                <option value="long-term-plans">Long-term Plans</option>
                <option value="reminders">Reminders</option>
                <option value="waiting-on">Waiting On</option>
              </select>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                <FiPlus /> {loading ? 'Adding...' : 'Add'}
              </button>
            </div>
          </form>
        </div>

        {/* Thoughts List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Your Thoughts ({thoughts.length})</h2>
          {thoughts.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-500 text-lg">No thoughts yet. Start by adding one!</p>
            </div>
          ) : (
            thoughts.map((thought) => (
              <div key={thought._id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-900 font-medium">{thought.content}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">
                        {thought.category}
                      </span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                        {thought.priority}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(thought.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
