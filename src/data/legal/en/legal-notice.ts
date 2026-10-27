import type { LegalDocument } from '../types';
import { RESPONSIBLE } from '../responsible';

const holderName = RESPONSIBLE.name || '[Holder name]';
const holderLocality = RESPONSIBLE.locality || '[City and region]';
const contactEmail = RESPONSIBLE.email || '[contact email]';

const activity =
  'sale of original artwork, illustrations, derivative products and in-person painting workshops';

const identificationItems = [
  `Trading name: ${RESPONSIBLE.brand}.`,
  `Owner: ${holderName}.`,
  RESPONSIBLE.taxId
    ? `Tax identification: ${RESPONSIBLE.taxId}.`
    : `Tax identification: for data protection reasons the owner's identification number is not published here. It is available to users who need it and to the competent public authorities, and we will send it on request to ${contactEmail}.`,
  RESPONSIBLE.domicile
    ? `Registered address: ${RESPONSIBLE.domicile}.`
    : `Registered address: the owner works from ${holderLocality}. The private street address is not published; the full address for notifications is available to anyone who asks at ${contactEmail} and to the competent public authorities.`,
  `Contact email: ${contactEmail}.`,
  `Activity: ${activity}.`,
  'Website: laurelenlienzo.vercel.app.',
];

export const LEGAL_NOTICE_DOCUMENT: LegalDocument = {
  title: 'Legal notice',
  description:
    'General information required by Article 10 of Spanish Law 34/2002 on information society services and electronic commerce.',
  updatedAt: '2026-10-27',
  intro: `This legal notice governs the use of the ${RESPONSIBLE.brand} website and fulfils the duty to inform under Article 10 of Spanish Law 34/2002 on Information Society Services and Electronic Commerce (LSSI-CE).`,
  sections: [
    {
      id: 'identificacion',
      title: '1. Identification details',
      blocks: [
        {
          kind: 'list',
          items: identificationItems,
        },
      ],
    },
    {
      id: 'objeto',
      title: '2. Purpose of the website',
      blocks: [
        {
          kind: 'paragraph',
          text: 'On this website you can browse original artwork and products, customise some pieces, check workshop dates and sign up for them. Purchases are made through the official Etsy shop and the Amazon links shown here, not directly on this site.',
        },
        {
          kind: 'paragraph',
          text: 'Accessing and browsing the website is free and requires no registration, apart from the workshop sign-up form, where you leave your name and email address.',
        },
      ],
    },
    {
      id: 'uso',
      title: '3. Conditions of use',
      blocks: [
        {
          kind: 'paragraph',
          text: 'As a user you agree to use the website in accordance with the law, this notice and good faith, and in particular to:',
        },
        {
          kind: 'list',
          items: [
            'Provide true contact details in the registration form.',
            'Not reproduce, distribute or publicly communicate the artwork, illustrations or texts on this site for commercial purposes without authorisation.',
            'Not carry out actions that overload or interfere with the operation of the website or its services.',
            'Not attempt to access the admin area or other users’ data without authorisation.',
          ],
        },
        {
          kind: 'paragraph',
          text: 'Workshop registrations are managed with your name and email address; you can ask us to cancel one by writing to us before the workshop date.',
        },
      ],
    },
    {
      id: 'propiedad',
      title: '4. Intellectual and industrial property',
      blocks: [
        {
          kind: 'paragraph',
          text: `All artistic works, illustrations, product photography, texts and design elements on this site belong to ${holderName} or are used under licence, and are protected by Spanish intellectual property law.`,
        },
        {
          kind: 'paragraph',
          text: 'You may view, print or share the content citing the source and linking back to this website, provided it is non-commercial and the works are not modified. Any other use requires prior written authorisation.',
        },
        {
          kind: 'paragraph',
          text: 'Third-party brands and names that appear here (Etsy, Amazon, Instagram, TikTok, Google) belong to their owners and are mentioned only to link to their services.',
        },
      ],
    },
    {
      id: 'responsabilidad',
      title: '5. Liability and links',
      blocks: [
        {
          kind: 'paragraph',
          text: 'We do our best to keep the website available and up to date, but we cannot guarantee uninterrupted operation or that all content is always accurate. We are not liable for damage arising from failures in your connection, browser or external hosting.',
        },
        {
          kind: 'paragraph',
          text: 'The site contains links to Etsy, Amazon, Instagram and TikTok. We do not control their content or terms: once you click, your browsing is governed by that platform’s policies. Providing a link does not imply recommendation, endorsement or a commercial relationship, apart from the book sold on Amazon and the shop on Etsy.',
        },
      ],
    },
    {
      id: 'comunicaciones',
      title: '6. Commercial communications',
      blocks: [
        {
          kind: 'paragraph',
          text: 'In line with Article 21 of the LSSI-CE, we do not send advertising or offer emails unless you have expressly requested them. We will only notify you about future workshops if you tick the optional box when registering, and you can opt out at any time by replying to a message.',
        },
      ],
    },
    {
      id: 'legislacion',
      title: '7. Applicable law',
      blocks: [
        {
          kind: 'paragraph',
          text: 'This notice is governed by Spanish law. In the event of a dispute, the competent courts are those determined by the procedural rules, and in particular the jurisdiction that corresponds to you when you are acting as a consumer.',
        },
      ],
    },
    {
      id: 'modificaciones',
      title: '8. Changes to this notice',
      blocks: [
        {
          kind: 'paragraph',
          text: 'We may adapt this notice to legal changes or to how the website works; the version in force is always the one published on this page, last updated on 27 October 2026.',
        },
      ],
    },
  ],
};
