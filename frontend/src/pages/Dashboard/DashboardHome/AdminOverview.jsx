import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { PieChart, Pie, Tooltip, Legend } from 'recharts';

const AdminOverview = () => {
  const axiosSecure = useAxiosSecure();

  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: async () => {
      const res = await axiosSecure.get('/dashboard/admin-summary');
      return res.data;
    },
  });

  if (isLoading) return <p>Loading...</p>;

  const pieData = [
    { name: 'Public Lessons', value: stats.totalPublicLessons },
    { name: 'Reported Lessons', value: stats.reportedLessons },
    { name: "Today's Lessons", value: stats.todaysLessons },
  ];

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4">Admin Dashboard Home</h2>

      <div className="stats shadow mb-6">
        <div className="stat">
          <div className="stat-title">Total Users</div>
          <div className="stat-value">{stats.totalUsers}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Total Public Lessons</div>
          <div className="stat-value">{stats.totalPublicLessons}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Reported Lessons</div>
          <div className="stat-value">{stats.reportedLessons}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Today's Lessons</div>
          <div className="stat-value">{stats.todaysLessons}</div>
        </div>
      </div>

      <h3 className="text-2xl font-semibold mb-2">Top Contributors</h3>
      <ul className="mb-6">
        {stats.topContributors?.map((c, idx) => (
          <li key={idx}>
            {c._id} - {c.count} lessons
          </li>
        ))}
      </ul>

      <div className="w-full h-[400px]">
        <PieChart width={400} height={400}>
          <Pie
            dataKey="value"
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            label
          />
          <Legend />
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
};

export default AdminOverview;
