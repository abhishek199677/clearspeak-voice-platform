// Content for every footer link that has no dedicated product page.
// Keyed by hash route path (see readRoute in App.jsx).

export const INFO_PAGES = {
  // ── Use Cases ────────────────────────────────────────────────
  '/use-cases/customer-support': {
    kicker: 'Use Cases',
    title: 'Customer Support',
    blurb:
      'Voice agents that resolve tickets instead of just routing them — across phone, web and WhatsApp.',
    points: [
      '80%+ of routine tickets resolved end-to-end without a human',
      'Sub-2-second answers, 24/7, in 22 Indian languages and 200+ global ones',
      'Warm handoff to a human with full context plus a post-call summary',
    ],
  },
  '/use-cases/sales': {
    kicker: 'Use Cases',
    title: 'Sales',
    blurb:
      'Outbound and inbound voice that qualifies leads, books meetings and follows up — while your reps close.',
    points: [
      'AI dialers qualify and score leads before a rep ever picks up',
      'Instant voice follow-ups and appointment booking in the buyer’s language',
      'Every call transcribed, scored and synced back to your CRM',
    ],
  },
  '/use-cases/marketing': {
    kicker: 'Use Cases',
    title: 'Marketing',
    blurb:
      'Launch multilingual voice campaigns that sound like your brand in every market.',
    points: [
      'Clone the brand voice once, localize campaign audio everywhere',
      'Personalized voice messages at list scale — no studio time',
      'Real-time sentiment signals from every listener to steer creative',
    ],
  },
  '/use-cases/onboarding': {
    kicker: 'Use Cases',
    title: 'Onboarding',
    blurb:
      'First-week experiences that speak every new hire’s language, on any device.',
    points: [
      'Voice-guided walkthroughs of tools, policies and workflows',
      '24/7 answers to new-hire questions in their own language',
      'Progress tracked automatically, with nudges when momentum drops',
    ],
  },
  '/use-cases/healthcare': {
    kicker: 'Use Cases',
    title: 'Healthcare',
    blurb:
      'HIPAA-ready voice documentation for clinics, hospitals and telemedicine.',
    points: [
      'Dictation turned into structured clinical notes in seconds',
      'Patient intake and appointment reminders in 22 Indian languages',
      'Zero data retention for audio and transcripts by default',
    ],
  },
  '/use-cases/education': {
    kicker: 'Use Cases',
    title: 'Education',
    blurb:
      'Tutors and lessons that answer every student, any time, in their language.',
    points: [
      'Voice tutors for exam prep across regional and global languages',
      'Auto-transcribed lectures turned into revision audio',
      'Built-in accessibility: sign language and captioned video',
    ],
  },

  // ── Resources ────────────────────────────────────────────────
  '/resources/documentation': {
    kicker: 'Resources',
    title: 'Documentation',
    blurb:
      'Guides for every product, from your first API call to a production rollout.',
    points: [
      'Quickstarts for speech-to-text, text-to-speech, translation and agents',
      'Step-by-step SDK guides for JavaScript, Python and mobile',
      'Architecture, latency tuning and deployment playbooks',
    ],
  },
  '/resources/blog': {
    kicker: 'Resources',
    title: 'Blog',
    blurb: 'Engineering notes, benchmarks and product news from the ClearSpeak team.',
    points: [
      'Latency and accuracy benchmarks on real Indian-language traffic',
      'Product release write-ups and architecture deep dives',
      'Field stories from customer deployments',
    ],
  },
  '/resources/case-studies': {
    kicker: 'Resources',
    title: 'Case Studies',
    blurb: 'How teams cut cost and latency with ClearSpeak — with the numbers.',
    points: [
      'Contact-center deployments measured on handle time and CSAT',
      'Regulated-industry rollouts in healthcare and finance',
      'Migrations from legacy IVR and telephony stacks',
    ],
  },
  '/resources/whitepapers': {
    kicker: 'Resources',
    title: 'Whitepapers',
    blurb: 'Deep dives on architecture, security and the economics of voice AI.',
    points: [
      'Real-time voice pipelines that hold sub-300ms end to end',
      'Zero data retention, encryption and key management',
      'TCO models compared against human-only operations',
    ],
  },
  '/resources/webinars': {
    kicker: 'Resources',
    title: 'Webinars',
    blurb: 'Live sessions with our engineers, designers and customers.',
    points: [
      'Hands-on builder workshops with sample apps',
      'Quarterly roadmap sessions with the product team',
      'On-demand recording published after every event',
    ],
  },
  '/resources/status': {
    kicker: 'Resources',
    title: 'System Status',
    blurb: 'Live health of the ClearSpeak API — checked the moment this page loads.',
    points: [
      'API and WebSocket streaming endpoints monitored continuously',
      'Incident history and post-mortems published here',
      'Subscribe for updates when anything degrades',
    ],
    status: true,
  },
  '/resources/developer-hub': {
    kicker: 'Resources',
    title: 'Developer Hub',
    blurb: 'Everything you need to ship: keys, SDKs, samples and the OpenAPI spec.',
    points: [
      'API keys, webhook configuration and sandbox environments',
      'Sample apps and starter repos for common voice workflows',
      'Postman collection and interactive OpenAPI reference',
    ],
  },

  // ── Company ──────────────────────────────────────────────────
  '/company/about': {
    kicker: 'Company',
    title: 'About Us',
    blurb:
      'ClearSpeak is building the voice layer for India’s languages — and every language beyond.',
    points: [
      'Founded to make speech AI work in 22 languages, not just English',
      'A research-to-production pipeline spanning speech, translation and vision',
      'A team across ML, real-time infrastructure and product',
    ],
  },
  '/company/careers': {
    kicker: 'Company',
    title: 'Careers',
    blurb: 'Build the voice interface for a billion people.',
    points: [
      'Roles across ML, real-time infrastructure, product and design',
      'Remote-first, with an engineering hub in Bengaluru',
      'Hard problems: streaming latency, low-resource languages, on-device models',
    ],
  },
  '/company/partners': {
    kicker: 'Company',
    title: 'Partners',
    blurb: 'Technology, channel and delivery partners grow with us.',
    points: [
      'Technology partners: telephony, CCaaS and device manufacturers',
      'Reseller and global-system-integrator programs',
      'Co-selling into enterprise accounts with dedicated support',
    ],
  },
  '/company/news': {
    kicker: 'Company',
    title: 'News',
    blurb: 'Announcements, launches and press coverage.',
    points: [
      'Product launch notes and release announcements',
      'Funding, milestone and partnership announcements',
      'Press inquiries and downloadable media kit',
    ],
  },
  '/company/investor-relations': {
    kicker: 'Company',
    title: 'Investor Relations',
    blurb: 'Information for investors and analysts.',
    points: [
      'Shareholder communications and earnings materials',
      'Board governance and regulatory filings',
      'Direct contact for the investor relations team',
    ],
  },

  // ── Legal ────────────────────────────────────────────────────
  '/legal/privacy-policy': {
    kicker: 'Legal',
    title: 'Privacy Policy',
    blurb: 'What we collect, why we collect it, and how long we keep it.',
    points: [
      'Zero data retention for audio and transcripts by default',
      'No sale of personal data, ever',
      'Your rights to access, export and delete your data',
    ],
  },
  '/legal/terms-of-service': {
    kicker: 'Legal',
    title: 'Terms of Service',
    blurb: 'The agreement that governs your use of ClearSpeak.',
    points: [
      'Acceptable use, rate limits and fair-use policies',
      'Service levels, warranties and liability terms',
      'Suspension, renewal and termination conditions',
    ],
  },
  '/legal/cookie-policy': {
    kicker: 'Legal',
    title: 'Cookie Policy',
    blurb: 'Cookies and local storage used on ClearSpeak properties.',
    points: [
      'Essential cookies that keep sessions and audio secure',
      'Analytics only where you have given consent',
      'Manage or withdraw your preferences at any time',
    ],
  },
  '/legal/gdpr': {
    kicker: 'Legal',
    title: 'GDPR',
    blurb: 'How ClearSpeak meets EU data protection requirements.',
    points: [
      'Data Processing Agreement available for EU customers',
      'EU data residency options for workloads and logs',
      'Responses to data-subject requests within 30 days',
    ],
  },
  '/legal/soc-2': {
    kicker: 'Legal',
    title: 'SOC 2',
    blurb: 'SOC 2 Type II controls, audited on an ongoing basis.',
    points: [
      'Security, availability and confidentiality trust criteria',
      'Independent auditor reports available under NDA',
      'Continuous control monitoring with evidence collection',
    ],
  },
}
