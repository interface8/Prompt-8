export interface Prompt {
  id: string;
  title: string;
  description: string;
  domain: string;
  category: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  currency: string;
  creator: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  rating: number;
  reviewCount: number;
  purchaseCount: number;
  likes: number;
  tags: string[];
  models: {
    name: string;
    provider: string;
    efficiency: number;
    recommended: boolean;
  }[];
  parameters: {
    name: string;
    type: 'text' | 'number' | 'select' | 'textarea';
    description: string;
    required: boolean;
    options?: string[];
    placeholder?: string;
  }[];
  template: string;
  sampleOutput: string;
  license: string;
  featured: boolean;
  createdAt: string;
}

export const domains = [
  'Development',
  'Design',
  'Content Writing',
  'Data Analysis',
  'Video Production',
  'Productivity',
  'Marketing',
  'Research'
];

export const skillLevels = ['beginner', 'intermediate', 'advanced'];

export const prompts: Prompt[] = [
  {
    id: '1',
    title: 'Advanced Code Refactoring Assistant',
    description: 'Refactor legacy code into clean, modern patterns with best practices. Handles multiple languages and provides detailed explanations.',
    domain: 'Development',
    category: 'Code Optimization',
    skillLevel: 'advanced',
    price: 12.99,
    currency: 'USD',
    creator: {
      id: 'c1',
      name: 'Sarah Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      verified: true
    },
    rating: 4.8,
    reviewCount: 234,
    purchaseCount: 1420,
    likes: 892,
    tags: ['refactoring', 'clean-code', 'best-practices', 'code-review'],
    models: [
      { name: 'GPT-4', provider: 'OpenAI', efficiency: 92, recommended: true },
      { name: 'Claude 3 Opus', provider: 'Anthropic', efficiency: 89, recommended: false },
      { name: 'GPT-3.5 Turbo', provider: 'OpenAI', efficiency: 78, recommended: false }
    ],
    parameters: [
      {
        name: 'language',
        type: 'select',
        description: 'Programming language of the code',
        required: true,
        options: ['JavaScript', 'Python', 'Java', 'C++', 'Ruby', 'Go']
      },
      {
        name: 'code',
        type: 'textarea',
        description: 'The code you want to refactor',
        required: true,
        placeholder: 'Paste your code here...'
      },
      {
        name: 'focus',
        type: 'select',
        description: 'What to focus on during refactoring',
        required: false,
        options: ['Performance', 'Readability', 'Maintainability', 'Security']
      }
    ],
    template: 'Refactor the following {{language}} code with focus on {{focus}}:\n\n{{code}}\n\nProvide:\n1. Refactored code\n2. Explanation of changes\n3. Performance improvements',
    sampleOutput: '// Refactored JavaScript code with improved readability...',
    license: 'Commercial Use Allowed',
    featured: true,
    createdAt: '2024-10-15'
  },
  {
    id: '2',
    title: 'Product Description Generator',
    description: 'Create compelling, SEO-optimized product descriptions that drive conversions. Perfect for e-commerce.',
    domain: 'Content Writing',
    category: 'E-commerce',
    skillLevel: 'beginner',
    price: 4.99,
    currency: 'USD',
    creator: {
      id: 'c2',
      name: 'Marcus Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
      verified: true
    },
    rating: 4.6,
    reviewCount: 567,
    purchaseCount: 3240,
    likes: 1523,
    tags: ['e-commerce', 'seo', 'copywriting', 'marketing'],
    models: [
      { name: 'GPT-4', provider: 'OpenAI', efficiency: 88, recommended: true },
      { name: 'GPT-3.5 Turbo', provider: 'OpenAI', efficiency: 85, recommended: false }
    ],
    parameters: [
      {
        name: 'productName',
        type: 'text',
        description: 'Name of the product',
        required: true,
        placeholder: 'e.g., Wireless Noise-Cancelling Headphones'
      },
      {
        name: 'features',
        type: 'textarea',
        description: 'Key features and specifications',
        required: true,
        placeholder: 'List main features...'
      },
      {
        name: 'targetAudience',
        type: 'text',
        description: 'Who is this product for?',
        required: false,
        placeholder: 'e.g., busy professionals, fitness enthusiasts'
      },
      {
        name: 'tone',
        type: 'select',
        description: 'Tone of the description',
        required: false,
        options: ['Professional', 'Casual', 'Luxury', 'Technical']
      }
    ],
    template: 'Create an SEO-optimized product description for {{productName}}.\n\nFeatures: {{features}}\nTarget Audience: {{targetAudience}}\nTone: {{tone}}\n\nInclude: headline, description (150-200 words), key benefits, and call-to-action.',
    sampleOutput: 'Experience Audio Perfection: Premium Wireless Headphones...',
    license: 'Commercial Use Allowed',
    featured: true,
    createdAt: '2024-11-02'
  },
  {
    id: '3',
    title: 'UI/UX Component Designer',
    description: 'Generate detailed component specifications with accessibility guidelines and responsive design patterns.',
    domain: 'Design',
    category: 'UI Components',
    skillLevel: 'intermediate',
    price: 8.99,
    currency: 'USD',
    creator: {
      id: 'c3',
      name: 'Elena Rodriguez',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
      verified: true
    },
    rating: 4.9,
    reviewCount: 189,
    purchaseCount: 856,
    likes: 643,
    tags: ['ui-design', 'accessibility', 'components', 'figma'],
    models: [
      { name: 'GPT-4', provider: 'OpenAI', efficiency: 91, recommended: true },
      { name: 'Claude 3 Sonnet', provider: 'Anthropic', efficiency: 87, recommended: false }
    ],
    parameters: [
      {
        name: 'componentType',
        type: 'select',
        description: 'Type of component to design',
        required: true,
        options: ['Button', 'Form Input', 'Card', 'Navigation', 'Modal', 'Table']
      },
      {
        name: 'designSystem',
        type: 'text',
        description: 'Design system or style guide (optional)',
        required: false,
        placeholder: 'e.g., Material Design, iOS HIG'
      },
      {
        name: 'requirements',
        type: 'textarea',
        description: 'Specific requirements or use cases',
        required: true,
        placeholder: 'Describe what the component should do...'
      }
    ],
    template: 'Design a {{componentType}} component with these requirements:\n\n{{requirements}}\n\nDesign System: {{designSystem}}\n\nProvide: 1) Visual specs 2) States & interactions 3) Accessibility guidelines 4) Responsive behavior',
    sampleOutput: 'Component: Primary Action Button\nStates: Default, Hover, Active, Disabled, Loading...',
    license: 'Commercial Use Allowed',
    featured: true,
    createdAt: '2024-10-28'
  },
  {
    id: '4',
    title: 'Data Analysis Report Generator',
    description: 'Transform raw data into comprehensive analysis reports with visualizations and insights.',
    domain: 'Data Analysis',
    category: 'Reporting',
    skillLevel: 'intermediate',
    price: 9.99,
    currency: 'USD',
    creator: {
      id: 'c4',
      name: 'David Park',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
      verified: true
    },
    rating: 4.7,
    reviewCount: 312,
    purchaseCount: 1105,
    likes: 789,
    tags: ['data-analysis', 'reporting', 'visualization', 'insights'],
    models: [
      { name: 'GPT-4', provider: 'OpenAI', efficiency: 90, recommended: true },
      { name: 'Claude 3 Opus', provider: 'Anthropic', efficiency: 88, recommended: false }
    ],
    parameters: [
      {
        name: 'dataDescription',
        type: 'textarea',
        description: 'Describe your dataset',
        required: true,
        placeholder: 'e.g., Sales data from Q3 2024 across 5 regions...'
      },
      {
        name: 'analysisGoal',
        type: 'text',
        description: 'What do you want to learn?',
        required: true,
        placeholder: 'e.g., Identify growth opportunities'
      },
      {
        name: 'format',
        type: 'select',
        description: 'Report format',
        required: false,
        options: ['Executive Summary', 'Technical Report', 'Presentation Slides']
      }
    ],
    template: 'Analyze this data and create a {{format}}:\n\nData: {{dataDescription}}\nGoal: {{analysisGoal}}\n\nInclude: key findings, trends, visualizations recommendations, and actionable insights.',
    sampleOutput: 'Executive Summary: Q3 Sales Analysis\nKey Findings:\n1. 23% growth in Region A...',
    license: 'Commercial Use Allowed',
    featured: false,
    createdAt: '2024-11-05'
  },
  {
    id: '5',
    title: 'Social Media Content Calendar',
    description: 'Generate a month-long content calendar with engaging posts tailored to your brand and audience.',
    domain: 'Marketing',
    category: 'Social Media',
    skillLevel: 'beginner',
    price: 6.99,
    currency: 'USD',
    creator: {
      id: 'c5',
      name: 'Priya Sharma',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
      verified: true
    },
    rating: 4.5,
    reviewCount: 445,
    purchaseCount: 2134,
    likes: 1247,
    tags: ['social-media', 'content-strategy', 'marketing', 'planning'],
    models: [
      { name: 'GPT-4', provider: 'OpenAI', efficiency: 86, recommended: true },
      { name: 'GPT-3.5 Turbo', provider: 'OpenAI', efficiency: 83, recommended: false }
    ],
    parameters: [
      {
        name: 'brand',
        type: 'text',
        description: 'Your brand or business name',
        required: true,
        placeholder: 'e.g., EcoTech Solutions'
      },
      {
        name: 'industry',
        type: 'text',
        description: 'Your industry or niche',
        required: true,
        placeholder: 'e.g., sustainable technology'
      },
      {
        name: 'platforms',
        type: 'text',
        description: 'Social media platforms (comma-separated)',
        required: true,
        placeholder: 'e.g., Instagram, Twitter, LinkedIn'
      },
      {
        name: 'postFrequency',
        type: 'select',
        description: 'How often to post',
        required: false,
        options: ['Daily', '3x per week', '5x per week', 'Weekdays only']
      }
    ],
    template: 'Create a 30-day content calendar for {{brand}} in the {{industry}} industry.\n\nPlatforms: {{platforms}}\nFrequency: {{postFrequency}}\n\nInclude: post ideas, captions, hashtags, optimal posting times, and content themes.',
    sampleOutput: 'Week 1: Building Awareness\nDay 1 (Mon): "Did you know?" post about sustainability...',
    license: 'Commercial Use Allowed',
    featured: false,
    createdAt: '2024-11-08'
  },
  {
    id: '6',
    title: 'API Documentation Writer',
    description: 'Generate clear, comprehensive API documentation with examples and best practices.',
    domain: 'Development',
    category: 'Documentation',
    skillLevel: 'intermediate',
    price: 7.99,
    currency: 'USD',
    creator: {
      id: 'c1',
      name: 'Sarah Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      verified: true
    },
    rating: 4.7,
    reviewCount: 178,
    purchaseCount: 723,
    likes: 512,
    tags: ['documentation', 'api', 'technical-writing', 'developer-tools'],
    models: [
      { name: 'GPT-4', provider: 'OpenAI', efficiency: 93, recommended: true },
      { name: 'Claude 3 Sonnet', provider: 'Anthropic', efficiency: 90, recommended: false }
    ],
    parameters: [
      {
        name: 'apiName',
        type: 'text',
        description: 'Name of your API',
        required: true,
        placeholder: 'e.g., Payment Gateway API'
      },
      {
        name: 'endpoints',
        type: 'textarea',
        description: 'List your API endpoints',
        required: true,
        placeholder: 'e.g., POST /payments, GET /transactions/{id}'
      },
      {
        name: 'authMethod',
        type: 'select',
        description: 'Authentication method',
        required: false,
        options: ['API Key', 'OAuth 2.0', 'JWT', 'Basic Auth']
      }
    ],
    template: 'Create comprehensive documentation for {{apiName}}.\n\nEndpoints: {{endpoints}}\nAuthentication: {{authMethod}}\n\nInclude: overview, authentication, endpoints with examples, error codes, and rate limits.',
    sampleOutput: '# Payment Gateway API Documentation\n\n## Overview\nThe Payment Gateway API allows...',
    license: 'Commercial Use Allowed',
    featured: false,
    createdAt: '2024-10-22'
  },
  {
    id: '7',
    title: 'Video Script Generator',
    description: 'Create engaging video scripts with hooks, storytelling elements, and call-to-actions.',
    domain: 'Video Production',
    category: 'Scriptwriting',
    skillLevel: 'beginner',
    price: 5.99,
    currency: 'USD',
    creator: {
      id: 'c6',
      name: 'Alex Rivera',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      verified: false
    },
    rating: 4.4,
    reviewCount: 289,
    purchaseCount: 1567,
    likes: 934,
    tags: ['video', 'scriptwriting', 'storytelling', 'youtube'],
    models: [
      { name: 'GPT-4', provider: 'OpenAI', efficiency: 87, recommended: true },
      { name: 'Claude 3 Sonnet', provider: 'Anthropic', efficiency: 85, recommended: false }
    ],
    parameters: [
      {
        name: 'videoTopic',
        type: 'text',
        description: 'What is your video about?',
        required: true,
        placeholder: 'e.g., 5 productivity hacks for remote workers'
      },
      {
        name: 'duration',
        type: 'select',
        description: 'Video length',
        required: true,
        options: ['30 seconds', '1 minute', '3-5 minutes', '10+ minutes']
      },
      {
        name: 'platform',
        type: 'select',
        description: 'Platform for the video',
        required: false,
        options: ['YouTube', 'TikTok', 'Instagram Reels', 'LinkedIn']
      }
    ],
    template: 'Write a {{duration}} video script about "{{videoTopic}}" for {{platform}}.\n\nInclude: attention-grabbing hook, main content with transitions, and strong call-to-action.',
    sampleOutput: '[HOOK - 0:00-0:05]\n"Stop wasting 3 hours every day on these mistakes..."\n\n[INTRO - 0:05-0:15]...',
    license: 'Personal Use Only',
    featured: false,
    createdAt: '2024-11-10'
  },
  {
    id: '8',
    title: 'Email Campaign Optimizer',
    description: 'Optimize your email campaigns for higher open rates and conversions with A/B test suggestions.',
    domain: 'Marketing',
    category: 'Email Marketing',
    skillLevel: 'intermediate',
    price: 8.49,
    currency: 'USD',
    creator: {
      id: 'c7',
      name: 'Jessica Wu',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica',
      verified: true
    },
    rating: 4.8,
    reviewCount: 401,
    purchaseCount: 1876,
    likes: 1123,
    tags: ['email-marketing', 'optimization', 'conversion', 'a-b-testing'],
    models: [
      { name: 'GPT-4', provider: 'OpenAI', efficiency: 89, recommended: true },
      { name: 'GPT-3.5 Turbo', provider: 'OpenAI', efficiency: 84, recommended: false }
    ],
    parameters: [
      {
        name: 'campaignGoal',
        type: 'select',
        description: 'What is your campaign goal?',
        required: true,
        options: ['Generate Sales', 'Drive Traffic', 'Build Awareness', 'Nurture Leads']
      },
      {
        name: 'currentSubject',
        type: 'text',
        description: 'Your current subject line',
        required: true,
        placeholder: 'e.g., Check out our new products'
      },
      {
        name: 'audience',
        type: 'text',
        description: 'Target audience',
        required: false,
        placeholder: 'e.g., B2B decision makers'
      }
    ],
    template: 'Optimize this email campaign for {{campaignGoal}}.\n\nCurrent subject: {{currentSubject}}\nAudience: {{audience}}\n\nProvide: 5 subject line variations, email body structure, CTA recommendations, and A/B test suggestions.',
    sampleOutput: 'Subject Line Variations:\n1. [URGENT] {{audience}}, Don\'t Miss This...\n2. {{audience}}: Your Exclusive...',
    license: 'Commercial Use Allowed',
    featured: true,
    createdAt: '2024-11-01'
  }
];

export const categories = {
  'Development': ['Code Optimization', 'Documentation', 'Testing', 'Architecture'],
  'Design': ['UI Components', 'Branding', 'Icons', 'Layouts'],
  'Content Writing': ['E-commerce', 'Blog Posts', 'Technical Writing', 'Social Media'],
  'Data Analysis': ['Reporting', 'Visualization', 'Forecasting', 'Insights'],
  'Video Production': ['Scriptwriting', 'Editing', 'Storyboarding'],
  'Productivity': ['Planning', 'Automation', 'Organization'],
  'Marketing': ['Social Media', 'Email Marketing', 'SEO', 'Advertising'],
  'Research': ['Academic', 'Market Research', 'Literature Review']
};
