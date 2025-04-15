import { Prompt, TeamMember } from '../types/interfaces';

/**
 * Przykładowe dane promptów
 */
export const prompts: Prompt[] = [
  {
    id: 1,
    title: "SEO Blog Post Generator",
    description: "Create SEO-optimized blog posts with proper headings, keywords, and meta descriptions.",
    tags: ["SEO", "Content", "Blog"],
    author: "John Doe",
    date: "2 days ago",
    usageCount: 3457,
    promptContent: "I want you to act as a professional content writer and SEO expert. Create a comprehensive blog post about TOPIC that is optimized for SEO. Your blog post should include:\n\n1. An attention-grabbing headline with the target keyword KEYWORD\n2. A compelling introduction that engages the reader and sets up the topic\n3. At least 5 sections with H2 headings that cover different aspects of the topic\n4. 1-2 H3 subheadings under each H2 section for better organization\n5. Naturally incorporated related keywords: RELATED KEYWORD 1, RELATED KEYWORD 2, RELATED KEYWORD 3\n6. A minimum of 1,500 words of valuable, informative content\n7. Practical examples, case studies, or statistics to support main points\n8. A conclusion that summarizes key takeaways and includes a call-to-action\n9. 3 FAQs about the topic with detailed answers\n10. Meta description of 150-160 characters that includes the main keyword and entices clicks\n\nFormat the content in Markdown. Make the content engaging, authoritative, and valuable to readers while ensuring it follows SEO best practices.",
    history: [
      {
        version: 1,
        date: "10 days ago",
        changes: "Initial version",
        content: "I want you to act as a content writer and SEO expert. Create a blog post about TOPIC optimized for SEO. Your blog post should include:\n\n1. A headline with the keyword KEYWORD\n2. An introduction\n3. 3-4 sections with headings\n4. Related keywords\n5. A conclusion with call-to-action\n6. 2 FAQs\n\nFormat in Markdown."
      },
      {
        version: 2,
        date: "7 days ago",
        changes: "Added more structure and details",
        content: "I want you to act as a professional content writer and SEO expert. Create a blog post about TOPIC that is optimized for SEO. Your blog post should include:\n\n1. A headline with the target keyword KEYWORD\n2. An introduction that engages the reader\n3. At least 4 sections with H2 headings\n4. Related keywords: RELATED KEYWORD 1, RELATED KEYWORD 2\n5. About 1,000 words of content\n6. Examples or statistics\n7. A conclusion with a call-to-action\n8. 2 FAQs about the topic\n9. Meta description\n\nFormat in Markdown."
      },
      {
        version: 3,
        date: "2 days ago",
        changes: "Expanded requirements and added more details",
        content: "I want you to act as a professional content writer and SEO expert. Create a comprehensive blog post about TOPIC that is optimized for SEO. Your blog post should include:\n\n1. An attention-grabbing headline with the target keyword KEYWORD\n2. A compelling introduction that engages the reader and sets up the topic\n3. At least 5 sections with H2 headings that cover different aspects of the topic\n4. 1-2 H3 subheadings under each H2 section for better organization\n5. Naturally incorporated related keywords: RELATED KEYWORD 1, RELATED KEYWORD 2, RELATED KEYWORD 3\n6. A minimum of 1,500 words of valuable, informative content\n7. Practical examples, case studies, or statistics to support main points\n8. A conclusion that summarizes key takeaways and includes a call-to-action\n9. 3 FAQs about the topic with detailed answers\n10. Meta description of 150-160 characters that includes the main keyword and entices clicks\n\nFormat the content in Markdown. Make the content engaging, authoritative, and valuable to readers while ensuring it follows SEO best practices."
      }
    ]
  },
  {
    id: 2,
    title: "Code Refactoring Assistant",
    description: "Helps refactor code for better readability, efficiency, and adherence to best practices.",
    tags: ["Coding", "DevTools", "Refactoring"],
    author: "Jane Smith",
    date: "5 days ago",
    usageCount: 2145,
    promptContent: "As a code refactoring expert, please help me improve the following code for LANGUAGE. My code:\n\n``````\n\nPlease refactor this code to:\n1. Improve readability\n2. Enhance performance where possible\n3. Follow LANGUAGE best practices and design patterns\n4. Reduce redundancy and improve code organization\n5. Add appropriate error handling\n6. Include helpful comments explaining complex parts\n\nFor each change you make, please explain your reasoning and the benefits of the improvement.",
    history: [
      {
        version: 1,
        date: "12 days ago",
        changes: "Initial version",
        content: "As a code reviewer, please help me improve this code:\n\n``````\n\nMake it more readable and fix any issues."
      },
      {
        version: 2,
        date: "5 days ago",
        changes: "More detailed requirements and structure",
        content: "As a code refactoring expert, please help me improve the following code for LANGUAGE. My code:\n\n``````\n\nPlease refactor this code to:\n1. Improve readability\n2. Enhance performance where possible\n3. Follow LANGUAGE best practices and design patterns\n4. Reduce redundancy and improve code organization\n5. Add appropriate error handling\n6. Include helpful comments explaining complex parts\n\nFor each change you make, please explain your reasoning and the benefits of the improvement."
      }
    ]
  },
  {
    id: 3,
    title: "UI/UX Feedback Expert",
    description: "Provides detailed feedback on UI/UX designs with actionable improvement suggestions.",
    tags: ["Design", "UI/UX", "Feedback"],
    author: "Alex Johnson",
    date: "1 week ago",
    usageCount: 1873,
    promptContent: "Act as a senior UI/UX design consultant with 15 years of experience. I'm going to show you a design for PRODUCT/WEBSITE/APP and I'd like you to provide detailed, professional feedback. For your analysis, please include:\n\n1. First impressions: visual hierarchy, clarity of purpose, branding\n2. User flow analysis: evaluate how intuitive the navigation and interactions are\n3. Specific UI element feedback: color scheme, typography, spacing, element sizing\n4. Accessibility considerations: contrast, text size, keyboard navigation, screen reader compatibility\n5. Mobile responsiveness (if applicable)\n6. 3-5 highest priority recommendations for improvement\n7. 2-3 strengths of the current design that should be preserved\n\nFor each critique point, please suggest a specific, actionable improvement. Balance your feedback with both positive elements and areas for improvement.",
    history: [
      {
        version: 1,
        date: "3 weeks ago",
        changes: "Initial version",
        content: "Act as a UI/UX designer. Review my design for PRODUCT and give me feedback on:\n1. Visual design\n2. Usability\n3. Suggestions for improvement"
      },
      {
        version: 2,
        date: "2 weeks ago",
        changes: "Added more specific feedback points",
        content: "Act as a UI/UX design consultant. I'm going to show you a design for PRODUCT/WEBSITE/APP and I'd like your feedback. Please review:\n1. Visual hierarchy\n2. User flow\n3. Color scheme and typography\n4. Accessibility\n5. Recommendations for improvement"
      },
      {
        version: 3,
        date: "1 week ago",
        changes: "Comprehensive rewrite with detailed structure",
        content: "Act as a senior UI/UX design consultant with 15 years of experience. I'm going to show you a design for PRODUCT/WEBSITE/APP and I'd like you to provide detailed, professional feedback. For your analysis, please include:\n\n1. First impressions: visual hierarchy, clarity of purpose, branding\n2. User flow analysis: evaluate how intuitive the navigation and interactions are\n3. Specific UI element feedback: color scheme, typography, spacing, element sizing\n4. Accessibility considerations: contrast, text size, keyboard navigation, screen reader compatibility\n5. Mobile responsiveness (if applicable)\n6. 3-5 highest priority recommendations for improvement\n7. 2-3 strengths of the current design that should be preserved\n\nFor each critique point, please suggest a specific, actionable improvement. Balance your feedback with both positive elements and areas for improvement."
      }
    ]
  },
  {
    id: 4,
    title: "Marketing Email Generator",
    description: "Creates compelling marketing emails with attention-grabbing subject lines and persuasive copy.",
    tags: ["Marketing", "Email", "Content"],
    author: "Sarah Williams",
    date: "2 weeks ago",
    usageCount: 1542,
    promptContent: "Create a marketing email for PRODUCT that will drive conversions. The email should include:\n\n1. An attention-grabbing subject line (provide 3 options)\n2. A personalized greeting\n3. A compelling opening paragraph that highlights a pain point or desire\n4. 3-4 paragraphs of persuasive copy that emphasizes benefits, not just features\n5. At least one customer testimonial or social proof element\n6. A clear, compelling call-to-action (repeated 2-3 times throughout)\n7. A sense of urgency or scarcity (limited time offer, limited quantity, etc.)\n8. Professional closing with contact information\n\nTarget audience: TARGET_AUDIENCE\nKey selling points: SELLING_POINT_1, SELLING_POINT_2, SELLING_POINT_3\nCurrent promotion: PROMOTION\n\nThe tone should be professional yet conversational, and the email should be formatted for easy scanning with short paragraphs, bullet points where appropriate, and strategic use of bold text for emphasis.",
    history: []
  },
  {
    id: 5,
    title: "Data Analysis Report Generator",
    description: "Creates comprehensive data analysis reports with insights and visualizations.",
    tags: ["Data", "Analysis", "Business"],
    author: "Michael Chen",
    date: "3 weeks ago",
    usageCount: 987,
    promptContent: "Act as a data analyst and create a comprehensive analysis report based on the following data:\n\n[INSERT_DATA_HERE]\n\nYour report should include:\n\n1. Executive Summary: A brief overview of the key findings and recommendations\n2. Introduction: Background information and objectives of the analysis\n3. Methodology: Explanation of the analytical approaches and techniques used\n4. Data Overview: Description of the dataset, including variables, time period, and any data quality issues\n5. Exploratory Data Analysis:\n   - Summary statistics\n   - Distribution analysis\n   - Correlation analysis\n   - Trend analysis (if time-series data)\n6. Key Insights: At least 5 significant findings from the data\n7. Visualizations: Describe 3-4 visualizations that would effectively represent the data (charts, graphs, etc.)\n8. Recommendations: At least 3 actionable recommendations based on the insights\n9. Limitations: Any constraints or limitations of the analysis\n10. Next Steps: Suggestions for further analysis or data collection\n\nFormat the report in a professional manner with clear section headings and concise language. Use bullet points and numbering where appropriate for readability.",
    history: []
  },
  {
    id: 6,
    title: "Product Description Writer",
    description: "Creates compelling product descriptions for e-commerce that drive conversions.",
    tags: ["Marketing", "E-commerce", "Content"],
    author: "Emily Rodriguez",
    date: "1 month ago",
    usageCount: 2356,
    promptContent: "Create a compelling product description for the following item that will maximize conversions on an e-commerce platform:\n\nProduct: [PRODUCT_NAME]\nCategory: [CATEGORY]\nTarget audience: [TARGET_AUDIENCE]\nKey features: [FEATURE_1], [FEATURE_2], [FEATURE_3], [FEATURE_4]\nKey benefits: [BENEFIT_1], [BENEFIT_2], [BENEFIT_3]\nPrice point: [PRICE_POINT] (budget/mid-range/premium)\nBrand voice: [BRAND_VOICE] (professional/casual/luxury/technical/friendly)\n\nThe product description should include:\n\n1. An attention-grabbing headline (under 70 characters)\n2. A compelling opening paragraph that hooks the reader\n3. Feature-benefit pairings (don't just list features, explain why they matter)\n4. Sensory words that help the customer imagine using the product\n5. Technical specifications formatted in an easy-to-scan bullet list\n6. Social proof element or use case scenario\n7. A clear call-to-action\n\nThe description should be between 250-300 words (excluding technical specifications), SEO-friendly with natural keyword inclusion, and formatted for easy scanning with short paragraphs and strategic use of bold text.",
    history: []
  }
];

/**
 * Przykładowe dane członków zespołu
 */
export const initialTeamMembers: TeamMember[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "leader",
    avatar: "https://via.placeholder.com/40",
    joinDate: "3 months ago"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "member",
    avatar: "https://via.placeholder.com/40",
    joinDate: "2 months ago"
  },
  {
    id: 3,
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    role: "member",
    avatar: "https://via.placeholder.com/40",
    joinDate: "1 month ago"
  },
  {
    id: 4,
    name: "Maria Garcia",
    email: "maria.garcia@example.com",
    role: "member",
    avatar: "https://via.placeholder.com/40",
    joinDate: "3 weeks ago"
  },
  {
    id: 5,
    name: "David Kim",
    email: "david.kim@example.com",
    role: "member",
    avatar: "https://via.placeholder.com/40",
    joinDate: "2 weeks ago"
  }
];
