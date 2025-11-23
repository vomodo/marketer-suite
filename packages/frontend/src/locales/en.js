/**
 * English translations
 */

export default {
  common: {
    buttons: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      submit: 'Submit',
      search: 'Search',
      export: 'Export',
      import: 'Import',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      confirm: 'Confirm',
      logout: 'Logout',
    },
    messages: {
      loading: 'Loading...',
      success: 'Success!',
      error: 'An error occurred',
      noData: 'No data available',
      confirmDelete: 'Are you sure you want to delete?',
    },
    labels: {
      email: 'Email',
      password: 'Password',
      search: 'Search',
      language: 'Language',
    },
  },
  
  auth: {
    login: {
      title: 'Login',
      subtitle: 'Enter your email to receive OTP code',
      emailPlaceholder: 'your@email.com',
      requestOtp: 'Request OTP',
      verifyOtp: 'Verify OTP',
      otpSent: 'OTP code has been sent to your email',
      otpPlaceholder: 'Enter 6 digits',
      resendOtp: 'Resend code',
    },
    errors: {
      invalidEmail: 'Invalid email',
      invalidOtp: 'Invalid OTP code',
      otpExpired: 'OTP code has expired',
      turnstileFailed: 'Security verification failed',
    },
  },
  
  dashboard: {
    title: 'Dashboard',
    greeting: 'Hello, {{name}}!',
    tier: {
      free: 'Free Tier',
      pro: 'Pro Tier',
      upgrade: 'Upgrade to Pro',
    },
  },
  
  navigation: {
    seoTools: 'SEO Tools',
    contentTools: 'Content Tools',
    settings: 'Settings',
    account: 'Account',
  },
  
  tools: {
    keywordResearch: {
      name: 'Keyword Research',
      description: 'Analyze keywords, density and competition',
      inputLabel: 'Enter keyword',
      inputPlaceholder: 'e.g: seo tools',
      analyze: 'Analyze',
      results: {
        density: 'Keyword Density',
        volume: 'Search Volume',
        competitorScore: 'Competition Score',
        lsiKeywords: 'Related Keywords',
      },
    },
    
    onpageSeo: {
      name: 'On-Page SEO Analyzer',
      description: 'Check meta tags, headers and schema markup',
      inputLabel: 'URL or HTML',
      analyze: 'Analyze SEO',
      score: 'SEO Score',
      issues: 'Issues',
      recommendations: 'Recommendations',
    },
    
    backlinkAnalyzer: {
      name: 'Backlink Analyzer',
      description: 'Analyze backlink profile and detect toxic links',
      uploadCsv: 'Upload CSV file',
      totalBacklinks: 'Total Backlinks',
      toxicLinks: 'Toxic Links',
      topDomains: 'Top Domains',
    },
    
    contentBrief: {
      name: 'Content Brief Generator',
      description: 'Generate outline based on SERP and NLP',
      keyword: 'Target Keyword',
      contentType: 'Content Type',
      generate: 'Generate Brief',
      outline: 'Suggested Outline',
      wordCount: 'Suggested Word Count',
      relatedTopics: 'Related Topics',
    },
    
    contentOptimizer: {
      name: 'Content Optimizer',
      description: 'Real-time feedback on content quality',
      editor: 'Editor',
      metrics: 'Metrics',
      contentScore: 'Content Score',
      readability: 'Readability',
      suggestions: 'Suggestions',
    },
    
    contentAudit: {
      name: 'Content Audit Tracker',
      description: 'Track performance and suggest updates',
      addContent: 'Add Content',
      url: 'URL',
      title: 'Title',
      lastUpdated: 'Last Updated',
      trafficScore: 'Traffic Score',
      needsRefresh: 'Needs Refresh',
    },
  },
  
  usage: {
    title: 'Usage Limits',
    used: 'Used',
    remaining: 'Remaining',
    resets: 'Resets on',
    upgradePrompt: 'Upgrade to Pro for unlimited usage',
  },
  
  payment: {
    title: 'Payment',
    tier: 'Tier',
    amount: 'Amount',
    bankTransfer: 'Bank Transfer',
    instructions: 'Payment Instructions',
    pending: 'Pending Verification',
    verified: 'Verified',
  },
};
