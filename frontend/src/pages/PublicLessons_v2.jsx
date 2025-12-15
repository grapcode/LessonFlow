import React, { useState, useMemo } from 'react';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import LessonCard from '../components/LessonCard';
import LoadingSpinner from '../components/my-components/LoadingSpinner';

const PublicLessons_v2 = () => {
  const axiosSecure = useAxiosSecure();

  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ['publicLessons'],
    queryFn: async () => {
      const res = await axiosSecure.get('/lessons');
      return res.data;
    },
  });

  // 🔹 Filter / Search / Sort state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [toneFilter, setToneFilter] = useState('');
  const [sortOption, setSortOption] = useState('newest'); // newest / mostSaved

  // 🔹 Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const lessonsPerPage = 12; // এক পেজে কতগুলো lesson দেখাবে

  // 🔹 Filtered + sorted lessons
  const filteredLessons = useMemo(() => {
    let result = lessons;

    if (searchTerm) {
      result = result.filter((l) =>
        l.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      result = result.filter((l) => l.category === categoryFilter);
    }

    if (toneFilter) {
      result = result.filter((l) => l.emotionalTone === toneFilter);
    }

    if (sortOption === 'newest') {
      result = result.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sortOption === 'mostSaved') {
      result = result.sort(
        (a, b) => (b.favoritesCount || 0) - (a.favoritesCount || 0)
      );
    }

    return result;
  }, [lessons, searchTerm, categoryFilter, toneFilter, sortOption]);

  // 🔹 Pagination calculations
  const indexOfLastLesson = currentPage * lessonsPerPage;
  const indexOfFirstLesson = indexOfLastLesson - lessonsPerPage;
  const currentLessons = filteredLessons.slice(
    indexOfFirstLesson,
    indexOfLastLesson
  );
  const totalPages = Math.ceil(filteredLessons.length / lessonsPerPage);

  if (isLoading) return <LoadingSpinner />;

  const categories = [...new Set(lessons.map((l) => l.category))];
  const tones = [...new Set(lessons.map((l) => l.emotionalTone))];

  return (
    <div>
      <h2 className="text-3xl font-bold py-3">
        Public Lessons: {filteredLessons.length}
      </h2>

      {/* 🔹 Search & Filter UI */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title..."
          className="input input-bordered flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="select select-bordered"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          className="select select-bordered"
          value={toneFilter}
          onChange={(e) => setToneFilter(e.target.value)}
        >
          <option value="">All Tones</option>
          {tones.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          className="select select-bordered"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="mostSaved">Most Saved</option>
        </select>
      </div>

      {/* 🔹 Lessons grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {currentLessons.map((lesson) => (
          <LessonCard key={lesson._id} lesson={lesson} />
        ))}
      </div>

      {/* 🔹 Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-2">
          <button
            className="btn btn-sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1}
              className={`btn btn-sm ${
                currentPage === idx + 1 ? 'btn-primary text-white' : ''
              }`}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}

          <button
            className="btn btn-sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PublicLessons_v2;
