import type { LegalDocument } from '../types';
import { RESPONSIBLE } from '../responsible';

const COOKIE_COLUMNS = ['Nombre', 'Qué hace', 'Tipo', 'Duración'];

const contactEmail = RESPONSIBLE.email || '[correo electrónico de contacto]';

export const COOKIES_DOCUMENT: LegalDocument = {
  title: 'Política de cookies',
  description:
    'Qué cookies y tecnologías de almacenamiento utiliza Laurel en Lienzo, con qué finalidad y cómo puedes aceptarlas, rechazarlas o revocar el consentimiento.',
  updatedAt: '2026-10-27',
  intro:
    'Una cookie es un pequeño fichero que una página web guarda en tu navegador, y el almacenamiento local (localStorage) es un espacio similar que usa el propio sitio. Aquí explicamos cuáles emplea esta web, para qué sirven y cómo decidir sobre ellas.',
  sections: [
    {
      id: 'que-son',
      title: '1. Qué son y para qué se usan',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Estas tecnologías permiten que la web recuerde tu idioma, conserve los productos personalizados que vas creando y, si lo autorizas, medir de forma agregada cuántas personas la visitan. No las usamos para identificarte ni para mostrarte publicidad fuera de esta web.',
        },
      ],
    },
    {
      id: 'propias',
      title: '2. Cookies y almacenamiento técnicos (exentos de consentimiento)',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Son necesarios para que la web funcione como tú esperas. Según el artículo 22.2 de la Ley 34/2002, no requieren consentimiento porque prestan exclusivamente el servicio solicitado. Puedes bloquearlos desde tu navegador, pero entonces la web dejará de recordar tus preferencias.',
        },
        {
          kind: 'table',
          table: {
            caption: 'Tecnologías propias de esta web',
            columns: COOKIE_COLUMNS,
            rows: [
              ['laurel_lang', 'Recuerda el idioma en el que se muestra la web.', 'Propia, técnica', '1 año'],
              ['laurel_language', 'Guarda la preferencia de idioma en tu navegador.', 'Propia, técnica (localStorage)', 'Hasta que borres los datos de navegación'],
              ['laurel_cookie_consent', 'Recuerda si has aceptado o rechazado las cookies analíticas.', 'Propia, técnica (localStorage)', '180 días'],
              ['laurel_custom_products_v2', 'Conserva los productos personalizados que diseñes en el catálogo.', 'Propia, técnica (localStorage)', 'Hasta que los elimines o borres los datos del navegador'],
              ['sb-…-auth-token', 'Mantiene la sesión iniciada en el panel de administración.', 'Propia, técnica (localStorage)', 'Hasta que cierres sesión'],
            ],
          },
        },
      ],
    },
    {
      id: 'analiticas',
      title: '3. Cookies analíticas (requieren tu consentimiento)',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Usamos Google Analytics, gestionado por Google Ireland Limited, para saber cuántas personas visitan la web y qué páginas interesan más, y así decidir qué talleres publicar o qué productos mejorar. No consideramos esta finalidad exenta, así que solo se activan si las aceptas de forma expresa: el rechazo es igual de fácil que la aceptación.',
        },
        {
          kind: 'table',
          table: {
            caption: 'Cookies de Google Analytics',
            columns: COOKIE_COLUMNS,
            rows: [
              ['_ga', 'Distingue entre usuarios distintos de forma estadística.', 'Terceros (Google)', '2 años'],
              ['_ga_L9R421RJQB', 'Conserva el estado de la sesión de medición.', 'Terceros (Google)', '2 años'],
              ['_gid', 'Distingue entre usuarios durante un periodo corto.', 'Terceros (Google)', '24 horas'],
              ['_gat', 'Limita la cantidad de peticiones enviadas a Google.', 'Terceros (Google)', '1 minuto'],
            ],
          },
        },
        {
          kind: 'paragraph',
          text: 'Google trata estos datos de forma agregada y anonimizada (no se guardan direcciones IP completas ni se cruzan con otros datos de Google). Puedes leer más en la política de privacidad de Google: https://policies.google.com/privacy?hl=es.',
        },
      ],
    },
    {
      id: 'terceros',
      title: '4. Contenido de terceros que puede instalar cookies',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Las imágenes de la tienda se cargan desde los servidores de Etsy ( *.etsystatic.com), protegidos por Cloudflare. Esa petición puede hacer que Cloudflare instale su cookie técnica en tu navegador:',
        },
        {
          kind: 'table',
          table: {
            caption: 'Cookies de servicios externos',
            columns: COOKIE_COLUMNS,
            rows: [
              ['__cf_bm', 'Proteger las imágenes de Etsy frente a uso automatizado.', 'Terceros (Cloudflare)', '30 minutos'],
              ['Cookies de Etsy', 'Se instalan solo si pulsas el enlace a la tienda de Etsy.', 'Terceros (Etsy Inc.)', 'Según su política'],
              ['Cookies de Instagram y TikTok', 'Se instalan solo si pulsas los enlaces a nuestros perfiles.', 'Terceros (Meta, ByteDance)', 'Según su política'],
            ],
          },
        },
        {
          kind: 'paragraph',
          text: 'Estas plataformas tratan los datos en Estados Unidos y tienen sus propias políticas. Puedes leerlas en https://www.etsy.com/es/legal/privacy, https://help.instagram.com/155888188262572 y https://www.tiktok.com/legal/page/eea/privacy-policy/es.',
        },
      ],
    },
    {
      id: 'gestionar',
      title: '5. Cómo aceptar, rechazar o cambiar tu decisión',
      blocks: [
        {
          kind: 'list',
          items: [
            'La primera vez que entras aparece un aviso con los botones Aceptar, Rechazar y Configurar. Rechazar no limita el funcionamiento de la web.',
            'En cualquier momento puedes abrir «Configuración de cookies» en el pie de página y activar o desactivar las analíticas. Al desactivarlas, se borran las cookies de Google Analytics ya instaladas.',
            'Tu decisión se conserva 180 días; después te volveremos a preguntar para que siga siendo actual.',
            'También puedes bloquear o eliminar cookies desde los ajustes de tu navegador (Chrome, Firefox, Safari y Edge tienen un apartado de privacidad). Si lo haces, puede que la web no recuerde tu idioma ni tus productos personalizados.',
          ],
        },
      ],
    },
    {
      id: 'actualizaciones',
      title: '6. Actualizaciones de esta política',
      blocks: [
        {
          kind: 'paragraph',
          text: `Esta política se actualizó por última vez el 27 de octubre de 2026. Si cambia el listado de cookies, lo publicaremos aquí y te lo volveremos a mostrar en el aviso. Para cualquier duda sobre el uso de cookies, escríbenos a ${contactEmail}.`,
        },
      ],
    },
  ],
};
