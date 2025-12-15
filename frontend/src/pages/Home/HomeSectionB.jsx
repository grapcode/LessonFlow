import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import LessonCard from '../../components/LessonCard';

const HomeSectionB = () => {
  const axiosSecure = useAxiosSecure();

  // 🏆 Top Contributors
  const { data: contributors = [] } = useQuery({
    queryKey: ['topContributors'],
    queryFn: async () => {
      const { data } = await axiosSecure.get('/users/top-contributors');
      return data;
    },
  });

  // 🔖 Most Saved Lessons
  const { data: savedLessons = [] } = useQuery({
    queryKey: ['mostSavedLessons'],
    queryFn: async () => {
      const { data } = await axiosSecure.get('/lessons/most-saved');
      return data;
    },
  });

  console.log(contributors);

  return (
    <div className="space-y-24 my-8">
      {/* ---------------------- 3. Top Contributors ---------------------- */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">
          🏆 Top Contributors of the Week
        </h2>
        <p className="text-center text-gray-600 mb-10">
          The most active contributors making the community better.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contributors.map((u) => (
            <div
              key={u._id}
              className="bg-white shadow rounded-xl p-6 text-center"
            >
              <img
                src={
                  u.authorInfo?.photoURL ||
                  'https://img.icons8.com/?size=80&id=108652&format=png'
                }
                alt={u.authorInfo?.name}
                className="w-20 h-20 mx-auto rounded-full mb-4"
              />
              <h3 className="text-lg font-semibold">{u.authorInfo?.name}</h3>
              <p className="text-gray-500">{u.authorInfo?.email}</p>
              <p className="text-sm text-gray-600 mt-2">
                Lessons: {u.totalLessons}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------- 4. Most Saved Lessons ---------------------- */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">
          🔖 Most Saved Lessons
        </h2>
        <p className="text-center text-gray-600 mb-10">
          Lessons people saved the most — because they matter.
        </p>

        {savedLessons.length === 0 ? (
          <p className="text-center text-gray-500">No saved lessons found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedLessons.map((lesson) => (
              <LessonCard key={lesson._id} lesson={lesson} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomeSectionB;
