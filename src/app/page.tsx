'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-16'>
        <div className='max-w-4xl mx-auto text-center'>
          <h1 className='text-5xl font-bold text-gray-900 mb-6'>
            Welcome to Recipe Collection
          </h1>
          <p className='text-xl text-gray-600 mb-8'>
            Your personal space to discover, create, and share your favorite
            recipes. Whether you're a seasoned chef or just starting your
            culinary journey, we've got you covered.
          </p>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-12'>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <div className='text-4xl mb-4'>📚</div>
              <h2 className='text-xl font-semibold mb-2'>Browse Recipes</h2>
              <p className='text-gray-600'>
                Explore our collection of delicious recipes from various
                cuisines.
              </p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <div className='text-4xl mb-4'>✏️</div>
              <h2 className='text-xl font-semibold mb-2'>Create & Share</h2>
              <p className='text-gray-600'>
                Add your own recipes and share them with the community.
              </p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <div className='text-4xl mb-4'>⭐</div>
              <h2 className='text-xl font-semibold mb-2'>Rate & Review</h2>
              <p className='text-gray-600'>
                Rate recipes and leave comments to help others.
              </p>
            </div>
          </div>

          <div className='flex justify-center'>
            <Link
              href='/recipes'
              className='px-8 py-4 text-lg font-medium text-white bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 transition-colors duration-300'
            >
              View Recipe Collection
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
