import React from 'react';
import { Link } from 'react-router';
import { FaLock } from 'react-icons/fa';

const LessonCard = ({ lesson }) => {
  const {
    _id,
    title,
    description,
    category,
    emotionalTone,
    creator,
    accessLevel,
    createdAt,
  } = lesson || {};

  return (
    <div className="card w-full bg-base-100 shadow-xl border hover:shadow-2xl transition-all duration-200">
      {/* Lock overlay if Premium */}
      {accessLevel === 'premium' && (
        <div className="absolute top-3 right-3 bg-error text-white px-2 py-1 rounded-md text-sm flex items-center gap-1">
          <FaLock /> Premium
        </div>
      )}

      <div className="card-body">
        {/* Title */}
        <h2 className="card-title text-xl font-bold">{title}</h2>

        {/* Short Description */}
        <p className="text-sm text-gray-600">{description?.slice(0, 100)}...</p>

        {/* Category + Emotional Tone */}
        <div className="flex flex-wrap gap-2 my-2">
          <span className="badge badge-primary badge-outline">{category}</span>
          <span className="badge badge-secondary badge-outline">
            {emotionalTone}
          </span>
        </div>

        {/* Creator Info */}
        <div className="flex items-center gap-3 mt-2">
          <img
            src={creator?.photoURL}
            alt="creator"
            className="w-10 h-10 rounded-full border"
          />
          <div>
            <p className="font-semibold">{creator?.name}</p>
            <p className="text-xs text-gray-500">
              {new Date(createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Footer / Button */}
        <div className="card-actions justify-end mt-3">
          <Link
            to={`/lessons/${_id}`}
            className="btn btn-sm btn-primary rounded-md"
          >
            See Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LessonCard;
