import coverImg from '../../assets/cover.jpg';
import Button from '../../components/Shared/Button';
import useAuth from '../../hooks/useAuth';
import useRole from '../../hooks/useRole';

const Profile = () => {
  const { user } = useAuth();
  const [role, isRoleLoading] = useRole();
  // const { role, isRoleLoading } = useRole();
  console.log(role, isRoleLoading);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white shadow-lg rounded-2xl md:w-4/5 lg:w-3/5">
        <img
          alt="cover photo"
          src={coverImg}
          className="w-full mb-4 rounded-t-lg h-56"
        />
        <div className="flex flex-col items-center justify-center p-4 -mt-16">
          <a href="#" className="relative block">
            <img
              alt="profile"
              src={user?.photoURL}
              className="mx-auto object-cover rounded-full h-24 w-24  border-2 border-white "
            />
          </a>

          <p className="p-2 px-4 text-xs text-white bg-primary rounded-full">
            {role}
          </p>
          <p className="mt-2 text-xl font-medium text-gray-800 ">
            User Id: {user?.uid}
          </p>
          <div className="w-full p-2 mt-4 rounded-lg">
            <div className="flex flex-wrap items-center justify-between text-sm text-gray-600 ">
              <p className="flex flex-col">
                Name
                <span className="font-bold text-gray-600 ">
                  {user?.displayName}
                </span>
              </p>
              <p className="flex flex-col">
                Email
                <span className="font-bold text-gray-600 ">{user?.email}</span>
              </p>

              <div>
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
