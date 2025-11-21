'use client';

import { useState } from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

interface User {
  id: string;
  name: string | null;
  image: string | null;
  isPremium: boolean;
}

interface PromptType {
  id: string;
  name: string;
}

interface Prompt {
  id: string;
  slug: string;
  title: string;
  content: string;
  description: string | null;
  category: string;
  tags: string[];
  price: number | null;
  isPrivate: boolean;
  isFeatured: boolean;
  isSellable: boolean;
  createdAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  saveCount: number;
  ratingCount: number;
  averageRating: number;
  user: User;
  type: PromptType;
  isLiked?: boolean;
  isSaved?: boolean;
  userRating?: number;
}

interface PromptCardProps {
  prompt: Prompt;
  onLike?: (promptId: string) => void;
  onSave?: (promptId: string) => void;
  onRate?: (promptId: string, rating: number) => void;
  onComment?: (promptId: string) => void;
  onShare?: (promptId: string) => void;
  onPurchase?: (promptId: string) => void;
  showFullContent?: boolean;
}

export default function PromptCard({ 
  prompt, 
  onLike, 
  onSave, 
  onRate, 
  onComment, 
  onShare, 
  onPurchase,
  showFullContent = false 
}: PromptCardProps) {
  const [isExpanded, setIsExpanded] = useState(showFullContent);
  const [showRating, setShowRating] = useState(false);

  const handleLike = () => {
    onLike?.(prompt.id);
  };

  const handleSave = () => {
    onSave?.(prompt.id);
  };

  const handleRate = (rating: number) => {
    onRate?.(prompt.id, rating);
    setShowRating(false);
  };

  const handleComment = () => {
    onComment?.(prompt.id);
  };

  const handleShare = () => {
    onShare?.(prompt.id);
  };

  const handlePurchase = () => {
    onPurchase?.(prompt.id);
  };

  const renderStars = (rating: number, interactive: boolean = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        onClick={interactive ? () => handleRate(i + 1) : undefined}
        className={`${
          i < rating 
            ? 'text-yellow-400' 
            : 'text-gray-300'
        } ${interactive ? 'hover:text-yellow-400 cursor-pointer' : 'cursor-default'}`}
      >
        ★
      </button>
    ));
  };

  const contentPreview = prompt.content.length > 200 
    ? `${prompt.content.substring(0, 200)}...` 
    : prompt.content;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {prompt.user.image ? (
              <Image
                src={prompt.user.image}
                alt={prompt.user.name || 'User'}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            ) : (
              prompt.user.name?.[0] || 'U'
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-gray-900 dark:text-white">
                {prompt.user.name || 'Anonymous'}
              </h4>
              {prompt.user.isPremium && (
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  PRO
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(prompt.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        
        {prompt.isFeatured && (
          <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-2 py-1 rounded-full">
            Featured
          </span>
        )}
      </div>

      {/* Title and Category */}
      <div className="mb-3">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          {prompt.title}
        </h3>
        <div className="flex items-center space-x-2">
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded">
            {prompt.type.name}
          </span>
          <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded">
            {prompt.category}
          </span>
        </div>
      </div>

      {/* Description */}
      {prompt.description && (
        <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm">
          {prompt.description}
        </p>
      )}

      {/* Content Preview */}
      <div className="mb-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-mono">
            {isExpanded ? prompt.content : contentPreview}
          </pre>
          {prompt.content.length > 200 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 dark:text-blue-400 text-sm mt-2 hover:underline"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      </div>

      {/* Tags */}
      {prompt.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {prompt.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Price and Purchase */}
      {prompt.isSellable && prompt.price && (
        <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-700">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-green-700 dark:text-green-300">
                ${prompt.price}
              </span>
              <span className="text-sm text-green-600 dark:text-green-400 ml-1">
                Premium Prompt
              </span>
            </div>
            <button
              onClick={handlePurchase}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Purchase
            </button>
          </div>
        </div>
      )}

      {/* Stats and Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
        {/* Stats */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center space-x-1">
            <span>👁</span>
            <span>{prompt.viewCount}</span>
          </span>
          <span className="flex items-center space-x-1">
            <span>💬</span>
            <span>{prompt.commentCount}</span>
          </span>
          {prompt.ratingCount > 0 && (
            <div className="flex items-center space-x-1">
              <div className="flex">
                {renderStars(Math.round(prompt.averageRating))}
              </div>
              <span>({prompt.ratingCount})</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleLike}
            className={`p-2 rounded-full transition-colors ${
              prompt.isLiked
                ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}
          >
            <div className="flex items-center space-x-1">
              <span>{prompt.isLiked ? '❤️' : '🤍'}</span>
              <span className="text-sm">{prompt.likeCount}</span>
            </div>
          </button>

          <button
            onClick={handleComment}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          >
            💬
          </button>

          <button
            onClick={handleSave}
            className={`p-2 rounded-full transition-colors ${
              prompt.isSaved
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}
          >
            {prompt.isSaved ? '🔖' : '📑'}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowRating(!showRating)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            >
              ⭐
            </button>
            
            {showRating && (
              <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg z-10">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Rate this prompt:</div>
                <div className="flex space-x-1">
                  {renderStars(prompt.userRating || 0, true)}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleShare}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          >
            📤
          </button>
        </div>
      </div>
    </div>
  );
}