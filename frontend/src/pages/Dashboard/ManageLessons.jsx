import { useQuery, useMutation } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const ManageLessons = () => {
  const axiosSecure = useAxiosSecure();

  const { data = {}, refetch } = useQuery({
    queryKey: ['admin-manage-lessons'],
    queryFn: async () => {
      const res = await axiosSecure.get('/admin/manage-lessons');
      return res.data;
    },
  });

  const { lessons = [], stats = {} } = data;

  // ⭐ Featured
  const featureMutation = useMutation({
    mutationFn: ({ id, status }) =>
      axiosSecure.patch(`/admin/lessons/${id}/featured`, {
        isFeatured: status,
      }),
    onSuccess: () => {
      toast.success('Featured updated');
      refetch();
    },
  });

  // ✅ Reviewed
  const reviewMutation = useMutation({
    mutationFn: (id) => axiosSecure.patch(`/admin/lessons/${id}/reviewed`),
    onSuccess: () => {
      toast.success('Marked as reviewed');
      refetch();
    },
  });

  // ❌ Delete
  const deleteLesson = (id) => {
    Swal.fire({
      title: 'Delete lesson?',
      text: 'This cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
    }).then((res) => {
      if (res.isConfirmed) {
        axiosSecure.delete(`/admin/lessons/${id}`).then(() => {
          toast.success('Lesson deleted');
          refetch();
        });
      }
    });
  };

  return (
    <div className="p-5">
      <h2 className="text-3xl font-bold mb-6">Manage Lessons</h2>

      {/* 📊 Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="stat shadow">
          <div className="stat-title">Public</div>
          <div className="stat-value">{stats.public}</div>
        </div>
        <div className="stat shadow">
          <div className="stat-title">Private</div>
          <div className="stat-value">{stats.private}</div>
        </div>
        <div className="stat shadow">
          <div className="stat-title">Flagged</div>
          <div className="stat-value">{stats.flagged}</div>
        </div>
      </div>

      {/* 📋 Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Access</th>
              <th>Featured</th>
              <th>Reviewed</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {lessons.map((l) => (
              <tr key={l._id}>
                <td>{l.title}</td>
                <td>{l.category}</td>
                <td>{l.accessLevel}</td>

                <td>
                  <button
                    onClick={() =>
                      featureMutation.mutate({
                        id: l._id,
                        status: !l.isFeatured,
                      })
                    }
                    className={`btn btn-xs ${
                      l.isFeatured ? 'btn-primary' : 'btn-outline'
                    }`}
                  >
                    {l.isFeatured ? 'Featured' : 'Make Featured'}
                  </button>
                </td>

                <td>
                  {l.isReviewed ? (
                    '✅'
                  ) : (
                    <button
                      onClick={() => reviewMutation.mutate(l._id)}
                      className="btn btn-xs btn-success"
                    >
                      Mark Reviewed
                    </button>
                  )}
                </td>

                <td className="space-x-2">
                  <button
                    onClick={() => deleteLesson(l._id)}
                    className="btn btn-xs btn-error"
                  >
                    Delete
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

export default ManageLessons;
