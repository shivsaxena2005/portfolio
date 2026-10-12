export const projects = [
  {
    n: '01',
    title: 'Agrisense',
    tag: 'AI / ML',
    year: '2025',
    desc: 'CNN that spots crop diseases from a leaf photo, then explains the fix through a voice chatbot built for farmers.',
    theory: 'Farmers often can\'t identify a plant disease early, and by the time an expert looks, the damage is done. Agrisense takes a leaf photo, resizes and normalises it, and passes it through a convolutional neural network trained on labelled disease images. The network learns visual patterns like spots, discolouration and texture, and outputs the most likely disease with a confidence score. A Flask backend serves the model, and a voice chatbot then explains the cause and treatment in simple language.',
    stack: ['Python', 'TensorFlow', 'Flask'],
    link: 'https://github.com/shivsaxena2005/agrisense.git',
  },
  {
    n: '02',
    title: 'Image Understanding App',
    tag: 'AI / ML',
    year: '2025',
    desc: 'Upload an image, get a title and description back. Auth and database-backed storage included.',
    theory: 'This is an image captioning idea: a vision model extracts features from the picture, and a language component turns those features into a title and a short description. The Flask app handles user login, receives the upload, runs inference, and saves the image and its generated text in a SQL database, so every user gets their own history. It taught me how to connect an ML model to a real product with auth and storage around it.',
    stack: ['Flask', 'ML', 'SQL'],
    link: 'https://github.com/shivsaxena2005/Dream_Team_Tech.git',
  },
  {
    n: '03',
    title: 'ML Model Explorer',
    tag: 'AI / ML',
    year: '2025',
    desc: 'A place to learn and test trained TensorFlow models, with a dashboard and user verification.',
    theory: 'Most ML models live inside notebooks where nobody can try them. This app wraps trained TensorFlow models behind a secure Flask interface: users sign up, verify their account, and then test models through a dashboard. SQLAlchemy manages users and records, and the verification flow keeps the model endpoints from being open to anyone. It is a small example of model serving: training, packaging, exposing and protecting a model.',
    stack: ['Flask', 'TensorFlow', 'SQLAlchemy'],
    // TODO: swap in the real repo link if this isn't the right one
    link: 'https://github.com/shivsaxena2005/-Secure-Flask-App-with-AI-Agent-and-User-Verification.git',
  },
  {
    n: '04',
    title: 'This Portfolio',
    tag: 'Web',
    year: '2026',
    desc: 'The site you are on: a React front end, a Node backend for the contact form, and live data from the GitHub API.',
    theory: 'The page is built with React and Vite and styled with SCSS. The contact form posts to a small Node function that emails me through Gmail, and the Recent code section reads my public repositories from the GitHub API. It is deployed on Netlify, which builds the site and runs the contact function.',
    stack: ['React', 'Vite', 'SCSS', 'Node.js', 'Netlify'],
    // TODO: add this site's GitHub repo link, e.g. 'https://github.com/shivsaxena2005/<repo>'. Until then no source button shows.
    link: null,
  },
];

export const jobs = [
  { when: 'May 2026 \u2013 now', role: 'Intern, SpanIdea Systems', note: 'On-site in Jodhpur. FastAPI, React, and autonomous-driving tooling.' },
  { when: 'Dec 2025 \u2013 Feb 2026', role: 'AI & DS Intern, DreamTeam Technologies', note: 'Built an image understanding app with Flask and ML.' },
  { when: 'Nov \u2013 Dec 2025', role: 'Azure AI Training, RCAT', note: '62 badges and 12 trophies building AI solutions on Azure.' },
];

export const stack = {
  'Frontend': ['JavaScript', 'React', 'SCSS', 'HTML/CSS'],
  'Backend': ['Node.js', 'Express', 'FastAPI', 'Flask', 'SQL'],
  'AI / ML': ['Python', 'TensorFlow', 'Machine Learning', 'Deep Learning'],
  'Generative AI': ['Gen AI', 'RAG (retrieval-augmented generation)', 'LangChain', 'LangGraph', 'MCP (Model Context Protocol)', 'Agentic AI'],
  'Dev tools': ['Git', 'GitHub', 'VS Code', 'Netlify'],
};

export const education = [
  { when: '2023 \u2013 2027', title: 'B.Tech, AI & ML', place: 'Jodhpur Institute of Engineering and Technology', note: 'Final year, in progress.' },
  { when: '2022', title: 'Class 12', place: 'K. S. Public Sen. Sec. School', note: '100/100 in Maths.' },
  { when: '2020', title: 'Class 10', place: 'Nehru Adarsh Vidhya Mandir', note: '100/100 in Maths.' },
];

export const wins = [
  '100/100 in Maths, both Class 10 and 12 boards',
  'Qualified GATE 2026 (Data Science & AI paper)',
  'TCS CodeVita, Round 1 cleared',
  'Merit seat under the Tuition Fee Waiver Scheme (TFWS)',
];

// Files live in public/certs/. The `file` name must match exactly (spaces are fine).
// Images (jpg/png/webp) open in a lightbox, PDFs open in a new tab. `year` is optional.
export const certs = [
  { title: 'Quantum Computing', issuer: 'C-DAC', file: 'CDAC_Quantam_Computing_Certificate.pdf' },
  { title: 'Python Coder', issuer: 'Kaggle', file: 'Python Coder_kaggle_Certificate.png' },
  { title: 'Problem Solving (Basic)', issuer: 'HackerRank', file: 'problem_solving_basic certificate_hackerRank.pdf' },
  { title: 'Python (Basic)', issuer: 'HackerRank', file: 'python_basic certificate_hackerrank.pdf' },
];

// Read after "I'm" in the hero, so each one carries its own article.
export const roles = ['a full-stack developer', 'an AI / ML builder', 'a React + Node developer', 'GATE DA 2026 qualified'];

// Repos shown under "Recent code". Add exact GitHub repo names here to pin them.
// While this list is empty, the 3rd and 6th most recently updated repos are shown (the old behaviour).
export const featuredRepos = [];

// Skills that open a proof-of-concept image when clicked. Key = skill name in `stack`, file lives in public/.
export const pocs = {
  'Machine Learning': 'Machine_Learning_Poc.png',
  'Deep Learning': 'Deep_Learning_Poc.png',
  'Gen AI': 'Generative_AI_Poc.png',
  'Flask': 'Flask_Poc.png',
};
