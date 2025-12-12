import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '../hooks/useAuth';
import useAxiosSecure from '../hooks/useAxiosSecure';
import useRole from '../hooks/useRole';
import toast from 'react-hot-toast';
import { TbHeart, TbBookmark, TbFlag } from 'react-icons/tb';
import { FaShareAlt } from 'react-icons/fa';
import LoadingSpinner from '../components/my-components/LoadingSpinner';
import LessonCard from '../components/LessonCard';

const LessonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { role, loading: roleLoading } = useRole();

  const [reporting, setReporting] = useState(false);
  const [commentText, setCommentText] = useState('');

  // Fetch lesson
  const {
    data: lesson,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['lesson', id],
    queryFn: async () => {
      try {
        const { data } = await axiosSecure.get(`/lessons/${id}`);
        return data;
      } catch (err) {
        console.log(err);
        return null;
      }
    },
  });

  // Redirect if lesson not found
  useEffect(() => {
    if (!isLoading && !roleLoading && (!lesson || isError)) {
      toast.error('Lesson not found or access denied');
      navigate('/pricing');
    }
  }, [lesson, isLoading, roleLoading, isError, navigate]);

  // --- Mutations ---
  const likeMutation = useMutation({
    mutationFn: async () =>
      axiosSecure.post(`/lessons/${id}/like`, { userId: user?.uid }),
    onSuccess: () => queryClient.invalidateQueries(['lesson', id]),
  });

  const favoriteMutation = useMutation({
    mutationFn: async () =>
      axiosSecure.post(`/lessons/${id}/favorite`, { userId: user?.uid }),
    onSuccess: () => queryClient.invalidateQueries(['lesson', id]),
  });

  const reportMutation = useMutation({
    mutationFn: async (reason) =>
      axiosSecure.post('/lessonsReports', {
        lessonId: lesson?._id,
        reporterUserId: user?.uid,
        reportedUserEmail: user?.email,
        reason,
        timestamp: new Date(),
      }),
    onSuccess: () => {
      toast.success('Report submitted');
      setReporting(false);
    },
  });

  const commentMutation = useMutation({
    mutationFn: async (text) =>
      axiosSecure.post(`/lessons/${id}/comments`, {
        userId: user?.uid,
        userName: user?.displayName || user?.email,
        text,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['lesson', id]);
      setCommentText('');
      toast.success('Comment added');
    },
  });

  // --- Loading ---
  if (isLoading || roleLoading) return <LoadingSpinner />;
  if (!lesson) return null; // redirect already handled in useEffect

  // ⭐ Premium Lock System
  if (
    lesson.accessLevel.toLowerCase() === 'premium' &&
    role.toLowerCase() !== 'premium'
  ) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold mb-4">This is a Premium Lesson ⭐</h2>
        <p className="mb-6 text-gray-600">
          Upgrade to Premium to unlock this content.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/pricing')}
        >
          Upgrade to Premium
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Lesson Heading */}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold">{lesson.title}</h1>
        <p className="text-gray-600">
          Category: {lesson.category} | Emotional Tone: {lesson.emotionalTone}
        </p>
        <p className="text-gray-800">
          {lesson.fullDescription || lesson.description}
        </p>
      </div>

      {/* Metadata */}
      <div className="flex flex-wrap gap-4 text-gray-500">
        <span>Created: {new Date(lesson.createdAt).toLocaleDateString()}</span>
        {lesson.updatedAt && (
          <span>
            Updated: {new Date(lesson.updatedAt).toLocaleDateString()}
          </span>
        )}
        <span>Access: {lesson.accessLevel}</span>
      </div>

      {/* Creator Info */}
      <div className="flex items-center gap-4">
        <img
          src={
            lesson.creator?.photoURL ||
            'https://img.icons8.com/?size=80&id=108652&format=png'
          }
          alt={lesson.creator?.name}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <p className="font-semibold">{lesson.creator?.name}</p>
          <p className="text-gray-500">{lesson.creator?.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 text-gray-600">
        <div>❤️ {lesson.likesCount || 0} Likes</div>
        <div>🔖 {lesson.favoritesCount || 0} Favorites</div>
        <div>👀 {lesson.viewsCount || 0} Views</div>
      </div>

      {/* Interaction Buttons */}
      <div className="flex gap-4">
        <button
          className="btn btn-outline btn-sm flex items-center gap-1"
          onClick={() =>
            !user ? toast.error('Please log in') : likeMutation.mutate()
          }
        >
          <TbHeart /> Like
        </button>
        <button
          className="btn btn-outline btn-sm flex items-center gap-1"
          onClick={() =>
            !user ? toast.error('Please log in') : favoriteMutation.mutate()
          }
        >
          <TbBookmark /> Save
        </button>
        <button
          className="btn btn-outline btn-sm flex items-center gap-1"
          onClick={() => setReporting(true)}
        >
          <TbFlag /> Report
        </button>
        <button
          className="btn btn-outline btn-sm flex items-center gap-1"
          onClick={() => {
            navigator.share
              ? navigator.share({
                  title: lesson.title,
                  text: lesson.fullDescription || lesson.description,
                  url: window.location.href,
                })
              : toast('Sharing not supported');
          }}
        >
          <FaShareAlt /> Share
        </button>
      </div>

      {/* Report Modal */}
      {reporting && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h3 className="text-lg font-bold mb-4">Report Lesson</h3>
            <select
              className="select select-bordered w-full mb-4"
              onChange={(e) => reportMutation.mutate(e.target.value)}
            >
              <option value="">Select Reason</option>
              <option value="Inappropriate Content">
                Inappropriate Content
              </option>
              <option value="Hate Speech">Hate Speech</option>
              <option value="Misleading Information">
                Misleading Information
              </option>
              <option value="Spam">Spam</option>
              <option value="Sensitive">Sensitive Content</option>
              <option value="Other">Other</option>
            </select>
            <button
              className="btn btn-primary w-full"
              onClick={() => setReporting(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Comments */}
      <div className="space-y-3">
        <h3 className="text-xl font-semibold mb-2">Comments</h3>
        {lesson.comments?.map((c) => (
          <div key={c._id} className="border-b py-2">
            <p className="font-semibold">{c.userName}</p>
            <p className="text-gray-600">{c.text}</p>
          </div>
        ))}
        {user && (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a comment..."
              className="input input-bordered flex-1"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button
              className="btn btn-primary"
              onClick={() => {
                if (!commentText.trim()) return toast.error('Comment is empty');
                commentMutation.mutate(commentText);
              }}
            >
              Post
            </button>
          </div>
        )}
      </div>

      {/* Similar Lessons */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Similar Lessons</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lesson.similarLessons?.map((l) => (
            <LessonCard key={l._id} lesson={l} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LessonDetails;
