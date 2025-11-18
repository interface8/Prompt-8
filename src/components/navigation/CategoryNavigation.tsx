'use client';

import { useState, useEffect } from 'react';

interface PromptType {
  id: string;
  name: string;
  parentId: string | null;
  children?: PromptType[];
  promptCount?: number;
}

interface CategoryNavigationProps {
  onCategorySelect: (categoryId: string | null) => void;
  selectedCategory?: string | null;
}

export default function CategoryNavigation({ 
  onCategorySelect, 
  selectedCategory 
}: CategoryNavigationProps) {
  const [categories, setCategories] = useState<PromptType[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Mock category data with hierarchical structure
  const mockCategories: PromptType[] = [
    {
      id: '1',
      name: 'Writing & Content',
      parentId: null,
      promptCount: 245,
      children: [
        { id: '1-1', name: 'Creative Writing', parentId: '1', promptCount: 89 },
        { id: '1-2', name: 'Technical Writing', parentId: '1', promptCount: 67 },
        { id: '1-3', name: 'Copywriting', parentId: '1', promptCount: 54 },
        { id: '1-4', name: 'Academic Writing', parentId: '1', promptCount: 35 },
      ]
    },
    {
      id: '2',
      name: 'Development & Code',
      parentId: null,
      promptCount: 198,
      children: [
        { id: '2-1', name: 'Code Review', parentId: '2', promptCount: 45 },
        { id: '2-2', name: 'Debugging', parentId: '2', promptCount: 38 },
        { id: '2-3', name: 'Architecture', parentId: '2', promptCount: 42 },
        { id: '2-4', name: 'Testing', parentId: '2', promptCount: 28 },
        { id: '2-5', name: 'Documentation', parentId: '2', promptCount: 45 },
      ]
    },
    {
      id: '3',
      name: 'Business & Marketing',
      parentId: null,
      promptCount: 156,
      children: [
        { id: '3-1', name: 'Marketing Strategy', parentId: '3', promptCount: 43 },
        { id: '3-2', name: 'Sales', parentId: '3', promptCount: 35 },
        { id: '3-3', name: 'Business Analysis', parentId: '3', promptCount: 39 },
        { id: '3-4', name: 'Project Management', parentId: '3', promptCount: 39 },
      ]
    },
    {
      id: '4',
      name: 'Education & Learning',
      parentId: null,
      promptCount: 123,
      children: [
        { id: '4-1', name: 'Language Learning', parentId: '4', promptCount: 45 },
        { id: '4-2', name: 'Math & Science', parentId: '4', promptCount: 38 },
        { id: '4-3', name: 'History & Social Studies', parentId: '4', promptCount: 25 },
        { id: '4-4', name: 'Test Preparation', parentId: '4', promptCount: 15 },
      ]
    },
    {
      id: '5',
      name: 'Creative & Design',
      parentId: null,
      promptCount: 89,
      children: [
        { id: '5-1', name: 'Graphic Design', parentId: '5', promptCount: 23 },
        { id: '5-2', name: 'Web Design', parentId: '5', promptCount: 28 },
        { id: '5-3', name: 'Game Design', parentId: '5', promptCount: 18 },
        { id: '5-4', name: 'Art & Illustration', parentId: '5', promptCount: 20 },
      ]
    },
    {
      id: '6',
      name: 'Productivity & Tools',
      parentId: null,
      promptCount: 76,
      children: [
        { id: '6-1', name: 'Task Management', parentId: '6', promptCount: 25 },
        { id: '6-2', name: 'Data Analysis', parentId: '6', promptCount: 28 },
        { id: '6-3', name: 'Automation', parentId: '6', promptCount: 23 },
      ]
    },
  ];

  useEffect(() => {
    setCategories(mockCategories);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleCategoryClick = (categoryId: string | null) => {
    onCategorySelect(categoryId);
  };

  const renderCategory = (category: PromptType, level: number = 0) => {
    const isExpanded = expandedCategories.has(category.id);
    const isSelected = selectedCategory === category.id;
    const hasChildren = category.children && category.children.length > 0;

    return (
      <div key={category.id} className={`ml-${level * 4}`}>
        <div
          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
            isSelected 
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          onClick={() => handleCategoryClick(category.id)}
        >
          <div className="flex items-center space-x-3">
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCategory(category.id);
                }}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {isExpanded ? '▼' : '▶'}
              </button>
            )}
            <span className={`font-medium ${!hasChildren ? 'ml-6' : ''}`}>
              {category.name}
            </span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
            {category.promptCount}
          </span>
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-4 mt-1">
            {category.children?.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Categories
        </h3>
        <button
          onClick={() => handleCategoryClick(null)}
          className={`text-sm px-3 py-1 rounded-md transition-colors ${
            selectedCategory === null
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          All Categories
        </button>
      </div>

      <div className="space-y-1">
        {categories.map(category => renderCategory(category))}
      </div>

      {/* Popular Tags Section */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
          Popular Tags
        </h4>
        <div className="flex flex-wrap gap-2">
          {[
            'chatgpt',
            'productivity',
            'creative-writing',
            'code-review',
            'marketing',
            'learning',
            'automation',
            'business',
            'design',
            'analysis'
          ].map(tag => (
            <button
              key={tag}
              onClick={() => console.log('Filter by tag:', tag)}
              className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}