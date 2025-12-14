import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiEdit } from 'react-icons/fi';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { FaTrashAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { Link } from 'react-router';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';

const MyLessons = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: lessons = [] } = useQuery({
    queryKey: ['my-lessons', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get('/lessons/my-lessons');
      return res.data;
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => axiosSecure.delete(`/lessons/${id}`),
    onSuccess: () => {
      toast.success('Lesson deleted successfully');
      queryClient.invalidateQueries(['my-lessons', user?.email]);
    },
  });

  const handleDelete = (lesson) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete your lesson!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(lesson._id);
    });
  };

  return (
    <div className="p-5">
      <h2 className="text-3xl font-bold mb-4">My Lessons ({lessons.length})</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Category</th>
              <th>Access</th>
              <th>Created</th>
              <th>Likes</th>
              <th>Favorites</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((lesson, index) => (
              <tr key={lesson._id}>
                <th>{index + 1}</th>
                <td>{lesson.title}</td>
                <td>{lesson.category}</td>
                <td>
                  {lesson.accessLevel} |{' '}
                  {lesson.isPublic ? 'Public' : 'Private'}
                </td>
                <td>{new Date(lesson.createdAt).toLocaleDateString()}</td>
                <td>{lesson.likesCount || 0}</td>
                <td>{lesson.favoritesCount || 0}</td>
                <td className="flex gap-2">
                  <Link
                    to={`/dashboard/lesson-details/${lesson._id}`}
                    className="btn btn-active hover:bg-primary/50"
                  >
                    <FaMagnifyingGlass />
                  </Link>

                  <Link
                    to={`/dashboard/lesson-edit/${lesson._id}`}
                    className="btn btn-active hover:bg-primary/50"
                  >
                    <FiEdit />
                  </Link>

                  <button
                    onClick={() => handleDelete(lesson)}
                    className="btn btn-active hover:bg-primary/50"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyLessons;
