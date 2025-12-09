import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { TbFidgetSpinner } from 'react-icons/tb';

const AddLesson = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // ==============================
  // TanStack Mutation
  // ==============================
  const {
    mutateAsync,
    isPending,
    isError,
    reset: mutationReset,
  } = useMutation({
    mutationFn: async (payload) => await axiosSecure.post('/lessons', payload),

    onSuccess: (data) => {
      console.log(data);
      toast.success('Lesson added successfully!');
      mutationReset();
    },

    onError: (err) => {
      console.log(err);
      toast.error('Something went wrong!');
    },
  });

  // ==============================
  // React Hook Form
  // ==============================
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // ==============================
  // Submit Handler
  // ==============================
  const onSubmit = async (data) => {
    const {
      title,
      shortDescription,
      fullDescription,
      category,
      emotionalTone,
      accessLevel,
    } = data;

    const lessonData = {
      title,
      description: shortDescription,
      fullDescription,
      category,
      emotionalTone,
      accessLevel,
      creator: {
        name: user?.displayName,
        email: user?.email,
        photoURL: user?.photoURL,
      },
      createdAt: new Date(),
      likes: [],
      likesCount: 0,
      favorites: [],
      favoritesCount: 0,
    };

    try {
      await mutateAsync(lessonData);
      reset();
    } catch (err) {
      console.log(err);
    }
  };

  if (isError) {
    return (
      <div className="text-center text-red-500 mt-10">Error occurred!</div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-120px)] flex flex-col justify-center items-center text-gray-800 rounded-xl bg-gray-50 p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Side */}
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-1 text-sm">
              <label className="block text-gray-600">Lesson Title</label>
              <input
                type="text"
                placeholder="Enter lesson title"
                className="w-full px-4 py-3 border border-indigo-300 focus:outline-indigo-500 rounded-md"
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title && (
                <p className="text-red-500 text-xs">{errors.title.message}</p>
              )}
            </div>

            {/* Short Description */}
            <div className="space-y-1 text-sm">
              <label className="block text-gray-600"> Description</label>
              <textarea
                className="w-full h-24 px-4 py-3 border border-indigo-300 rounded-md focus:outline-indigo-500"
                placeholder="Short description..."
                {...register('shortDescription', { required: true })}
              ></textarea>
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-6 flex flex-col">
            {/* Category */}
            <div className="space-y-1 text-sm">
              <label className="block text-gray-600">Category</label>
              <select
                className="w-full px-4 py-3 border-indigo-300 rounded-md focus:outline-indigo-500"
                {...register('category', { required: true })}
              >
                <option value="Personal Growth">Personal Growth</option>
                <option value="Mindset">Mindset</option>
                <option value="Career">Career</option>
                <option value="Relationships">Relationships</option>
                <option value="Mistakes Learned">Mistakes Learned</option>
              </select>
            </div>

            {/* Emotional Tone */}
            <div className="space-y-1 text-sm">
              <label className="block text-gray-600">Emotional Tone</label>
              <select
                className="w-full px-4 py-3 border-indigo-300 rounded-md focus:outline-indigo-500"
                {...register('emotionalTone', { required: true })}
              >
                <option value="Motivational">Motivational</option>
                <option value="Sad">Sad</option>
                <option value="Realization">Realization</option>
                <option value="Gratitude">Gratitude</option>
              </select>
            </div>

            {/* Access Level */}
            <div className="space-y-1 text-sm">
              <label className="block text-gray-600">Access Level</label>
              <select
                className="w-full px-4 py-3 border-indigo-300 rounded-md focus:outline-indigo-500"
                {...register('accessLevel', { required: true })}
              >
                <option value="public">Public</option>
                <option value="premium">Premium</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full cursor-pointer p-3 mt-5 text-center font-medium text-white transition duration-200 rounded shadow-md bg-primary"
            >
              {isPending ? (
                <TbFidgetSpinner className="animate-spin m-auto text-xl" />
              ) : (
                'Save Lesson'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddLesson;
