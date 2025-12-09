import React from 'react';

import useAxiosSecure from '../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import LessonCard from '../components/LessonCard';
import LoadingSpinner from '../components/my-components/LoadingSpinner';

const PublicLessons = () => {
  // const { user } = useAuth(); // firebase auth user

  const axiosSecure = useAxiosSecure(); // url →  http://localhost:3000

  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ['myLessons'],
    queryFn: async () => {
      const res = await axiosSecure.get(`/lessons`);
      return res.data;
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="text-3xl font-bold py-3">
        Public Lessons: {lessons.length}
      </h2>
      <div className="pt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  gap-8 py-10">
        {lessons.map((lesson) => (
          <LessonCard key={lesson._id} lesson={lesson} />
        ))}
      </div>
    </div>
  );
};

export default PublicLessons;
