// Källdata för den ombyggda Services-sidan. Innehållet är hämtat ur den
// befintliga Services-sidan (sex tjänstedomäner + vendors) och omorganiserat
// till de två Shift5-inspirerade funktionerna: en tre-panels-väljare och en
// cirkulär driftsmodell. Pastellgrönt ersätter Shift5:s röda som aktiv färg.

export const PASTEL = '#A9E8B4';
export const PASTEL_SOFT = '#B8F2C2';

// ── Sektion 2/3: tre primära spår (väljare + detaljpanel) ───────────────────
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
      'Reduce risk through cybersecurity strategy, cloud security, incident response, compliance, awareness, SOC and MDR — staffed by humans and powered by automation.',
    tags: ['Strategy', 'Cloud Security', 'Incident Response', 'Compliance', 'Awareness', 'SOC', 'MDR'],
    covers: [
      'Security strategy & hardening',
      'Cloud & identity security',
      'Incident response & escalation',
      'Compliance & governance support',
      'Awareness & training',
      'SOC / MDR monitoring',
    ],
    outcomes: [
      'Reduced exposure',
      'Better visibility',
      'Faster response',
      'Stronger identity & cloud posture',
      'Practical governance',
    ],
    related: ['Identity', 'SOC', 'Cloud', 'Infrastructure', 'Users'],
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

// ── Sektion 4: cirkulär driftsmodell (sex steg på radarn) ────────────────────
export const operatingStages = [
  {
    number: '01',
    title: 'Discover',
    code: 'DISCOVERY',
    text: 'Map devices, identities, networks, infrastructure, cloud, SOC, help desk and existing tools to understand what exists, where ownership is unclear and where risk or fragmentation is building up.',
    tags: ['Inventory', 'Identity', 'Network', 'Cloud'],
  },
  {
    number: '02',
    title: 'Onboard',
    code: 'ONBOARD',
    text: 'Bring users, devices, systems and services into a managed operating model with clear access, documentation, ownership, support paths and configuration standards.',
    tags: ['Device', 'Access', 'Documentation', 'Support'],
  },
  {
    number: '03',
    title: 'Control',
    code: 'CONTROL',
    text: 'Apply practical controls across identity, endpoint, cloud, infrastructure and tooling so the environment becomes easier to operate, secure and improve.',
    tags: ['Identity', 'Endpoint', 'Cloud', 'Tooling'],
  },
  {
    number: '04',
    title: 'Monitor',
    code: 'MONITOR',
    text: 'Maintain visibility across operational health, alerts, security events, vulnerabilities and service issues using a connected IT and security view.',
    tags: ['SOC', 'MDR', 'Visibility', 'Alerts'],
  },
  {
    number: '05',
    title: 'Respond',
    code: 'RESPOND',
    text: 'Handle incidents, support needs, changes and escalations with structured communication, clear responsibility and documented resolution.',
    tags: ['Incident Response', 'Help Desk', 'Escalation', 'Resolution'],
  },
  {
    number: '06',
    title: 'Improve',
    code: 'IMPROVE',
    text: 'Continuously improve the environment through reporting, compliance support, awareness, governance, roadmaps and technical decision-making.',
    tags: ['Compliance', 'Awareness', 'Governance', 'Roadmaps'],
  },
];

export const ringLabels = {
  outer: 'CONTINUOUS IMPROVEMENT',
  ring2: 'MONITORING & RESPONSE',
  ring3: 'CONTROL & HARDENING',
  center: 'INVENTORY & OWNERSHIP',
};

// ── Sektion 5: bevarad detaljinfo (de sex ursprungliga tjänstedomänerna) ─────
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
