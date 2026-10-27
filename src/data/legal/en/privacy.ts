import type { LegalDocument } from '../types';
import { AEPD_URL, RESPONSIBLE } from '../responsible';

const holderName = RESPONSIBLE.name || '[Holder name]';
const holderLocality = RESPONSIBLE.locality || '[City and region]';
const contactEmail = RESPONSIBLE.email || '[contact email]';

const controllerText =
  RESPONSIBLE.taxId && RESPONSIBLE.domicile
    ? `${holderName}, with tax ID ${RESPONSIBLE.taxId} and registered address at ${RESPONSIBLE.domicile}, is the controller of the personal data collected on this website.`
    : `${holderName}, who works from ${holderLocality}, is the controller of the personal data collected on this website. Their tax identification number and full address are not published for data protection reasons; you can request them by writing to ${contactEmail}.`;

export const PRIVACY_DOCUMENT: LegalDocument = {
  title: 'Privacy policy',
  description:
    'How Laurel en Lienzo processes personal data, in line with Regulation (EU) 2016/679 and Organic Law 3/2018.',
  updatedAt: '2026-10-27',
  intro: `This policy explains which personal data ${RESPONSIBLE.brand} collects when you browse this website, sign up for a workshop or write to us, why we process it and how you can exercise your rights.`,
  sections: [
    {
      id: 'responsable',
      title: '1. Data controller',
      blocks: [
        {
          kind: 'paragraph',
          text: controllerText,
        },
        {
          kind: 'paragraph',
          text: `Email address for privacy matters: ${contactEmail}.`,
        },
      ],
    },
    {
      id: 'finalidades',
      title: '2. Purposes and legal basis',
      blocks: [
        {
          kind: 'paragraph',
          text: 'We process your data for the following purposes, each with the legal basis indicated:',
        },
        {
          kind: 'list',
          items: [
            'Managing your workshop registration: reserving your place, confirming attendance and contacting you about the session. Legal basis: your explicit consent by ticking the mandatory box in the form (Article 6(1)(a) GDPR).',
            'Answering your enquiries and custom product requests. Legal basis: the consent you give by writing to us (Article 6(1)(a) GDPR).',
            'Understanding how the website is used, in statistical form. Legal basis: your consent through the cookie banner, which you may withdraw at any time (Article 6(1)(a) GDPR).',
            'Sending news about future workshops, only if you tick the optional box in the registration form. Legal basis: your consent (Article 21.1 of Law 34/2002 on information society services).',
          ],
        },
        {
          kind: 'paragraph',
          text: 'We do not take automated decisions or build profiles about you.',
        },
      ],
    },
    {
      id: 'datos',
      title: '3. Data we process',
      blocks: [
        {
          kind: 'list',
          items: [
            'Identification and contact: your name and email address, when you provide them in the registration form or in a message.',
            'Proof of consent: the date and time you accepted the privacy policy when registering, and whether you allowed workshop notices.',
            'Statistical navigation data: pages visited, referring section, approximate country, device type and browser. Collected in aggregate form through Google Analytics, only if you accept analytics cookies.',
            'Technical preferences: your chosen language and the custom products you design in the catalogue. These stay in your own browser and are never sent to our servers.',
          ],
        },
        {
          kind: 'paragraph',
          text: 'We do not ask for special categories of data (health, beliefs, ethnic origin, and so on). If you voluntarily include such information in a message, we treat it as confidential and use it only to reply to you.',
        },
      ],
    },
    {
      id: 'conservacion',
      title: '4. How long we keep your data',
      blocks: [
        {
          kind: 'list',
          items: [
            'Workshop registrations: for as long as our relationship lasts and until you ask us to erase them. After a workshop ends we keep them for a maximum of twelve months, to document the organisation and handle any issues.',
            'Email enquiries: until you ask us to delete them.',
            'Analytics cookies: following the periods Google configures (up to 26 months for _ga). You can withdraw consent at any time from "Cookie settings".',
          ],
        },
        {
          kind: 'paragraph',
          text: 'Once your data is no longer needed, we delete it using reasonable secure-deletion measures.',
        },
      ],
    },
    {
      id: 'destinatarios',
      title: '5. Recipients and international transfers',
      blocks: [
        {
          kind: 'paragraph',
          text: 'We do not share your data with third parties for commercial purposes. We use service providers that act as data processors and only access what they need to deliver their service:',
        },
        {
          kind: 'list',
          items: [
            'Supabase (database and authentication), where registrations are stored.',
            'Vercel, which hosts and serves this website.',
            'Google Ireland Limited (Google Analytics), for statistical measurement, only if you accept analytics cookies.',
            'Etsy, Instagram and TikTok: we do not send them your data. Loading shop images or clicking the social links may let those platforms set their own cookies; please read their privacy policies.',
          ],
        },
        {
          kind: 'paragraph',
          text: `Some providers transfer data outside the European Economic Area, in particular to the United States. Those transfers rely on the Data Privacy Framework where the company is certified, or on the European Commission's standard contractual clauses, with the additional safeguards of Articles 44 and following of the GDPR. You can request a copy of those safeguards by writing to ${contactEmail}.`,
        },
      ],
    },
    {
      id: 'derechos',
      title: '6. Your rights',
      blocks: [
        {
          kind: 'paragraph',
          text: `You can exercise the following rights free of charge by writing to ${contactEmail} with your name and the reason for your request:`,
        },
        {
          kind: 'list',
          items: [
            'Access: find out which of your data we process.',
            'Rectification: have inaccurate data corrected.',
            'Erasure: ask us to delete your data when it is no longer necessary.',
            'Objection: object to processing, including marketing messages.',
            'Restriction: ask us to restrict processing in the cases set out in Article 18 GDPR.',
            'Portability: receive your data in a structured, commonly used format.',
          ],
        },
        {
          kind: 'paragraph',
          text: `You can also file a complaint with the Spanish Data Protection Agency (Agencia Española de Protección de Datos, ${AEPD_URL}), especially if you believe we did not handle your request properly. If you allowed workshop notices, you can withdraw that at any time by replying to any of our messages or writing to us.`,
        },
      ],
    },
    {
      id: 'menores',
      title: '7. Minors',
      blocks: [
        {
          kind: 'paragraph',
          text: 'This site does not knowingly collect data from anyone under fourteen. Under Article 7 of Organic Law 3/2018, processing a minor’s data requires the consent of their parents or legal guardian. If you are under fourteen and want to join a workshop, please ask an adult to complete the registration or to contact us.',
        },
      ],
    },
    {
      id: 'seguridad',
      title: '8. Security measures',
      blocks: [
        {
          kind: 'paragraph',
          text: 'We apply technical and organisational measures appropriate to the risk: encrypted communication over HTTPS, an admin area protected by authentication, a database with least-privilege permissions by default, and periodic review of credentials. No measure is unbreakable; ask us if you would like more detail.',
        },
      ],
    },
    {
      id: 'cambios',
      title: '9. Updates to this policy',
      blocks: [
        {
          kind: 'paragraph',
          text: 'This policy was last updated on 27 October 2026. When something relevant changes we publish the new version here with a new date, and if the change affects processing you already consented to, we will ask you to confirm again.',
        },
      ],
    },
  ],
};
