// Data for the Services page's selector and square process model.

export const serviceTracks = [
  {
    id: 'ops',
    number: '01',
    code: 'OPS',
    title: 'Managed IT Operations',
    video: '/assets/cosmos_1992624789.mp4',
    objectPosition: '50% 48%',
    cropPosition: [0.5, 0.48],
    description:
      'Operate, support and maintain the IT environment across devices, users, networks, infrastructure, help desk and cloud so systems stay secure, documented and stable over time.',
    selectorText: {
      eyebrow: '01 / OPERATIONS',
      capability: 'OPERATE / MAINTAIN / OPTIMISE',
      alignment: 'right',
    },
  },
  {
    id: 'sec',
    number: '02',
    code: 'SEC',
    title: 'Cybersecurity',
    video: '/assets/cosmos_1032118682.mp4',
    objectPosition: '58% 50%',
    cropPosition: [0.58, 0.5],
    description:
      'Reduce risk through practical cybersecurity guidance, cloud and identity hardening, incident readiness, compliance support and security awareness.',
    selectorText: {
      eyebrow: '02 / SECURITY',
      capability: 'PROTECT / CONTROL / RESPOND',
      alignment: 'left',
    },
  },
  {
    id: 'gov',
    number: '03',
    code: 'GOV',
    title: 'Control Plane & Governance',
    video: '/assets/cosmos_93407076 (1).mp4',
    objectPosition: '42% 50%',
    cropPosition: [0.42, 0.5],
    description:
      'Connect IT and security into one operating layer across identity, tooling, visibility, ownership, governance and continuous improvement.',
    selectorText: {
      eyebrow: '03 / GOVERNANCE',
      capability: 'ALIGN / GOVERN / DIRECT',
      alignment: 'left',
    },
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
