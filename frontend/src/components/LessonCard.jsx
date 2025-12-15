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
    <div className="relative group bg-base-100 border rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden">
      {/* 🔒 Premium Badge */}
      {accessLevel === 'premium' && (
        <div className="absolute top-3 right-3 z-10 bg-error text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow">
          <FaLock size={12} /> Premium
        </div>
      )}

      <div className="p-5 flex flex-col h-full">
        {/* Title */}
        <h2 className="text-lg font-bold leading-snug line-clamp-2 group-hover:text-primary transition">
          {title}
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-600 mt-2 line-clamp-3">{description}</p>

        {/* Category + Tone */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
            {category}
          </span>
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-secondary/10 text-secondary">
            {emotionalTone}
          </span>
        </div>

        {/* Creator */}
        <div className="flex items-center gap-3 mt-5">
          <img
            src={
              creator?.photoURL ||
              'https://img.icons8.com/?size=80&id=108652&format=png'
            }
            alt="creator"
            className="w-10 h-10 rounded-full border object-cover"
          />
          <div>
            <p className="text-sm font-semibold leading-none">
              {creator?.name || 'Unknown'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {createdAt ? new Date(createdAt).toLocaleDateString() : '—'}
            </p>
          </div>
        </div>

        {/* Action */}
        <div className="mt-auto pt-5">
          <Link
            to={`/lessons/${_id}`}
            className="btn btn-sm btn-primary w-full rounded-lg"
          >
            See Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LessonCard;
