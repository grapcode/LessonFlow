import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router';

const MyFavorites = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [categoryFilter, setCategoryFilter] = useState('');
  const [toneFilter, setToneFilter] = useState('');

  const { data: favorites = [] } = useQuery({
    queryKey: ['myFavorites', user?.uid],
    queryFn: async () => {
      const res = await axiosSecure.get('/favorites');
      return res.data;
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async (lessonId) => {
      const res = await axiosSecure.post('/favorites/remove', { lessonId });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myFavorites', user?.uid]);
      Swal.fire('Removed!', '', 'success');
    },
  });

  const filteredFavorites = favorites.filter((lesson) => {
    return (
      (!categoryFilter || lesson.category === categoryFilter) &&
      (!toneFilter || lesson.emotionalTone === toneFilter)
    );
  });

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4">
        My Favorites ({filteredFavorites.length})
      </h2>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="select select-bordered"
        >
          <option value="">All Categories</option>
          {[...new Set(favorites.map((l) => l.category))].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={toneFilter}
          onChange={(e) => setToneFilter(e.target.value)}
          className="select select-bordered"
        >
          <option value="">All Emotional Tones</option>
          {[...new Set(favorites.map((l) => l.emotionalTone))].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Favorites Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Category</th>
              <th>Emotional Tone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFavorites.map((lesson, idx) => (
              <tr key={lesson._id}>
                <td>{idx + 1}</td>
                <td>{lesson.title}</td>
                <td>{lesson.category}</td>
                <td>{lesson.emotionalTone}</td>
                <td className="space-x-2">
                  <Link
                    to={`/lessons/${lesson._id}`}
                    className="btn btn-sm btn-outline"
                  >
                    View
                  </Link>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => removeFavoriteMutation.mutate(lesson._id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {filteredFavorites.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center">
                  No favorites found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyFavorites;
