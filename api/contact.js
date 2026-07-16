import { handleContactRequest } from './_lib/contact-handler.js';

export async function POST(request) {
  return handleContactRequest(request);
}
