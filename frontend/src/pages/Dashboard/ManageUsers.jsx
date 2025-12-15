import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import MyLoading from '../../components/my-components/MyLoading';

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: users = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await axiosSecure.get('/manageUsers');
      return res.data;
    },
  });

  if (isLoading) return <MyLoading />;

  const promoteToAdmin = (id) => {
    Swal.fire({
      title: 'Promote to Admin?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    }).then((res) => {
      if (res.isConfirmed) {
        axiosSecure.patch(`/manageUsers/promote/${id}`).then(() => {
          refetch();
          Swal.fire('Success', 'User promoted to admin', 'success');
        });
      }
    });
  };

  const deleteUser = (id) => {
    Swal.fire({
      title: 'Delete user?',
      text: 'This cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
    }).then((res) => {
      if (res.isConfirmed) {
        axiosSecure.delete(`/manageUsers/${id}`).then(() => {
          refetch();
          Swal.fire('Deleted', 'User removed', 'success');
        });
      }
    });
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-5">Manage Users</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Total Lessons</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u._id}>
                <td>{i + 1}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role?.join(', ')}</td>
                <td>{u.totalLessons}</td>
                <td className="space-x-2">
                  {!u.role?.includes('admin') && (
                    <button
                      onClick={() => promoteToAdmin(u._id)}
                      className="btn btn-xs btn-primary"
                    >
                      Make Admin
                    </button>
                  )}
                  <button
                    onClick={() => deleteUser(u._id)}
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

export default ManageUsers;
