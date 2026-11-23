// Comprehensive Skill & Industry Keyword Taxonomy for ATS Analysis

const TECHNICAL_SKILLS = [
  // Programming Languages
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'c', 'ruby', 'go', 'golang',
  'rust', 'php', 'swift', 'kotlin', 'dart', 'scala', 'r', 'matlab', 'perl', 'shell', 'bash',
  
  // Frontend
  'react', 'react.js', 'reactjs', 'next.js', 'nextjs', 'vue', 'vue.js', 'vuejs', 'angular',
  'angularjs', 'svelte', 'html', 'html5', 'css', 'css3', 'tailwind', 'tailwind css', 'bootstrap',
  'sass', 'scss', 'redux', 'mobx', 'zustand', 'webpack', 'vite', 'graphql', 'apollo',
  
  // Backend & APIs
  'node.js', 'nodejs', 'express', 'express.js', 'nest.js', 'nestjs', 'fastapi', 'flask',
  'django', 'spring', 'spring boot', 'asp.net', '.net', 'laravel', 'ruby on rails', 'rails',
  'rest api', 'restful api', 'rest', 'soap', 'grpc', 'websocket', 'microservices',
  
  // Databases & Caching
  'mongodb', 'postgresql', 'postgres', 'mysql', 'sqlite', 'redis', 'elasticsearch', 'dynamodb',
  'cassandra', 'mariadb', 'oracle', 'neo4j', 'firebase', 'supabase', 'prisma', 'mongoose', 'sequelize',
  
  // Cloud & DevOps
  'aws', 'amazon web services', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'k8s',
  'jenkins', 'github actions', 'gitlab ci', 'terraform', 'ansible', 'helm', 'nginx', 'apache',
  'ci/cd', 'devops', 'linux', 'serverless', 'lambda',
  
  // AI, ML & Data Science
  'machine learning', 'deep learning', 'artificial intelligence', 'nlp', 'natural language processing',
  'computer vision', 'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy', 'keras',
  'opencv', 'llm', 'generative ai', 'data analysis', 'data science', 'tableau', 'power bi',
  
  // Testing & Quality
  'jest', 'mocha', 'chai', 'cypress', 'selenium', 'playwright', 'unit testing', 'integration testing',
  'tdd', 'bdd', 'postman',
  
  // Version Control & Methodologies
  'git', 'github', 'gitlab', 'bitbucket', 'jira', 'agile', 'scrum', 'kanban', 'sdlc',
  'system design', 'object oriented programming', 'oop', 'data structures', 'algorithms'
];

const SOFT_SKILLS = [
  'communication', 'leadership', 'teamwork', 'collaboration', 'problem solving',
  'critical thinking', 'time management', 'adaptability', 'flexibility', 'creativity',
  'work ethic', 'emotional intelligence', 'conflict resolution', 'decision making',
  'project management', 'attention to detail', 'presentation skills', 'interpersonal skills',
  'negotiation', 'analytical thinking', 'ownership', 'mentorship', 'client relations'
];

const ACTION_VERBS = [
  'spearheaded', 'engineered', 'developed', 'architected', 'implemented', 'designed',
  'optimized', 'accelerated', 'orchestrated', 'built', 'created', 'deployed',
  'streamlined', 'transformed', 'enhanced', 'automated', 'integrated', 'delivered',
  'achieved', 'managed', 'led', 'mentored', 'reduced', 'increased', 'maximized',
  'minimized', 'formulated', 'directed', 'authored', 'revamped', 'scaled'
];

// Map common synonyms to canonical skill name
const SYNONYMS = {
  'reactjs': 'react',
  'react.js': 'react',
  'nextjs': 'next.js',
  'nodejs': 'node.js',
  'node': 'node.js',
  'golang': 'go',
  'js': 'javascript',
  'ts': 'typescript',
  'postgres': 'postgresql',
  'amazon web services': 'aws',
  'google cloud platform': 'gcp',
  'google cloud': 'gcp',
  'k8s': 'kubernetes',
  'restful': 'rest api',
  'restful apis': 'rest api',
  'rest apis': 'rest api',
  'rest': 'rest api',
  'mongo': 'mongodb',
  'tailwind': 'tailwind css',
  'tailwind-css': 'tailwind css',
  'ml': 'machine learning',
  'ai': 'artificial intelligence',
  'ci / cd': 'ci/cd',
  'cicd': 'ci/cd',
  'continuous integration': 'ci/cd',
  'git hub': 'github',
  'system architecture': 'system design',
  'team player': 'teamwork',
  'public speaking': 'presentation skills',
};

module.exports = {
  TECHNICAL_SKILLS,
  SOFT_SKILLS,
  ACTION_VERBS,
  SYNONYMS,
};
