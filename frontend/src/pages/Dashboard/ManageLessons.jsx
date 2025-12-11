import { useQuery, useMutation } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { toast } from 'react-toastify';

const ManageLessons = () => {
  const axiosSecure = useAxiosSecure();

  // Load all lessons
  const { data: lessons = [], refetch } = useQuery({
    queryKey: ['manage-lessons'],
    queryFn: async () => {
      const res = await axiosSecure.get('/lessons');
      return res.data;
    },
  });

  // Toggle featured
  const featureMutation = useMutation({
    mutationFn: async ({ id, status }) =>
      axiosSecure.patch(`/lessons/${id}/featured`, { isFeatured: status }),
    onSuccess: () => {
      toast.success('Updated Successfully!');
      refetch();
    },
  });

  const handleFeatured = (id, current) => {
    featureMutation.mutate({ id, status: !current });
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold pb-3">Manage Lessons</h2>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Title</th>
            <th className="p-2">Category</th>
            <th className="p-2">Featured</th>
          </tr>
        </thead>

        <tbody>
          {lessons.map((lesson) => (
            <tr key={lesson._id} className="border-t">
              <td className="p-2">{lesson.title}</td>
              <td className="p-2">{lesson.category}</td>
              <td className="p-2 text-center">
                <button
                  onClick={() =>
                    handleFeatured(lesson._id, lesson.isFeatured || false)
                  }
                  className={`px-3 py-1 rounded ${
                    lesson.isFeatured ? 'bg-primary text-white' : 'bg-gray-300'
                  }`}
                >
                  {lesson.isFeatured ? 'Featured' : 'Make Featured'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ManageLessons;
