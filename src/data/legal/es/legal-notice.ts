import type { LegalDocument } from '../types';
import { RESPONSIBLE } from '../responsible';

const holderName = RESPONSIBLE.name || '[Nombre del titular]';
const holderLocality = RESPONSIBLE.locality || '[Localidad y provincia]';
const contactEmail = RESPONSIBLE.email || '[correo electrónico de contacto]';

const activity =
  'venta de obra original, ilustraciones, productos derivados y talleres presenciales de pintura';

const identificationItems = [
  `Denominación social / nombre comercial: ${RESPONSIBLE.brand}.`,
  `Titular: ${holderName}.`,
  RESPONSIBLE.taxId
    ? `Identificación fiscal: ${RESPONSIBLE.taxId}.`
    : `Identificación fiscal: por razones de protección de datos no se publica el número identificativo del titular. Consta a disposición de las personas usuarias que lo necesiten y de los organismos públicos competentes, y se facilita escribiendo a ${contactEmail}.`,
  RESPONSIBLE.domicile
    ? `Domicilio: ${RESPONSIBLE.domicile}.`
    : `Domicilio: el titular desarrolla su actividad en ${holderLocality}. No se publica la dirección particular; la dirección completa a efectos de notificaciones se comunica a quien la solicite escribiendo a ${contactEmail} y a los organismos públicos competentes.`,
  `Correo electrónico de contacto: ${contactEmail}.`,
  `Actividad: ${activity}.`,
  'Sitio web: laurelenlienzo.vercel.app.',
];

export const LEGAL_NOTICE_DOCUMENT: LegalDocument = {
  title: 'Aviso legal',
  description:
    'Información general exigida por el artículo 10 de la Ley 34/2002, de servicios de la sociedad de la información y de comercio electrónico.',
  updatedAt: '2026-10-27',
  intro: `Este aviso legal regula el uso del sitio web de ${RESPONSIBLE.brand} y cumple con el deber de información del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE).`,
  sections: [
    {
      id: 'identificacion',
      title: '1. Datos identificativos',
      blocks: [
        {
          kind: 'list',
          items: identificationItems,
        },
      ],
    },
    {
      id: 'objeto',
      title: '2. Objeto del sitio web',
      blocks: [
        {
          kind: 'paragraph',
          text: 'En esta web puedes ver el catálogo de obra y productos, personalizar algunas piezas, consultar los talleres y sus fechas, e inscribirte en ellos. Las compras se realizan a través de la tienda oficial en Etsy y de los enlaces de Amazon que aparecen en la web, no directamente en este sitio.',
        },
        {
          kind: 'paragraph',
          text: 'Acceder y navegar por la web es gratuito y no exige registro, salvo el formulario de inscripción a un taller, donde nos dejas tu nombre y tu correo electrónico.',
        },
      ],
    },
    {
      id: 'uso',
      title: '3. Condiciones de uso',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Como persona usuaria te comprometes a usar el sitio web conforme a la ley, a este aviso y a la buena fe, y en particular a:',
        },
        {
          kind: 'list',
          items: [
            'Facilitar datos de contacto veraces en el formulario de inscripción.',
            'No reproducir, distribuir ni comunicar públicamente las obras, ilustraciones o textos del sitio con fines comerciales sin autorización.',
            'No realizar acciones que sobrecarguen o interfieran en el funcionamiento de la web o de sus servicios.',
            'No intentar acceder al panel de administración ni a los datos de otras personas usuarias sin autorización.',
          ],
        },
        {
          kind: 'paragraph',
          text: 'Las inscripciones a talleres se gestionan indicando nombre y correo electrónico; puedes pedir su anulación escribiéndonos antes de la fecha del taller.',
        },
      ],
    },
    {
      id: 'propiedad',
      title: '4. Propiedad intelectual e industrial',
      blocks: [
        {
          kind: 'paragraph',
          text: `Todas las obras artísticas, ilustraciones, fotografías de producto, textos y elementos de diseño de este sitio son titularidad de ${holderName} o se utilizan con licencia, y están protegidos por la Ley de Propiedad Intelectual.`,
        },
        {
          kind: 'paragraph',
          text: 'Puedes visualizar el contenido, imprimirlo o compartirlo citando la fuente y enlazando a esta web, siempre sin ánimo de lucro y sin modificar las obras. Cualquier otro uso requiere autorización previa y por escrito.',
        },
        {
          kind: 'paragraph',
          text: 'Las marcas y nombres de terceros que aparecen (Etsy, Amazon, Instagram, TikTok, Google) pertenecen a sus titulares y se mencionan únicamente para enlazar sus servicios.',
        },
      ],
    },
    {
      id: 'responsabilidad',
      title: '5. Responsabilidad y enlaces',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Hacemos lo posible por mantener la web disponible y actualizada, pero no podemos garantizar que funcione ininterrumpidamente ni que el contenido sea siempre exacto. No respondemos de los daños que puedan derivarse de fallos de tu conexión, del navegador o del alojamiento externo.',
        },
        {
          kind: 'paragraph',
          text: 'La web incluye enlaces a Etsy, Amazon, Instagram y TikTok. No controlamos sus contenidos ni sus condiciones: al pulsar un enlace, la navegación pasa a regirse por las políticas de esa plataforma. La existencia de un enlace no implica recomendación, aprobación ni relación comercial con esos sitios, salvo la compra del libro en Amazon y la venta en la tienda de Etsy.',
        },
      ],
    },
    {
      id: 'comunicaciones',
      title: '6. Comunicaciones comerciales',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Conforme al artículo 21 de la LSSI-CE, no enviamos correos publicitarios ni de ofertas si no los has solicitado de forma expresa. Solo te escribiremos con avisos de futuros talleres si marcas la casilla opcional al inscribirte, y podrás darte de baja en cualquier momento respondiendo al mensaje.',
        },
      ],
    },
    {
      id: 'legislacion',
      title: '7. Legislación aplicable',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Este aviso se rige por la legislación española. En caso de controversia son competentes los juzgados y tribunales que determine la normativa procesal, y en particular el fuero legal que corresponda cuando la persona destinataria tenga la condición de consumidora.',
        },
      ],
    },
    {
      id: 'modificaciones',
      title: '8. Modificaciones de este aviso',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Podemos adaptar este aviso a cambios legales o de funcionamiento de la web; la versión vigente es siempre la publicada en esta página, actualizada por última vez el 27 de octubre de 2026.',
        },
      ],
    },
  ],
};
