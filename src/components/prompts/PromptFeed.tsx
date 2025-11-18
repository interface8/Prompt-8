'use client';

import { useState, useEffect } from 'react';
import PromptCard from './PromptCard';

interface Prompt {
  id: string;
  slug: string;
  title: string;
  content: string;
  description: string;
  price: number | null;
  category: string;
  tags: string[];
  isPrivate: boolean;
  isFeatured: boolean;
  isSellable: boolean;
  createdAt: string;
  isLiked?: boolean;
  isSaved?: boolean;
  likeCount: number;
  saveCount: number;
  commentCount: number;
  viewCount: number;
  averageRating: number;
  ratingCount: number;
  userRating: number;
  user?: { name: string; image?: string | null };
  type?: { name: string };
  [key: string]: unknown;
}

interface FeedFilters {
  category?: string;
  sortBy: 'latest' | 'popular' | 'trending' | 'top-rated';
  timeRange: 'today' | 'week' | 'month' | 'all';
  priceFilter: 'all' | 'free' | 'paid';
}

interface PromptFeedProps {
  initialPrompts?: Prompt[];
  userId?: string;
}

export default function PromptFeed({ initialPrompts = [] }: PromptFeedProps) {
  const [prompts, setPrompts] = useState(initialPrompts);
  const [loading] = useState(false);
  const [filters, setFilters] = useState<FeedFilters>({
    sortBy: 'latest',
    timeRange: 'all',
    priceFilter: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for development
  const mockPrompts = [
    {
      id: '1',
      slug: 'creative-writing-assistant',
      title: 'Creative Writing Assistant',
      content: 'You are a professional creative writing assistant. Help me write engaging stories by providing plot ideas, character development suggestions, and narrative techniques. Focus on:\n\n1. Character depth and motivation\n2. Plot structure and pacing\n3. Vivid descriptions and dialogue\n4. Theme development\n\nAlways ask clarifying questions about the genre, target audience, and specific elements the writer wants to explore.',
      description: 'A comprehensive prompt for getting help with creative writing projects',
      category: 'Writing',
      tags: ['creative-writing', 'storytelling', 'character-development'],
      price: 4.99,
      isPrivate: false,
      isFeatured: true,
      isSellable: true,
      createdAt: new Date().toISOString(),
      viewCount: 1234,
      likeCount: 89,
      commentCount: 23,
      saveCount: 156,
      ratingCount: 45,
      averageRating: 4.7,
      user: {
        id: 'user1',
        name: 'Sarah Chen',
        image: null,
        isPremium: true
      },
      type: {
        id: 'type1',
        name: 'Assistant'
      },
      isLiked: false,
      isSaved: false,
      userRating: 0
    },
    {
      id: '2',
      slug: 'code-review-expert',
      title: 'Code Review Expert',
      content: 'Act as a senior software engineer conducting a thorough code review. Analyze the provided code for:\n\n- Code quality and best practices\n- Performance optimizations\n- Security vulnerabilities\n- Maintainability and readability\n- Testing coverage suggestions\n\nProvide specific, actionable feedback with examples of improvements.',
      description: 'Get professional code reviews to improve your programming skills',
      category: 'Development',
      tags: ['code-review', 'programming', 'best-practices'],
      price: null,
      isPrivate: false,
      isFeatured: false,
      isSellable: false,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      viewCount: 892,
      likeCount: 67,
      commentCount: 15,
      saveCount: 234,
      ratingCount: 28,
      averageRating: 4.5,
      user: {
        id: 'user2',
        name: 'Alex Rodriguez',
        image: null,
        isPremium: false
      },
      type: {
        id: 'type2',
        name: 'Expert'
      },
      isLiked: true,
      isSaved: true,
      userRating: 5
    },
    {
      id: '3',
      slug: 'marketing-strategy-consultant',
      title: 'Marketing Strategy Consultant',
      content: 'You are a marketing strategy consultant with 15+ years of experience. Help create comprehensive marketing strategies by analyzing:\n\n1. Target audience identification\n2. Competitive landscape\n3. Brand positioning\n4. Channel selection and budget allocation\n5. KPI definition and measurement\n\nAsk detailed questions about the business, industry, and goals before providing recommendations.',
      description: 'Professional marketing strategy guidance for businesses of all sizes',
      category: 'Business',
      tags: ['marketing', 'strategy', 'business-growth'],
      price: 9.99,
      isPrivate: false,
      isFeatured: false,
      isSellable: true,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      viewCount: 567,
      likeCount: 34,
      commentCount: 8,
      saveCount: 78,
      ratingCount: 12,
      averageRating: 4.2,
      user: {
        id: 'user3',
        name: 'Maria Garcia',
        image: null,
        isPremium: true
      },
      type: {
        id: 'type3',
        name: 'Consultant'
      },
      isLiked: false,
      isSaved: false,
      userRating: 0
    }
  ];

  useEffect(() => {
    if (initialPrompts.length === 0) {
      setPrompts(mockPrompts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompts]);

  const handleLike = async (promptId: string) => {
    // Optimistic update
    setPrompts(prev => prev.map(prompt => 
      prompt.id === promptId 
        ? { 
            ...prompt, 
            isLiked: !prompt.isLiked,
            likeCount: prompt.isLiked ? prompt.likeCount - 1 : prompt.likeCount + 1
          }
        : prompt
    ));

    // TODO: API call
    console.log('Like prompt:', promptId);
  };

  const handleSave = async (promptId: string) => {
    setPrompts(prev => prev.map(prompt => 
      prompt.id === promptId 
        ? { 
            ...prompt, 
            isSaved: !prompt.isSaved,
            saveCount: prompt.isSaved ? prompt.saveCount - 1 : prompt.saveCount + 1
          }
        : prompt
    ));

    console.log('Save prompt:', promptId);
  };

  const handleRate = async (promptId: string, rating: number) => {
    setPrompts(prev => prev.map(prompt => 
      prompt.id === promptId 
        ? { 
            ...prompt, 
            userRating: rating,
            // Update average rating (simplified calculation)
            averageRating: prompt.userRating === 0 
              ? ((prompt.averageRating * prompt.ratingCount) + rating) / (prompt.ratingCount + 1)
              : ((prompt.averageRating * prompt.ratingCount) - prompt.userRating + rating) / prompt.ratingCount,
            ratingCount: prompt.userRating === 0 ? prompt.ratingCount + 1 : prompt.ratingCount
          }
        : prompt
    ));

    console.log('Rate prompt:', promptId, rating);
  };

  const handleComment = (promptId: string) => {
    console.log('Comment on prompt:', promptId);
    // TODO: Navigate to prompt detail page or open comment modal
  };

  const handleShare = (promptId: string) => {
    const prompt = prompts.find(p => p.id === promptId);
    if (prompt) {
      navigator.clipboard.writeText(`${window.location.origin}/prompts/${prompt.slug}`);
      // TODO: Show toast notification
      console.log('Shared prompt:', promptId);
    }
  };

  const handlePurchase = (promptId: string) => {
    console.log('Purchase prompt:', promptId);
    // TODO: Open purchase modal or redirect to payment
  };

  const filteredPrompts = prompts.filter(prompt => {
    if (searchQuery && !prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !prompt.description?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }

    if (filters.priceFilter === 'free' && prompt.price !== null) return false;
    if (filters.priceFilter === 'paid' && prompt.price === null) return false;

    return true;
  });

  const sortedPrompts = [...filteredPrompts].sort((a, b) => {
    switch (filters.sortBy) {
      case 'popular':
        return (b.likeCount + b.saveCount) - (a.likeCount + a.saveCount);
      case 'trending':
        return (b.likeCount + b.commentCount + b.viewCount) - (a.likeCount + a.commentCount + a.viewCount);
      case 'top-rated':
        return b.averageRating - a.averageRating;
      case 'latest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Discover Prompts
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Find and share the best AI prompts for any use case
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search prompts, tags, or descriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-4">
          {/* Sort By */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Sort by:
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as 'latest' | 'popular' | 'trending' | 'top-rated' }))}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
            >
              <option value="latest">Latest</option>
              <option value="popular">Popular</option>
              <option value="trending">Trending</option>
              <option value="top-rated">Top Rated</option>
            </select>
          </div>

          {/* Price Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Price:
            </label>
            <select
              value={filters.priceFilter}
              onChange={(e) => setFilters(prev => ({ ...prev, priceFilter: e.target.value as 'all' | 'free' | 'paid' }))}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : sortedPrompts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No prompts found matching your search.' : 'No prompts available.'}
            </p>
          </div>
        ) : (
          sortedPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt as never}
              onLike={handleLike}
              onSave={handleSave}
              onRate={handleRate}
              onComment={handleComment}
              onShare={handleShare}
              onPurchase={handlePurchase}
            />
          ))
        )}
      </div>

      {/* Load More */}
      {!loading && sortedPrompts.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={() => console.log('Load more prompts')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Load More Prompts
          </button>
        </div>
      )}
    </div>
  );
}