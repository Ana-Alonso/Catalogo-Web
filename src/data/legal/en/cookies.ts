import type { LegalDocument } from '../types';
import { RESPONSIBLE } from '../responsible';

const COOKIE_COLUMNS = ['Name', 'What it does', 'Type', 'Duration'];

const contactEmail = RESPONSIBLE.email || '[contact email]';

export const COOKIES_DOCUMENT: LegalDocument = {
  title: 'Cookie policy',
  description:
    'Which cookies and local storage technologies Laurel en Lienzo uses, what they are for, and how to accept, reject or change your choice.',
  updatedAt: '2026-10-27',
  intro:
    'A cookie is a small file a website stores in your browser, and local storage (localStorage) is a similar space the site itself uses. Here we explain which of them this website uses, what for, and how to decide about them.',
  sections: [
    {
      id: 'que-son',
      title: '1. What they are and what they are used for',
      blocks: [
        {
          kind: 'paragraph',
          text: 'These technologies let the website remember your language, keep the custom products you design and, only if you allow it, measure in aggregate how many people visit. We do not use them to identify you or to serve you advertising outside this website.',
        },
      ],
    },
    {
      id: 'propias',
      title: '2. Technical cookies and storage (exempt from consent)',
      blocks: [
        {
          kind: 'paragraph',
          text: 'They are needed for the website to behave as you expect. Under Article 22.2 of Law 34/2002 they do not require consent, because they provide exclusively the service you asked for. You can block them in your browser, but then the website will stop remembering your preferences.',
        },
        {
          kind: 'table',
          table: {
            caption: 'First-party technologies used by this website',
            columns: COOKIE_COLUMNS,
            rows: [
              ['laurel_lang', 'Remembers the language the website is displayed in.', 'First party, technical', '1 year'],
              ['laurel_language', 'Stores your language preference in your browser.', 'First party, technical (localStorage)', 'Until you clear browsing data'],
              ['laurel_cookie_consent', 'Remembers whether you accepted or rejected analytics cookies.', 'First party, technical (localStorage)', '180 days'],
              ['laurel_custom_products_v2', 'Keeps the custom products you design in the catalogue.', 'First party, technical (localStorage)', 'Until you remove them or clear browsing data'],
              ['sb-…-auth-token', 'Keeps the admin area session signed in.', 'First party, technical (localStorage)', 'Until you sign out'],
            ],
          },
        },
      ],
    },
    {
      id: 'analiticas',
      title: '3. Analytics cookies (your consent is required)',
      blocks: [
        {
          kind: 'paragraph',
          text: 'We use Google Analytics, run by Google Ireland Limited, to see how many people visit the site and which pages interest them most, so we can decide which workshops to run or which products to improve. We do not consider this purpose exempt, so these cookies are only set if you expressly accept them: refusing is as easy as accepting.',
        },
        {
          kind: 'table',
          table: {
            caption: 'Google Analytics cookies',
            columns: COOKIE_COLUMNS,
            rows: [
              ['_ga', 'Distinguishes unique users for statistical purposes.', 'Third party (Google)', '2 years'],
              ['_ga_L9R421RJQB', 'Keeps the state of the measurement session.', 'Third party (Google)', '2 years'],
              ['_gid', 'Distinguishes users over a short period.', 'Third party (Google)', '24 hours'],
              ['_gat', 'Limits the number of requests sent to Google.', 'Third party (Google)', '1 minute'],
            ],
          },
        },
        {
          kind: 'paragraph',
          text: 'Google processes this data in aggregate and anonymised form (full IP addresses are not stored, and the data is not merged with other Google data). More information in the Google privacy policy: https://policies.google.com/privacy.',
        },
      ],
    },
    {
      id: 'terceros',
      title: '4. Third-party content that may set cookies',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Shop images are loaded from Etsy’s servers ( *.etsystatic.com), protected by Cloudflare. That request may let Cloudflare set its own technical cookie in your browser:',
        },
        {
          kind: 'table',
          table: {
            caption: 'Cookies from external services',
            columns: COOKIE_COLUMNS,
            rows: [
              ['__cf_bm', 'Protects Etsy images from automated abuse.', 'Third party (Cloudflare)', '30 minutes'],
              ['Etsy cookies', 'Only set if you click through to the Etsy shop.', 'Third party (Etsy Inc.)', 'Per their policy'],
              ['Instagram and TikTok cookies', 'Only set if you click through to our profiles.', 'Third party (Meta, ByteDance)', 'Per their policy'],
            ],
          },
        },
        {
          kind: 'paragraph',
          text: 'These platforms process data in the United States and have their own policies, available at https://www.etsy.com/legal/privacy, https://help.instagram.com/155888188262572 and https://www.tiktok.com/legal/page/eea/privacy-policy/en.',
        },
      ],
    },
    {
      id: 'gestionar',
      title: '5. How to accept, reject or change your choice',
      blocks: [
        {
          kind: 'list',
          items: [
            'On your first visit a notice appears with Accept, Reject and Configure buttons. Rejecting does not limit how the website works.',
            'At any time you can open "Cookie settings" in the footer and turn analytics on or off. Turning them off deletes the Google Analytics cookies already installed.',
            'Your choice is kept for 180 days, after which we will ask you again so your decision stays up to date.',
            'You can also block or delete cookies in your browser settings (Chrome, Firefox, Safari and Edge all have a privacy section). Doing so may stop the website from remembering your language or your custom products.',
          ],
        },
      ],
    },
    {
      id: 'actualizaciones',
      title: '6. Updates to this policy',
      blocks: [
        {
          kind: 'paragraph',
          text: `This policy was last updated on 27 October 2026. If the cookie list changes we will publish it here and show the notice again. For any question about cookie use, write to ${contactEmail}.`,
        },
      ],
    },
  ],
};
