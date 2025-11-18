'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, X, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { domains, skillLevels } from '@/data/mockData';

interface Parameter {
  name: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  description: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

interface Model {
  name: string;
  provider: string;
  recommended: boolean;
}

export default function CreatorStudio() {
  const [step, setStep] = useState<'basic' | 'parameters' | 'models' | 'preview'>('basic');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('');
  const [category, setCategory] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [price, setPrice] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [template, setTemplate] = useState('');
  const [sampleOutput, setSampleOutput] = useState('');
  const [license, setLicense] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  
  const [newParam, setNewParam] = useState<Parameter>({
    name: '',
    type: 'text',
    description: '',
    required: true,
    placeholder: ''
  });

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const addParameter = () => {
    if (newParam.name && newParam.description) {
      setParameters([...parameters, { ...newParam }]);
      setNewParam({
        name: '',
        type: 'text',
        description: '',
        required: true,
        placeholder: ''
      });
    }
  };

  const removeParameter = (index: number) => {
    setParameters(parameters.filter((_, i) => i !== index));
  };

  const addModel = (modelName: string, provider: string) => {
    if (!models.find(m => m.name === modelName)) {
      setModels([...models, { name: modelName, provider, recommended: false }]);
    }
  };

  const toggleRecommended = (index: number) => {
    setModels(models.map((m, i) => ({
      ...m,
      recommended: i === index ? !m.recommended : false
    })));
  };

  const removeModel = (index: number) => {
    setModels(models.filter((_, i) => i !== index));
  };

  const generateTemplatePreview = () => {
    let preview = template;
    parameters.forEach(param => {
      preview = preview.replace(
        new RegExp(`{{${param.name}}}`, 'g'),
        `[${param.name}]`
      );
    });
    return preview;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Ensure all required fields are provided
      if (!title || !description || !domain || !template || !category) {
        setSubmitError('Please fill all required fields');
        return;
      }

      const response = await fetch('/api/prompts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          domain,
          category: category || domain,
          skillLevel,
          price: parseFloat(price) || 0,
          license: license || 'Commercial Use Allowed',
          tags,
          template,
          sampleOutput: sampleOutput || null,
          parameters: parameters.map(p => ({
            name: p.name,
            type: p.type,
            description: p.description,
            required: p.required,
            placeholder: p.placeholder || null,
            options: p.options || [],
          })),
          models: models.map(m => ({
            name: m.name,
            provider: m.provider,
            efficiency: 85,
            recommended: m.recommended,
          })),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create prompt');
      }

      const result = await response.json();
      
      // Reset form and redirect
      alert('Prompt submitted successfully! It will be reviewed by our team.');
      window.location.href = '/marketplace';
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit prompt');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    if (step === 'basic') {
      return title && description && domain && skillLevel && price && license;
    }
    if (step === 'parameters') {
      return parameters.length > 0 && template;
    }
    if (step === 'models') {
      return models.length > 0 && models.some(m => m.recommended);
    }
    return true;
  };

  const availableModels = [
    { name: 'GPT-4', provider: 'OpenAI' },
    { name: 'GPT-3.5 Turbo', provider: 'OpenAI' },
    { name: 'Claude 3 Opus', provider: 'Anthropic' },
    { name: 'Claude 3 Sonnet', provider: 'Anthropic' },
    { name: 'Gemini Pro', provider: 'Google' },
    { name: 'Llama 3', provider: 'Meta' }
  ];

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
                <Link href="/creator" className="text-indigo-400">
                  Creator Studio
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Creator Studio
          </h1>
          <p className="text-gray-400">
            Create and publish high-quality AI prompts with parametric templates
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[
              { id: 'basic', label: 'Basic Info' },
              { id: 'parameters', label: 'Parameters' },
              { id: 'models', label: 'Models' },
              { id: 'preview', label: 'Preview' }
            ].map((s, idx) => (
              <div key={s.id} className="flex items-center flex-1">
                <div
                  className={`flex items-center gap-2 cursor-pointer ${
                    step === s.id ? 'text-indigo-400' : 'text-gray-500'
                  }`}
                  onClick={() => setStep(s.id as 'basic' | 'parameters' | 'models' | 'preview')}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                      step === s.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span className="hidden md:block">{s.label}</span>
                </div>
                {idx < 3 && (
                  <div className="flex-1 h-0.5 bg-gray-800 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Basic Info Step */}
        {step === 'basic' && (
          <div className="space-y-6">
            <Card className="border-2 border-gray-800 bg-gray-900">
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-100">Basic Information</h2>
                <p className="text-sm text-gray-400">
                  Provide essential details about your prompt
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                  <Input
                    placeholder="e.g., Advanced Code Refactoring Assistant"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                  <Textarea
                    placeholder="Describe what your prompt does and its key benefits..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="bg-gray-800 border-gray-700 text-gray-100"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Domain *</label>
                    <Select value={domain} onValueChange={setDomain}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100">
                        <SelectValue placeholder="Select domain" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {domains.map(d => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                    <Input
                      placeholder="e.g., Code Optimization"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-gray-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Skill Level *</label>
                    <Select value={skillLevel} onValueChange={setSkillLevel}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {skillLevels.map(level => (
                          <SelectItem key={level} value={level}>
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Price (USD) *</label>
                    <Input
                      type="number"
                      placeholder="9.99"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      min="0"
                      step="0.01"
                      className="bg-gray-800 border-gray-700 text-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">License *</label>
                  <Select value={license} onValueChange={setLicense}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100">
                      <SelectValue placeholder="Select license" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="commercial">Commercial Use Allowed</SelectItem>
                      <SelectItem value="personal">Personal Use Only</SelectItem>
                      <SelectItem value="attribution">Commercial with Attribution</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Add a tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="bg-gray-800 border-gray-700 text-gray-100"
                    />
                    <Button onClick={addTag} variant="outline" className="border-gray-700 text-gray-300">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="gap-1 bg-gray-800 text-gray-300">
                        {tag}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-gray-100"
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Parameters Step */}
        {step === 'parameters' && (
          <div className="space-y-6">
            <Card className="border-2 border-gray-800 bg-gray-900">
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-100">Parametric Template</h2>
                <p className="text-sm text-gray-400">
                  Define parameters that users can customize
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add Parameter Form */}
                <div className="bg-gray-800 p-4 rounded-lg space-y-4 border border-gray-700">
                  <h3 className="text-sm font-medium text-gray-300">Add Parameter</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Parameter Name</label>
                      <Input
                        placeholder="e.g., language, topic"
                        value={newParam.name}
                        onChange={(e) => setNewParam({ ...newParam, name: e.target.value })}
                        className="bg-gray-900 border-gray-700 text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Type</label>
                      <Select
                        value={newParam.type}
                        onValueChange={(value: string) => setNewParam({ ...newParam, type: value as 'text' | 'number' | 'select' | 'textarea' })}
                      >
                        <SelectTrigger className="bg-gray-900 border-gray-700 text-gray-100">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="textarea">Text Area</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="select">Select</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Description</label>
                    <Input
                      placeholder="What does this parameter do?"
                      value={newParam.description}
                      onChange={(e) => setNewParam({ ...newParam, description: e.target.value })}
                      className="bg-gray-900 border-gray-700 text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Placeholder</label>
                    <Input
                      placeholder="Example value or hint"
                      value={newParam.placeholder}
                      onChange={(e) => setNewParam({ ...newParam, placeholder: e.target.value })}
                      className="bg-gray-900 border-gray-700 text-gray-100"
                    />
                  </div>
                  <Button onClick={addParameter} className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Parameter
                  </Button>
                </div>

                {/* Current Parameters */}
                {parameters.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-300">Parameters ({parameters.length})</h3>
                    {parameters.map((param, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-gray-800 border border-gray-700 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-gray-100 font-mono">{`{{${param.name}}}`}</span>
                            <Badge variant="outline" className="border-gray-700 text-gray-400">{param.type}</Badge>
                            {param.required && (
                              <Badge variant="secondary" className="bg-gray-700 text-gray-300">Required</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-400">{param.description}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeParameter(idx)}
                          className="text-gray-400 hover:text-gray-100"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Template */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Prompt Template *</label>
                  <p className="text-xs text-gray-500 mb-2">
                    Use {'{{'} and {'}'} to reference parameters (e.g., {'{'}{'{'} language {'}'}{'}'})
                  </p>
                  <Textarea
                    placeholder="Write your prompt template here. Use {{parameterName}} to insert parameter values."
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    rows={8}
                    className="bg-gray-800 border-gray-700 text-gray-100 font-mono"
                  />
                </div>

                {/* Template Preview */}
                {template && (
                  <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-700/50">
                    <h3 className="text-sm font-medium text-blue-300 mb-2">Template Preview</h3>
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                      {generateTemplatePreview()}
                    </pre>
                  </div>
                )}

                {/* Sample Output */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Sample Output (Optional)</label>
                  <Textarea
                    placeholder="Show an example of what this prompt generates..."
                    value={sampleOutput}
                    onChange={(e) => setSampleOutput(e.target.value)}
                    rows={6}
                    className="bg-gray-800 border-gray-700 text-gray-100"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Models Step */}
        {step === 'models' && (
          <div className="space-y-6">
            <Card className="border-2 border-gray-800 bg-gray-900">
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-100">Model Recommendations</h2>
                <p className="text-sm text-gray-400">
                  Specify which AI models work best with this prompt
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-300">
                        Select models that you&apos;ve tested and recommend for this prompt. 
                        Mark one as &quot;recommended&quot; for best results.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableModels.map(model => (
                    <Button
                      key={model.name}
                      variant="outline"
                      className="justify-start h-auto p-4 border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-indigo-600/50"
                      onClick={() => addModel(model.name, model.provider)}
                      disabled={models.some(m => m.name === model.name)}
                    >
                      <div className="text-left">
                        <p className="text-gray-100 font-medium">{model.name}</p>
                        <p className="text-sm text-gray-400">{model.provider}</p>
                      </div>
                    </Button>
                  ))}
                </div>

                {models.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-300">Selected Models ({models.length})</h3>
                    {models.map((model, idx) => (
                      <div
                        key={idx}
                        className={`p-4 border-2 rounded-lg ${
                          model.recommended
                            ? 'border-green-600/50 bg-green-900/10'
                            : 'border-gray-700 bg-gray-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-100 font-medium">{model.name}</p>
                            <p className="text-sm text-gray-400">{model.provider}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant={model.recommended ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => toggleRecommended(idx)}
                              className={model.recommended ? 'bg-green-600 hover:bg-green-700' : 'border-gray-700 text-gray-300'}
                            >
                              {model.recommended ? (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Recommended
                                </>
                              ) : (
                                'Set as Recommended'
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeModel(idx)}
                              className="text-gray-400 hover:text-gray-100"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Preview Step */}
        {step === 'preview' && (
          <div className="space-y-6">
            <Card className="border-2 border-indigo-600/50 bg-gray-900">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-100">Preview & Submit</h2>
                  <Badge className="bg-indigo-600">Ready to Publish</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-100 mb-2">{title}</h3>
                  <p className="text-gray-300">{description}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-indigo-600/20 text-indigo-400 border-indigo-600/30">{domain}</Badge>
                  {category && <Badge variant="outline" className="border-gray-700 text-gray-400">{category}</Badge>}
                  <Badge variant="outline" className="border-gray-700 text-gray-400 capitalize">{skillLevel}</Badge>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="bg-gray-800 text-gray-300">{tag}</Badge>
                    ))}
                  </div>
                )}

                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Parameters ({parameters.length})</h3>
                  <div className="space-y-2">
                    {parameters.map((param, idx) => (
                      <div key={idx} className="text-sm">
                        <span className="text-gray-100 font-mono">{`{{${param.name}}}`}</span>
                        <span className="text-gray-400"> - {param.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Template</h3>
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                    {generateTemplatePreview()}
                  </pre>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Recommended Models ({models.length})</h3>
                  <div className="space-y-2">
                    {models.map((model, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-gray-100">{model.name}</span>
                        {model.recommended && (
                          <Badge className="bg-green-600">Recommended</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Price</p>
                      <p className="text-2xl font-bold text-indigo-400">${price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">License</p>
                      <p className="text-gray-100 font-medium">{license}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-green-300">
                        Your prompt will be submitted for review. Once approved by our team, 
                        it will be published on the marketplace.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-800">
          <Button
            variant="outline"
            onClick={() => {
              const steps: Array<'basic' | 'parameters' | 'models' | 'preview'> = ['basic', 'parameters', 'models', 'preview'];
              const currentIndex = steps.indexOf(step);
              if (currentIndex > 0) {
                setStep(steps[currentIndex - 1]);
              }
            }}
            disabled={step === 'basic'}
            className="border-gray-700 text-gray-300"
          >
            Previous
          </Button>

          {step !== 'preview' ? (
            <Button
              onClick={() => {
                const steps: Array<'basic' | 'parameters' | 'models' | 'preview'> = ['basic', 'parameters', 'models', 'preview'];
                const currentIndex = steps.indexOf(step);
                if (currentIndex < steps.length - 1) {
                  setStep(steps[currentIndex + 1]);
                }
              }}
              disabled={!canProceed()}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              {isSubmitting ? 'Submitting...' : 'Submit for Review'}
            </Button>
          )}
        </div>

        {/* Error Message */}
        {submitError && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
            <p className="text-red-400 text-sm">{submitError}</p>
          </div>
        )}
      </div>
    </div>
  );
}
