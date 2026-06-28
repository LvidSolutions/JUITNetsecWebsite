// Data for the Services page. Content is organized around the Services selector,
// the square process model, and the retained support matrix.

export const PASTEL = '#A9E8B4';
export const PASTEL_SOFT = '#B8F2C2';

export const serviceTracks = [
  {
    id: 'ops',
    number: '01',
    code: 'OPS',
    title: 'Managed IT Operations',
    layer: 'Operations layer',
    graphic: 'stack',
    description:
      'Operate, support and maintain the IT environment across devices, users, networks, infrastructure, help desk and cloud so systems stay secure, documented and stable over time.',
    tags: ['Device', 'Network', 'Infrastructure', 'Help Desk', 'Cloud', 'Documentation'],
    covers: [
      'Device onboarding & lifecycle',
      'Network & infrastructure operations',
      'Help desk & user support',
      'Cloud / SaaS administration',
      'Documentation & standards',
      'Patching, configuration & retirement',
    ],
    outcomes: [
      'Clearer ownership',
      'Stable, predictable support',
      'Better documentation',
      'Reduced fragmentation',
      'Controlled device & cloud estate',
    ],
    related: ['Device', 'Network', 'Infrastructure', 'Help Desk', 'Cloud'],
  },
  {
    id: 'sec',
    number: '02',
    code: 'SEC',
    title: 'Cybersecurity',
    layer: 'Protection layer',
    graphic: 'orbit',
    description:
      'Reduce risk through practical cybersecurity guidance, cloud and identity hardening, incident readiness, compliance support and security awareness.',
    tags: ['Strategy', 'Cloud Security', 'Identity', 'Incident Readiness', 'Compliance', 'Awareness'],
    covers: [
      'Security strategy & hardening',
      'Cloud & identity security',
      'Incident readiness & escalation paths',
      'Compliance & governance support',
      'Awareness & training',
      'Secure operating routines',
    ],
    outcomes: [
      'Reduced exposure',
      'Better visibility',
      'Faster response',
      'Stronger identity & cloud posture',
      'Practical governance',
    ],
    related: ['Identity', 'Cloud', 'Infrastructure', 'Users', 'Governance'],
  },
  {
    id: 'gov',
    number: '03',
    code: 'GOV',
    title: 'Control Plane & Governance',
    layer: 'Management layer',
    graphic: 'cube',
    description:
      'Connect IT and security into one operating layer across identity, tooling, visibility, ownership, governance and continuous improvement.',
    tags: ['Identity', 'Visibility', 'Governance', 'Tooling', 'Ownership', 'Improvement'],
    covers: [
      'IT & security operating model',
      'Identity & access visibility',
      'Tooling & platform coordination',
      'Vendor & platform alignment',
      'Reporting & governance',
      'Continuous improvement',
    ],
    outcomes: [
      'Less fragmented tooling',
      'Clearer decision-making',
      'Better technical direction',
      'Maintainable environments',
      'Practical roadmaps',
    ],
    related: ['Identity', 'Tooling', 'Vendors', 'Governance', 'Visibility'],
  },
];

export const processStages = [
  {
    id: 'discover',
    number: '01',
    title: 'Discover',
    code: 'DISCOVER',
    text: 'Understand the current infrastructure, risks, requirements, operating constraints and business context before changing the environment.',
    tags: ['Infrastructure', 'Risk', 'Requirements', 'Context'],
  },
  {
    id: 'map',
    number: '02',
    title: 'Map',
    code: 'MAP',
    text: 'Identify systems, dependencies, network and security posture, access paths, ownership and priorities across the technical estate.',
    tags: ['Systems', 'Dependencies', 'Access', 'Priorities'],
  },
  {
    id: 'secure',
    number: '03',
    title: 'Secure',
    code: 'SECURE',
    text: 'Implement practical improvements across infrastructure, network, identity, access, operations and security controls.',
    tags: ['Network', 'Identity', 'Access', 'Controls'],
  },
  {
    id: 'operate',
    number: '04',
    title: 'Operate',
    code: 'OPERATE',
    text: 'Support, advise, improve and maintain secure IT operations over time with clear communication and technical ownership.',
    tags: ['Support', 'Advisory', 'Improvement', 'Management'],
  },
];

export const serviceDomains = [
  {
    number: '01',
    symbol: 'INF',
    title: 'IT Infrastructure',
    layer: 'Foundation layer',
    text: 'Architecture, improvement and implementation of stable infrastructure for environments that need control, resilience and long-term maintainability.',
    focus: ['Architecture', 'Segmentation', 'Resilience', 'Lifecycle'],
  },
  {
    number: '02',
    symbol: 'NET',
    title: 'Network & Secure Communication',
    layer: 'Communication layer',
    text: 'Secure communication paths for users, offices, systems and external connections, designed around visibility and operational reliability.',
    focus: ['Routing', 'Access', 'Connectivity', 'Control'],
  },
  {
    number: '03',
    symbol: 'SEC',
    title: 'Cybersecurity',
    layer: 'Protection layer',
    text: 'Practical security guidance and technical implementation that reduce risk across infrastructure, identities, endpoints and connected systems.',
    focus: ['Risk', 'Hardening', 'Identity', 'Visibility'],
  },
  {
    number: '04',
    symbol: 'OPS',
    title: 'IT Operations',
    layer: 'Operations layer',
    text: 'Reliable operations support for companies that need secure systems to remain understandable, documented and stable over time.',
    focus: ['Operations', 'Support', 'Documentation', 'Continuity'],
  },
  {
    number: '05',
    symbol: 'ADV',
    title: 'Technical Advisory',
    layer: 'Decision layer',
    text: 'Senior advisory for technical decisions, requirements, project direction and implementation choices across IT and security environments.',
    focus: ['Strategy', 'Requirements', 'Procurement', 'Direction'],
  },
  {
    number: '06',
    symbol: 'MGT',
    title: 'IT Management',
    layer: 'Management layer',
    text: 'Structured management of technical environments with focus on maintainability, communication, governance and practical execution.',
    focus: ['Governance', 'Planning', 'Execution', 'Maintainability'],
  },
];

export const vendors = [
  { name: 'VMware', url: 'https://www.vmware.com/', symbol: 'VM' },
  { name: 'Veeam', symbol: 'VE' },
  { name: 'Dell', url: 'https://www.dell.com/sv-se/shop/scc/sc/private-cloud-solutions', symbol: 'DE' },
  { name: 'Trend Micro', url: 'https://www.trendmicro.com/en_us/business.html', symbol: 'TM' },
  { name: 'Microsoft', url: 'https://www.microsoft.com', symbol: 'MS' },
  { name: 'Smart Cloud Solutions', symbol: 'SC' },
  { name: 'Microsoft Azure', symbol: 'AZ' },
  { name: 'AWS', symbol: 'AW' },
];
