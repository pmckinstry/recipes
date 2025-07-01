'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { getLabel, updateLabel } from '@/app/actions';
import MainContent from '@/components/MainContent';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface EditLabelPageProps {
  params: Promise<{ id: string }>;
}

export default function EditLabelPage({ params }: EditLabelPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLabel() {
      try {
        const label = await getLabel(id);
        if (label) {
          setName(label.name);
          setColor(label.color);
        } else {
          setError('Label not found');
        }
      } catch (err) {
        setError('Failed to load label');
      } finally {
        setLoading(false);
      }
    }
    loadLabel();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateLabel(id, { name, color });
      router.push('/labels');
    } catch (err: any) {
      setError(err.message || 'Failed to update label');
    } finally {
      setSaving(false);
    }
  };

  if (loading || status === 'loading') {
    return (
      <MainContent>
        <div className='text-center'>Loading...</div>
      </MainContent>
    );
  }

  if (!session) {
    return (
      <MainContent>
        <div className='text-center text-red-600'>
          You must be logged in to edit labels.
        </div>
      </MainContent>
    );
  }

  if (error) {
    return (
      <MainContent>
        <div className='text-center text-red-600'>{error}</div>
      </MainContent>
    );
  }

  return (
    <MainContent>
      <div className='max-w-lg mx-auto'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Edit Label</h1>
          <Link
            href='/labels'
            className='text-indigo-600 hover:text-indigo-800'
          >
            ← Back to Labels
          </Link>
        </div>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label className='block text-sm font-medium text-gray-900'>
              Label Name
            </label>
            <input
              type='text'
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-900'>
              Color
            </label>
            <input
              type='color'
              value={color}
              onChange={e => setColor(e.target.value)}
              className='mt-1 h-10 w-20 rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
            />
            <span className='ml-2 text-sm text-gray-700'>{color}</span>
          </div>
          {error && <div className='text-red-600 text-sm'>{error}</div>}
          <button
            type='submit'
            disabled={saving}
            className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </MainContent>
  );
}
