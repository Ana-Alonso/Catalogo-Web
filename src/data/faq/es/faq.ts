import type { FaqDocument } from '../types';
import { FAQ_CONTACT_EMAIL } from '../contact';

export const FAQ_DOCUMENT_ES: FaqDocument = {
  title: 'Preguntas frecuentes',
  description:
    'Cómo funcionan las ilustraciones, los encargos, las camisetas pintadas a mano y las joyas artesanales de Laurel en Lienzo: plazos, envíos y entregas en mano en Benidorm.',
  intro:
    'Lo que preguntas muchas veces cuando echas un vistazo al catálogo. Si te queda cualquier duda, escríbeme.',
  questions: [
    {
      id: 'alma',
      question: '¿Cuál es el alma de la marca?',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Laurel en Lienzo nace de la conexión con la naturaleza y con lo sensible. El proyecto se llama Laurel en Lienzo y nuestro lema es Crear, sentir y conectar.',
        },
        {
          kind: 'paragraph',
          text: 'Esta identidad está profundamente inspirada en el concepto de la hoja de laurel —un símbolo medicinal, que acompaña, que influye de forma positiva en los demás— y en mi libro Florecillas, donde siempre me he identificado con lo orgánico. Cada una de las palabras de nuestro lema tiene un porqué:',
        },
        {
          kind: 'list',
          items: [
            'Crear, porque necesitamos expresar todo lo que llevamos dentro.',
            'Sentir, porque sin las emociones la vida no tendría sentido.',
            'Conectar, porque no somos seres individuales; necesitamos de los demás para nutrirnos, compartir y crecer juntos.',
          ],
        },
      ],
    },
    {
      id: 'productos',
      question: '¿Qué productos se pueden comprar y cómo funcionan?',
      blocks: [
        {
          kind: 'paragraph',
          text: 'En Laurel en Lienzo encontrarás diferentes piezas creadas a mano. Dependiendo del producto, la disponibilidad y los plazos varían:',
        },
        {
          kind: 'list',
          items: [
            'Ilustraciones del catálogo: Son de carácter ILIMITADO. Puedes conseguirlas en formato digital o solicitar el envío en físico (añadiendo un dinero extra por los costes de envío).',
            `Ilustraciones personalizadas: Se realizan bajo ENCARGO DIRECTO. El tiempo de elaboración es de 1 a 3 días. Una vez listas, se envían por correo electrónico en formato digital. Si prefieres la versión en físico, el proceso total de preparación lleva de 1 a 7 días. Si se quiere en otro formato, consultar por email a ${FAQ_CONTACT_EMAIL}`,
            'Camisetas pintadas a mano: Aunque en teoría son LIMITADAS, cada diseño es único. Si una camiseta ya está vendida, puedes solicitar exactamente el mismo diseño por encargo; al ser pintadas a mano, tardaré entre 3 y 5 días en tenerla lista antes de enviarla.',
            'Joyas artesanales: Son LIMITADAS. Al trabajar con materiales muy concretos y específicos, se elaboran en tiradas muy cerradas o piezas únicas. Si una joya se agota, no es posible repetirla exactamente igual porque no dispongo de los mismos materiales.',
          ],
        },
      ],
    },
    {
      id: 'envios',
      question: '¿Cómo funcionan los envíos y los plazos?',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Envíos nacionales (España): Los envíos físicos dentro de España se realizan los lunes y los viernes de cada semana.',
        },
        {
          kind: 'paragraph',
          text: 'Envíos internacionales: Si te encuentras fuera de España y te gustaría adquirir alguna pieza, los envíos internacionales se gestionan de forma personalizada a través de Instagram. ¡Escríbeme por mensaje directo y lo organizamos!',
        },
      ],
    },
    {
      id: 'plataformas',
      question:
        'Si quiero comprar más de un producto, pero están en plataformas diferentes (como Etsy, Vinted o Amazon), ¿qué hago?',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Si te has enamorado de varias piezas que tengo repartidas en diferentes plataformas y quieres llevártelas juntas, no tienes que pagar envíos separados en cada sitio.',
        },
        {
          kind: 'paragraph',
          text: 'Puedes consultármelo directamente por correo electrónico o a través de un mensaje directo en Instagram. Cuéntame qué productos son los que te interesan y nos organizamos: te prepararé un lote de productos personalizado en una sola plataforma (la que ambos decidamos que te sea más cómoda) para que así el coste del envío sea único y te cueste mucho menos.',
        },
      ],
    },
    {
      id: 'entrega-mano',
      question: '¿Se pueden hacer entregas en mano?',
      blocks: [
        {
          kind: 'paragraph',
          text: '¡Sí, por supuesto! Si vives por la zona, realizamos entregas en mano lunes y viernes en Benidorm y sus alrededores.',
        },
      ],
    },
  ],
};
