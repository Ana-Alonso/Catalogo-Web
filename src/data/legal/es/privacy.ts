import type { LegalDocument } from '../types';
import { AEPD_URL, RESPONSIBLE } from '../responsible';

const holderName = RESPONSIBLE.name || '[Nombre del titular]';
const holderLocality = RESPONSIBLE.locality || '[Localidad y provincia]';
const contactEmail = RESPONSIBLE.email || '[correo electrónico de contacto]';

const controllerText =
  RESPONSIBLE.taxId && RESPONSIBLE.domicile
    ? `${holderName}, con ${RESPONSIBLE.taxId} y domicilio en ${RESPONSIBLE.domicile}, es responsable del tratamiento de los datos personales que se recogen en este sitio web.`
    : `${holderName}, que desarrolla su actividad en ${holderLocality}, es responsable del tratamiento de los datos personales que se recogen en este sitio web. Su número de identificación fiscal y su dirección completa no se publican por razones de protección de datos; puedes pedirlos escribiendo a ${contactEmail}.`;

export const PRIVACY_DOCUMENT: LegalDocument = {
  title: 'Política de privacidad',
  description:
    'Información sobre el tratamiento de datos personales en Laurel en Lienzo conforme al Reglamento (UE) 2016/679 y a la Ley Orgánica 3/2018.',
  updatedAt: '2026-10-27',
  intro: `Esta política explica qué datos personales recopila ${RESPONSIBLE.brand} cuando navegas por este sitio web, te inscribes en un taller o nos escribes, con qué finalidad los tratamos y cómo puedes ejercer tus derechos.`,
  sections: [
    {
      id: 'responsable',
      title: '1. Responsable del tratamiento',
      blocks: [
        {
          kind: 'paragraph',
          text: controllerText,
        },
        {
          kind: 'paragraph',
          text: `Correo electrónico para asuntos de privacidad: ${contactEmail}.`,
        },
      ],
    },
    {
      id: 'finalidades',
      title: '2. Finalidades y base jurídica',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Tratamos tus datos para las finalidades siguientes, con la base jurídica que se indica en cada caso:',
        },
        {
          kind: 'list',
          items: [
            'Gestionar tu inscripción en un taller: reservar plaza, confirmar la asistencia y comunicarnos contigo sobre el desarrollo del taller. Base jurídica: tu consentimiento expreso al marcar la casilla obligatoria del formulario (artículo 6.1.a del RGPD).',
            'Responder a tus consultas y encargos personalizados. Base jurídica: el consentimiento que otorgas al escribirnos (artículo 6.1.a del RGPD).',
            'Conocer de forma estadística cómo se usa el sitio web. Base jurídica: tu consentimiento a través del banner de cookies, que puedes retirar cuando quieras (artículo 6.1.a del RGPD).',
            'Informarte de futuros talleres y novedades, solo si marcas la casilla opcional del formulario de inscripción. Base jurídica: tu consentimiento (artículo 21.1 de la Ley 34/2002, de servicios de la sociedad de la información).',
          ],
        },
        {
          kind: 'paragraph',
          text: 'No tomamos decisiones automatizadas ni elaboramos perfiles sobre ti.',
        },
      ],
    },
    {
      id: 'datos',
      title: '3. Datos que tratamos',
      blocks: [
        {
          kind: 'list',
          items: [
            'Identificación y contacto: nombre y correo electrónico, cuando los facilitas en el formulario de inscripción o en un mensaje.',
            'Evidencia del consentimiento: la fecha y hora en que aceptas la política de privacidad al inscribirte, y si autorizas o no los avisos de futuros talleres.',
            'Datos de navegación estadística: páginas visitadas, sección de referencia, país aproximado, tipo de dispositivo y navegador. Se recogen de forma agregada mediante Google Analytics y solo si aceptas las cookies analíticas.',
            'Preferencias técnicas: el idioma escogido y los productos personalizados que creas en el catálogo. Se guardan en tu propio navegador y no se transmiten a nuestros servidores.',
          ],
        },
        {
          kind: 'paragraph',
          text: 'No pedimos datos especialmente protegidos (salud, ideología, origen étnico, etc.). Si incluyes voluntariamente ese tipo de información en un mensaje, la trataremos con confidencialidad y únicamente para poder responderte.',
        },
      ],
    },
    {
      id: 'conservacion',
      title: '4. Cuánto tiempo conservamos los datos',
      blocks: [
        {
          kind: 'list',
          items: [
            'Inscripciones a talleres: mientras dure la relación y hasta que nos pidas la supresión. Una vez finalizado el taller, se conservan como máximo doce meses para justificar la organización y resolver incidencias.',
            'Consultas por correo electrónico: hasta que nos indiques que las borremos.',
            'Cookies analíticas: con los plazos que configura Google (hasta 26 meses para la cookie _ga). Puedes revocar el consentimiento en cualquier momento desde «Configuración de cookies».',
          ],
        },
        {
          kind: 'paragraph',
          text: 'Cuando deja de ser necesario conservar tus datos, los eliminamos aplicando medidas razonables de borrado seguro.',
        },
      ],
    },
    {
      id: 'destinatarios',
      title: '5. Destinatarios y transferencias internacionales',
      blocks: [
        {
          kind: 'paragraph',
          text: 'No cedemos tus datos a terceros con fines comerciales. Utilizamos proveedores que actúan como encargados del tratamiento y que solo acceden a los datos necesarios para prestar su servicio:',
        },
        {
          kind: 'list',
          items: [
            'Supabase (base de datos y autenticación), donde se almacenan las inscripciones.',
            'Vercel, que aloja y sirve este sitio web.',
            'Google Ireland Limited (Google Analytics), para la medición estadística, solo si aceptas las cookies analíticas.',
            'Etsy, Instagram y TikTok: no les enviamos datos. Al cargar imágenes de la tienda de Etsy o al pulsar los enlaces de redes sociales, esas plataformas pueden instalar sus propias cookies; consulta sus políticas de privacidad.',
          ],
        },
        {
          kind: 'paragraph',
          text: `Algunos proveedores transfieren datos fuera del Espacio Económico Europeo, en particular a Estados Unidos. Estas transferencias se amparan en el Escudo de Datos (Data Privacy Framework) cuando la empresa está certificada, o en las cláusulas contractuales tipo de la Comisión Europea, con las garantías adicionales previstas en los artículos 44 y siguientes del RGPD. Puedes pedirme copia de esas garantías escribiendo a ${contactEmail}.`,
        },
      ],
    },
    {
      id: 'derechos',
      title: '6. Tus derechos',
      blocks: [
        {
          kind: 'paragraph',
          text: `Puedes ejercer gratuitamente los siguientes derechos escribiendo a ${contactEmail}, indicando tu nombre y el motivo de la petición:`,
        },
        {
          kind: 'list',
          items: [
            'Acceso: saber qué datos tuyos estamos tratando.',
            'Rectificación: corregir los datos que sean inexactos.',
            'Supresión: pedir que borremos tus datos cuando ya no sean necesarios.',
            'Oposición: oponerte al tratamiento, incluidas las comunicaciones comerciales.',
            'Limitación: pedir que limitemos el tratamiento en los casos previstos en el artículo 18 del RGPD.',
            'Portabilidad: recibir tus datos en un formato estructurado y de uso común.',
          ],
        },
        {
          kind: 'paragraph',
          text: `También puedes presentar una reclamación ante la Agencia Española de Protección de Datos (${AEPD_URL}), especialmente si consideras que no hemos atendido correctamente tu petición. Si autorizaste los avisos de futuros talleres, puedes revocarlo en cualquier momento respondiendo a cualquiera de nuestros mensajes o pidiéndonoslo por escrito.`,
        },
      ],
    },
    {
      id: 'menores',
      title: '7. Menores de edad',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Este sitio no recopila conscientemente datos de menores de catorce años. Conforme al artículo 7 de la Ley Orgánica 3/2018, el tratamiento de los datos de un menor exige el consentimiento de sus padres, madres o tutores legales. Si eres menor y quieres inscribirte en un taller, pide a una persona adulta que complete la inscripción o que nos escriba.',
        },
      ],
    },
    {
      id: 'seguridad',
      title: '8. Medidas de seguridad',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Aplicamos medidas técnicas y organizativas apropiadas al riesgo: comunicación cifrada mediante HTTPS, acceso al panel de administración protegido con autenticación, base de datos con permisos mínimos por defecto y revisión periódica de las credenciales. Ninguna medida es inviolable; si quieres conocer más detalles, escríbenos.',
        },
      ],
    },
    {
      id: 'cambios',
      title: '9. Actualizaciones de esta política',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Esta política se actualizó por última vez el 27 de octubre de 2026. Cuando cambiemos algo relevante, lo publicaremos en esta página con una nueva fecha y, si el cambio afecta a un tratamiento ya consentido, volveremos a pedirte confirmación.',
        },
      ],
    },
  ],
};
