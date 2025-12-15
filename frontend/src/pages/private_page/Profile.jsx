import coverImg from '../../assets/cover.jpg';
import Button from '../../components/Shared/Button';
import useAuth from '../../hooks/useAuth';
import useRole from '../../hooks/useRole';

const Profile = () => {
  const { user } = useAuth();
  const [role, isRoleLoading] = useRole();

  if (isRoleLoading) {
    return <div className="flex justify-center mt-20">Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white shadow-lg rounded-2xl md:w-4/5 lg:w-3/5">
        <img
          alt="cover photo"
          src={coverImg}
          className="w-full mb-4 rounded-t-lg h-56"
        />

        <div className="flex flex-col items-center p-4 -mt-16">
          <img
            alt="profile"
            src={user?.photoURL}
            className="mx-auto object-cover rounded-full h-24 w-24 border-2 border-white"
          />

          {/* 🔹 Role badges */}
          <div className="flex gap-2 mt-3 flex-wrap justify-center">
            {Array.isArray(role) &&
              role.map((r) => (
                <span
                  key={r}
                  className={`px-3 py-1 text-xs rounded-full text-white
                    ${
                      r === 'admin'
                        ? 'bg-orange-500'
                        : r === 'premium'
                        ? 'bg-yellow-500'
                        : 'bg-primary'
                    }`}
                >
                  {r.toUpperCase()}
                </span>
              ))}
          </div>

          <p className="mt-2 text-sm text-gray-500">User ID: {user?.uid}</p>

          <div className="w-full p-2 mt-4 rounded-lg">
            <div className="flex flex-wrap items-center justify-between text-sm text-gray-600">
              <p className="flex flex-col">
                Name
                <span className="font-bold">{user?.displayName}</span>
              </p>

              <p className="flex flex-col">
                Email
                <span className="font-bold">{user?.email}</span>
              </p>

              {/* 🔹 Custom buttons (unchanged) */}
              <div className="">
                <Button label="Update Profile" />
                <Button label="Change Password" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
