import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { toast } from 'react-toastify';

const ReportedLessons = () => {
  const axiosSecure = useAxiosSecure();

  const { data: reports = [], refetch } = useQuery({
    queryKey: ['reported-lessons'],
    queryFn: async () => {
      const res = await axiosSecure.get('/reported-lessons');
      return res.data;
    },
  });

  const handleDelete = async (lessonId) => {
    await axiosSecure.delete(`/reported-lessons/${lessonId}`);
    toast.success('Lesson deleted');
    refetch();
  };

  const handleIgnore = async (lessonId) => {
    await axiosSecure.patch(`/reported-lessons/${lessonId}/ignore`);
    toast.info('Reports ignored');
    refetch();
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold pb-4">Reported Lessons</h2>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th>Lesson</th>
            <th>Reports</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {reports.map((item) => (
            <tr key={item._id} className="border-t">
              <td className="p-2">{item.lesson.title}</td>
              <td className="p-2 text-center">{item.reportCount}</td>
              <td className="p-2 flex gap-2 justify-center">
                <button
                  onClick={() => handleIgnore(item._id)}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  Ignore
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportedLessons;
