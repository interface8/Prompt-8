'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, Star, ShoppingCart, Heart, Share2, CheckCircle,
  AlertCircle, TrendingUp, Copy
} from 'lucide-react';
import Image from 'next/image';
import { prompts } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function PromptDetailPage() {
  const params = useParams();
  const prompt = prompts.find(p => p.id === params?.id);
  const [liked, setLiked] = useState(false);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  if (!prompt) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-400 mb-4">Prompt not found</p>
            <Link href="/">
              <Button variant="outline" className="border-gray-700 text-gray-300">Back to Home</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleParamChange = (paramName: string, value: string) => {
    setParamValues(prev => ({ ...prev, [paramName]: value }));
  };

  const generatePromptPreview = () => {
    let preview = prompt.template;
    prompt.parameters.forEach(param => {
      const value = paramValues[param.name] || `[${param.name}]`;
      preview = preview.replace(new RegExp(`{{${param.name}}}`, 'g'), value);
    });
    setGeneratedPrompt(preview);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const recommendedModel = prompt.models.find(m => m.recommended);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Header />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-indigo-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Discover</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-100 mb-2">{prompt.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-gray-100 font-medium">{prompt.rating}</span>
                      <span>({prompt.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ShoppingCart className="w-4 h-4" />
                      <span>{prompt.purchaseCount.toLocaleString()} purchases</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                      <span>{prompt.likes + (liked ? 1 : 0)} likes</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <Badge className="bg-indigo-600/20 text-indigo-400 border-indigo-600/30">{prompt.domain}</Badge>
                <Badge variant="outline" className="border-gray-700 text-gray-400">{prompt.category}</Badge>
                <Badge variant="outline" className="border-gray-700 text-gray-400 capitalize">{prompt.skillLevel}</Badge>
              </div>

              <p className="text-gray-300">{prompt.description}</p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="parameters" className="w-full">
              <TabsList className="w-full justify-start bg-gray-900 border border-gray-800">
                <TabsTrigger value="parameters" className="data-[state=active]:bg-indigo-600">Parameters</TabsTrigger>
                <TabsTrigger value="models" className="data-[state=active]:bg-indigo-600">Model Recommendations</TabsTrigger>
                <TabsTrigger value="reviews" className="data-[state=active]:bg-indigo-600">Reviews</TabsTrigger>
                <TabsTrigger value="details" className="data-[state=active]:bg-indigo-600">Details</TabsTrigger>
              </TabsList>

              {/* Parameters Tab */}
              <TabsContent value="parameters" className="space-y-6 mt-6">
                <Card className="border-2 border-gray-800 bg-gray-900">
                  <CardHeader>
                    <h3 className="text-lg font-bold text-gray-100">Configure Your Prompt</h3>
                    <p className="text-sm text-gray-400">
                      Fill in the parameters below to customize this prompt for your needs
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {prompt.parameters.map(param => (
                      <div key={param.name}>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          {param.name.charAt(0).toUpperCase() + param.name.slice(1).replace(/([A-Z])/g, ' $1')}
                          {param.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <p className="text-xs text-gray-500 mb-2">{param.description}</p>
                        
                        {param.type === 'text' && (
                          <Input
                            placeholder={param.placeholder}
                            value={paramValues[param.name] || ''}
                            onChange={(e) => handleParamChange(param.name, e.target.value)}
                            className="bg-gray-800 border-gray-700 text-gray-100"
                          />
                        )}
                        
                        {param.type === 'textarea' && (
                          <Textarea
                            placeholder={param.placeholder}
                            value={paramValues[param.name] || ''}
                            onChange={(e) => handleParamChange(param.name, e.target.value)}
                            rows={4}
                            className="bg-gray-800 border-gray-700 text-gray-100"
                          />
                        )}
                        
                        {param.type === 'select' && param.options && (
                          <Select
                            value={paramValues[param.name] || ''}
                            onValueChange={(value: string) => handleParamChange(param.name, value)}
                          >
                            <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100">
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              {param.options.map(option => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    ))}

                    <Button onClick={generatePromptPreview} className="w-full bg-indigo-600 hover:bg-indigo-700">
                      Generate Preview
                    </Button>

                    {generatedPrompt && (
                      <div className="bg-gray-800 rounded-lg p-4 border-2 border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-300">Generated Prompt</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(generatedPrompt)}
                            className="text-gray-400 hover:text-gray-100"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                          {generatedPrompt}
                        </pre>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Sample Output */}
                <Card className="border-2 border-blue-800/50 bg-blue-900/10">
                  <CardHeader>
                    <h3 className="text-lg font-bold text-gray-100">Sample Output</h3>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                      {prompt.sampleOutput}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Models Tab */}
              <TabsContent value="models" className="space-y-4 mt-6">
                {prompt.models.map(model => (
                  <Card 
                    key={model.name} 
                    className={`border-2 ${model.recommended ? 'border-green-600/50 bg-green-900/10' : 'border-gray-800 bg-gray-900'}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold text-gray-100">{model.name}</h3>
                            {model.recommended && (
                              <Badge className="bg-green-600">Recommended</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mb-4">{model.provider}</p>
                          
                          <div className="space-y-2">
                            <div>
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-gray-400">Efficiency Score</span>
                                <span className="text-gray-100 font-medium">{model.efficiency}%</span>
                              </div>
                              <div className="w-full bg-gray-800 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    model.efficiency >= 90 ? 'bg-green-600' :
                                    model.efficiency >= 80 ? 'bg-blue-600' :
                                    'bg-yellow-600'
                                  }`}
                                  style={{ width: `${model.efficiency}%` }}
                                />
                              </div>
                            </div>
                            
                            {model.recommended && (
                              <p className="text-sm text-gray-300 mt-3">
                                This model provides the best balance of quality, speed, and cost for this prompt.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Card className="border-2 border-blue-800/50 bg-blue-900/10">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-blue-300">
                          Efficiency scores are calculated based on output quality, response time, 
                          and token usage. Scores above 85% are considered excellent.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-4 mt-6">
                {[
                  {
                    author: 'Emma Thompson',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
                    rating: 5,
                    date: '2 days ago',
                    comment: 'Excellent prompt! Saved me hours of work. The parametric templates are genius.'
                  },
                  {
                    author: 'Michael Chen',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
                    rating: 4,
                    date: '1 week ago',
                    comment: 'Really good, though I wish there were more customization options for advanced use cases.'
                  },
                  {
                    author: 'Sofia Martinez',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia',
                    rating: 5,
                    date: '2 weeks ago',
                    comment: 'Best purchase I\'ve made on this platform. The model recommendations are spot on!'
                  }
                ].map((review, idx) => (
                  <Card key={idx} className="border-2 border-gray-800 bg-gray-900">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Image
                          src={review.avatar}
                          alt={review.author}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-100 font-medium">{review.author}</span>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-gray-300">{review.comment}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details" className="space-y-4 mt-6">
                <Card className="border-2 border-gray-800 bg-gray-900">
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="text-sm text-gray-400 mb-1">License</h3>
                      <p className="text-gray-100 font-medium">{prompt.license}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-400 mb-1">Created</h3>
                      <p className="text-gray-100 font-medium">
                        {new Date(prompt.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-400 mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {prompt.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="border-gray-700 text-gray-400">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <Card className="border-2 border-indigo-600/50 sticky top-24 bg-gray-900">
              <CardContent className="p-6 space-y-4">
                <div>
                  <p className="text-3xl font-bold text-indigo-400">${prompt.price}</p>
                  <p className="text-sm text-gray-400">One-time purchase</p>
                </div>

                <Button className="w-full bg-indigo-600 hover:bg-indigo-700" size="lg">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Purchase Prompt
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-700 text-gray-300"
                    onClick={() => setLiked(!liked)}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                    {liked ? 'Liked' : 'Like'}
                  </Button>
                  <Button variant="outline" className="flex-1 border-gray-700 text-gray-300">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>

                <div className="pt-4 border-t border-gray-800 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-300">Lifetime access</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-300">Free updates</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-300">Commercial license</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-300">Creator support</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Creator Card */}
            <Card className="border-2 border-gray-800 bg-gray-900">
              <CardContent className="p-6">
                <h3 className="text-sm text-gray-400 mb-4">Created by</h3>
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src={prompt.creator.avatar}
                    alt={prompt.creator.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-100 font-medium">{prompt.creator.name}</span>
                      {prompt.creator.verified && (
                        <CheckCircle className="w-4 h-4 text-blue-400" />
                      )}
                    </div>
                    <p className="text-sm text-gray-400">Verified Creator</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full border-gray-700 text-gray-300">
                  View Profile
                </Button>
              </CardContent>
            </Card>

            {/* Recommended Model Highlight */}
            {recommendedModel && (
              <Card className="border-2 border-green-600/50 bg-gradient-to-br from-green-900/20 to-emerald-900/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <h3 className="text-green-100 font-bold">Best Model</h3>
                  </div>
                  <p className="text-2xl font-bold text-green-300 mb-1">{recommendedModel.name}</p>
                  <p className="text-sm text-green-400 mb-3">{recommendedModel.efficiency}% efficiency</p>
                  <p className="text-sm text-gray-300">
                    This model is optimized for this prompt and provides the best results.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
