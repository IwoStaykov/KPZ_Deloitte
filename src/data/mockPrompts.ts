import { Prompt, TeamMember } from '../types/interfaces';

export const prompts: Prompt[] = [
  {
    id: '1',
    title: 'SEO Blog Post Generator',
    description: 'Create SEO-optimized blog posts with proper headings, keywords, and meta descriptions.',
    tags: ['SEO', 'Content', 'Blog'],
    author: 'John Doe',
    date: '2 days ago',
    usageCount: 3457,
    promptContent: `I want you to act as a professional content writer and SEO expert...`,
    history: [
      {
        version: 1,
        date: '10 days ago',
        changes: 'Initial version',
        content: `I want you to act as a content writer and SEO expert...`
      },
      {
        version: 2,
        date: '7 days ago',
        changes: 'Added more structure and details',
        content: `I want you to act as a professional content writer...`
      },
      {
        version: 3,
        date: '2 days ago',
        changes: 'Expanded requirements and added more details',
        content: `I want you to act as a professional content writer and SEO expert...`
      }
    ]
  },
  {
    id: '2',
    title: 'Code Refactoring Assistant',
    description: 'Helps refactor code for better readability, efficiency, and adherence to best practices.',
    tags: ['Coding', 'DevTools', 'Refactoring'],
    author: 'Jane Smith',
    date: '5 days ago',
    usageCount: 2145,
    promptContent: `As a code refactoring expert, please help me improve the following code...`,
    history: [
      {
        version: 1,
        date: '12 days ago',
        changes: 'Initial version',
        content: `As a code reviewer, please help me improve this code...`
      },
      {
        version: 2,
        date: '5 days ago',
        changes: 'More detailed requirements and structure',
        content: `As a code refactoring expert, please help me improve...`
      }
    ]
  },
  {
    id: '3',
    title: 'UI/UX Feedback Expert',
    description: 'Provides detailed feedback on UI/UX designs with actionable improvement suggestions.',
    tags: ['Design', 'UI/UX', 'Feedback'],
    author: 'Alex Johnson',
    date: '1 week ago',
    usageCount: 1873,
    promptContent: `Act as a senior UI/UX design consultant with 15+ years of experience...`,
    history: [
      {
        version: 1,
        date: '3 weeks ago',
        changes: 'Initial version',
        content: `Act as a UI/UX designer. Review my design...`
      },
      {
        version: 2,
        date: '2 weeks ago',
        changes: 'Added more specific feedback points',
        content: `Act as a UI/UX design consultant. I'm going to show you a design...`
      },
      {
        version: 3,
        date: '1 week ago',
        changes: 'Comprehensive rewrite with detailed structure',
        content: `Act as a senior UI/UX design consultant with 15+ years of experience...`
      }
    ]
  }
];

export const initialTeamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'leader',
    avatar: 'https://via.placeholder.com/40',
    joinDate: '3 months ago'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'member',
    avatar: 'https://via.placeholder.com/40',
    joinDate: '2 months ago'
  },
  {
    id: 3,
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    role: 'member',
    avatar: 'https://via.placeholder.com/40',
    joinDate: '1 month ago'
  }
];
