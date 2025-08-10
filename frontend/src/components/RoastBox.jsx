import { useState } from 'react';
import { requestRoast } from '../services/api';

export default function RoastBox() {
  const [name, setName] = useState('');
  const [roast, setRoast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRoast = async () => {
    if (!name.trim()) return alert('Enter a name');
    setLoading(true);
    try {
      const res = await requestRoast(name.trim(), 'savage');
      setRoast(res);
    } catch (err) {
      console.error('Error generating roast:', err);
      alert('Error generating roast');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🔥 AI Roast Machine</h1>
      <input
        className="border p-2 w-full mb-3"
        placeholder="Enter a name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="flex gap-2">
        <button
          onClick={handleRoast}
          className="bg-red-500 text-black px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Roasting...' : 'Roast Me'}
        </button>
      </div>

      {roast && (
        <div className="mt-6 p-4 border rounded bg-black-50">
          <p className="italic">Source: {roast.source}</p>
          <p className="text-lg mt-2">{roast.roast}</p>
        </div>
      )}
    </div>
  );
}
