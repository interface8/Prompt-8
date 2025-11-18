'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Star, ShoppingCart, TrendingUp, Sparkles } from 'lucide-react';
import { prompts, domains, skillLevels, type Prompt } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = searchQuery === '' || 
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDomain = selectedDomain === 'all' || prompt.domain === selectedDomain;
    const matchesSkillLevel = selectedSkillLevel === 'all' || prompt.skillLevel === selectedSkillLevel;
    
    const matchesPrice = priceRange === 'all' || 
      (priceRange === 'free' && prompt.price === 0) ||
      (priceRange === 'under5' && prompt.price > 0 && prompt.price < 5) ||
      (priceRange === '5to10' && prompt.price >= 5 && prompt.price <= 10) ||
      (priceRange === 'over10' && prompt.price > 10);
    
    return matchesSearch && matchesDomain && matchesSkillLevel && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    if (sortBy === 'popular') return b.purchaseCount - a.purchaseCount;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                PromptSearch
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link href="/" className="text-gray-300 hover:text-indigo-400 transition-colors">
                  Explore
                </Link>
                <Link href="/marketplace" className="text-gray-300 hover:text-indigo-400 transition-colors">
                  Marketplace
                </Link>
                <Link href="/creator" className="text-gray-300 hover:text-indigo-400 transition-colors">
                  Creator Studio
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/creator">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Create Prompt
                </Button>
              </Link>
              <Link href="/signin">
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Discover AI Prompts That Work
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-lg">
            Find, create, and monetize high-quality AI prompts across all domains. 
            Powered by taxonomies, templates, and verified efficiency scores.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search prompts, tags, or domains..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg rounded-xl border-2 border-gray-800 bg-gray-900 text-gray-100 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Prompts', value: prompts.length.toString(), icon: Sparkles },
            { label: 'Avg Rating', value: '4.7', icon: Star },
            { label: 'Total Sales', value: '12.4K', icon: ShoppingCart },
            { label: 'Active Creators', value: '234', icon: TrendingUp }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className="border-2 border-gray-800 bg-gray-900 hover:border-indigo-600/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold mt-1 text-gray-100">{stat.value}</p>
                    </div>
                    <div className="bg-indigo-600/20 p-3 rounded-lg">
                      <Icon className="w-6 h-6 text-indigo-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-gray-900 rounded-xl border-2 border-gray-800 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-gray-300 font-medium">Filters</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Domain</label>
              <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100">
                  <SelectValue placeholder="All Domains" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">All Domains</SelectItem>
                  {domains.map(domain => (
                    <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Skill Level</label>
              <Select value={selectedSkillLevel} onValueChange={setSelectedSkillLevel}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">All Levels</SelectItem>
                  {skillLevels.map(level => (
                    <SelectItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Price Range</label>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100">
                  <SelectValue placeholder="All Prices" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="under5">Under $5</SelectItem>
                  <SelectItem value="5to10">$5 - $10</SelectItem>
                  <SelectItem value="over10">Over $10</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100">
                  <SelectValue placeholder="Featured" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
            <p className="text-sm text-gray-400">
              {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? 's' : ''} found
            </p>
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedDomain('all');
                setSelectedSkillLevel('all');
                setPriceRange('all');
                setSortBy('featured');
                setSearchQuery('');
              }}
              className="text-gray-400 hover:text-gray-100"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Prompts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map(prompt => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>

        {filteredPrompts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No prompts found matching your criteria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedDomain('all');
                setSelectedSkillLevel('all');
                setPriceRange('all');
                setSearchQuery('');
              }}
              className="border-gray-700 text-gray-300"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function PromptCard({ prompt }: { prompt: Prompt }) {
  const recommendedModel = prompt.models.find(m => m.recommended);
  
  return (
    <Link href={`/prompt/${prompt.id}`}>
      <Card className="h-full border-2 border-gray-800 bg-gray-900 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10 transition-all cursor-pointer group">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1 text-gray-100 group-hover:text-indigo-400 transition-colors">
                {prompt.title}
              </h3>
              <p className="text-sm text-gray-500">{prompt.category}</p>
            </div>
            {prompt.featured && (
              <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-400 border-yellow-600/30">
                Featured
              </Badge>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-400 mb-4 line-clamp-2">
            {prompt.description}
          </p>

          {/* Domain Badge */}
          <Badge className="mb-4 bg-indigo-600/20 text-indigo-400 border-indigo-600/30">
            {prompt.domain}
          </Badge>

          {/* Model Recommendation */}
          {recommendedModel && (
            <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-400">Recommended Model</p>
                  <p className="text-sm font-medium text-green-300">{recommendedModel.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-400">{recommendedModel.efficiency}%</p>
                  <p className="text-xs text-green-500">efficiency</p>
                </div>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <span className="text-gray-300 font-medium">{prompt.rating}</span>
              <span className="text-gray-500">({prompt.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1">
              <ShoppingCart className="w-4 h-4" />
              <span className="text-gray-300">{prompt.purchaseCount.toLocaleString()}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {prompt.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded border border-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-800">
            <div className="flex items-center gap-2">
              <img
                src={prompt.creator.avatar}
                alt={prompt.creator.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm text-gray-400">{prompt.creator.name}</span>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-indigo-400">${prompt.price}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
