import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import LessonCard from '../../components/LessonCard';

const HomeSectionA = () => {
  const axiosSecure = useAxiosSecure();

  // 🌟 Featured Lessons (Dynamic)
  const { data: featured = [] } = useQuery({
    queryKey: ['featuredLessons'],
    queryFn: async () => {
      const { data } = await axiosSecure.get('/lessons/featured');
      return data;
    },
  });

  return (
    <div className="space-y-24">
      {/* ---------------------- 1. Featured Lessons ---------------------- */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">
          🌟 Featured Life Lessons
        </h2>
        <p className="text-center text-gray-600 mb-10">
          Selected by Admin — the most meaningful lessons.
        </p>

        {featured.length === 0 ? (
          <p className="text-center text-gray-500">
            No featured lessons found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((lesson) => (
              <LessonCard key={lesson._id} lesson={lesson} />
            ))}
          </div>
        )}
      </section>

      {/* ---------------------- 2. Why Learning Matters ---------------------- */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            💡 Why Learning From Life Matters
          </h2>
          <p className="text-gray-600 mb-12">
            Real-life experiences teach us more than any book ever could.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-white rounded-xl shadow">
              <h3 className="text-xl font-semibold mb-2">Practical Wisdom</h3>
              <p className="text-gray-500">
                Learn from real stories that create long-lasting impact.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow">
              <h3 className="text-xl font-semibold mb-2">Better Decisions</h3>
              <p className="text-gray-500">
                Use others’ experiences to guide your own choices.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow">
              <h3 className="text-xl font-semibold mb-2">Emotional Growth</h3>
              <p className="text-gray-500">
                Stories help you connect, understand, and empathize.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow">
              <h3 className="text-xl font-semibold mb-2">Stronger Mindset</h3>
              <p className="text-gray-500">
                Build resilience through lessons shared by real people.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeSectionA;
