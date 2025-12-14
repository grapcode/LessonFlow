import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import MyLoading from '../../../components/my-components/MyLoading';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const UserOverview = () => {
  const axiosSecure = useAxiosSecure();

  // 🔹 React Query: fetch user summary
  const { data, isLoading } = useQuery({
    queryKey: ['user-dashboard-summary'],
    queryFn: async () => {
      const res = await axiosSecure.get('/dashboard/user-summary', {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return res.data;
    },
  });

  // 🔹 Loading state
  if (isLoading) return <MyLoading />;

  // 🔹 Default values to prevent map crash
  const {
    totalLessons = 0,
    totalFavorites = 0,
    recentLessons = [],
    weeklyActivity = [],
  } = data || {};

  return (
    <div className="space-y-10 mx-5">
      {/* Title */}
      <h2 className="text-3xl font-bold">Dashboard Overview</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl bg-white shadow p-6">
          <p className="text-gray-500">Total Lessons</p>
          <h3 className="text-4xl font-bold">{totalLessons}</h3>
        </div>

        <div className="rounded-xl bg-white shadow p-6">
          <p className="text-gray-500">Favorites</p>
          <h3 className="text-4xl font-bold">{totalFavorites}</h3>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4 flex-wrap">
        <Link
          to="/dashboard/add-lesson"
          className="px-5 py-3 rounded-lg bg-primary text-white hover:bg-primary/80 transition"
        >
          ➕ Add Lesson
        </Link>

        <Link
          to="/dashboard/my-lessons"
          className="px-5 py-3 rounded-lg border hover:bg-gray-100 transition"
        >
          📚 My Lessons
        </Link>
      </div>

      {/* Recent Lessons */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Recent Lessons</h3>
        {recentLessons.length === 0 ? (
          <p className="text-gray-400">No recent lessons found.</p>
        ) : (
          <div className="space-y-3">
            {recentLessons.map((lesson) => (
              <div
                key={lesson._id}
                className="flex justify-between items-center bg-white p-4 rounded-lg shadow"
              >
                <div>
                  <h4 className="font-medium">{lesson.title}</h4>
                  <p className="text-sm text-gray-500">{lesson.category}</p>
                </div>
                <span className="text-sm text-gray-400">
                  {new Date(lesson.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Analytics Chart */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Weekly Activity</h3>
        {weeklyActivity.length === 0 ? (
          <p className="text-gray-400">No activity data available.</p>
        ) : (
          <div className="h-64 bg-white rounded-lg shadow p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyActivity}>
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#000"
                  strokeWidth={2}
                />
                <XAxis dataKey="week" />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOverview;
