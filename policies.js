/* ============================================================
   AURIA · Políticas
   Edita aquí los textos. Cada política tiene:
   - title, icon (id del ícono en index.html), intro, sections [{h, p | list}]
   ============================================================ */
const POLICIES_UPDATED = "Noviembre 2026";

const POLICIES = {
  envios: {
    title: "Política de envíos",
    tab: "Envíos",
    icon: "i-truck",
    intro: "Enviamos a toda la República Mexicana. Queremos que tu pedido llegue rápido y seguro.",
    sections: [
      { h: "Cobertura", p: "Realizamos envíos a los 32 estados de México mediante paqueterías nacionales." },
      { h: "Tiempos de preparación", p: "Tu pedido se prepara y se envía en un plazo de 1 a 2 días hábiles después de confirmar tu pago." },
      { h: "Tiempo de entrega", list: [
        "Envío estándar: de 3 a 7 días hábiles.",
        "Zonas extendidas o rurales pueden tardar de 2 a 3 días hábiles adicionales.",
        "Los días hábiles no incluyen sábados, domingos ni días festivos."
      ]},
      { h: "Costo de envío", p: "El costo depende de tu código postal y de la cantidad de piezas. Te lo confirmamos por mensaje directo antes de que realices tu pago." },
      { h: "Número de guía", p: "Al enviar tu paquete te compartimos tu número de guía por Instagram para que puedas rastrearlo." },
      { h: "Dirección correcta", p: "Es tu responsabilidad proporcionar una dirección completa y correcta. Si el paquete regresa por datos incorrectos o por no encontrar a nadie, el reenvío tendrá un costo adicional." },
      { h: "Paquetes dañados o extraviados", p: "Si tu paquete llega dañado, tómale fotos antes de abrirlo y escríbenos dentro de las primeras 24 horas. Te ayudamos a levantar el reporte con la paquetería." }
    ]
  },

  cambios: {
    title: "Cambios y devoluciones",
    tab: "Cambios",
    icon: "i-refresh",
    intro: "Queremos que ames tu pieza. Si la talla no te quedó, te ayudamos con un cambio.",
    sections: [
      { h: "Plazo para solicitar un cambio", p: "Tienes 7 días naturales a partir de que recibes tu pedido para solicitar un cambio por mensaje directo en Instagram." },
      { h: "Condiciones", list: [
        "La prenda debe estar sin uso, sin lavar y en perfectas condiciones.",
        "Debe conservar sus etiquetas originales.",
        "No debe tener olores (perfume, desodorante, sudor), maquillaje ni manchas.",
        "Debes enviarnos fotos de la prenda antes de autorizar el cambio."
      ]},
      { h: "Tipos de cambio", p: "Puedes cambiar tu pieza por otra talla o por otro modelo de igual o mayor precio (pagando la diferencia), sujeto a disponibilidad." },
      { h: "Costo de envío del cambio", p: "Los gastos de envío de un cambio por talla o gusto corren por cuenta de la clienta. Si el cambio es por un defecto de fabricación o un error nuestro, nosotras cubrimos el envío." },
      { h: "Devoluciones de dinero", p: "No realizamos reembolsos por talla o gusto. Solo se realiza reembolso si la pieza presenta un defecto de fabricación y no tenemos una pieza igual para reponerla." },
      { h: "Piezas sin cambio", list: [
        "Piezas en promoción o con “Precio especial”.",
        "Piezas usadas, lavadas o sin etiquetas.",
        "Bodys, rompers y jumpsuits por motivos de higiene, salvo defecto de fabricación."
      ]}
    ]
  },

  pagos: {
    title: "Pagos y apartados",
    tab: "Pagos",
    icon: "i-diamond",
    intro: "Todas las compras se confirman de forma personalizada por mensaje directo en Instagram.",
    sections: [
      { h: "Cómo se confirma tu pedido", p: "Al recibir tu mensaje revisamos la disponibilidad de tus piezas y te compartimos el total con envío y los datos para realizar tu pago." },
      { h: "Formas de pago", p: "Te compartimos por mensaje las opciones disponibles, como transferencia bancaria o depósito. Nunca te pediremos datos de tu tarjeta ni contraseñas." },
      { h: "Comprobante", p: "Una vez realizado el pago, envíanos tu comprobante por el mismo chat. Tu pedido se considera confirmado al verificar el pago." },
      { h: "Apartados", p: "Las piezas se apartan por 24 horas desde que te confirmamos disponibilidad. Si no recibimos tu pago en ese tiempo, la pieza se libera para otra clienta." },
      { h: "Precios", p: "Todos los precios están en pesos mexicanos (MXN). Los precios y la disponibilidad pueden cambiar sin previo aviso, pero respetamos el precio de los pedidos ya confirmados." },
      { h: "Cuidado con fraudes", p: "Solo atendemos desde nuestra cuenta oficial de Instagram. Si alguien te contacta desde otra cuenta a nombre de AURIA, repórtala y avísanos." }
    ]
  },

  privacidad: {
    title: "Aviso de privacidad",
    tab: "Privacidad",
    icon: "i-shield",
    intro: "Tu información es importante para nosotras. Este aviso explica qué datos usamos y para qué.",
    sections: [
      { h: "Datos que recabamos", p: "Nombre, teléfono, dirección de envío y usuario de Instagram que nos compartes voluntariamente al realizar un pedido." },
      { h: "Para qué los usamos", list: [
        "Confirmar, preparar y enviar tu pedido.",
        "Darte seguimiento, atender cambios y aclaraciones.",
        "Con tu autorización, avisarte de nuevas colecciones y promociones."
      ]},
      { h: "Con quién los compartimos", p: "Solo compartimos tu nombre, teléfono y dirección con la paquetería encargada de entregar tu pedido. No vendemos ni rentamos tu información." },
      { h: "Datos en este sitio", p: "Este sitio no tiene registro de usuarias. Tu bolsa, tus favoritos y los datos de envío que escribes en el pedido se guardan solo en tu propio navegador para que no tengas que escribirlos otra vez. Esos datos solo nos llegan cuando tú nos envías el mensaje por Instagram." },
      { h: "Tus derechos", p: "Puedes solicitar en cualquier momento el acceso, corrección o eliminación de tus datos escribiéndonos por mensaje directo en Instagram." }
    ]
  },

  terminos: {
    title: "Términos y condiciones",
    tab: "Términos",
    icon: "i-feather",
    intro: "Al realizar un pedido con AURIA aceptas los siguientes términos.",
    sections: [
      { h: "Productos", p: "Hacemos lo posible por mostrar los colores y detalles de cada pieza con fidelidad; el tono puede variar ligeramente según la pantalla y la iluminación de la foto." },
      { h: "Tallas", p: "Cada pieza indica su talla disponible. Te recomendamos revisar la talla o pedirnos asesoría por mensaje antes de comprar." },
      { h: "Disponibilidad", p: "Muchas piezas son de existencia limitada. Agregar una pieza a la bolsa no la aparta; el apartado se realiza al confirmar tu pedido por mensaje." },
      { h: "Pedidos", p: "Un pedido se considera confirmado cuando se verifica el pago. Nos reservamos el derecho de cancelar un pedido si la pieza ya no está disponible, devolviendo íntegramente lo pagado." },
      { h: "Uso del sitio", p: "Las imágenes, el logotipo y el contenido de este sitio pertenecen a AURIA y no pueden usarse sin autorización." },
      { h: "Cambios a estos términos", p: "Podemos actualizar estas políticas en cualquier momento. La versión vigente es la publicada en este sitio." }
    ]
  }
};
