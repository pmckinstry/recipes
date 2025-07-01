'use client';

import Link from 'next/link';
import { Label } from '@/types/recipe';
import { getAllLabels, deleteLabel } from '@/app/actions';
import { useEffect, useState } from 'react';
import MainContent from '@/components/MainContent';
import { useSession } from 'next-auth/react';

export default function LabelsPage() {
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    async function loadLabels() {
      try {
        const data = await getAllLabels();
        setLabels(data);
      } catch (err) {
        setError('Failed to load labels');
        console.error('Error loading labels:', err);
      } finally {
        setLoading(false);
      }
    }

    loadLabels();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this label?')) {
      return;
    }

    try {
      await deleteLabel(id);
      setLabels(labels.filter(label => label.id !== id));
    } catch (err) {
      setError('Failed to delete label');
      console.error('Error deleting label:', err);
    }
  };

  if (loading || status === 'loading') {
    return (
      <MainContent>
        <div className='text-center'>Loading labels...</div>
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
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-4xl font-bold text-gray-900'>Labels</h1>
        {session && (
          <Link
            href='/labels/new'
            className='px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700'
          >
            Add New Label
          </Link>
        )}
      </div>

      <div className='grid gap-4'>
        {labels.map(label => (
          <div key={label.id} className='bg-white rounded-lg shadow-md p-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                <Link href={`/labels/${label.id}`}>
                  <span
                    className='px-3 py-1 rounded-full text-white font-medium hover:opacity-80 transition-opacity cursor-pointer'
                    style={{ backgroundColor: label.color }}
                  >
                    {label.name}
                  </span>
                </Link>
                <span className='text-sm text-gray-500'>#{label.color}</span>
              </div>
              {session && (
                <div className='space-x-2'>
                  <Link
                    href={`/labels/${label.id}/edit`}
                    className='text-indigo-600 hover:text-indigo-800'
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(label.id)}
                    className='text-red-600 hover:text-red-800'
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </MainContent>
  );
}
