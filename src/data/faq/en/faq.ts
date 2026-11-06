import type { FaqDocument } from '../types';
import { FAQ_CONTACT_EMAIL } from '../contact';

export const FAQ_DOCUMENT_EN: FaqDocument = {
  title: 'Frequently asked questions',
  description:
    'How the illustrations, the commissions, the hand-painted t-shirts and the artisan jewellery of Laurel en Lienzo work: timescales, shipping and hand deliveries in Benidorm.',
  intro:
    'What you ask most often when you look around the catalogue. If you are left with any doubt, just write to me.',
  questions: [
    {
      id: 'alma',
      question: 'What is the soul of the brand?',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Laurel en Lienzo is born from a connection with nature and with what we feel. The project is called Laurel en Lienzo and our motto is Create, feel and connect.',
        },
        {
          kind: 'paragraph',
          text: 'This identity is deeply inspired by the idea of the laurel leaf —a medicinal symbol, one that keeps you company and leaves a positive mark on others— and by my book Florecillas, where I have always identified with the organic. Every word of our motto has a reason:',
        },
        {
          kind: 'list',
          items: [
            'Create, because we need to express everything we carry inside us.',
            'Feel, because without emotions life would make no sense.',
            'Connect, because we are not separate beings; we need others to nourish ourselves, to share and to grow together.',
          ],
        },
      ],
    },
    {
      id: 'productos',
      question: 'What can you buy, and how does it work?',
      blocks: [
        {
          kind: 'paragraph',
          text: 'At Laurel en Lienzo you will find different pieces made by hand. Depending on the product, availability and timescales vary:',
        },
        {
          kind: 'list',
          items: [
            'Catalogue illustrations: they are UNLIMITED. You can get them as a digital file or ask for the physical piece to be sent (adding a surcharge for shipping costs).',
            `Custom illustrations: they are made by DIRECT ORDER. Making them takes 1 to 3 days. Once they are ready they are sent by email as a digital file. If you prefer the physical version, the whole preparation takes 1 to 7 days. For any other format, ask me by email at ${FAQ_CONTACT_EMAIL}`,
            'Hand-painted t-shirts: although in theory they are LIMITED, every design is unique. If a t-shirt is already sold you can order that exact design; because they are painted by hand it takes me 3 to 5 days to have it ready before sending it.',
            'Artisan jewellery: it is LIMITED. Working with very specific materials, pieces are made in closed runs or as one-offs. Once a jewellery piece sells out it cannot be repeated exactly, because I do not have the same materials.',
          ],
        },
      ],
    },
    {
      id: 'envios',
      question: 'How does shipping work, and what are the timescales?',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Domestic shipping (Spain): physical pieces are sent on Mondays and Fridays every week.',
        },
        {
          kind: 'paragraph',
          text: 'International shipping: if you live outside Spain and would like one of the pieces, international orders are arranged personally. Send me a direct message on Instagram and we will sort it out!',
        },
      ],
    },
    {
      id: 'plataformas',
      question:
        'I want to buy more than one piece, but they are on different platforms (Etsy, Vinted or Amazon). What do I do?',
      blocks: [
        {
          kind: 'paragraph',
          text: 'If you have fallen for several pieces of mine spread across different platforms and you want them together, you do not have to pay separate shipping on each site.',
        },
        {
          kind: 'paragraph',
          text: 'Ask me directly by email or through a direct message on Instagram. Tell me which pieces interest you and we will organise it: I will prepare a personalised bundle on a single platform (whichever of them works best for both of us), so the shipping cost is one and it comes out much cheaper.',
        },
      ],
    },
    {
      id: 'entrega-mano',
      question: 'Can orders be handed over in person?',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Yes, of course! If you live nearby, we do hand deliveries on Mondays and Fridays in Benidorm and the surrounding area.',
        },
      ],
    },
  ],
};
