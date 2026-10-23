import { handleRequest, streamTimeout } from "@vercel/react-router/entry.server";
import { Link, Links, Meta, Outlet, Scripts, ScrollRestoration, UNSAFE_FrameworkContext, UNSAFE_withComponentProps, UNSAFE_withErrorBoundaryProps, data, isRouteErrorResponse, redirect, useLoaderData, useLocation, useNavigate } from "react-router";
import React, { forwardRef, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { I18nextProvider, Trans, useTranslation } from "react-i18next";
import i18next from "i18next";
import { AlertCircle, AlertTriangle, ArrowLeft, Bell, Calendar, Check, CheckCircle, ClipboardList, Download, Edit3, ExternalLink, Eye, EyeOff, Globe, LoaderCircle, Lock, Mail, MapPin, Menu, Plus, RefreshCw, ShoppingBag, Sparkles, Tag, Trash2, Unlock, Upload, UserPlus, Users, X } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createClient } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "framer-motion";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region src/entry.server.tsx
var entry_server_exports = /* @__PURE__ */ __exportAll({
	default: () => handleDocumentRequest,
	streamTimeout: () => streamTimeout
});
var getRuntimeEnv = () => {
	return globalThis.process?.env ?? {};
};
var buildContentSecurityPolicy = (nonce) => [
	"default-src 'self'",
	"base-uri 'self'",
	"object-src 'none'",
	"frame-ancestors 'none'",
	`script-src 'self' 'nonce-${nonce}'`,
	"style-src 'self' 'unsafe-inline'",
	"img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com https://*.etsystatic.com",
	"font-src 'self'",
	"connect-src 'self' https://*.supabase.co",
	"form-action 'self'"
].join("; ");
async function handleDocumentRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
	const nonce = crypto.randomUUID();
	const env = getRuntimeEnv();
	const pathname = new URL(request.url).pathname;
	const routeErrors = routerContext.staticHandlerContext.errors;
	const hasRouteErrors = routeErrors ? Object.keys(routeErrors).length > 0 : false;
	if (env.VERCEL_ENV === "preview" || pathname.startsWith("/admin") || pathname.startsWith("/api") || hasRouteErrors || responseStatusCode >= 400) responseHeaders.set("X-Robots-Tag", "noindex, nofollow");
	if (env.NODE_ENV === "production") responseHeaders.set("Content-Security-Policy", buildContentSecurityPolicy(nonce));
	return handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext, { nonce });
}
var resources = {
	es: { translation: {
		meta: {
			"title": "Laurel en Lienzo | Ilustraciones personalizadas y talleres creativos",
			"description": "Catálogo de ilustraciones personalizadas, camisetas y talleres creativos. Piezas exclusivas hechas a mano para conectar contigo."
		},
		brand: { "name": "<highlight>Laurel</highlight> en Lienzo" },
		common: {
			"close": "Cerrar",
			"cancel": "Cancelar",
			"save": "Guardar",
			"delete": "Eliminar",
			"loading": "Cargando...",
			"retry": "Reintentar",
			"reload": "Recargar página"
		},
		language: {
			"label": "Idioma",
			"switchToSpanish": "Cambiar a español",
			"switchToEnglish": "Cambiar a inglés"
		},
		nav: {
			"ariaLabel": "Navegación principal",
			"homeAria": "Laurel en Lienzo - Inicio",
			"logoAlt": "Logo Laurel en Lienzo",
			"openMenu": "Abrir menú principal",
			"closeMenu": "Cerrar menú principal",
			"links": {
				"all": "Todos",
				"custom": "Personalizados",
				"tshirts": "Camisetas",
				"illustrations": "Ilustraciones",
				"workshops": "Talleres"
			}
		},
		hero: {
			"title": "<highlight>CREAR</highlight> SENTIR CONECTAR",
			"subtitle": "Ilustraciones personalizables cuidadas al más mínimo detalle para que tú puedas ser partícipe de ellas, añadiendo color o detalles. Talleres creativos y piezas exclusivas para llevar contigo.",
			"catalogCta": "Ver Catálogo",
			"etsyCta": "Tienda Etsy"
		},
		catalog: {
			"heading": "Catálogo",
			"headingAccent": "Visual",
			"filterAria": "Filtro de obras por categoría",
			"offers": "Ofertas",
			"loading": "Cargando catálogo…",
			"errorTitle": "No se pudo cargar el catálogo",
			"errorDescription": "Ha ocurrido un problema al cargar las obras. Vuelve a intentarlo.",
			"spotsError": "No se pudieron actualizar las plazas de los talleres.",
			"empty": "No hay piezas disponibles en esta categoría por el momento.",
			"emptyOffers": "No hay ofertas activas en esta categoría por el momento.",
			"categories": {
				"all": "Todas las obras",
				"custom": "Personalizados",
				"tshirts": "Camisetas",
				"illustrations": "Ilustraciones",
				"workshops": "Talleres"
			}
		},
		product: {
			"featured": "Destacado",
			"imageAlt": "Obra: {{title}}",
			"consult": "Consultar",
			"priceOnRequest": "Precio a consultar",
			"priceAria": "Precio {{price}}",
			"offerAria": "Precio {{finalPrice}}, antes {{originalPrice}}, {{discount}}% de descuento",
			"status": {
				"available": "Disponible",
				"reserved": "Reservado",
				"sold": "Vendido / Finalizado"
			},
			"spotsOpen": "Inscripción abierta",
			"spotsFull": "Completo · no quedan plazas",
			"spotsLeft": "Quedan {{spots}} de {{total}} plazas",
			"signup": "Apuntarse al taller",
			"signupAria": "Apuntarse al taller {{title}}",
			"workshopFull": "Taller completo",
			"buyEtsy": "Comprar en Etsy",
			"buyEtsyAria": "Comprar {{title}} en Etsy",
			"viewVinted": "Ver en Vinted",
			"viewVintedAria": "Comprar {{title}} en Vinted",
			"unavailable": "Pieza no disponible",
			"signupModalTitle": "Inscripción al taller"
		},
		workshop: {
			"form": {
				"intro": "Deja tus datos para reservar tu plaza en «{{title}}».",
				"nameLabel": "Tu nombre *",
				"namePlaceholder": "Nombre y apellidos",
				"emailLabel": "Tu email *",
				"emailPlaceholder": "tu@email.com",
				"submit": "Apuntarme al taller",
				"submitting": "Inscribiendo...",
				"errors": {
					"required": "Por favor indica tu nombre y tu email.",
					"invalidEmail": "Introduce un email válido.",
					"alreadyRegistered": "Ya estás apuntado a este taller con este email.",
					"workshopFull": "El taller está completo: no quedan plazas.",
					"notFound": "Inscripción no encontrada.",
					"unknown": "No se pudo completar la inscripción. Inténtalo de nuevo."
				},
				"successTitle": "¡Inscripción completada!",
				"successBody": "Te has apuntado al taller «{{title}}»."
			},
			"social": {
				"both": "Estate atento a nuestras redes sociales: publicaremos novedades y actualizaciones sobre el taller en <instagram>Instagram</instagram> y <tiktok>TikTok</tiktok>.",
				"instagram": "Estate atento a nuestras redes sociales: publicaremos novedades y actualizaciones sobre el taller en <instagram>Instagram</instagram>.",
				"tiktok": "Estate atento a nuestras redes sociales: publicaremos novedades y actualizaciones sobre el taller en <tiktok>TikTok</tiktok>.",
				"none": "Estate atento a nuestras redes sociales: publicaremos novedades y actualizaciones sobre el taller.",
				"instagramAria": "Ver novedades del taller en Instagram",
				"tiktokAria": "Ver novedades del taller en TikTok"
			}
		},
		calendar: {
			"heading": "Añadir a mi calendario",
			"googleAria": "Añadir el taller {{title}} a Google Calendar",
			"outlookAria": "Añadir el taller {{title}} a Outlook",
			"downloadAria": "Descargar el evento del taller {{title}} en formato ics",
			"priceLabel": "Precio",
			"filenameFallback": "taller"
		},
		footer: {
			"heading": "Pie de página",
			"emailAria": "Enviar correo a {{email}}",
			"etsyAria": "Visitar tienda oficial en Etsy",
			"instagramAria": "Visitar perfil de Instagram",
			"tiktokAria": "Visitar perfil de TikTok",
			"copyright": "© {{year}} Laurel en Lienzo. Todos los derechos reservados.",
			"accessibility": "Accesibilidad (WCAG)",
			"legal": "Aviso Legal"
		},
		a11y: {
			"skipToContent": "Saltar al contenido principal",
			"closeDialog": "Cerrar diálogo"
		},
		validation: {
			"titleDescription": "Por favor completa el título y la descripción de la obra.",
			"image": "Por favor sube una imagen para el producto o introduce una URL.",
			"price": "El precio introducido no es válido.",
			"discountRange": "El descuento debe ser un número entero entre 1 % y 90 %.",
			"discountRequiresPrice": "Para aplicar un descuento primero debes indicar un precio."
		},
		errors: {
			"notFound": {
				"title": "Página no encontrada",
				"description": "La página que buscas no existe o se ha movido.",
				"backHome": "Volver al catálogo"
			},
			"boundary": {
				"title": "Algo ha salido mal",
				"description": "No hemos podido mostrar esta página. Recarga para intentarlo de nuevo."
			}
		},
		admin: {
			"title": "Panel de Administración",
			"loadingSession": "Cargando sesión…",
			"backToSite": "Volver a la Web",
			"logout": "Cerrar sesión",
			"login": {
				"title": "Acceso Administrador",
				"subtitle": "Inicia sesión para gestionar el catálogo.",
				"emailLabel": "Email",
				"emailPlaceholder": "tu@email.com",
				"passwordLabel": "Contraseña",
				"passwordPlaceholder": "Contraseña",
				"submit": "Entrar",
				"submitting": "Entrando…",
				"invalidCredentials": "Email o contraseña incorrectos.",
				"unknownError": "Error al iniciar sesión."
			},
			"feedback": {
				"productCreated": "Producto publicado con éxito.",
				"productUpdated": "Producto actualizado correctamente.",
				"productDeleted": "Producto eliminado correctamente.",
				"productOperationError": "Error al procesar la operación.",
				"etsyUpdated": "Producto de Etsy actualizado correctamente.",
				"etsyUpdateError": "Error al actualizar el producto de Etsy.",
				"productDeleteError": "Error al eliminar el producto."
			},
			"productForm": {
				"editTitle": "Modificar Producto",
				"createTitle": "Añadir Nuevo Producto",
				"editDescription": "Editando los datos de \"{{title}}\"",
				"createDescription": "Sube nuevas obras, camisetas o talleres al catálogo.",
				"cancelEdit": "Cancelar Edición",
				"cancel": "Cancelar",
				"saving": "Guardando...",
				"saveChanges": "Guardar Modificación",
				"publish": "Publicar Producto",
				"imageFormatError": "Formato no permitido. Usa PNG, JPG, WEBP o GIF.",
				"imageSizeError": "La imagen supera los 5 MB."
			},
			"productFields": {
				"titleLabel": "Título de la Obra *",
				"titlePlaceholder": "Título del producto",
				"categoryLabel": "Categoría *",
				"statusLabel": "Estado / Disponibilidad *",
				"featuredLabel": "Destacar en la parte superior del catálogo",
				"descriptionLabel": "Descripción *",
				"descriptionPlaceholder": "Descripción, materiales, dimensiones...",
				"etsyLinkLabel": "Enlace de Etsy (opcional)",
				"vintedLinkLabel": "Enlace de Vinted (opcional)"
			},
			"workshopFields": {
				"dateLabel": "Fecha y Hora del Taller",
				"locationLabel": "Lugar o Modalidad",
				"locationPlaceholder": "Ej: Presencial (Madrid) u Online",
				"capacityLabel": "Cupo (opcional)",
				"capacityPlaceholder": "Sin límite",
				"capacityHint": "Deja vacío para inscripciones sin límite."
			},
			"priceFields": {
				"priceLabel": "Precio estimado en € (opcional)",
				"pricePlaceholder": "25,00",
				"onRequest": "Precio a consultar",
				"discountLabel": "Descuento % (opcional)",
				"discountPlaceholder": "20",
				"discountHint": "Se aplica solo a productos locales. Entre 1 % y 90 %.",
				"preview": "Vista previa",
				"before": "antes"
			},
			"imageField": {
				"label": "Imagen del Producto",
				"optionalHint": "(opcional si conservas la actual)",
				"requiredHint": "*",
				"upload": "Subir archivo desde el dispositivo",
				"formats": "PNG, JPG, WEBP o GIF (máx. 5 MB)",
				"previewAlt": "Vista previa",
				"urlHint": "O introduce una URL de imagen:"
			},
			"etsyForm": {
				"title": "Producto de Etsy",
				"subtitle": "Título, descripción, imagen, precio y estado se sincronizan desde Etsy.",
				"close": "Cerrar",
				"priceOnRequest": "Precio a consultar",
				"listing": "Listing #{{id}}",
				"status": "Estado en Etsy: {{state}}",
				"hidden": "Oculto en la web",
				"offersNote": "Las ofertas porcentuales solo están disponibles en productos locales. Para cambiar el precio o retirar este producto, hazlo desde Etsy.",
				"saveError": "No se pudieron guardar los cambios. Inténtalo de nuevo.",
				"categoryLabel": "Categoría en la web *",
				"featuredLabel": "Destacar en la parte superior del catálogo",
				"cancel": "Cancelar",
				"saving": "Guardando...",
				"saveChanges": "Guardar Cambios"
			},
			"etsySync": {
				"title": "Sincronización con Etsy",
				"description": "Los cambios en Etsy llegan automáticamente. Usa este botón para forzar una reconciliación completa.",
				"syncNow": "Sincronizar ahora",
				"syncing": "Sincronizando...",
				"success": "Sincronización completada: {{total}} productos ({{created}} nuevos, {{updated}} actualizados, {{hidden}} ocultos).",
				"error": "Error al sincronizar con Etsy.",
				"errors": {
					"notConfigured": "Supabase no está configurado.",
					"unauthorized": "Debes iniciar sesión para sincronizar con Etsy.",
					"unexpectedResponse": "Respuesta inesperada del servidor.",
					"unknown": "No se pudo sincronizar con Etsy."
				}
			},
			"productTable": {
				"empty": "No hay productos registrados en el catálogo.",
				"loading": "Cargando productos…",
				"errorTitle": "No se pudieron cargar los productos",
				"title": "Productos en Catálogo ({{count}})",
				"subtitle": "Gestiona disponibilidad, destacados y enlaces.",
				"columns": {
					"artwork": "Obra",
					"category": "Categoría",
					"availability": "Disponibilidad",
					"price": "Precio",
					"links": "Enlaces",
					"actions": "Acciones"
				},
				"featuredTitle": "Producto Destacado",
				"etsy": "Etsy",
				"hidden": "Oculto",
				"capacity": "Cupo: {{count}} plazas",
				"noCapacity": "Sin cupo",
				"consult": "A consultar",
				"editAria": "Modificar {{title}}",
				"deleteConfirm": "¿Seguro que deseas eliminar \"{{title}}\"?",
				"etsyDeleteHint": "Los productos de Etsy se eliminan desde Etsy",
				"etsyDeleteAria": "{{title}} se elimina desde Etsy",
				"deleteAria": "Eliminar {{title}}"
			},
			"registrations": {
				"title": "Inscripciones a Talleres ({{count}})",
				"subtitle": "Confirma, cancela o elimina las plazas solicitadas.",
				"loading": "Cargando inscripciones...",
				"errorTitle": "No se pudieron cargar las inscripciones",
				"emptyWorkshops": "No hay talleres publicados en el catálogo.",
				"spots": "{{active}} / {{cupo}} plazas",
				"attendee": "{{count}} inscrito",
				"attendees": "{{count}} inscritos",
				"empty": "Sin inscripciones todavía.",
				"confirmAria": "Confirmar inscripción de {{name}}",
				"cancelAria": "Cancelar inscripción de {{name}}",
				"deleteAria": "Eliminar inscripción de {{name}}",
				"deleteConfirm": "¿Seguro que deseas eliminar la inscripción de \"{{name}}\"?",
				"status": {
					"pending": "Pendiente",
					"confirmed": "Confirmado",
					"cancelled": "Cancelado"
				}
			},
			"calendarPanel": { "published": "Taller «{{title}}» publicado. Añade el evento a tu calendario:" },
			"errors": {
				"loadProducts": "Error desconocido al cargar productos",
				"saveProduct": "Error al guardar el producto",
				"updateProduct": "Error al actualizar el producto",
				"deleteProduct": "Error al eliminar el producto",
				"loadRegistrations": "Error desconocido al cargar inscripciones",
				"updateRegistration": "Error al actualizar la inscripción",
				"deleteRegistration": "Error al eliminar la inscripción"
			}
		}
	} },
	en: { translation: {
		meta: {
			"title": "Laurel en Lienzo | Custom illustrations and creative workshops",
			"description": "Catalog of custom illustrations, T-shirts and creative workshops. Exclusive handmade pieces to connect with you."
		},
		brand: { "name": "<highlight>Laurel</highlight> en Lienzo" },
		common: {
			"close": "Close",
			"cancel": "Cancel",
			"save": "Save",
			"delete": "Delete",
			"loading": "Loading...",
			"retry": "Retry",
			"reload": "Reload page"
		},
		language: {
			"label": "Language",
			"switchToSpanish": "Switch to Spanish",
			"switchToEnglish": "Switch to English"
		},
		nav: {
			"ariaLabel": "Main navigation",
			"homeAria": "Laurel en Lienzo - Home",
			"logoAlt": "Laurel en Lienzo logo",
			"openMenu": "Open main menu",
			"closeMenu": "Close main menu",
			"links": {
				"all": "All",
				"custom": "Custom",
				"tshirts": "T-shirts",
				"illustrations": "Illustrations",
				"workshops": "Workshops"
			}
		},
		hero: {
			"title": "<highlight>CREATE</highlight> FEEL CONNECT",
			"subtitle": "Personalizable illustrations crafted down to the smallest detail so you can be part of them, adding colour or details. Creative workshops and exclusive pieces to take with you.",
			"catalogCta": "View Catalog",
			"etsyCta": "Etsy Shop"
		},
		catalog: {
			"heading": "Visual",
			"headingAccent": "Catalog",
			"filterAria": "Filter works by category",
			"offers": "Offers",
			"loading": "Loading catalog…",
			"errorTitle": "Could not load the catalog",
			"errorDescription": "Something went wrong while loading the pieces. Please try again.",
			"spotsError": "Could not refresh workshop availability.",
			"empty": "There are no pieces available in this category right now.",
			"emptyOffers": "There are no active offers in this category right now.",
			"categories": {
				"all": "All works",
				"custom": "Custom",
				"tshirts": "T-shirts",
				"illustrations": "Illustrations",
				"workshops": "Workshops"
			}
		},
		product: {
			"featured": "Featured",
			"imageAlt": "Artwork: {{title}}",
			"consult": "Ask",
			"priceOnRequest": "Price on request",
			"priceAria": "Price {{price}}",
			"offerAria": "Price {{finalPrice}}, originally {{originalPrice}}, {{discount}}% off",
			"status": {
				"available": "Available",
				"reserved": "Reserved",
				"sold": "Sold / Finished"
			},
			"spotsOpen": "Registration open",
			"spotsFull": "Full · no spots left",
			"spotsLeft": "{{spots}} of {{total}} spots left",
			"signup": "Join the workshop",
			"signupAria": "Join the workshop {{title}}",
			"workshopFull": "Workshop full",
			"buyEtsy": "Buy on Etsy",
			"buyEtsyAria": "Buy {{title}} on Etsy",
			"viewVinted": "View on Vinted",
			"viewVintedAria": "Buy {{title}} on Vinted",
			"unavailable": "Piece unavailable",
			"signupModalTitle": "Workshop registration"
		},
		workshop: {
			"form": {
				"intro": "Leave your details to reserve your spot at «{{title}}».",
				"nameLabel": "Your name *",
				"namePlaceholder": "Full name",
				"emailLabel": "Your email *",
				"emailPlaceholder": "you@email.com",
				"submit": "Join the workshop",
				"submitting": "Registering...",
				"errors": {
					"required": "Please enter your name and email.",
					"invalidEmail": "Enter a valid email.",
					"alreadyRegistered": "You are already registered for this workshop with this email.",
					"workshopFull": "The workshop is full: no spots left.",
					"notFound": "Registration not found.",
					"unknown": "Could not complete registration. Please try again."
				},
				"successTitle": "Registration complete!",
				"successBody": "You have signed up for the workshop «{{title}}»."
			},
			"social": {
				"both": "Stay tuned to our social media: we will share news and updates about the workshop on <instagram>Instagram</instagram> and <tiktok>TikTok</tiktok>.",
				"instagram": "Stay tuned to our social media: we will share news and updates about the workshop on <instagram>Instagram</instagram>.",
				"tiktok": "Stay tuned to our social media: we will share news and updates about the workshop on <tiktok>TikTok</tiktok>.",
				"none": "Stay tuned to our social media: we will share news and updates about the workshop.",
				"instagramAria": "See workshop updates on Instagram",
				"tiktokAria": "See workshop updates on TikTok"
			}
		},
		calendar: {
			"heading": "Add to my calendar",
			"googleAria": "Add workshop {{title}} to Google Calendar",
			"outlookAria": "Add workshop {{title}} to Outlook",
			"downloadAria": "Download workshop {{title}} event as ics",
			"priceLabel": "Price",
			"filenameFallback": "workshop"
		},
		footer: {
			"heading": "Footer",
			"emailAria": "Send email to {{email}}",
			"etsyAria": "Visit official Etsy shop",
			"instagramAria": "Visit Instagram profile",
			"tiktokAria": "Visit TikTok profile",
			"copyright": "© {{year}} Laurel en Lienzo. All rights reserved.",
			"accessibility": "Accessibility (WCAG)",
			"legal": "Legal Notice"
		},
		a11y: {
			"skipToContent": "Skip to main content",
			"closeDialog": "Close dialog"
		},
		validation: {
			"titleDescription": "Please complete the title and description of the piece.",
			"image": "Please upload an image for the product or enter a URL.",
			"price": "The price entered is not valid.",
			"discountRange": "The discount must be a whole number between 1% and 90%.",
			"discountRequiresPrice": "To apply a discount you must first enter a price."
		},
		errors: {
			"notFound": {
				"title": "Page not found",
				"description": "The page you are looking for does not exist or has moved.",
				"backHome": "Back to the catalog"
			},
			"boundary": {
				"title": "Something went wrong",
				"description": "We could not display this page. Reload to try again."
			}
		},
		admin: {
			"title": "Admin Panel",
			"loadingSession": "Loading session…",
			"backToSite": "Back to site",
			"logout": "Log out",
			"login": {
				"title": "Admin Access",
				"subtitle": "Sign in to manage the catalog.",
				"emailLabel": "Email",
				"emailPlaceholder": "you@email.com",
				"passwordLabel": "Password",
				"passwordPlaceholder": "Password",
				"submit": "Sign in",
				"submitting": "Signing in…",
				"invalidCredentials": "Incorrect email or password.",
				"unknownError": "Could not sign in."
			},
			"feedback": {
				"productCreated": "Product published successfully.",
				"productUpdated": "Product updated successfully.",
				"productDeleted": "Product deleted successfully.",
				"productOperationError": "Could not complete the operation.",
				"etsyUpdated": "Etsy product updated successfully.",
				"etsyUpdateError": "Could not update the Etsy product.",
				"productDeleteError": "Could not delete the product."
			},
			"productForm": {
				"editTitle": "Edit Product",
				"createTitle": "Add New Product",
				"editDescription": "Editing the details of \"{{title}}\"",
				"createDescription": "Add new artwork, t-shirts or workshops to the catalog.",
				"cancelEdit": "Cancel Editing",
				"cancel": "Cancel",
				"saving": "Saving...",
				"saveChanges": "Save Changes",
				"publish": "Publish Product",
				"imageFormatError": "Unsupported format. Use PNG, JPG, WEBP or GIF.",
				"imageSizeError": "The image exceeds 5 MB."
			},
			"productFields": {
				"titleLabel": "Artwork Title *",
				"titlePlaceholder": "Product title",
				"categoryLabel": "Category *",
				"statusLabel": "Status / Availability *",
				"featuredLabel": "Feature at the top of the catalog",
				"descriptionLabel": "Description *",
				"descriptionPlaceholder": "Description, materials, dimensions...",
				"etsyLinkLabel": "Etsy link (optional)",
				"vintedLinkLabel": "Vinted link (optional)"
			},
			"workshopFields": {
				"dateLabel": "Workshop Date and Time",
				"locationLabel": "Location or Format",
				"locationPlaceholder": "E.g. In person (Madrid) or Online",
				"capacityLabel": "Capacity (optional)",
				"capacityPlaceholder": "No limit",
				"capacityHint": "Leave empty for unlimited registrations."
			},
			"priceFields": {
				"priceLabel": "Estimated price in € (optional)",
				"pricePlaceholder": "25.00",
				"onRequest": "Price on request",
				"discountLabel": "Discount % (optional)",
				"discountPlaceholder": "20",
				"discountHint": "Applies only to local products. Between 1% and 90%.",
				"preview": "Preview",
				"before": "before"
			},
			"imageField": {
				"label": "Product Image",
				"optionalHint": "(optional if you keep the current one)",
				"requiredHint": "*",
				"upload": "Upload file from device",
				"formats": "PNG, JPG, WEBP or GIF (max. 5 MB)",
				"previewAlt": "Preview",
				"urlHint": "Or enter an image URL:"
			},
			"etsyForm": {
				"title": "Etsy Product",
				"subtitle": "Title, description, image, price and status are synced from Etsy.",
				"close": "Close",
				"priceOnRequest": "Price on request",
				"listing": "Listing #{{id}}",
				"status": "Etsy status: {{state}}",
				"hidden": "Hidden on the site",
				"offersNote": "Percentage offers are only available on local products. To change the price or remove this product, do it from Etsy.",
				"saveError": "Could not save the changes. Please try again.",
				"categoryLabel": "Website category *",
				"featuredLabel": "Feature at the top of the catalog",
				"cancel": "Cancel",
				"saving": "Saving...",
				"saveChanges": "Save Changes"
			},
			"etsySync": {
				"title": "Etsy Sync",
				"description": "Changes from Etsy arrive automatically. Use this button to force a full reconciliation.",
				"syncNow": "Sync now",
				"syncing": "Syncing...",
				"success": "Sync complete: {{total}} products ({{created}} new, {{updated}} updated, {{hidden}} hidden).",
				"error": "Could not sync with Etsy.",
				"errors": {
					"notConfigured": "Supabase is not configured.",
					"unauthorized": "You must sign in to sync with Etsy.",
					"unexpectedResponse": "Unexpected server response.",
					"unknown": "Could not sync with Etsy."
				}
			},
			"productTable": {
				"empty": "There are no products registered in the catalog.",
				"loading": "Loading products…",
				"errorTitle": "Could not load products",
				"title": "Products in Catalog ({{count}})",
				"subtitle": "Manage availability, featured items and links.",
				"columns": {
					"artwork": "Artwork",
					"category": "Category",
					"availability": "Availability",
					"price": "Price",
					"links": "Links",
					"actions": "Actions"
				},
				"featuredTitle": "Featured Product",
				"etsy": "Etsy",
				"hidden": "Hidden",
				"capacity": "Capacity: {{count}} spots",
				"noCapacity": "No capacity",
				"consult": "Ask",
				"editAria": "Edit {{title}}",
				"deleteConfirm": "Are you sure you want to delete \"{{title}}\"?",
				"etsyDeleteHint": "Etsy products are deleted from Etsy",
				"etsyDeleteAria": "{{title}} is deleted from Etsy",
				"deleteAria": "Delete {{title}}"
			},
			"registrations": {
				"title": "Workshop Registrations ({{count}})",
				"subtitle": "Confirm, cancel or delete requested spots.",
				"loading": "Loading registrations...",
				"errorTitle": "Could not load registrations",
				"emptyWorkshops": "There are no published workshops in the catalog.",
				"spots": "{{active}} / {{cupo}} spots",
				"attendee": "{{count}} registered",
				"attendees": "{{count}} registered",
				"empty": "No registrations yet.",
				"confirmAria": "Confirm registration for {{name}}",
				"cancelAria": "Cancel registration for {{name}}",
				"deleteAria": "Delete registration for {{name}}",
				"deleteConfirm": "Are you sure you want to delete the registration for \"{{name}}\"?",
				"status": {
					"pending": "Pending",
					"confirmed": "Confirmed",
					"cancelled": "Cancelled"
				}
			},
			"calendarPanel": { "published": "Workshop \"{{title}}\" published. Add the event to your calendar:" },
			"errors": {
				"loadProducts": "Unknown error while loading products",
				"saveProduct": "Could not save the product",
				"updateProduct": "Could not update the product",
				"deleteProduct": "Could not delete the product",
				"loadRegistrations": "Unknown error while loading registrations",
				"updateRegistration": "Could not update the registration",
				"deleteRegistration": "Could not delete the registration"
			}
		}
	} }
};
//#endregion
//#region src/i18n/languages.ts
var SUPPORTED_LANGUAGES = ["es", "en"];
var isSupportedLanguage = (language) => language === "es" || language === "en";
var normalizeLanguage = (language) => language?.toLowerCase().startsWith("en") ? "en" : "es";
var getIntlLocale = (language) => normalizeLanguage(language) === "en" ? "en-GB" : "es-ES";
//#endregion
//#region src/i18n/createI18nInstance.ts
var createI18nInstance = (language) => {
	const instance = i18next.createInstance();
	instance.init({
		resources,
		lng: language,
		fallbackLng: "es",
		supportedLngs: [...SUPPORTED_LANGUAGES],
		load: "languageOnly",
		initAsync: false,
		returnNull: false,
		interpolation: { escapeValue: false },
		react: { useSuspense: false }
	});
	return instance;
};
//#endregion
//#region src/i18n/constants.ts
var LANGUAGE_COOKIE = "laurel_lang";
var LANGUAGE_STORAGE_KEY = "laurel_language";
//#endregion
//#region src/i18n/persistLanguage.ts
var persistLanguage = (language) => {
	const normalized = normalizeLanguage(language);
	if (typeof document !== "undefined") {
		document.documentElement.lang = normalized;
		document.cookie = `${LANGUAGE_COOKIE}=${normalized}; path=/; max-age=31536000; SameSite=Lax`;
	}
	if (typeof localStorage !== "undefined") localStorage.setItem(LANGUAGE_STORAGE_KEY, normalized);
	return normalized;
};
//#endregion
//#region src/i18n/paths.ts
var getPathLanguage = (pathname) => {
	const segment = pathname.split("/").filter(Boolean)[0];
	return isSupportedLanguage(segment) ? segment : null;
};
var buildLocalizedPath = (pathname, search, hash, language) => {
	if (pathname === "/admin" || pathname.startsWith("/admin/")) return `${pathname}${search}${hash}`;
	const segments = pathname.split("/").filter(Boolean);
	if (isSupportedLanguage(segments[0])) segments.shift();
	return `/${language}${segments.length > 0 ? `/${segments.join("/")}` : ""}${search}${hash}`;
};
//#endregion
//#region src/i18n/server.ts
var readCookie = (header, name) => {
	if (!header) return null;
	const entry = header.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
	if (!entry) return null;
	try {
		return decodeURIComponent(entry.slice(name.length + 1));
	} catch {
		return null;
	}
};
var resolveAcceptLanguage = (header) => {
	if (!header) return "es";
	return header.split(",").map((part) => {
		const [rawTag, ...parameters] = part.trim().split(";");
		const qualityParameter = parameters.map((parameter) => parameter.trim()).find((parameter) => /^q\s*=/i.test(parameter));
		const numericQuality = qualityParameter ? Number(qualityParameter.replace(/^q\s*=\s*/i, "")) : 1;
		return {
			tag: rawTag.trim().toLowerCase(),
			quality: Number.isFinite(numericQuality) ? numericQuality : 0
		};
	}).filter((preference) => preference.quality > 0).sort((a, b) => b.quality - a.quality).find((preference) => preference.tag === "en" || preference.tag.startsWith("en-") || preference.tag === "es" || preference.tag.startsWith("es-"))?.tag.startsWith("en") ? "en" : "es";
};
var resolvePreferredLanguage = (request) => {
	const pathLanguage = getPathLanguage(new URL(request.url).pathname);
	if (pathLanguage) return pathLanguage;
	const cookieLanguage = readCookie(request.headers.get("cookie"), LANGUAGE_COOKIE);
	if (cookieLanguage && isSupportedLanguage(cookieLanguage)) return cookieLanguage;
	return resolveAcceptLanguage(request.headers.get("accept-language"));
};
//#endregion
//#region src/hooks/useNoindex.ts
var NOINDEX_CONTENT = "noindex, nofollow";
var useNoindex = () => {
	useEffect(() => {
		const existing = document.head.querySelector("meta[name=\"robots\"]");
		const previousContent = existing?.content ?? null;
		const meta = existing ?? document.createElement("meta");
		if (!existing) {
			meta.name = "robots";
			document.head.appendChild(meta);
		}
		meta.content = NOINDEX_CONTENT;
		return () => {
			if (previousContent === null) {
				meta.remove();
				return;
			}
			meta.content = previousContent;
		};
	}, []);
};
//#endregion
//#region src/utils/logger.ts
var logError = (context, error) => {
	const normalized = error instanceof Error ? error : new Error(String(error));
	console.error(`[${context}]`, normalized);
};
//#endregion
//#region src/theme/index.ts
var theme = {
	colors: {
		primary: "bg-orange-600 hover:bg-orange-700 text-white",
		primaryText: "text-orange-600",
		primaryBorder: "border-orange-600",
		primaryFocus: "focus-visible:ring-orange-600",
		primaryBadge: "bg-orange-600/20 text-orange-400 border border-orange-500/30",
		background: "bg-neutral-950",
		surface: "bg-neutral-900",
		surfaceSubtle: "bg-neutral-950/60",
		border: "border-neutral-800",
		borderSubtle: "border-neutral-800/60",
		textMain: "text-white",
		textMuted: "text-neutral-400",
		textSubtle: "text-neutral-500"
	},
	inputs: {
		base: "w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:border-orange-600 text-sm transition-colors",
		label: "block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2"
	},
	card: { base: "bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden" }
};
//#endregion
//#region src/components/errors/ErrorBoundary.tsx
var ErrorFallback = () => {
	useNoindex();
	const { t } = useTranslation();
	return /* @__PURE__ */ jsx("main", {
		role: "alert",
		className: "min-h-screen bg-neutral-950 text-neutral-50 flex items-center justify-center px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-xl text-center",
			children: [
				/* @__PURE__ */ jsx(AlertTriangle, {
					className: "w-10 h-10 text-orange-500 mx-auto",
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "mt-4 text-3xl font-bold tracking-wide uppercase",
					children: t("errors.boundary.title")
				}),
				/* @__PURE__ */ jsx("p", {
					className: `${theme.colors.textMuted} mt-4 text-base`,
					children: t("errors.boundary.description")
				}),
				/* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => window.location.reload(),
					className: `inline-flex mt-8 items-center justify-center gap-2 rounded-md px-6 py-3 text-xs font-bold uppercase tracking-widest ${theme.colors.primary} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950`,
					children: [/* @__PURE__ */ jsx(RefreshCw, {
						className: "w-4 h-4",
						"aria-hidden": "true"
					}), t("common.reload")]
				})
			]
		})
	});
};
React.Component;
//#endregion
//#region src/hooks/useDocumentTitle.ts
var useDocumentTitle = (title) => {
	useEffect(() => {
		document.title = title;
	}, [title]);
};
//#endregion
//#region src/seo/site.ts
var DEFAULT_SITE_URL = "https://laurelenlienzo.vercel.app";
var SITE_NAME = "Laurel en Lienzo";
var DEFAULT_OG_IMAGE_PATH = "/og-image.png";
var getSiteUrl = () => {
	if (typeof window !== "undefined" && window.location.origin) return window.location.origin;
	return DEFAULT_SITE_URL;
};
//#endregion
//#region src/pages/NotFoundPage.tsx
var NotFoundPage = () => {
	const { t, i18n } = useTranslation();
	const language = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language);
	useDocumentTitle(`${t("errors.notFound.title")} | ${SITE_NAME}`);
	return /* @__PURE__ */ jsx("main", {
		className: "min-h-screen bg-neutral-950 text-neutral-50 flex items-center justify-center px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-xl text-center",
			children: [
				/* @__PURE__ */ jsx("p", {
					className: `${theme.colors.primaryText} text-6xl font-bold`,
					children: "404"
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "mt-4 text-3xl font-bold tracking-wide uppercase",
					children: t("errors.notFound.title")
				}),
				/* @__PURE__ */ jsx("p", {
					className: `${theme.colors.textMuted} mt-4 text-base`,
					children: t("errors.notFound.description")
				}),
				/* @__PURE__ */ jsx(Link, {
					to: `/${language}`,
					className: `inline-flex mt-8 items-center justify-center rounded-md px-6 py-3 text-xs font-bold uppercase tracking-widest ${theme.colors.primary} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950`,
					children: t("errors.notFound.backHome")
				})
			]
		})
	});
};
//#endregion
//#region src/seo/meta.ts
var OG_LOCALES = {
	es: "es_ES",
	en: "en_GB"
};
var isPreviewDeployment = () => {
	return globalThis.process?.env?.VERCEL_ENV === "preview";
};
var buildLanguageLinks = (siteUrl, language) => {
	const alternateLanguage = language === "es" ? "en" : "es";
	return [
		{
			tagName: "link",
			rel: "alternate",
			hrefLang: "es",
			href: `${siteUrl}/es`
		},
		{
			tagName: "link",
			rel: "alternate",
			hrefLang: "en",
			href: `${siteUrl}/en`
		},
		{
			tagName: "link",
			rel: "alternate",
			hrefLang: "x-default",
			href: `${siteUrl}/es`
		},
		{
			property: "og:locale",
			content: OG_LOCALES[language]
		},
		{
			property: "og:locale:alternate",
			content: OG_LOCALES[alternateLanguage]
		}
	];
};
var getRootLanguage = (matches) => {
	const rootData = (matches.find((match) => match.id === "root") ?? matches[0])?.data;
	return normalizeLanguage(rootData?.preferredLanguage);
};
var getHomeMeta = (language, siteUrl = getSiteUrl()) => {
	const translation = resources[language].translation;
	const title = translation.meta.title;
	const description = translation.meta.description;
	const canonicalUrl = `${siteUrl}/${language}`;
	const imageUrl = `${siteUrl}${DEFAULT_OG_IMAGE_PATH}`;
	const robots = isPreviewDeployment() ? "noindex, nofollow" : "index, follow";
	return [
		{ title },
		{
			name: "description",
			content: description
		},
		{
			name: "robots",
			content: robots
		},
		{
			tagName: "link",
			rel: "canonical",
			href: canonicalUrl
		},
		...buildLanguageLinks(siteUrl, language),
		{
			property: "og:type",
			content: "website"
		},
		{
			property: "og:site_name",
			content: SITE_NAME
		},
		{
			property: "og:title",
			content: title
		},
		{
			property: "og:description",
			content: description
		},
		{
			property: "og:url",
			content: canonicalUrl
		},
		{
			property: "og:image",
			content: imageUrl
		},
		{
			property: "og:image:width",
			content: "1200"
		},
		{
			property: "og:image:height",
			content: "630"
		},
		{
			property: "og:image:alt",
			content: title
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{
			name: "twitter:title",
			content: title
		},
		{
			name: "twitter:description",
			content: description
		},
		{
			name: "twitter:image",
			content: imageUrl
		},
		{
			name: "twitter:image:alt",
			content: title
		}
	];
};
var getNotFoundMeta = (language) => {
	const translation = resources[language].translation.errors.notFound;
	return [
		{ title: `${translation.title} | ${SITE_NAME}` },
		{
			name: "description",
			content: translation.description
		},
		{
			name: "robots",
			content: "noindex, nofollow"
		}
	];
};
var getAdminMeta = (language) => {
	return [{ title: `${resources[language].translation.admin.title} | ${SITE_NAME}` }, {
		name: "robots",
		content: "noindex, nofollow"
	}];
};
var getDefaultMeta = () => {
	const translation = resources.es.translation;
	return [{ title: translation.meta.title }, {
		name: "description",
		content: translation.meta.description
	}];
};
//#endregion
//#region src/root.tsx
var root_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary,
	Layout: () => Layout,
	default: () => root_default,
	loader: () => loader$3,
	meta: () => meta$3
});
function loader$3({ request }) {
	return { preferredLanguage: resolvePreferredLanguage(request) };
}
function meta$3() {
	return getDefaultMeta();
}
function Layout({ children }) {
	const data = useLoaderData();
	const pathLanguage = getPathLanguage(useLocation().pathname);
	const preferredLanguage = data?.preferredLanguage ?? "es";
	const language = pathLanguage ?? preferredLanguage;
	const i18n = useMemo(() => createI18nInstance(language), [language]);
	useEffect(() => {
		const handleLanguageChanged = (nextLanguage) => {
			document.documentElement.lang = normalizeLanguage(nextLanguage);
		};
		i18n.on("languageChanged", handleLanguageChanged);
		return () => {
			i18n.off("languageChanged", handleLanguageChanged);
		};
	}, [i18n]);
	useEffect(() => {
		if (pathLanguage) persistLanguage(pathLanguage);
	}, [pathLanguage]);
	return /* @__PURE__ */ jsxs("html", {
		lang: language,
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
			/* @__PURE__ */ jsx("meta", {
				name: "viewport",
				content: "width=device-width, initial-scale=1.0"
			}),
			/* @__PURE__ */ jsx("meta", {
				name: "theme-color",
				content: "#0a0a0a"
			}),
			/* @__PURE__ */ jsx("link", {
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			}),
			/* @__PURE__ */ jsx(Meta, {}),
			/* @__PURE__ */ jsx(Links, {})
		] }), /* @__PURE__ */ jsxs("body", { children: [
			/* @__PURE__ */ jsx(I18nextProvider, {
				i18n,
				children
			}),
			/* @__PURE__ */ jsx(ScrollRestoration, {}),
			/* @__PURE__ */ jsx(Scripts, {})
		] })]
	});
}
var root_default = UNSAFE_withComponentProps(function App() {
	return /* @__PURE__ */ jsx(Outlet, {});
});
var ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary({ error }) {
	if (isRouteErrorResponse(error) && error.status === 404) return /* @__PURE__ */ jsx(NotFoundPage, {});
	return /* @__PURE__ */ jsx(ErrorFallback, {});
});
//#endregion
//#region src/routes/language-redirect.ts
var language_redirect_exports = /* @__PURE__ */ __exportAll({ loader: () => loader$2 });
function loader$2({ request }) {
	return redirect(`/${resolvePreferredLanguage(request)}`);
}
//#endregion
//#region src/components/ui/Button.tsx
var variantStyles$2 = {
	primary: "bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/20 focus-visible:ring-white",
	secondary: "bg-neutral-800 hover:bg-neutral-700 text-neutral-200 focus-visible:ring-orange-600",
	outline: "bg-transparent border border-neutral-700 hover:border-white text-white focus-visible:ring-orange-600",
	ghost: "bg-transparent hover:bg-neutral-800 text-neutral-400 hover:text-white focus-visible:ring-orange-600",
	danger: "bg-red-600/10 border border-red-500/30 hover:bg-red-600 text-red-400 hover:text-white focus-visible:ring-red-500"
};
var sizeStyles = {
	sm: "px-3 py-1.5 text-xs",
	md: "px-5 py-2.5 text-xs",
	lg: "px-8 py-4 text-sm font-bold tracking-widest"
};
var Button = ({ variant = "primary", size = "md", className, children, type = "button", ...props }) => {
	return /* @__PURE__ */ jsx("button", {
		type,
		className: twMerge(clsx("inline-flex items-center justify-center gap-2 font-semibold uppercase tracking-wider rounded-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:opacity-50 disabled:pointer-events-none cursor-pointer", variantStyles$2[variant], sizeStyles[size], className)),
		...props,
		children
	});
};
//#endregion
//#region src/components/ui/Input.tsx
var Input = forwardRef(({ label, error, className, id, endAdornment, ...props }, ref) => {
	return /* @__PURE__ */ jsxs("div", {
		className: "w-full",
		children: [
			label && /* @__PURE__ */ jsx("label", {
				htmlFor: id,
				className: "block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2",
				children: label
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative",
				children: [/* @__PURE__ */ jsx("input", {
					ref,
					id,
					className: twMerge(clsx("w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:border-orange-600 text-sm transition-colors", error && "border-red-500 focus:border-red-500", endAdornment && "pr-12", className)),
					...props
				}), endAdornment && /* @__PURE__ */ jsx("div", {
					className: "absolute inset-y-0 right-2 flex items-center",
					children: endAdornment
				})]
			}),
			error && /* @__PURE__ */ jsx("p", {
				className: "mt-1 text-xs text-red-400",
				children: error
			})
		]
	});
});
Input.displayName = "Input";
//#endregion
//#region src/components/ui/PasswordInput.tsx
var PasswordInput = forwardRef(({ className, ...props }, ref) => {
	const [isVisible, setIsVisible] = useState(false);
	const toggleVisibility = () => {
		setIsVisible((prev) => !prev);
	};
	return /* @__PURE__ */ jsx(Input, {
		ref,
		type: isVisible ? "text" : "password",
		className,
		endAdornment: /* @__PURE__ */ jsx("button", {
			type: "button",
			onClick: toggleVisibility,
			"aria-label": isVisible ? "Ocultar contraseña" : "Mostrar contraseña",
			className: "p-1.5 text-neutral-400 hover:text-orange-400 focus:outline-none focus-visible:text-orange-400 rounded transition-colors",
			children: isVisible ? /* @__PURE__ */ jsx(EyeOff, {
				className: "w-4 h-4",
				"aria-hidden": "true"
			}) : /* @__PURE__ */ jsx(Eye, {
				className: "w-4 h-4",
				"aria-hidden": "true"
			})
		}),
		...props
	});
});
PasswordInput.displayName = "PasswordInput";
//#endregion
//#region src/components/ui/Card.tsx
var Card = ({ variant = "default", className, children, ...props }) => {
	return /* @__PURE__ */ jsx("div", {
		className: twMerge(clsx("border rounded-xl overflow-hidden", variant === "default" && "bg-neutral-900 border-neutral-800", variant === "subtle" && "bg-neutral-950/60 border-neutral-800/60", className)),
		...props,
		children
	});
};
//#endregion
//#region src/components/ui/Badge.tsx
var variantStyles$1 = {
	primary: "bg-orange-600/20 text-orange-400 border-orange-500/30",
	neutral: "bg-neutral-800 text-neutral-300 border-neutral-700",
	outline: "bg-transparent text-neutral-400 border-neutral-800"
};
var Badge = ({ variant = "neutral", className, children, ...props }) => {
	return /* @__PURE__ */ jsx("span", {
		className: twMerge(clsx("inline-flex items-center px-2.5 py-1 text-xs rounded uppercase font-semibold border", variantStyles$1[variant], className)),
		...props,
		children
	});
};
//#endregion
//#region src/components/ui/Box.tsx
var Box = ({ as: Component = "div", className, children, ...props }) => {
	return /* @__PURE__ */ jsx(Component, {
		className: twMerge(clsx(className)),
		...props,
		children
	});
};
//#endregion
//#region src/components/ui/Typography.tsx
var defaultVariantElements = {
	h1: "h1",
	h2: "h2",
	h3: "h3",
	h4: "h4",
	body: "p",
	caption: "span",
	subtitle: "p"
};
var variantStyles = {
	h1: "text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none",
	h2: "text-3xl md:text-5xl font-extrabold text-white uppercase tracking-wider",
	h3: "text-xl font-bold text-white uppercase tracking-wider",
	h4: "text-lg font-bold text-white",
	body: "text-neutral-400 text-sm leading-relaxed",
	subtitle: "text-lg sm:text-xl text-neutral-400 font-light",
	caption: "text-xs uppercase tracking-wider font-semibold"
};
var Typography = ({ as, variant = "body", className, children, ...props }) => {
	const Component = as || defaultVariantElements[variant];
	return /* @__PURE__ */ jsx(Component, {
		className: twMerge(clsx(variantStyles[variant], className)),
		...props,
		children
	});
};
//#endregion
//#region src/utils/price.ts
var DEFAULT_CURRENCY = "EUR";
var CURRENCY_PATTERN = /^[A-Z]{3}$/;
var parsePriceToCents = (value) => {
	if (!value) return null;
	const normalized = value.trim().replace(/[^\d,.]/g, "");
	if (!normalized) return null;
	let numeric = normalized;
	if (normalized.includes(",")) numeric = normalized.replace(/\./g, "").replace(",", ".");
	else {
		const parts = normalized.split(".");
		if (parts.length > 2) numeric = `${parts.slice(0, -1).join("")}.${parts[parts.length - 1]}`;
	}
	const parsed = Number(numeric);
	if (!Number.isFinite(parsed) || parsed < 0) return null;
	return Math.round(parsed * 100);
};
var normalizeCurrency = (currency) => {
	const candidate = (currency ?? DEFAULT_CURRENCY).trim().toUpperCase();
	return CURRENCY_PATTERN.test(candidate) ? candidate : DEFAULT_CURRENCY;
};
var formatPrice = (cents, currency, locale = "es-ES") => {
	if (cents == null) return "";
	const code = normalizeCurrency(currency);
	try {
		return new Intl.NumberFormat(locale, {
			style: "currency",
			currency: code,
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(cents / 100);
	} catch {
		return `${(cents / 100).toFixed(2)} ${code}`;
	}
};
var getDiscountedCents = (cents, discountPercent) => {
	if (cents == null) return null;
	if (discountPercent == null || discountPercent < 1 || discountPercent > 90) return cents;
	return Math.round(cents * (100 - discountPercent) / 100);
};
var isOfferActive = (item) => item.source !== "etsy" && item.priceCents != null && item.discountPercent != null && item.discountPercent >= 1 && item.discountPercent <= 90;
//#endregion
//#region src/utils/calendar.ts
var DEFAULT_DURATION_MS = 72e5;
var DEFAULT_CALENDAR_LABELS = {
	language: "es",
	priceLabel: "Precio",
	filenameFallback: "taller"
};
var getCalendarLocale = (language) => language.toLowerCase().startsWith("en") ? "en-GB" : "es-ES";
var buildEventDescription = (workshop, labels) => {
	const price = formatPrice(workshop.priceCents, workshop.currency, getCalendarLocale(labels.language));
	return price ? `${workshop.description}\n${labels.priceLabel}: ${price}` : workshop.description;
};
var parseWorkshopDate = (eventDate) => {
	if (!eventDate) return null;
	const start = new Date(eventDate);
	if (Number.isNaN(start.getTime())) return null;
	return {
		start,
		end: new Date(start.getTime() + DEFAULT_DURATION_MS)
	};
};
var formatIcsDate = (date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
var escapeIcsText = (text) => text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
var foldIcsLine = (line) => {
	if (line.length <= 73) return line;
	const segments = [];
	let remaining = line;
	segments.push(remaining.slice(0, 73));
	remaining = remaining.slice(73);
	while (remaining.length > 0) {
		segments.push(` ${remaining.slice(0, 72)}`);
		remaining = remaining.slice(72);
	}
	return segments.join("\r\n");
};
var buildWorkshopIcs = (workshop, attendee, labels = DEFAULT_CALENDAR_LABELS) => {
	const eventDate = parseWorkshopDate(workshop.eventDate);
	if (!eventDate) return "";
	const contactEmail = "laurelenlienzo@gmail.com";
	const description = buildEventDescription(workshop, labels);
	const lines = [
		"BEGIN:VCALENDAR",
		"VERSION:2.0",
		`PRODID:-//Laurel en Lienzo//Talleres//${labels.language.toUpperCase()}`,
		"CALSCALE:GREGORIAN",
		"METHOD:PUBLISH",
		"BEGIN:VEVENT",
		`UID:${workshop.id}-${eventDate.start.getTime()}@laurelenlienzo`,
		`DTSTAMP:${formatIcsDate(/* @__PURE__ */ new Date())}`,
		`DTSTART:${formatIcsDate(eventDate.start)}`,
		`DTEND:${formatIcsDate(eventDate.end)}`,
		`SUMMARY:${escapeIcsText(workshop.title)}`,
		`DESCRIPTION:${escapeIcsText(description)}`
	];
	if (workshop.eventLocation) lines.push(`LOCATION:${escapeIcsText(workshop.eventLocation)}`);
	lines.push(`ORGANIZER;CN=Laurel en Lienzo:mailto:${contactEmail}`);
	if (attendee) lines.push(`ATTENDEE;CN=${escapeIcsText(attendee.name)};RSVP=TRUE:mailto:${attendee.email}`);
	lines.push("END:VEVENT", "END:VCALENDAR");
	return `${lines.map(foldIcsLine).join("\r\n")}\r\n`;
};
var getGoogleCalendarUrl = (workshop, labels = DEFAULT_CALENDAR_LABELS) => {
	const eventDate = parseWorkshopDate(workshop.eventDate);
	if (!eventDate) return "";
	return `https://calendar.google.com/calendar/render?${new URLSearchParams({
		action: "TEMPLATE",
		text: workshop.title,
		dates: `${formatIcsDate(eventDate.start)}/${formatIcsDate(eventDate.end)}`,
		details: buildEventDescription(workshop, labels),
		location: workshop.eventLocation || ""
	}).toString()}`;
};
var getOutlookCalendarUrl = (workshop, labels = DEFAULT_CALENDAR_LABELS) => {
	const eventDate = parseWorkshopDate(workshop.eventDate);
	if (!eventDate) return "";
	return `https://outlook.live.com/calendar/0/deeplink/compose?${new URLSearchParams({
		path: "/calendar/action/compose",
		rru: "addevent",
		subject: workshop.title,
		startdt: eventDate.start.toISOString(),
		enddt: eventDate.end.toISOString(),
		body: buildEventDescription(workshop, labels),
		location: workshop.eventLocation || ""
	}).toString()}`;
};
var downloadIcsFile = (filename, ics) => {
	const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = filename;
	document.body.appendChild(anchor);
	anchor.click();
	document.body.removeChild(anchor);
	URL.revokeObjectURL(url);
};
var buildIcsFilename = (title, fallback = "taller") => {
	return `laurel-${title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || fallback}.ics`;
};
//#endregion
//#region src/components/ui/CalendarEventActions.tsx
var linkClassName = "w-full inline-flex justify-center items-center gap-2 bg-transparent border border-neutral-700 hover:border-white text-neutral-300 hover:text-white font-semibold uppercase tracking-wider text-xs py-2.5 px-4 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950";
var CalendarEventActions = ({ workshop, attendee, className }) => {
	const { t, i18n } = useTranslation();
	if (!parseWorkshopDate(workshop.eventDate)) return null;
	const labels = {
		language: normalizeLanguage(i18n.resolvedLanguage ?? i18n.language),
		priceLabel: t("calendar.priceLabel"),
		filenameFallback: t("calendar.filenameFallback")
	};
	const googleUrl = getGoogleCalendarUrl(workshop, labels);
	const outlookUrl = getOutlookCalendarUrl(workshop, labels);
	const handleDownload = () => {
		downloadIcsFile(buildIcsFilename(workshop.title, labels.filenameFallback), buildWorkshopIcs(workshop, attendee, labels));
	};
	return /* @__PURE__ */ jsxs(Box, {
		className,
		children: [/* @__PURE__ */ jsxs("p", {
			className: "text-xs uppercase font-semibold tracking-wider text-neutral-400 flex items-center gap-1.5 mb-2",
			children: [/* @__PURE__ */ jsx(Calendar, {
				className: "w-3.5 h-3.5 text-orange-400",
				"aria-hidden": "true"
			}), t("calendar.heading")]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col sm:flex-row gap-2",
			children: [
				/* @__PURE__ */ jsxs("a", {
					href: googleUrl,
					target: "_blank",
					rel: "noopener noreferrer",
					className: linkClassName,
					"aria-label": t("calendar.googleAria", { title: workshop.title }),
					children: [/* @__PURE__ */ jsx(Globe, {
						className: "w-3.5 h-3.5",
						"aria-hidden": "true"
					}), "Google"]
				}),
				/* @__PURE__ */ jsxs("a", {
					href: outlookUrl,
					target: "_blank",
					rel: "noopener noreferrer",
					className: linkClassName,
					"aria-label": t("calendar.outlookAria", { title: workshop.title }),
					children: [/* @__PURE__ */ jsx(Calendar, {
						className: "w-3.5 h-3.5",
						"aria-hidden": "true"
					}), "Outlook"]
				}),
				/* @__PURE__ */ jsxs(Button, {
					type: "button",
					variant: "outline",
					size: "sm",
					className: "w-full uppercase",
					onClick: handleDownload,
					"aria-label": t("calendar.downloadAria", { title: workshop.title }),
					children: [/* @__PURE__ */ jsx(Download, {
						className: "w-3.5 h-3.5",
						"aria-hidden": "true"
					}), ".ics"]
				})
			]
		})]
	});
};
//#endregion
//#region src/components/ui/Skeleton.tsx
var roundedStyles = {
	none: "rounded-none",
	sm: "rounded-sm",
	md: "rounded-md",
	lg: "rounded-lg",
	full: "rounded-full"
};
var Skeleton = ({ className, rounded = "md", ...props }) => {
	return /* @__PURE__ */ jsx("div", {
		"aria-hidden": "true",
		className: twMerge(clsx("animate-pulse bg-neutral-800/80", roundedStyles[rounded], className)),
		...props
	});
};
//#endregion
//#region src/components/ui/ErrorState.tsx
var ErrorState = ({ title, description, onRetry, retryLabel, className }) => {
	return /* @__PURE__ */ jsxs(Card, {
		role: "alert",
		className: twMerge(clsx("p-8 text-center flex flex-col items-center gap-4", className)),
		children: [
			/* @__PURE__ */ jsx(AlertTriangle, {
				className: "w-8 h-8 text-orange-500",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ jsx("h3", {
					className: "text-lg font-bold text-white",
					children: title
				}), /* @__PURE__ */ jsx("p", {
					className: `${theme.colors.textMuted} text-sm max-w-md mx-auto`,
					children: description
				})]
			}),
			onRetry && retryLabel && /* @__PURE__ */ jsxs(Button, {
				variant: "outline",
				onClick: () => void onRetry(),
				children: [/* @__PURE__ */ jsx(RefreshCw, {
					className: "w-4 h-4",
					"aria-hidden": "true"
				}), retryLabel]
			})
		]
	});
};
//#endregion
//#region src/utils/imageValidation.ts
var ALLOWED_IMAGE_MIME_TYPES = [
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/gif"
];
var MAX_IMAGE_SIZE_BYTES = 5242880;
var ACCEPTED_IMAGE_INPUT = ALLOWED_IMAGE_MIME_TYPES.join(",");
var validateImageFile = (file) => {
	if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) return "format";
	if (file.size > MAX_IMAGE_SIZE_BYTES) return "size";
	return null;
};
//#endregion
//#region src/utils/productLinks.ts
var resolvePurchaseLinks = (category, etsyLink, vintedLink) => {
	if (category === "talleres") return {};
	return {
		etsyLink: etsyLink?.trim() || void 0,
		vintedLink: vintedLink?.trim() || void 0
	};
};
//#endregion
//#region src/utils/productFormValidation.ts
var validateProductForm = (input) => {
	if (!input.title.trim() || !input.description.trim()) return "titleDescription";
	if (!input.isEditing && !input.imageFile && !input.externalImageUrl.trim()) return "image";
	const priceCents = input.priceOnRequest ? null : parsePriceToCents(input.price);
	if (!input.priceOnRequest && input.price.trim() && priceCents == null) return "price";
	if (!input.discountPercent.trim()) return null;
	const discount = Number(input.discountPercent.replace(",", "."));
	if (!Number.isInteger(discount) || discount < 1 || discount > 90) return "discountRange";
	if (priceCents == null) return "discountRequiresPrice";
	return null;
};
//#endregion
//#region src/components/admin/product-form/ImageField.tsx
var ImageField = ({ previewUrl, externalImageUrl, isEditing, onFileChange, onExternalUrlChange }) => {
	const { t } = useTranslation();
	return /* @__PURE__ */ jsxs(Box, {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ jsxs("label", {
				className: theme.inputs.label,
				children: [
					t("admin.imageField.label"),
					" ",
					isEditing ? t("admin.imageField.optionalHint") : t("admin.imageField.requiredHint")
				]
			}),
			/* @__PURE__ */ jsxs(Box, {
				className: "flex flex-col sm:flex-row items-center gap-6",
				children: [/* @__PURE__ */ jsxs("label", {
					className: "w-full sm:w-auto flex-1 cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-800 hover:border-orange-600 rounded-lg transition-colors bg-neutral-950/60",
					children: [
						/* @__PURE__ */ jsx(Upload, { className: "w-8 h-8 text-neutral-500 mb-2 group-hover:text-orange-600" }),
						/* @__PURE__ */ jsx("span", {
							className: "text-sm text-neutral-300 font-medium",
							children: t("admin.imageField.upload")
						}),
						/* @__PURE__ */ jsx("span", {
							className: "text-xs text-neutral-500 mt-1",
							children: t("admin.imageField.formats")
						}),
						/* @__PURE__ */ jsx("input", {
							type: "file",
							accept: ACCEPTED_IMAGE_INPUT,
							onChange: onFileChange,
							className: "hidden"
						})
					]
				}), (previewUrl || externalImageUrl) && /* @__PURE__ */ jsx(Box, {
					className: "w-28 h-28 relative rounded-lg overflow-hidden border border-neutral-700 bg-neutral-800 flex-shrink-0",
					children: /* @__PURE__ */ jsx("img", {
						src: previewUrl || externalImageUrl,
						alt: t("admin.imageField.previewAlt"),
						className: "w-full h-full object-cover"
					})
				})]
			}),
			/* @__PURE__ */ jsxs(Box, { children: [/* @__PURE__ */ jsx("span", {
				className: "text-xs text-neutral-500 block mb-1",
				children: t("admin.imageField.urlHint")
			}), /* @__PURE__ */ jsx("input", {
				type: "url",
				value: externalImageUrl,
				onChange: (event) => onExternalUrlChange(event.target.value),
				placeholder: "https://...",
				className: theme.inputs.base
			})] })
		]
	});
};
//#endregion
//#region src/i18n/formatters.ts
var formatPriceForLanguage = (cents, currency, language) => formatPrice(cents, currency, getIntlLocale(language));
var formatWorkshopDateForLanguage = (value, language) => {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return new Intl.DateTimeFormat(getIntlLocale(language), {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	}).format(date);
};
//#endregion
//#region src/components/admin/product-form/PriceFields.tsx
var PriceFields = ({ price, priceOnRequest, discountPercent, onPriceChange, onPriceOnRequestChange, onDiscountChange }) => {
	const { t, i18n } = useTranslation();
	const language = i18n.resolvedLanguage ?? i18n.language;
	const priceCents = priceOnRequest ? null : parsePriceToCents(price);
	const parsedDiscount = Number(discountPercent.replace(",", "."));
	const hasValidDiscount = Number.isInteger(parsedDiscount) && parsedDiscount >= 1 && parsedDiscount <= 90 && priceCents != null;
	const finalCents = hasValidDiscount ? getDiscountedCents(priceCents, parsedDiscount) : priceCents;
	return /* @__PURE__ */ jsxs(Box, {
		className: "grid grid-cols-1 md:grid-cols-3 gap-6",
		children: [
			/* @__PURE__ */ jsxs(Box, { children: [/* @__PURE__ */ jsx(Input, {
				id: "prod-price",
				label: t("admin.priceFields.priceLabel"),
				type: "number",
				min: 0,
				step: "0.01",
				inputMode: "decimal",
				value: priceOnRequest ? "" : price,
				disabled: priceOnRequest,
				onChange: (event) => onPriceChange(event.target.value),
				placeholder: t("admin.priceFields.pricePlaceholder")
			}), /* @__PURE__ */ jsxs(Box, {
				className: "mt-3 flex items-center gap-2",
				children: [/* @__PURE__ */ jsx("input", {
					id: "prod-price-on-request",
					type: "checkbox",
					checked: priceOnRequest,
					onChange: (event) => onPriceOnRequestChange(event.target.checked),
					className: "w-4 h-4 text-orange-600 bg-neutral-950 border-neutral-800 rounded focus:ring-orange-600"
				}), /* @__PURE__ */ jsx("label", {
					htmlFor: "prod-price-on-request",
					className: "text-xs uppercase font-semibold text-neutral-300 cursor-pointer",
					children: t("admin.priceFields.onRequest")
				})]
			})] }),
			/* @__PURE__ */ jsxs(Box, { children: [/* @__PURE__ */ jsx(Input, {
				id: "prod-discount",
				label: t("admin.priceFields.discountLabel"),
				type: "number",
				min: 1,
				max: 90,
				step: 1,
				value: discountPercent,
				disabled: priceOnRequest,
				onChange: (event) => onDiscountChange(event.target.value),
				placeholder: t("admin.priceFields.discountPlaceholder")
			}), /* @__PURE__ */ jsx("p", {
				className: `mt-2 text-xs ${theme.colors.textMuted}`,
				children: t("admin.priceFields.discountHint")
			})] }),
			/* @__PURE__ */ jsxs(Box, {
				className: "rounded-lg border border-neutral-800 bg-neutral-950/60 p-4",
				children: [/* @__PURE__ */ jsx("span", {
					className: "block text-xs font-semibold uppercase tracking-wider text-neutral-400",
					children: t("admin.priceFields.preview")
				}), finalCents == null ? /* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-neutral-300",
					children: t("admin.priceFields.onRequest")
				}) : /* @__PURE__ */ jsxs(Box, {
					className: "mt-2 space-y-1",
					children: [/* @__PURE__ */ jsx("p", {
						className: "text-lg font-bold text-orange-400",
						children: formatPriceForLanguage(finalCents, "EUR", language)
					}), hasValidDiscount && priceCents != null && /* @__PURE__ */ jsxs("p", {
						className: "text-xs text-neutral-400",
						children: [
							t("admin.priceFields.before"),
							" ",
							/* @__PURE__ */ jsx("s", {
								className: "text-neutral-500",
								children: formatPriceForLanguage(priceCents, "EUR", language)
							}),
							" ",
							"· -",
							parsedDiscount,
							"%"
						]
					})]
				})]
			})
		]
	});
};
//#endregion
//#region src/i18n/labels.ts
var categoryTranslationKeys = {
	todas: "catalog.categories.all",
	personalizados: "catalog.categories.custom",
	camisetas: "catalog.categories.tshirts",
	ilustraciones: "catalog.categories.illustrations",
	talleres: "catalog.categories.workshops"
};
var availabilityTranslationKeys = {
	disponible: "product.status.available",
	reservado: "product.status.reserved",
	vendido: "product.status.sold"
};
var registrationStatusTranslationKeys = {
	pendiente: "admin.registrations.status.pending",
	confirmado: "admin.registrations.status.confirmed",
	cancelado: "admin.registrations.status.cancelled"
};
//#endregion
//#region src/components/admin/product-form/ProductDetailsFields.tsx
var CATEGORY_OPTIONS$1 = [
	"ilustraciones",
	"camisetas",
	"talleres",
	"personalizados"
];
var STATUS_OPTIONS = [
	"disponible",
	"reservado",
	"vendido"
];
var ProductDetailsFields = ({ title, description, category, status, featured, etsyLink, vintedLink, showLinks, onTitleChange, onDescriptionChange, onCategoryChange, onStatusChange, onFeaturedChange, onEtsyLinkChange, onVintedLinkChange }) => {
	const { t } = useTranslation();
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsxs(Box, {
			className: "grid grid-cols-1 md:grid-cols-2 gap-6",
			children: [/* @__PURE__ */ jsx(Input, {
				id: "prod-title",
				label: t("admin.productFields.titleLabel"),
				required: true,
				maxLength: 120,
				value: title,
				onChange: (event) => onTitleChange(event.target.value),
				placeholder: t("admin.productFields.titlePlaceholder")
			}), /* @__PURE__ */ jsxs(Box, { children: [/* @__PURE__ */ jsx("label", {
				htmlFor: "prod-category",
				className: theme.inputs.label,
				children: t("admin.productFields.categoryLabel")
			}), /* @__PURE__ */ jsx("select", {
				id: "prod-category",
				value: category,
				onChange: (event) => onCategoryChange(event.target.value),
				className: theme.inputs.base,
				children: CATEGORY_OPTIONS$1.map((option) => /* @__PURE__ */ jsx("option", {
					value: option,
					children: t(categoryTranslationKeys[option])
				}, option))
			})] })]
		}),
		/* @__PURE__ */ jsxs(Box, {
			className: "grid grid-cols-1 md:grid-cols-2 gap-6",
			children: [/* @__PURE__ */ jsxs(Box, { children: [/* @__PURE__ */ jsx("label", {
				htmlFor: "prod-status",
				className: theme.inputs.label,
				children: t("admin.productFields.statusLabel")
			}), /* @__PURE__ */ jsx("select", {
				id: "prod-status",
				value: status,
				onChange: (event) => onStatusChange(event.target.value),
				className: theme.inputs.base,
				children: STATUS_OPTIONS.map((option) => /* @__PURE__ */ jsx("option", {
					value: option,
					children: t(availabilityTranslationKeys[option])
				}, option))
			})] }), /* @__PURE__ */ jsxs(Box, {
				className: "flex items-center gap-3 pt-6",
				children: [/* @__PURE__ */ jsx("input", {
					id: "prod-featured",
					type: "checkbox",
					checked: featured,
					onChange: (event) => onFeaturedChange(event.target.checked),
					className: "w-4 h-4 text-orange-600 bg-neutral-950 border-neutral-800 rounded focus:ring-orange-600"
				}), /* @__PURE__ */ jsx("label", {
					htmlFor: "prod-featured",
					className: "text-xs uppercase font-semibold text-neutral-300 cursor-pointer",
					children: t("admin.productFields.featuredLabel")
				})]
			})]
		}),
		/* @__PURE__ */ jsxs(Box, { children: [/* @__PURE__ */ jsx("label", {
			htmlFor: "prod-desc",
			className: theme.inputs.label,
			children: t("admin.productFields.descriptionLabel")
		}), /* @__PURE__ */ jsx("textarea", {
			id: "prod-desc",
			rows: 3,
			required: true,
			maxLength: 2e3,
			value: description,
			onChange: (event) => onDescriptionChange(event.target.value),
			placeholder: t("admin.productFields.descriptionPlaceholder"),
			className: theme.inputs.base
		})] }),
		showLinks && /* @__PURE__ */ jsxs(Box, {
			className: "grid grid-cols-1 md:grid-cols-2 gap-6",
			children: [/* @__PURE__ */ jsx(Input, {
				id: "prod-etsy",
				label: t("admin.productFields.etsyLinkLabel"),
				type: "url",
				maxLength: 300,
				value: etsyLink,
				onChange: (event) => onEtsyLinkChange(event.target.value),
				placeholder: "https://..."
			}), /* @__PURE__ */ jsx(Input, {
				id: "prod-vinted",
				label: t("admin.productFields.vintedLinkLabel"),
				type: "url",
				maxLength: 300,
				value: vintedLink,
				onChange: (event) => onVintedLinkChange(event.target.value),
				placeholder: "https://..."
			})]
		})
	] });
};
//#endregion
//#region src/components/admin/product-form/WorkshopFields.tsx
var WorkshopFields = ({ eventDate, eventLocation, cupo, onEventDateChange, onEventLocationChange, onCupoChange }) => {
	const { t } = useTranslation();
	return /* @__PURE__ */ jsxs(Box, {
		className: "grid grid-cols-1 md:grid-cols-3 gap-6 p-4 rounded-lg bg-neutral-950 border border-neutral-800",
		children: [
			/* @__PURE__ */ jsxs(Box, { children: [/* @__PURE__ */ jsx("label", {
				htmlFor: "prod-event-date",
				className: theme.inputs.label,
				children: t("admin.workshopFields.dateLabel")
			}), /* @__PURE__ */ jsx("input", {
				id: "prod-event-date",
				type: "datetime-local",
				value: eventDate,
				onChange: (event) => onEventDateChange(event.target.value),
				className: theme.inputs.base
			})] }),
			/* @__PURE__ */ jsx(Input, {
				id: "prod-event-loc",
				label: t("admin.workshopFields.locationLabel"),
				maxLength: 120,
				value: eventLocation,
				onChange: (event) => onEventLocationChange(event.target.value),
				placeholder: t("admin.workshopFields.locationPlaceholder")
			}),
			/* @__PURE__ */ jsxs(Box, { children: [
				/* @__PURE__ */ jsx("label", {
					htmlFor: "prod-cupo",
					className: theme.inputs.label,
					children: t("admin.workshopFields.capacityLabel")
				}),
				/* @__PURE__ */ jsx("input", {
					id: "prod-cupo",
					type: "number",
					min: 1,
					step: 1,
					value: cupo,
					onChange: (event) => onCupoChange(event.target.value),
					className: theme.inputs.base,
					placeholder: t("admin.workshopFields.capacityPlaceholder")
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-1 text-xs text-neutral-500",
					children: t("admin.workshopFields.capacityHint")
				})
			] })
		]
	});
};
//#endregion
//#region src/components/admin/ProductFormHeader.tsx
var ProductFormHeader = ({ isEditing, productTitle, onCancelEdit }) => {
	const { t } = useTranslation();
	return /* @__PURE__ */ jsxs(Box, {
		className: `flex items-center justify-between border-b ${theme.colors.border} pb-4`,
		children: [/* @__PURE__ */ jsxs(Box, { children: [/* @__PURE__ */ jsx("h3", {
			className: "text-xl font-bold text-white uppercase tracking-wider",
			children: t(isEditing ? "admin.productForm.editTitle" : "admin.productForm.createTitle")
		}), /* @__PURE__ */ jsx("p", {
			className: `${theme.colors.textMuted} text-sm`,
			children: isEditing ? t("admin.productForm.editDescription", { title: productTitle ?? "" }) : t("admin.productForm.createDescription")
		})] }), isEditing && onCancelEdit && /* @__PURE__ */ jsxs(Button, {
			variant: "secondary",
			size: "sm",
			onClick: onCancelEdit,
			children: [/* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" }), t("admin.productForm.cancelEdit")]
		})]
	});
};
//#endregion
//#region src/components/admin/ProductFormActions.tsx
var ProductFormActions = ({ isEditing, isSubmitting, onCancelEdit }) => {
	const { t } = useTranslation();
	return /* @__PURE__ */ jsxs(Box, {
		className: `pt-4 border-t ${theme.colors.border} flex justify-end gap-3`,
		children: [isEditing && onCancelEdit && /* @__PURE__ */ jsx(Button, {
			variant: "outline",
			onClick: onCancelEdit,
			children: t("admin.productForm.cancel")
		}), /* @__PURE__ */ jsxs(Button, {
			type: "submit",
			variant: "primary",
			disabled: isSubmitting,
			children: [isEditing ? /* @__PURE__ */ jsx(Check, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }), isSubmitting ? t("admin.productForm.saving") : isEditing ? t("admin.productForm.saveChanges") : t("admin.productForm.publish")]
		})]
	});
};
//#endregion
//#region src/components/admin/AdminProductForm.tsx
var validationErrorKeys = {
	titleDescription: "validation.titleDescription",
	image: "validation.image",
	price: "validation.price",
	discountRange: "validation.discountRange",
	discountRequiresPrice: "validation.discountRequiresPrice"
};
var imageValidationKeys = {
	format: "admin.productForm.imageFormatError",
	size: "admin.productForm.imageSizeError"
};
var AdminProductForm = ({ onSubmit, isSubmitting, editingProduct, onCancelEdit }) => {
	const { t } = useTranslation();
	const [title, setTitle] = useState(editingProduct?.title || "");
	const [description, setDescription] = useState(editingProduct?.description || "");
	const [category, setCategory] = useState(editingProduct && editingProduct.category !== "todas" ? editingProduct.category : "ilustraciones");
	const [price, setPrice] = useState(editingProduct?.priceCents != null ? (editingProduct.priceCents / 100).toFixed(2) : "");
	const [priceOnRequest, setPriceOnRequest] = useState(editingProduct ? editingProduct.priceCents == null : false);
	const [discountPercent, setDiscountPercent] = useState(editingProduct?.discountPercent != null ? String(editingProduct.discountPercent) : "");
	const [etsyLink, setEtsyLink] = useState(editingProduct?.etsyLink || "");
	const [vintedLink, setVintedLink] = useState(editingProduct?.vintedLink || "");
	const [status, setStatus] = useState(editingProduct?.status || "disponible");
	const [featured, setFeatured] = useState(editingProduct?.featured || false);
	const [eventDate, setEventDate] = useState(editingProduct?.eventDate || "");
	const [eventLocation, setEventLocation] = useState(editingProduct?.eventLocation || "");
	const [cupo, setCupo] = useState(editingProduct?.cupo != null ? String(editingProduct.cupo) : "");
	const [imageFile, setImageFile] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(editingProduct?.image || "");
	const [externalImageUrl, setExternalImageUrl] = useState("");
	const [formError, setFormError] = useState(null);
	const handleFileChange = (event) => {
		const file = event.target.files?.[0];
		if (!file) return;
		const validationError = validateImageFile(file);
		if (validationError) {
			setImageFile(null);
			setPreviewUrl(editingProduct?.image || "");
			setFormError(t(imageValidationKeys[validationError]));
			event.target.value = "";
			return;
		}
		setFormError(null);
		setImageFile(file);
		setPreviewUrl(URL.createObjectURL(file));
		setExternalImageUrl("");
	};
	const handlePriceOnRequestChange = (value) => {
		setPriceOnRequest(value);
		if (value) {
			setPrice("");
			setDiscountPercent("");
		}
	};
	const handleExternalUrlChange = (value) => {
		setExternalImageUrl(value);
		setImageFile(null);
	};
	const resetAfterCreate = () => {
		setTitle("");
		setDescription("");
		setPrice("");
		setPriceOnRequest(false);
		setDiscountPercent("");
		setEtsyLink("");
		setVintedLink("");
		setStatus("disponible");
		setFeatured(false);
		setEventDate("");
		setEventLocation("");
		setCupo("");
		setImageFile(null);
		setPreviewUrl("");
		setExternalImageUrl("");
	};
	const handleSubmit = async (event) => {
		event.preventDefault();
		setFormError(null);
		const validationError = validateProductForm({
			isEditing: Boolean(editingProduct),
			title,
			description,
			price,
			priceOnRequest,
			discountPercent,
			imageFile,
			externalImageUrl
		});
		if (validationError) {
			setFormError(t(validationErrorKeys[validationError]));
			return;
		}
		const purchaseLinks = resolvePurchaseLinks(category, etsyLink, vintedLink);
		if (await onSubmit({
			title,
			description,
			category,
			price: priceOnRequest ? "" : price,
			discountPercent: priceOnRequest ? "" : discountPercent,
			...purchaseLinks,
			status,
			featured,
			eventDate: category === "talleres" ? eventDate : void 0,
			eventLocation: category === "talleres" ? eventLocation : void 0,
			cupo: category === "talleres" ? cupo : "",
			imageFile,
			imageUrl: externalImageUrl.trim() || (editingProduct ? editingProduct.image : void 0)
		}) && !editingProduct) resetAfterCreate();
	};
	return /* @__PURE__ */ jsxs(Card, {
		className: "p-6 sm:p-8 space-y-6",
		children: [
			/* @__PURE__ */ jsx(ProductFormHeader, {
				isEditing: Boolean(editingProduct),
				productTitle: editingProduct?.title,
				onCancelEdit
			}),
			formError && /* @__PURE__ */ jsxs(Box, {
				className: "p-4 bg-red-950/40 border border-red-800/60 rounded-lg flex items-center gap-3 text-red-300 text-sm",
				children: [/* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5 flex-shrink-0 text-red-500" }), /* @__PURE__ */ jsx("span", { children: formError })]
			}),
			/* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit,
				className: "space-y-6",
				children: [
					/* @__PURE__ */ jsx(ProductDetailsFields, {
						title,
						description,
						category,
						status,
						featured,
						etsyLink,
						vintedLink,
						showLinks: category !== "talleres",
						onTitleChange: setTitle,
						onDescriptionChange: setDescription,
						onCategoryChange: setCategory,
						onStatusChange: setStatus,
						onFeaturedChange: setFeatured,
						onEtsyLinkChange: setEtsyLink,
						onVintedLinkChange: setVintedLink
					}),
					category === "talleres" && /* @__PURE__ */ jsx(WorkshopFields, {
						eventDate,
						eventLocation,
						cupo,
						onEventDateChange: setEventDate,
						onEventLocationChange: setEventLocation,
						onCupoChange: setCupo
					}),
					/* @__PURE__ */ jsx(PriceFields, {
						price,
						priceOnRequest,
						discountPercent,
						onPriceChange: setPrice,
						onPriceOnRequestChange: handlePriceOnRequestChange,
						onDiscountChange: setDiscountPercent
					}),
					/* @__PURE__ */ jsx(ImageField, {
						previewUrl,
						externalImageUrl,
						isEditing: Boolean(editingProduct),
						onFileChange: handleFileChange,
						onExternalUrlChange: handleExternalUrlChange
					}),
					/* @__PURE__ */ jsx(ProductFormActions, {
						isEditing: Boolean(editingProduct),
						isSubmitting,
						onCancelEdit
					})
				]
			})
		]
	});
};
//#endregion
//#region src/components/admin/AdminEtsyProductForm.tsx
var CATEGORY_OPTIONS = [
	"ilustraciones",
	"camisetas",
	"personalizados"
];
var AdminEtsyProductForm = ({ product, onSubmit, isSubmitting, onCancelEdit }) => {
	const { t, i18n } = useTranslation();
	const language = i18n.resolvedLanguage ?? i18n.language;
	const [category, setCategory] = useState(product.category !== "todas" && product.category !== "talleres" ? product.category : "ilustraciones");
	const [featured, setFeatured] = useState(product.featured);
	const [formError, setFormError] = useState(null);
	const handleSubmit = async (event) => {
		event.preventDefault();
		setFormError(null);
		if (!await onSubmit({
			category,
			featured
		})) setFormError(t("admin.etsyForm.saveError"));
	};
	return /* @__PURE__ */ jsxs(Card, {
		className: "p-6 sm:p-8 space-y-6",
		children: [
			/* @__PURE__ */ jsxs(Box, {
				className: `flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b ${theme.colors.border} pb-4`,
				children: [/* @__PURE__ */ jsxs(Box, { children: [/* @__PURE__ */ jsx("h3", {
					className: "text-xl font-bold text-white uppercase tracking-wider",
					children: t("admin.etsyForm.title")
				}), /* @__PURE__ */ jsx("p", {
					className: `${theme.colors.textMuted} text-sm`,
					children: t("admin.etsyForm.subtitle")
				})] }), /* @__PURE__ */ jsxs(Button, {
					variant: "secondary",
					size: "sm",
					onClick: onCancelEdit,
					children: [/* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" }), t("admin.etsyForm.close")]
				})]
			}),
			/* @__PURE__ */ jsxs(Box, {
				className: "flex flex-col sm:flex-row gap-6",
				children: [/* @__PURE__ */ jsx("img", {
					src: product.image,
					alt: product.title,
					className: "w-full sm:w-40 h-40 rounded-lg object-cover bg-neutral-800 border border-neutral-800"
				}), /* @__PURE__ */ jsxs(Box, {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "text-lg font-bold text-white",
							children: product.title
						}),
						/* @__PURE__ */ jsx("p", {
							className: `${theme.colors.textMuted} text-sm line-clamp-3`,
							children: product.description
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm text-neutral-300",
							children: product.priceCents != null ? formatPriceForLanguage(product.priceCents, product.currency || "EUR", language) : t("admin.etsyForm.priceOnRequest")
						}),
						/* @__PURE__ */ jsxs(Box, {
							className: "flex flex-wrap items-center gap-2 text-xs text-neutral-500",
							children: [
								/* @__PURE__ */ jsxs("span", {
									className: "inline-flex items-center gap-1",
									children: [/* @__PURE__ */ jsx(RefreshCw, { className: "w-3 h-3" }), t("admin.etsyForm.listing", { id: product.etsyListingId ?? "—" })]
								}),
								product.etsyState && /* @__PURE__ */ jsx("span", { children: t("admin.etsyForm.status", { state: product.etsyState }) }),
								product.isVisible === false && /* @__PURE__ */ jsx("span", {
									className: "text-red-400",
									children: t("admin.etsyForm.hidden")
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx(Box, {
				className: "p-4 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-400",
				children: t("admin.etsyForm.offersNote")
			}),
			formError && /* @__PURE__ */ jsxs(Box, {
				className: "p-4 bg-red-950/40 border border-red-800/60 rounded-lg flex items-center gap-3 text-red-300 text-sm",
				children: [/* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5 flex-shrink-0 text-red-500" }), /* @__PURE__ */ jsx("span", { children: formError })]
			}),
			/* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit,
				className: "space-y-6",
				children: [/* @__PURE__ */ jsxs(Box, {
					className: "grid grid-cols-1 md:grid-cols-2 gap-6",
					children: [/* @__PURE__ */ jsxs(Box, { children: [/* @__PURE__ */ jsx("label", {
						htmlFor: "etsy-category",
						className: theme.inputs.label,
						children: t("admin.etsyForm.categoryLabel")
					}), /* @__PURE__ */ jsx("select", {
						id: "etsy-category",
						value: category,
						onChange: (event) => setCategory(event.target.value),
						className: theme.inputs.base,
						children: CATEGORY_OPTIONS.map((option) => /* @__PURE__ */ jsx("option", {
							value: option,
							children: t(categoryTranslationKeys[option])
						}, option))
					})] }), /* @__PURE__ */ jsxs(Box, {
						className: "flex items-center gap-3 pt-6",
						children: [/* @__PURE__ */ jsx("input", {
							id: "etsy-featured",
							type: "checkbox",
							checked: featured,
							onChange: (event) => setFeatured(event.target.checked),
							className: "w-4 h-4 text-orange-600 bg-neutral-950 border-neutral-800 rounded focus:ring-orange-600"
						}), /* @__PURE__ */ jsx("label", {
							htmlFor: "etsy-featured",
							className: "text-xs uppercase font-semibold text-neutral-300 cursor-pointer",
							children: t("admin.etsyForm.featuredLabel")
						})]
					})]
				}), /* @__PURE__ */ jsxs(Box, {
					className: `pt-4 border-t ${theme.colors.border} flex justify-end gap-3`,
					children: [/* @__PURE__ */ jsx(Button, {
						variant: "outline",
						onClick: onCancelEdit,
						children: t("admin.etsyForm.cancel")
					}), /* @__PURE__ */ jsxs(Button, {
						type: "submit",
						variant: "primary",
						disabled: isSubmitting,
						children: [/* @__PURE__ */ jsx(Check, { className: "w-4 h-4" }), isSubmitting ? t("admin.etsyForm.saving") : t("admin.etsyForm.saveChanges")]
					})]
				})]
			})
		]
	});
};
//#endregion
//#region src/utils/supabase.ts
var supabaseUrl = "https://gixnkwtygqvcyfjmucmh.supabase.co";
var supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpeG5rd3R5Z3F2Y3lmam11Y21oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzOTk3NzUsImV4cCI6MjEwNzk3NTc3NX0.h_Ap3Z_lC6DZspUUpvPcvDDPX3hAlccq95kObXd-g9Y";
var isSupabaseConfigured = Boolean(supabaseAnonKey);
var supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;
//#endregion
//#region src/services/etsySyncService.ts
var EtsySyncError = class extends Error {
	code;
	constructor(code) {
		super(code);
		this.name = "EtsySyncError";
		this.code = code;
	}
};
var isEtsySyncResult = (value) => {
	if (typeof value !== "object" || value === null) return false;
	const record = value;
	return typeof record.created === "number" && typeof record.updated === "number" && typeof record.hidden === "number" && typeof record.total === "number";
};
var readErrorMessage = (value) => {
	if (typeof value !== "object" || value === null) return null;
	const record = value;
	return typeof record.error === "string" ? record.error : null;
};
var triggerEtsySync = async () => {
	if (!supabase) throw new EtsySyncError("notConfigured");
	const { data, error } = await supabase.auth.getSession();
	if (error) throw error;
	if (!data.session) throw new EtsySyncError("unauthorized");
	const response = await fetch("/api/etsy-sync", {
		method: "POST",
		headers: { Authorization: `Bearer ${data.session.access_token}` }
	});
	const payload = await response.json().catch(() => null);
	if (!response.ok) {
		const message = readErrorMessage(payload);
		throw message ? new Error(message) : new EtsySyncError("unknown");
	}
	if (!isEtsySyncResult(payload)) throw new EtsySyncError("unexpectedResponse");
	return payload;
};
//#endregion
//#region src/components/admin/AdminEtsySyncPanel.tsx
var syncErrorKeys = {
	notConfigured: "admin.etsySync.errors.notConfigured",
	unauthorized: "admin.etsySync.errors.unauthorized",
	unexpectedResponse: "admin.etsySync.errors.unexpectedResponse",
	unknown: "admin.etsySync.errors.unknown"
};
var AdminEtsySyncPanel = ({ onSynced }) => {
	const { t } = useTranslation();
	const [isSyncing, setIsSyncing] = useState(false);
	const [feedback, setFeedback] = useState(null);
	const handleSync = async () => {
		setIsSyncing(true);
		setFeedback(null);
		try {
			const result = await triggerEtsySync();
			await onSynced();
			setFeedback({
				type: "success",
				text: t("admin.etsySync.success", {
					total: result.total,
					created: result.created,
					updated: result.updated,
					hidden: result.hidden
				})
			});
		} catch (error) {
			const text = error instanceof EtsySyncError ? t(syncErrorKeys[error.code]) : error instanceof Error ? error.message : t("admin.etsySync.error");
			setFeedback({
				type: "error",
				text
			});
		} finally {
			setIsSyncing(false);
		}
	};
	return /* @__PURE__ */ jsxs(Card, {
		className: "p-6",
		children: [/* @__PURE__ */ jsxs(Box, {
			className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
			children: [/* @__PURE__ */ jsxs(Box, { children: [/* @__PURE__ */ jsx("h3", {
				className: "text-lg font-bold text-white uppercase tracking-wider",
				children: t("admin.etsySync.title")
			}), /* @__PURE__ */ jsx("p", {
				className: `${theme.colors.textMuted} text-sm`,
				children: t("admin.etsySync.description")
			})] }), /* @__PURE__ */ jsxs(Button, {
				variant: "secondary",
				onClick: handleSync,
				disabled: isSyncing,
				children: [/* @__PURE__ */ jsx(RefreshCw, { className: `w-4 h-4 ${isSyncing ? "animate-spin" : ""}` }), isSyncing ? t("admin.etsySync.syncing") : t("admin.etsySync.syncNow")]
			})]
		}), feedback && /* @__PURE__ */ jsxs(Box, {
			className: `mt-4 p-3 rounded-lg border flex items-center gap-2 text-sm ${feedback.type === "success" ? "bg-green-950/40 border-green-800 text-green-300" : "bg-red-950/40 border-red-800 text-red-300"}`,
			children: [feedback.type === "success" ? /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4 flex-shrink-0 text-green-400" }) : /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 flex-shrink-0 text-red-400" }), /* @__PURE__ */ jsx("span", { children: feedback.text })]
		})]
	});
};
//#endregion
//#region src/components/admin/AdminProductTableRow.tsx
var statusBadgeVariant$1 = {
	disponible: "primary",
	reservado: "neutral",
	vendido: "outline"
};
var AdminProductTableRow = ({ item, isDeleting, onDelete, onEdit }) => {
	const { t, i18n } = useTranslation();
	const language = i18n.resolvedLanguage ?? i18n.language;
	const currentStatus = item.status || "disponible";
	const currency = item.currency || "EUR";
	const offerPercent = item.priceCents != null && item.discountPercent != null && isOfferActive(item) ? item.discountPercent : null;
	const displayCents = offerPercent != null && item.priceCents != null ? getDiscountedCents(item.priceCents, offerPercent) : item.priceCents;
	return /* @__PURE__ */ jsxs("tr", {
		className: "hover:bg-neutral-800/40 transition-colors",
		children: [
			/* @__PURE__ */ jsx("td", {
				className: "py-4 px-6",
				children: /* @__PURE__ */ jsxs(Box, {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ jsx("img", {
						src: item.image,
						alt: "",
						className: "w-12 h-12 rounded object-cover bg-neutral-800 flex-shrink-0"
					}), /* @__PURE__ */ jsxs(Box, { children: [/* @__PURE__ */ jsxs(Box, {
						className: "flex flex-wrap items-center gap-1.5",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "font-semibold text-white",
								children: item.title
							}),
							item.featured && /* @__PURE__ */ jsx("span", {
								title: t("admin.productTable.featuredTitle"),
								children: /* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5 text-orange-500 fill-orange-500/20" })
							}),
							item.source === "etsy" && /* @__PURE__ */ jsx(Badge, {
								variant: "neutral",
								children: t("admin.productTable.etsy")
							}),
							item.isVisible === false && /* @__PURE__ */ jsx(Badge, {
								variant: "outline",
								children: t("admin.productTable.hidden")
							})
						]
					}), /* @__PURE__ */ jsx(Box, {
						className: `${theme.colors.textMuted} text-xs line-clamp-1 max-w-xs`,
						children: item.description
					})] })]
				})
			}),
			/* @__PURE__ */ jsxs("td", {
				className: "py-4 px-6",
				children: [/* @__PURE__ */ jsx(Badge, {
					variant: "outline",
					children: t(categoryTranslationKeys[item.category])
				}), item.category === "talleres" && /* @__PURE__ */ jsx("div", {
					className: "mt-1.5 text-xs text-neutral-500",
					children: item.cupo != null ? t("admin.productTable.capacity", { count: item.cupo }) : t("admin.productTable.noCapacity")
				})]
			}),
			/* @__PURE__ */ jsx("td", {
				className: "py-4 px-6",
				children: /* @__PURE__ */ jsx(Badge, {
					variant: statusBadgeVariant$1[currentStatus],
					children: t(availabilityTranslationKeys[currentStatus])
				})
			}),
			/* @__PURE__ */ jsx("td", {
				className: "py-4 px-6 font-medium text-neutral-300",
				children: displayCents != null ? /* @__PURE__ */ jsxs(Box, {
					className: "space-y-1",
					children: [/* @__PURE__ */ jsx("span", { children: formatPriceForLanguage(displayCents, currency, language) }), offerPercent != null && item.priceCents != null && /* @__PURE__ */ jsxs(Box, {
						className: "text-xs text-neutral-500",
						children: [/* @__PURE__ */ jsx("s", { children: formatPriceForLanguage(item.priceCents, currency, language) }), /* @__PURE__ */ jsxs("span", {
							className: "ml-2 text-orange-400",
							children: [
								"-",
								offerPercent,
								"%"
							]
						})]
					})]
				}) : t("admin.productTable.consult")
			}),
			/* @__PURE__ */ jsx("td", {
				className: "py-4 px-6",
				children: /* @__PURE__ */ jsxs(Box, {
					className: "flex items-center gap-3",
					children: [item.category !== "talleres" && item.etsyLink && /* @__PURE__ */ jsxs("a", {
						href: item.etsyLink,
						target: "_blank",
						rel: "noopener noreferrer",
						className: `text-xs ${theme.colors.primaryText} hover:underline inline-flex items-center gap-1`,
						children: ["Etsy ", /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3" })]
					}), item.category !== "talleres" && item.vintedLink && /* @__PURE__ */ jsxs("a", {
						href: item.vintedLink,
						target: "_blank",
						rel: "noopener noreferrer",
						className: "text-xs text-neutral-400 hover:text-white inline-flex items-center gap-1",
						children: ["Vinted ", /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3" })]
					})]
				})
			}),
			/* @__PURE__ */ jsx("td", {
				className: "py-4 px-6 text-right",
				children: /* @__PURE__ */ jsxs(Box, {
					className: "flex items-center justify-end gap-1",
					children: [/* @__PURE__ */ jsx(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => onEdit(item),
						"aria-label": t("admin.productTable.editAria", { title: item.title }),
						children: /* @__PURE__ */ jsx(Edit3, { className: "w-4 h-4 text-orange-500" })
					}), /* @__PURE__ */ jsx(Button, {
						variant: "ghost",
						size: "sm",
						disabled: isDeleting || item.source === "etsy",
						title: item.source === "etsy" ? t("admin.productTable.etsyDeleteHint") : void 0,
						onClick: () => {
							if (window.confirm(t("admin.productTable.deleteConfirm", { title: item.title }))) onDelete(String(item.id));
						},
						"aria-label": item.source === "etsy" ? t("admin.productTable.etsyDeleteAria", { title: item.title }) : t("admin.productTable.deleteAria", { title: item.title }),
						children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4 text-red-400" })
					})]
				})
			})
		]
	});
};
//#endregion
//#region src/components/admin/AdminProductTableSkeleton.tsx
var SKELETON_ROWS$1 = 5;
var AdminProductTableSkeleton = () => {
	return /* @__PURE__ */ jsxs(Card, {
		"aria-hidden": "true",
		children: [/* @__PURE__ */ jsxs("div", {
			className: `p-6 border-b ${theme.colors.border} space-y-2`,
			children: [/* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-64" }), /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-80 max-w-full" })]
		}), /* @__PURE__ */ jsx("div", {
			className: "divide-y divide-neutral-800",
			children: Array.from({ length: SKELETON_ROWS$1 }, (_, index) => /* @__PURE__ */ jsxs("div", {
				className: "p-6 flex items-center gap-4",
				children: [
					/* @__PURE__ */ jsx(Skeleton, { className: "w-12 h-12 flex-shrink-0" }),
					/* @__PURE__ */ jsxs("div", {
						className: "flex-1 space-y-2",
						children: [/* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-1/3" }), /* @__PURE__ */ jsx(Skeleton, { className: "h-3 w-1/2" })]
					}),
					/* @__PURE__ */ jsx(Skeleton, {
						className: "h-6 w-24",
						rounded: "full"
					}),
					/* @__PURE__ */ jsx(Skeleton, {
						className: "h-6 w-20",
						rounded: "full"
					}),
					/* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-16" })
				]
			}, index))
		})]
	});
};
//#endregion
//#region src/components/admin/AdminProductTable.tsx
var AdminProductTable = ({ products, onDelete, onEdit, isDeleting, isLoading, error, onRetry }) => {
	const { t } = useTranslation();
	if (isLoading) return /* @__PURE__ */ jsx("div", {
		role: "status",
		"aria-label": t("admin.productTable.loading"),
		children: /* @__PURE__ */ jsx(AdminProductTableSkeleton, {})
	});
	if (error) return /* @__PURE__ */ jsx(ErrorState, {
		title: t("admin.productTable.errorTitle"),
		description: error,
		onRetry,
		retryLabel: t("common.retry")
	});
	if (products.length === 0) return /* @__PURE__ */ jsx(Card, {
		className: "text-center py-12",
		children: /* @__PURE__ */ jsx("p", {
			className: theme.colors.textMuted,
			children: t("admin.productTable.empty")
		})
	});
	return /* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(Box, {
		className: `p-6 border-b ${theme.colors.border}`,
		children: [/* @__PURE__ */ jsx("h3", {
			className: "text-xl font-bold text-white uppercase tracking-wider",
			children: t("admin.productTable.title", { count: products.length })
		}), /* @__PURE__ */ jsx("p", {
			className: `${theme.colors.textMuted} text-sm`,
			children: t("admin.productTable.subtitle")
		})]
	}), /* @__PURE__ */ jsx(Box, {
		className: "overflow-x-auto",
		children: /* @__PURE__ */ jsxs("table", {
			className: "w-full text-left border-collapse",
			children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
				className: `border-b ${theme.colors.border} bg-neutral-950/60 text-xs font-semibold uppercase tracking-wider text-neutral-400`,
				children: [
					/* @__PURE__ */ jsx("th", {
						className: "py-4 px-6",
						children: t("admin.productTable.columns.artwork")
					}),
					/* @__PURE__ */ jsx("th", {
						className: "py-4 px-6",
						children: t("admin.productTable.columns.category")
					}),
					/* @__PURE__ */ jsx("th", {
						className: "py-4 px-6",
						children: t("admin.productTable.columns.availability")
					}),
					/* @__PURE__ */ jsx("th", {
						className: "py-4 px-6",
						children: t("admin.productTable.columns.price")
					}),
					/* @__PURE__ */ jsx("th", {
						className: "py-4 px-6",
						children: t("admin.productTable.columns.links")
					}),
					/* @__PURE__ */ jsx("th", {
						className: "py-4 px-6 text-right",
						children: t("admin.productTable.columns.actions")
					})
				]
			}) }), /* @__PURE__ */ jsx("tbody", {
				className: `divide-y ${theme.colors.borderSubtle} text-sm`,
				children: products.map((item) => /* @__PURE__ */ jsx(AdminProductTableRow, {
					item,
					isDeleting,
					onDelete,
					onEdit
				}, item.id))
			})]
		})
	})] });
};
//#endregion
//#region src/components/admin/AdminRegistrationsSkeleton.tsx
var SKELETON_ROWS = 3;
var AdminRegistrationsSkeleton = () => {
	return /* @__PURE__ */ jsx("div", {
		className: "space-y-6",
		"aria-hidden": "true",
		children: Array.from({ length: SKELETON_ROWS }, (_, index) => /* @__PURE__ */ jsxs("div", {
			className: "space-y-3",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ jsx(Skeleton, { className: "h-5 w-48" }), /* @__PURE__ */ jsx(Skeleton, {
					className: "h-6 w-28",
					rounded: "full"
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "rounded-lg border border-neutral-800 divide-y divide-neutral-800",
				children: Array.from({ length: 2 }, (_row, rowIndex) => /* @__PURE__ */ jsxs("div", {
					className: "p-4 flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-40" }), /* @__PURE__ */ jsx(Skeleton, { className: "h-3 w-56 max-w-full" })]
					}), /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-32" })]
				}, rowIndex))
			})]
		}, index))
	});
};
//#endregion
//#region src/components/admin/AdminRegistrationsPanel.tsx
var statusBadgeVariant = {
	pendiente: "neutral",
	confirmado: "primary",
	cancelado: "outline"
};
var formatRegistrationDate = (value, language) => {
	const parsed = new Date(value);
	if (isNaN(parsed.getTime())) return value;
	return parsed.toLocaleDateString(getIntlLocale(language), {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	});
};
var AdminRegistrationsPanel = ({ workshops, registrations, isLoading, error, onRetry, onSetStatus, onDelete }) => {
	const { t, i18n } = useTranslation();
	const language = i18n.resolvedLanguage ?? i18n.language;
	const workshopsWithRegistrations = workshops.filter((workshop) => workshop.category === "talleres").map((workshop) => ({
		workshop,
		list: registrations.filter((registration) => registration.product_id === workshop.id).sort((a, b) => b.created_at.localeCompare(a.created_at))
	}));
	return /* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(Box, {
		className: `p-6 border-b ${theme.colors.border} flex items-center gap-3`,
		children: [/* @__PURE__ */ jsx(ClipboardList, {
			className: "w-5 h-5 text-orange-500",
			"aria-hidden": "true"
		}), /* @__PURE__ */ jsxs(Box, { children: [/* @__PURE__ */ jsx("h3", {
			className: "text-xl font-bold text-white uppercase tracking-wider",
			children: t("admin.registrations.title", { count: registrations.length })
		}), /* @__PURE__ */ jsx("p", {
			className: `${theme.colors.textMuted} text-sm`,
			children: t("admin.registrations.subtitle")
		})] })]
	}), /* @__PURE__ */ jsxs(Box, {
		className: "p-6 space-y-8",
		children: [
			isLoading && /* @__PURE__ */ jsx("div", {
				role: "status",
				"aria-label": t("admin.registrations.loading"),
				children: /* @__PURE__ */ jsx(AdminRegistrationsSkeleton, {})
			}),
			!isLoading && error && /* @__PURE__ */ jsx(ErrorState, {
				title: t("admin.registrations.errorTitle"),
				description: error,
				onRetry,
				retryLabel: t("common.retry")
			}),
			!isLoading && !error && workshopsWithRegistrations.length === 0 && /* @__PURE__ */ jsx("p", {
				className: `${theme.colors.textMuted} text-sm text-center py-4`,
				children: t("admin.registrations.emptyWorkshops")
			}),
			!isLoading && !error && workshopsWithRegistrations.map(({ workshop, list }) => {
				const activeCount = list.filter((registration) => registration.status !== "cancelado").length;
				const cupo = workshop.cupo ?? null;
				return /* @__PURE__ */ jsxs(Box, { children: [/* @__PURE__ */ jsxs(Box, {
					className: "flex flex-wrap items-center justify-between gap-3 mb-3",
					children: [/* @__PURE__ */ jsx("h4", {
						className: "text-sm font-bold text-white uppercase tracking-wider",
						children: workshop.title
					}), /* @__PURE__ */ jsxs(Badge, {
						variant: cupo !== null && activeCount >= cupo ? "outline" : "primary",
						children: [/* @__PURE__ */ jsx(Users, {
							className: "w-3 h-3 mr-1",
							"aria-hidden": "true"
						}), cupo !== null ? t("admin.registrations.spots", {
							active: activeCount,
							cupo
						}) : activeCount === 1 ? t("admin.registrations.attendee", { count: activeCount }) : t("admin.registrations.attendees", { count: activeCount })]
					})]
				}), /* @__PURE__ */ jsxs(Box, {
					className: `rounded-lg border ${theme.colors.border} divide-y ${theme.colors.borderSubtle}`,
					children: [list.length === 0 && /* @__PURE__ */ jsx("p", {
						className: `${theme.colors.textMuted} text-sm p-4`,
						children: t("admin.registrations.empty")
					}), list.map((registration) => /* @__PURE__ */ jsxs(Box, {
						className: "p-4 flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ jsxs(Box, { children: [/* @__PURE__ */ jsx("span", {
							className: "text-sm font-semibold text-white block",
							children: registration.name
						}), /* @__PURE__ */ jsx("span", {
							className: `text-xs ${theme.colors.textMuted}`,
							children: registration.email
						})] }), /* @__PURE__ */ jsxs(Box, {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: `text-xs ${theme.colors.textSubtle}`,
									children: formatRegistrationDate(registration.created_at, language)
								}),
								/* @__PURE__ */ jsx(Badge, {
									variant: statusBadgeVariant[registration.status],
									children: t(registrationStatusTranslationKeys[registration.status])
								}),
								registration.status !== "confirmado" && /* @__PURE__ */ jsx(Button, {
									variant: "ghost",
									size: "sm",
									onClick: () => void onSetStatus(registration.id, "confirmado"),
									"aria-label": t("admin.registrations.confirmAria", { name: registration.name }),
									children: /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 text-green-400" })
								}),
								registration.status !== "cancelado" && /* @__PURE__ */ jsx(Button, {
									variant: "ghost",
									size: "sm",
									onClick: () => void onSetStatus(registration.id, "cancelado"),
									"aria-label": t("admin.registrations.cancelAria", { name: registration.name }),
									children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4 text-orange-400" })
								}),
								/* @__PURE__ */ jsx(Button, {
									variant: "ghost",
									size: "sm",
									onClick: () => {
										if (window.confirm(t("admin.registrations.deleteConfirm", { name: registration.name }))) onDelete(registration.id);
									},
									"aria-label": t("admin.registrations.deleteAria", { name: registration.name }),
									children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4 text-red-400" })
								})
							]
						})]
					}, registration.id))]
				})] }, workshop.id);
			})
		]
	})] });
};
//#endregion
//#region src/components/admin/AdminWorkshopCalendarPanel.tsx
var buildWorkshopItem = (data) => ({
	id: "draft",
	title: data.title,
	description: data.description,
	image: "",
	category: "talleres",
	status: data.status,
	featured: data.featured,
	eventDate: data.eventDate,
	eventLocation: data.eventLocation,
	priceCents: parsePriceToCents(data.price),
	currency: "EUR"
});
var AdminWorkshopCalendarPanel = ({ workshopData }) => {
	const { t } = useTranslation();
	const workshop = useMemo(() => buildWorkshopItem(workshopData), [workshopData]);
	return /* @__PURE__ */ jsxs("div", {
		className: "p-4 rounded-xl border bg-neutral-900/60 border-neutral-700 space-y-3",
		children: [/* @__PURE__ */ jsxs("p", {
			className: "text-sm text-neutral-200 flex items-center gap-3",
			children: [/* @__PURE__ */ jsx(CheckCircle, {
				className: "w-5 h-5 text-green-400 flex-shrink-0",
				"aria-hidden": "true"
			}), /* @__PURE__ */ jsx("span", { children: t("admin.calendarPanel.published", { title: workshop.title }) })]
		}), /* @__PURE__ */ jsx(CalendarEventActions, { workshop })]
	});
};
//#endregion
//#region src/components/i18n/LanguageSwitcher.tsx
var languages = [{
	code: "es",
	label: "ES"
}, {
	code: "en",
	label: "EN"
}];
var LanguageSwitcher = ({ className = "", onSelect }) => {
	const { t, i18n } = useTranslation();
	const location = useLocation();
	const currentLanguage = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language);
	const isAdminRoute = location.pathname === "/admin" || location.pathname.startsWith("/admin/");
	return /* @__PURE__ */ jsx("nav", {
		"aria-label": t("language.label"),
		className,
		children: /* @__PURE__ */ jsx("ul", {
			className: "flex items-center gap-1",
			children: languages.map((language) => {
				const isActive = currentLanguage === language.code;
				const ariaLabel = language.code === "es" ? t("language.switchToSpanish") : t("language.switchToEnglish");
				return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
					to: buildLocalizedPath(location.pathname, location.search, location.hash, language.code),
					hrefLang: language.code,
					lang: language.code,
					"aria-label": ariaLabel,
					"aria-current": isActive ? "page" : void 0,
					onClick: () => {
						persistLanguage(language.code);
						if (isAdminRoute) i18n.changeLanguage(language.code);
						onSelect?.();
					},
					className: `inline-flex min-w-8 items-center justify-center rounded-md px-2 py-1 text-xs font-semibold tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 ${isActive ? "bg-orange-600 text-white" : "text-neutral-400 hover:text-white"}`,
					children: language.label
				}) }, language.code);
			})
		})
	});
};
//#endregion
//#region src/assets/Logo.png
var Logo_default = "/assets/Logo-35Lqm5dB.png";
//#endregion
//#region src/components/admin/AdminLoginForm.tsx
var AdminLoginForm = ({ onLogin, onClose, errorMessage }) => {
	const { t } = useTranslation();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!email.trim() || !password) return;
		setIsSubmitting(true);
		try {
			await onLogin(email.trim(), password);
		} finally {
			setIsSubmitting(false);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: `fixed inset-0 z-50 ${theme.colors.background} flex flex-col justify-center items-center px-4`,
		children: [/* @__PURE__ */ jsx("div", {
			className: "absolute top-6 right-6",
			children: /* @__PURE__ */ jsx(LanguageSwitcher, {})
		}), /* @__PURE__ */ jsxs(Card, {
			className: "max-w-md w-full p-8 text-center shadow-2xl",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "flex justify-center mb-6",
					children: /* @__PURE__ */ jsx("img", {
						src: Logo_default,
						alt: t("nav.logoAlt"),
						className: "h-12 w-auto object-contain"
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600",
					children: /* @__PURE__ */ jsx(Lock, {
						className: "w-6 h-6",
						"aria-hidden": "true"
					})
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "text-2xl font-bold text-white mb-2 uppercase tracking-wider",
					children: t("admin.login.title")
				}),
				/* @__PURE__ */ jsx("p", {
					className: `${theme.colors.textMuted} text-sm mb-6`,
					children: t("admin.login.subtitle")
				}),
				/* @__PURE__ */ jsxs("form", {
					onSubmit: handleSubmit,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ jsx(Input, {
							id: "admin-email",
							label: t("admin.login.emailLabel"),
							type: "email",
							value: email,
							onChange: (event) => setEmail(event.target.value),
							placeholder: t("admin.login.emailPlaceholder"),
							autoComplete: "username",
							required: true,
							autoFocus: true
						}),
						/* @__PURE__ */ jsx(PasswordInput, {
							id: "admin-password",
							label: t("admin.login.passwordLabel"),
							value: password,
							onChange: (event) => setPassword(event.target.value),
							placeholder: t("admin.login.passwordPlaceholder"),
							autoComplete: "current-password",
							required: true
						}),
						errorMessage && /* @__PURE__ */ jsx("p", {
							className: "text-xs text-red-400",
							role: "alert",
							children: errorMessage
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex gap-3 pt-2",
							children: [/* @__PURE__ */ jsx(Button, {
								variant: "secondary",
								className: "w-1/2",
								onClick: onClose,
								children: t("admin.backToSite")
							}), /* @__PURE__ */ jsx(Button, {
								type: "submit",
								variant: "primary",
								className: "w-1/2",
								disabled: isSubmitting,
								children: isSubmitting ? t("admin.login.submitting") : t("admin.login.submit")
							})]
						})
					]
				})
			]
		})]
	});
};
//#endregion
//#region src/components/admin/AdminDashboardHeader.tsx
var AdminDashboardHeader = ({ onClose, onLogout }) => {
	const { t } = useTranslation();
	return /* @__PURE__ */ jsx("header", {
		className: `sticky top-0 z-40 bg-neutral-900/90 backdrop-blur-md border-b ${theme.colors.border}`,
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ jsx("img", {
					src: Logo_default,
					alt: t("nav.logoAlt"),
					className: "h-10 w-auto object-contain"
				}), /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h1", {
					className: "text-lg font-bold text-white uppercase tracking-wider",
					children: t("admin.title")
				}) })]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-3",
				children: [
					/* @__PURE__ */ jsx(LanguageSwitcher, {}),
					/* @__PURE__ */ jsxs(Button, {
						variant: "secondary",
						size: "sm",
						onClick: onClose,
						children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "w-3.5 h-3.5" }), t("admin.backToSite")]
					}),
					/* @__PURE__ */ jsx(Button, {
						variant: "outline",
						size: "sm",
						onClick: onLogout,
						"aria-label": t("admin.logout"),
						children: /* @__PURE__ */ jsx(Unlock, { className: "w-3.5 h-3.5" })
					})
				]
			})]
		})
	});
};
//#endregion
//#region src/hooks/useAdminAuth.ts
var useAdminAuth = () => {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
	useEffect(() => {
		if (!isSupabaseConfigured || !supabase) return;
		let isActive = true;
		supabase.auth.getSession().then(({ data }) => {
			if (isActive) {
				setUser(data.session?.user ?? null);
				setIsLoading(false);
			}
		});
		const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
			if (isActive) {
				setUser(session?.user ?? null);
				setIsLoading(false);
			}
		});
		return () => {
			isActive = false;
			listener.subscription.unsubscribe();
		};
	}, []);
	return {
		user,
		isLoading,
		signIn: useCallback(async (email, password) => {
			if (!isSupabaseConfigured || !supabase) return { success: true };
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password
			});
			if (error) return {
				success: false,
				errorKey: "admin.login.invalidCredentials"
			};
			return { success: true };
		}, []),
		signOut: useCallback(async () => {
			if (!isSupabaseConfigured || !supabase) return;
			await supabase.auth.signOut();
		}, [])
	};
};
//#endregion
//#region src/components/admin/AdminDashboard.tsx
var AdminDashboard = ({ products, registrations, isLoadingProducts, productsError, isLoadingRegistrations, registrationsError, onAddProduct, onEditProduct, onEditEtsyMetadata, onDeleteProduct, onRefreshProducts, onRefreshRegistrations, onSetRegistrationStatus, onDeleteRegistration, onClose }) => {
	const { t } = useTranslation();
	const { user, isLoading, signIn, signOut } = useAdminAuth();
	const [authError, setAuthError] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [editingProduct, setEditingProduct] = useState(null);
	const [feedbackMsg, setFeedbackMsg] = useState(null);
	const [createdWorkshop, setCreatedWorkshop] = useState(null);
	const isAuthenticated = !isSupabaseConfigured || user !== null;
	const handleLogin = async (email, password) => {
		const result = await signIn(email, password);
		setAuthError(result.success ? null : t(result.errorKey ?? "admin.login.unknownError"));
	};
	const handleLogout = () => {
		signOut();
	};
	const handleFormSubmit = async (data) => {
		setIsSubmitting(true);
		setFeedbackMsg(null);
		setCreatedWorkshop(null);
		const isEdit = Boolean(editingProduct);
		const success = isEdit && editingProduct ? await onEditProduct(String(editingProduct.id), data) : await onAddProduct(data);
		setIsSubmitting(false);
		if (success) {
			setFeedbackMsg({
				text: t(isEdit ? "admin.feedback.productUpdated" : "admin.feedback.productCreated"),
				type: "success"
			});
			setEditingProduct(null);
			if (!isEdit && data.category === "talleres" && data.eventDate) setCreatedWorkshop(data);
			setTimeout(() => setFeedbackMsg(null), 3500);
			return true;
		}
		setFeedbackMsg({
			text: t("admin.feedback.productOperationError"),
			type: "error"
		});
		return false;
	};
	const handleEtsySubmit = async (metadata) => {
		if (!editingProduct) return false;
		setIsSubmitting(true);
		setFeedbackMsg(null);
		const success = await onEditEtsyMetadata(String(editingProduct.id), metadata);
		setIsSubmitting(false);
		if (success) {
			setFeedbackMsg({
				text: t("admin.feedback.etsyUpdated"),
				type: "success"
			});
			setEditingProduct(null);
			setTimeout(() => setFeedbackMsg(null), 3500);
			return true;
		}
		setFeedbackMsg({
			text: t("admin.feedback.etsyUpdateError"),
			type: "error"
		});
		return false;
	};
	const handleDelete = async (id) => {
		setIsDeleting(true);
		setFeedbackMsg(null);
		const success = await onDeleteProduct(id);
		setIsDeleting(false);
		if (success) {
			if (editingProduct?.id === id) setEditingProduct(null);
			setFeedbackMsg({
				text: t("admin.feedback.productDeleted"),
				type: "success"
			});
			setTimeout(() => setFeedbackMsg(null), 3e3);
		} else setFeedbackMsg({
			text: t("admin.feedback.productDeleteError"),
			type: "error"
		});
	};
	if (isLoading) return /* @__PURE__ */ jsxs("div", {
		className: `fixed inset-0 z-50 ${theme.colors.background} flex flex-col justify-center items-center gap-3`,
		role: "status",
		children: [/* @__PURE__ */ jsx(LoaderCircle, {
			className: "w-6 h-6 text-orange-500 animate-spin",
			"aria-hidden": "true"
		}), /* @__PURE__ */ jsx("p", {
			className: `${theme.colors.textMuted} text-sm`,
			children: t("admin.loadingSession")
		})]
	});
	if (!isAuthenticated) return /* @__PURE__ */ jsx(AdminLoginForm, {
		onLogin: handleLogin,
		onClose,
		errorMessage: authError
	});
	return /* @__PURE__ */ jsxs("div", {
		className: `fixed inset-0 z-50 ${theme.colors.background} overflow-y-auto`,
		children: [/* @__PURE__ */ jsx(AdminDashboardHeader, {
			onClose,
			onLogout: handleLogout
		}), /* @__PURE__ */ jsxs("main", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8",
			children: [
				feedbackMsg && /* @__PURE__ */ jsxs("div", {
					className: `p-4 rounded-xl border flex items-center gap-3 text-sm ${feedbackMsg.type === "success" ? "bg-green-950/40 border-green-800 text-green-300" : "bg-red-950/40 border-red-800 text-red-300"}`,
					children: [feedbackMsg.type === "success" ? /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5 text-green-400" }) : /* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5 text-red-400" }), /* @__PURE__ */ jsx("span", { children: feedbackMsg.text })]
				}),
				createdWorkshop && /* @__PURE__ */ jsx(AdminWorkshopCalendarPanel, { workshopData: createdWorkshop }),
				isSupabaseConfigured && /* @__PURE__ */ jsx(AdminEtsySyncPanel, { onSynced: onRefreshProducts }),
				editingProduct?.source === "etsy" ? /* @__PURE__ */ jsx(AdminEtsyProductForm, {
					product: editingProduct,
					onSubmit: handleEtsySubmit,
					isSubmitting,
					onCancelEdit: () => setEditingProduct(null)
				}, editingProduct.id) : /* @__PURE__ */ jsx(AdminProductForm, {
					onSubmit: handleFormSubmit,
					isSubmitting,
					editingProduct,
					onCancelEdit: () => setEditingProduct(null)
				}, editingProduct ? editingProduct.id : "new-product-form"),
				/* @__PURE__ */ jsx(AdminProductTable, {
					products,
					onDelete: handleDelete,
					onEdit: (prod) => {
						setEditingProduct(prod);
						window.scrollTo({
							top: 0,
							behavior: "smooth"
						});
					},
					isDeleting,
					isLoading: isLoadingProducts,
					error: productsError,
					onRetry: onRefreshProducts
				}),
				/* @__PURE__ */ jsx(AdminRegistrationsPanel, {
					workshops: products,
					registrations,
					isLoading: isLoadingRegistrations,
					error: registrationsError,
					onRetry: onRefreshRegistrations,
					onSetStatus: onSetRegistrationStatus,
					onDelete: onDeleteRegistration
				})
			]
		})]
	});
};
//#endregion
//#region src/services/productService.ts
var STORAGE_BUCKET = "products";
var LOCAL_STORAGE_KEY$1 = "laurel_custom_products_v2";
var parseCupo = (value) => {
	if (!value || !value.trim()) return null;
	const parsed = Number(value);
	return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};
var resolvePriceFields = (formData) => {
	const priceCents = parsePriceToCents(formData.price);
	if (formData.price?.trim() && priceCents == null) throw new Error("El precio introducido no es válido.");
	if (!formData.discountPercent?.trim()) return {
		priceCents,
		currency: "EUR",
		discountPercent: null
	};
	const discountPercent = Number(formData.discountPercent.replace(",", "."));
	if (!Number.isInteger(discountPercent) || discountPercent < 1 || discountPercent > 90) throw new Error("El descuento debe ser un número entero entre 1 y 90.");
	if (priceCents == null) throw new Error("Para aplicar un descuento primero debes indicar un precio.");
	return {
		priceCents,
		currency: "EUR",
		discountPercent
	};
};
var getStoredLocalProducts = () => {
	try {
		const raw = localStorage.getItem(LOCAL_STORAGE_KEY$1);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
};
var saveStoredLocalProducts = (items) => {
	try {
		localStorage.setItem(LOCAL_STORAGE_KEY$1, JSON.stringify(items));
	} catch {
		return;
	}
};
var fetchProducts = async () => {
	{
		if (!isSupabaseConfigured || !supabase) return [];
		const { data, error } = await supabase.from("products").select("*").order("featured", { ascending: false }).order("created_at", { ascending: false });
		if (error) throw error;
		return data || [];
	}
};
var uploadProductImage = async (file) => {
	const validationError = validateImageFile(file);
	if (validationError) throw new Error(validationError);
	if (isSupabaseConfigured && supabase) {
		const fileExt = file.name.split(".").pop();
		const filePath = `items/${`${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`}`;
		const { error: uploadError } = await supabase.storage.from(STORAGE_BUCKET).upload(filePath, file);
		if (uploadError) throw uploadError;
		const { data: publicUrlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
		return publicUrlData.publicUrl;
	}
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
};
var createProduct = async (formData) => {
	let imageUrl = formData.imageUrl || "";
	const priceFields = resolvePriceFields(formData);
	const purchaseLinks = resolvePurchaseLinks(formData.category, formData.etsyLink, formData.vintedLink);
	if (formData.imageFile) imageUrl = await uploadProductImage(formData.imageFile);
	const newProduct = {
		id: isSupabaseConfigured ? void 0 : `mock-${Date.now()}`,
		title: formData.title.trim(),
		description: formData.description.trim(),
		category: formData.category,
		image: imageUrl,
		...purchaseLinks,
		...priceFields,
		source: "local",
		isVisible: true,
		status: formData.status,
		featured: formData.featured,
		eventDate: formData.eventDate?.trim() || void 0,
		eventLocation: formData.eventLocation?.trim() || void 0,
		cupo: parseCupo(formData.cupo),
		created_at: (/* @__PURE__ */ new Date()).toISOString()
	};
	if (isSupabaseConfigured && supabase) {
		const { data, error } = await supabase.from("products").insert([{
			title: newProduct.title,
			description: newProduct.description,
			category: newProduct.category,
			image: newProduct.image,
			etsyLink: newProduct.etsyLink || null,
			vintedLink: newProduct.vintedLink || null,
			priceCents: newProduct.priceCents ?? null,
			currency: newProduct.currency,
			discountPercent: newProduct.discountPercent ?? null,
			source: "local",
			isVisible: true,
			status: newProduct.status,
			featured: newProduct.featured,
			eventDate: newProduct.eventDate || null,
			eventLocation: newProduct.eventLocation || null,
			cupo: newProduct.cupo ?? null
		}]).select().single();
		if (error) throw error;
		return data;
	}
	saveStoredLocalProducts([newProduct, ...getStoredLocalProducts()]);
	return newProduct;
};
var updateProduct = async (id, formData) => {
	let imageUrl = formData.imageUrl || "";
	const priceFields = resolvePriceFields(formData);
	const purchaseLinks = resolvePurchaseLinks(formData.category, formData.etsyLink, formData.vintedLink);
	if (formData.imageFile) imageUrl = await uploadProductImage(formData.imageFile);
	if (isSupabaseConfigured && supabase) {
		const payload = {
			title: formData.title.trim(),
			description: formData.description.trim(),
			category: formData.category,
			etsyLink: purchaseLinks.etsyLink ?? null,
			vintedLink: purchaseLinks.vintedLink ?? null,
			...priceFields,
			status: formData.status,
			featured: formData.featured,
			eventDate: formData.eventDate?.trim() || void 0,
			eventLocation: formData.eventLocation?.trim() || void 0,
			cupo: parseCupo(formData.cupo)
		};
		if (imageUrl) payload.image = imageUrl;
		const { data, error } = await supabase.from("products").update(payload).eq("id", id).eq("source", "local").select().single();
		if (error) {
			if (error.code === "PGRST116") throw new Error("Los productos de Etsy se editan desde Etsy.");
			throw error;
		}
		return data;
	}
	const updatedLocals = getStoredLocalProducts().map((item) => {
		if (item.id === id) return {
			...item,
			title: formData.title.trim(),
			description: formData.description.trim(),
			category: formData.category,
			image: imageUrl || item.image,
			etsyLink: purchaseLinks.etsyLink ?? null,
			vintedLink: purchaseLinks.vintedLink ?? null,
			...priceFields,
			status: formData.status,
			featured: formData.featured,
			eventDate: formData.eventDate?.trim() || void 0,
			eventLocation: formData.eventLocation?.trim() || void 0,
			cupo: parseCupo(formData.cupo)
		};
		return item;
	});
	saveStoredLocalProducts(updatedLocals);
	const found = updatedLocals.find((item) => item.id === id);
	if (!found) return {
		id,
		title: formData.title.trim(),
		description: formData.description.trim(),
		category: formData.category,
		image: imageUrl,
		etsyLink: purchaseLinks.etsyLink ?? null,
		vintedLink: purchaseLinks.vintedLink ?? null,
		...priceFields,
		status: formData.status,
		featured: formData.featured,
		eventDate: formData.eventDate?.trim() || void 0,
		eventLocation: formData.eventLocation?.trim() || void 0,
		cupo: parseCupo(formData.cupo)
	};
	return found;
};
var deleteProduct = async (id) => {
	if (isSupabaseConfigured && supabase) {
		const { data, error } = await supabase.from("products").delete().eq("id", id).eq("source", "local").select("id");
		if (error) throw error;
		if (!data || data.length === 0) throw new Error("Los productos de Etsy se gestionan desde Etsy.");
		return;
	}
	saveStoredLocalProducts(getStoredLocalProducts().filter((item) => item.id !== id));
};
var updateEtsyProductMetadata = async (id, metadata) => {
	if (metadata.category === "talleres") throw new Error("Los talleres no pueden sincronizarse desde Etsy.");
	if (isSupabaseConfigured && supabase) {
		const { data, error } = await supabase.from("products").update({
			category: metadata.category,
			featured: metadata.featured
		}).eq("id", id).eq("source", "etsy").select().single();
		if (error) throw error;
		return data;
	}
	const currentLocals = getStoredLocalProducts();
	let updatedProduct = null;
	saveStoredLocalProducts(currentLocals.map((item) => {
		if (item.id !== id) return item;
		updatedProduct = {
			...item,
			category: metadata.category,
			featured: metadata.featured
		};
		return updatedProduct;
	}));
	if (!updatedProduct) throw new Error("Producto no encontrado.");
	return updatedProduct;
};
//#endregion
//#region src/hooks/useProducts.ts
var useProducts = () => {
	const { t } = useTranslation();
	const [products, setProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const loadProducts = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const data = await fetchProducts();
			setProducts(data);
		} catch (err) {
			logError("useProducts.loadProducts", err);
			const msg = err instanceof Error ? err.message : t("admin.errors.loadProducts");
			setError(msg);
		} finally {
			setIsLoading(false);
		}
	}, [t]);
	useEffect(() => {
		let isCancelled = false;
		const init = async () => {
			try {
				const data = await fetchProducts();
				if (!isCancelled) {
					setProducts(data);
					setIsLoading(false);
				}
			} catch (err) {
				if (!isCancelled) {
					logError("useProducts.init", err);
					const msg = err instanceof Error ? err.message : t("admin.errors.loadProducts");
					setError(msg);
					setIsLoading(false);
				}
			}
		};
		init();
		return () => {
			isCancelled = true;
		};
	}, [t]);
	const addProduct = async (data) => {
		try {
			const created = await createProduct(data);
			setProducts((prev) => [created, ...prev]);
			return true;
		} catch (err) {
			logError("useProducts.addProduct", err);
			const msg = err instanceof Error ? err.message : t("admin.errors.saveProduct");
			setError(msg);
			return false;
		}
	};
	const editProduct = async (id, data) => {
		try {
			const updated = await updateProduct(id, data);
			setProducts((prev) => prev.map((item) => item.id === id ? updated : item));
			return true;
		} catch (err) {
			logError("useProducts.editProduct", err);
			const msg = err instanceof Error ? err.message : t("admin.errors.updateProduct");
			setError(msg);
			return false;
		}
	};
	const editEtsyMetadata = async (id, metadata) => {
		try {
			const updated = await updateEtsyProductMetadata(id, metadata);
			setProducts((prev) => prev.map((item) => item.id === id ? updated : item));
			return true;
		} catch (err) {
			logError("useProducts.editEtsyMetadata", err);
			const msg = err instanceof Error ? err.message : t("admin.errors.updateProduct");
			setError(msg);
			return false;
		}
	};
	const removeProduct = async (id) => {
		try {
			await deleteProduct(id);
			setProducts((prev) => prev.filter((item) => item.id !== id));
			return true;
		} catch (err) {
			logError("useProducts.removeProduct", err);
			const msg = err instanceof Error ? err.message : t("admin.errors.deleteProduct");
			setError(msg);
			return false;
		}
	};
	return {
		products,
		isLoading,
		error,
		addProduct,
		editProduct,
		editEtsyMetadata,
		removeProduct,
		refreshProducts: loadProducts
	};
};
//#endregion
//#region src/errors/registrationError.ts
var RegistrationError = class extends Error {
	code;
	constructor(code) {
		super(code);
		this.name = "RegistrationError";
		this.code = code;
	}
};
var getRegistrationErrorCode = (error) => error instanceof RegistrationError ? error.code : "unknown";
//#endregion
//#region src/services/registrationService.ts
var LOCAL_STORAGE_KEY = "laurel_workshop_registrations";
var getStoredLocalRegistrations = () => {
	try {
		const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
};
var saveStoredLocalRegistrations = (items) => {
	try {
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
	} catch {
		return;
	}
};
var mapRegistrationError = (code, message) => {
	if (code === "23505") return new RegistrationError("alreadyRegistered");
	if (message.includes("workshop_full")) return new RegistrationError("workshopFull");
	return new RegistrationError("unknown");
};
var fetchRegistrations = async () => {
	{
		if (!isSupabaseConfigured || !supabase) return [];
		const { data, error } = await supabase.from("workshop_registrations").select("*").order("created_at", { ascending: false });
		if (error) throw error;
		return data || [];
	}
};
var fetchRegistrationCounts = async () => {
	return (await fetchRegistrations()).reduce((counts, registration) => {
		if (registration.status !== "cancelado") counts[registration.product_id] = (counts[registration.product_id] || 0) + 1;
		return counts;
	}, {});
};
var createRegistration = async (productId, formData, cupo) => {
	const name = formData.name.trim();
	const email = formData.email.trim();
	if (isSupabaseConfigured && supabase) {
		const { data, error } = await supabase.from("workshop_registrations").insert([{
			product_id: productId,
			name,
			email
		}]).select().single();
		if (error) throw mapRegistrationError(error.code, error.message);
		return data;
	}
	const localRegistrations = getStoredLocalRegistrations();
	const isActiveForWorkshop = (registration) => registration.product_id === productId && registration.status !== "cancelado";
	if (localRegistrations.some((registration) => isActiveForWorkshop(registration) && registration.email.toLowerCase() === email.toLowerCase())) throw new RegistrationError("alreadyRegistered");
	if (cupo !== null && localRegistrations.filter(isActiveForWorkshop).length >= cupo) throw new RegistrationError("workshopFull");
	const newRegistration = {
		id: `local-${crypto.randomUUID()}`,
		product_id: productId,
		name,
		email,
		status: "pendiente",
		created_at: (/* @__PURE__ */ new Date()).toISOString()
	};
	saveStoredLocalRegistrations([newRegistration, ...localRegistrations]);
	return newRegistration;
};
var updateRegistrationStatus = async (id, status) => {
	if (isSupabaseConfigured && supabase) {
		const { data, error } = await supabase.from("workshop_registrations").update({ status }).eq("id", id).select().single();
		if (error) throw mapRegistrationError(error.code, error.message);
		return data;
	}
	const updated = getStoredLocalRegistrations().map((registration) => registration.id === id ? {
		...registration,
		status
	} : registration);
	saveStoredLocalRegistrations(updated);
	const found = updated.find((registration) => registration.id === id);
	if (!found) throw new RegistrationError("notFound");
	return found;
};
var deleteRegistration = async (id) => {
	if (isSupabaseConfigured && supabase) {
		const { error } = await supabase.from("workshop_registrations").delete().eq("id", id);
		if (error) throw mapRegistrationError(error.code, error.message);
		return;
	}
	saveStoredLocalRegistrations(getStoredLocalRegistrations().filter((registration) => registration.id !== id));
};
//#endregion
//#region src/hooks/useRegistrations.ts
var useRegistrations = () => {
	const { t } = useTranslation();
	const [registrations, setRegistrations] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const loadRegistrations = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const data = await fetchRegistrations();
			setRegistrations(data);
		} catch (err) {
			logError("useRegistrations.loadRegistrations", err);
			const msg = err instanceof Error ? err.message : t("admin.errors.loadRegistrations");
			setError(msg);
		} finally {
			setIsLoading(false);
		}
	}, [t]);
	useEffect(() => {
		let isCancelled = false;
		const init = async () => {
			try {
				const data = await fetchRegistrations();
				if (!isCancelled) {
					setRegistrations(data);
					setIsLoading(false);
				}
			} catch (err) {
				if (!isCancelled) {
					logError("useRegistrations.init", err);
					const msg = err instanceof Error ? err.message : t("admin.errors.loadRegistrations");
					setError(msg);
					setIsLoading(false);
				}
			}
		};
		init();
		return () => {
			isCancelled = true;
		};
	}, [t]);
	const setStatus = async (id, status) => {
		try {
			const updated = await updateRegistrationStatus(id, status);
			setRegistrations((prev) => prev.map((registration) => registration.id === id ? updated : registration));
			return true;
		} catch (err) {
			logError("useRegistrations.setStatus", err);
			const msg = err instanceof Error ? err.message : t("admin.errors.updateRegistration");
			setError(msg);
			return false;
		}
	};
	const remove = async (id) => {
		try {
			await deleteRegistration(id);
			setRegistrations((prev) => prev.filter((registration) => registration.id !== id));
			return true;
		} catch (err) {
			logError("useRegistrations.remove", err);
			const msg = err instanceof Error ? err.message : t("admin.errors.deleteRegistration");
			setError(msg);
			return false;
		}
	};
	return {
		registrations,
		isLoading,
		error,
		setStatus,
		remove,
		refreshRegistrations: loadRegistrations
	};
};
//#endregion
//#region src/pages/AdminPage.tsx
var AdminPage = () => {
	const { t } = useTranslation();
	useDocumentTitle(`${t("admin.title")} | ${SITE_NAME}`);
	const navigate = useNavigate();
	const { products, isLoading: isLoadingProducts, error: productsError, addProduct, editProduct, editEtsyMetadata, removeProduct, refreshProducts } = useProducts();
	const { registrations, isLoading: isLoadingRegistrations, error: registrationsError, setStatus, remove, refreshRegistrations } = useRegistrations();
	return /* @__PURE__ */ jsx(AdminDashboard, {
		products,
		registrations,
		isLoadingProducts,
		productsError,
		isLoadingRegistrations,
		registrationsError,
		onAddProduct: addProduct,
		onEditProduct: editProduct,
		onEditEtsyMetadata: editEtsyMetadata,
		onDeleteProduct: removeProduct,
		onRefreshProducts: refreshProducts,
		onRefreshRegistrations: refreshRegistrations,
		onSetRegistrationStatus: setStatus,
		onDeleteRegistration: remove,
		onClose: () => navigate("/")
	});
};
//#endregion
//#region src/routes/admin.tsx
var admin_exports = /* @__PURE__ */ __exportAll({
	default: () => admin_default,
	meta: () => meta$2
});
function meta$2({ matches }) {
	return getAdminMeta(getRootLanguage(matches));
}
var admin_default = UNSAFE_withComponentProps(function AdminRoute() {
	return /* @__PURE__ */ jsx(AdminPage, {});
});
//#endregion
//#region src/seo/sitemap.ts
var INDEXABLE_PATHS = ["/es", "/en"];
var escapeXml = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
var buildUrl = (siteUrl, path) => `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
var buildSitemap = (siteUrl, paths = INDEXABLE_PATHS) => {
	const normalizedSiteUrl = siteUrl.replace(/\/$/, "");
	const spanishUrl = escapeXml(buildUrl(normalizedSiteUrl, "/es"));
	const englishUrl = escapeXml(buildUrl(normalizedSiteUrl, "/en"));
	return [
		"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
		"<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:xhtml=\"http://www.w3.org/1999/xhtml\">",
		...paths.map((path) => {
			return [
				"  <url>",
				`    <loc>${escapeXml(buildUrl(normalizedSiteUrl, path))}</loc>`,
				`    <xhtml:link rel="alternate" hreflang="es" href="${spanishUrl}" />`,
				`    <xhtml:link rel="alternate" hreflang="en" href="${englishUrl}" />`,
				`    <xhtml:link rel="alternate" hreflang="x-default" href="${spanishUrl}" />`,
				"  </url>"
			].join("\n");
		}),
		"</urlset>"
	].join("\n");
};
//#endregion
//#region src/routes/sitemap.ts
var sitemap_exports = /* @__PURE__ */ __exportAll({ loader: () => loader$1 });
function loader$1() {
	return new Response(buildSitemap(getSiteUrl()), {
		status: 200,
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
		}
	});
}
//#endregion
//#region src/routes/language-layout.tsx
var language_layout_exports = /* @__PURE__ */ __exportAll({ default: () => language_layout_default });
var language_layout_default = UNSAFE_withComponentProps(function LanguageLayout() {
	return /* @__PURE__ */ jsx(Outlet, {});
});
//#endregion
//#region src/hooks/useWindowScroll.ts
var useWindowScroll = (threshold = 20) => {
	const [isScrolled, setIsScrolled] = useState(false);
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > threshold);
		};
		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [threshold]);
	return isScrolled;
};
//#endregion
//#region src/components/layout/Navbar.tsx
var navLinks = [
	{
		labelKey: "nav.links.all",
		category: "todas",
		href: "#galeria"
	},
	{
		labelKey: "nav.links.custom",
		category: "personalizados",
		href: "#galeria"
	},
	{
		labelKey: "nav.links.tshirts",
		category: "camisetas",
		href: "#galeria"
	},
	{
		labelKey: "nav.links.illustrations",
		category: "ilustraciones",
		href: "#galeria"
	},
	{
		labelKey: "nav.links.workshops",
		category: "talleres",
		href: "#galeria"
	}
];
var Navbar = ({ activeCategory, onSelectCategory }) => {
	const { t } = useTranslation();
	const [isOpen, setIsOpen] = useState(false);
	const isScrolled = useWindowScroll(20);
	const handleLinkClick = (category) => {
		onSelectCategory(category);
		setIsOpen(false);
	};
	return /* @__PURE__ */ jsx("header", {
		className: `fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-neutral-950/90 backdrop-blur-md shadow-lg shadow-black/50 border-b border-neutral-800" : "bg-transparent"}`,
		children: /* @__PURE__ */ jsxs("nav", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
			"aria-label": t("nav.ariaLabel"),
			children: [/* @__PURE__ */ jsxs(Box, {
				className: "flex justify-between items-center h-20",
				children: [
					/* @__PURE__ */ jsxs("a", {
						href: "#",
						onClick: () => handleLinkClick("todas"),
						className: `flex-shrink-0 flex items-center gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 ${theme.colors.primaryFocus} rounded-sm group`,
						"aria-label": t("nav.homeAria"),
						children: [/* @__PURE__ */ jsx("img", {
							src: Logo_default,
							alt: t("nav.logoAlt"),
							className: "h-11 w-auto max-w-[130px] object-contain transition-transform group-hover:scale-105"
						}), /* @__PURE__ */ jsx(Typography, {
							variant: "h4",
							as: "span",
							className: "tracking-widest uppercase hidden sm:inline",
							children: /* @__PURE__ */ jsx(Trans, {
								i18nKey: "brand.name",
								components: { highlight: /* @__PURE__ */ jsx("span", { className: theme.colors.primaryText }) }
							})
						})]
					}),
					/* @__PURE__ */ jsxs(Box, {
						className: "hidden md:flex items-center space-x-6",
						children: [navLinks.map((link) => {
							const isActive = activeCategory === link.category;
							return /* @__PURE__ */ jsx("a", {
								href: link.href,
								onClick: () => handleLinkClick(link.category),
								className: `text-sm font-medium tracking-wide uppercase px-3 py-1.5 rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 ${theme.colors.primaryFocus} ${isActive ? "text-orange-500 font-semibold" : "text-neutral-300 hover:text-white"}`,
								"aria-current": isActive ? "page" : void 0,
								children: t(link.labelKey)
							}, link.category);
						}), /* @__PURE__ */ jsx(LanguageSwitcher, {})]
					}),
					/* @__PURE__ */ jsxs(Box, {
						className: "md:hidden flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(LanguageSwitcher, { onSelect: () => setIsOpen(false) }), /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setIsOpen((prev) => !prev),
							className: `text-neutral-300 hover:text-white p-2 rounded-md focus-visible:outline-none focus-visible:ring-2 ${theme.colors.primaryFocus}`,
							"aria-expanded": isOpen,
							"aria-label": isOpen ? t("nav.closeMenu") : t("nav.openMenu"),
							children: isOpen ? /* @__PURE__ */ jsx(X, { className: "h-6 w-6" }) : /* @__PURE__ */ jsx(Menu, { className: "h-6 w-6" })
						})]
					})
				]
			}), /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsx(motion.div, {
				initial: {
					opacity: 0,
					height: 0
				},
				animate: {
					opacity: 1,
					height: "auto"
				},
				exit: {
					opacity: 0,
					height: 0
				},
				transition: { duration: .2 },
				className: "md:hidden bg-neutral-900 border-b border-neutral-800 rounded-b-lg overflow-hidden",
				children: /* @__PURE__ */ jsx(Box, {
					className: "px-2 pt-2 pb-4 space-y-1 sm:px-3",
					children: navLinks.map((link) => {
						const isActive = activeCategory === link.category;
						return /* @__PURE__ */ jsx("a", {
							href: link.href,
							onClick: () => handleLinkClick(link.category),
							className: `block px-3 py-3 text-base font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 ${theme.colors.primaryFocus} ${isActive ? "text-orange-500 bg-neutral-800/80 font-semibold" : "text-neutral-300 hover:text-white hover:bg-neutral-800"}`,
							"aria-current": isActive ? "page" : void 0,
							children: t(link.labelKey)
						}, link.category);
					})
				})
			}) })]
		})
	});
};
//#endregion
//#region src/components/layout/Footer.tsx
var Footer = () => {
	const { t } = useTranslation();
	const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
	const etsyUrl = "https://www.etsy.com/es/shop/Laurelenlienzo?etsrc=sdt";
	const instagramUrl = "https://www.instagram.com/laurelenlienzo?cplk=Ynl4anVvemtlNzhw";
	const tiktokUrl = "https://www.tiktok.com/@laurelenlienzo?_r=1&_t=ZN-9AgTExlNL7u";
	const contactEmail = "laurelenlienzo@gmail.com";
	return /* @__PURE__ */ jsxs("footer", {
		className: "bg-neutral-950 border-t border-neutral-900 pt-16 pb-8",
		"aria-labelledby": "footer-heading",
		children: [/* @__PURE__ */ jsx(Typography, {
			as: "h2",
			id: "footer-heading",
			className: "sr-only",
			children: t("footer.heading")
		}), /* @__PURE__ */ jsxs(Box, {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ jsxs(Box, {
				className: "flex flex-col md:flex-row justify-between items-center gap-6",
				children: [/* @__PURE__ */ jsxs(Box, {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ jsx("img", {
						src: Logo_default,
						alt: t("nav.logoAlt"),
						className: "h-11 w-auto max-w-[130px] object-contain transition-transform group-hover:scale-105"
					}), /* @__PURE__ */ jsx(Typography, {
						variant: "h4",
						className: "tracking-widest uppercase",
						children: /* @__PURE__ */ jsx(Trans, {
							i18nKey: "brand.name",
							components: { highlight: /* @__PURE__ */ jsx("span", { className: theme.colors.primaryText }) }
						})
					})]
				}), /* @__PURE__ */ jsxs(Box, {
					className: "flex items-center space-x-6",
					children: [
						/* @__PURE__ */ jsxs("a", {
							href: `mailto:${contactEmail}`,
							className: "text-neutral-400 hover:text-orange-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 rounded-sm p-1 inline-flex items-center justify-center gap-2 text-sm",
							"aria-label": t("footer.emailAria", { email: contactEmail }),
							title: contactEmail,
							children: [/* @__PURE__ */ jsx(Mail, {
								className: "h-6 w-6",
								"aria-hidden": "true"
							}), /* @__PURE__ */ jsx("span", {
								className: "hidden sm:inline font-mono text-xs",
								children: contactEmail
							})]
						}),
						/* @__PURE__ */ jsx("a", {
							href: etsyUrl,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "text-neutral-400 hover:text-orange-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 rounded-sm p-1 inline-flex items-center justify-center",
							"aria-label": t("footer.etsyAria"),
							children: /* @__PURE__ */ jsx(ShoppingBag, {
								className: "h-6 w-6",
								"aria-hidden": "true"
							})
						}),
						/* @__PURE__ */ jsx("a", {
							href: instagramUrl,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "text-neutral-400 hover:text-orange-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 rounded-sm p-1 inline-flex items-center justify-center",
							"aria-label": t("footer.instagramAria"),
							children: /* @__PURE__ */ jsxs("svg", {
								className: "h-6 w-6 fill-none stroke-current stroke-2",
								viewBox: "0 0 24 24",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								"aria-hidden": "true",
								children: [
									/* @__PURE__ */ jsx("rect", {
										width: "20",
										height: "20",
										x: "2",
										y: "2",
										rx: "5",
										ry: "5"
									}),
									/* @__PURE__ */ jsx("path", { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" }),
									/* @__PURE__ */ jsx("line", {
										x1: "17.5",
										x2: "17.51",
										y1: "6.5",
										y2: "6.5"
									})
								]
							})
						}),
						/* @__PURE__ */ jsx("a", {
							href: tiktokUrl,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "text-neutral-400 hover:text-orange-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 rounded-sm p-1 inline-flex items-center justify-center",
							"aria-label": t("footer.tiktokAria"),
							children: /* @__PURE__ */ jsx("svg", {
								className: "h-6 w-6 fill-none stroke-current stroke-2",
								viewBox: "0 0 24 24",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								"aria-hidden": "true",
								children: /* @__PURE__ */ jsx("path", { d: "M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" })
							})
						})
					]
				})]
			}), /* @__PURE__ */ jsxs(Box, {
				className: "mt-8 border-t border-neutral-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4",
				children: [/* @__PURE__ */ jsx(Typography, {
					variant: "body",
					className: "text-neutral-500 text-center md:text-left",
					children: t("footer.copyright", { year: currentYear })
				}), /* @__PURE__ */ jsxs(Box, {
					className: "flex gap-4 text-sm text-neutral-500",
					children: [/* @__PURE__ */ jsx(Typography, {
						as: "span",
						variant: "caption",
						className: "hover:text-neutral-300 transition-colors cursor-default",
						children: t("footer.accessibility")
					}), /* @__PURE__ */ jsx(Typography, {
						as: "span",
						variant: "caption",
						className: "hover:text-neutral-300 transition-colors cursor-default",
						children: t("footer.legal")
					})]
				})]
			})]
		})]
	});
};
//#endregion
//#region src/components/HeroSection.tsx
var HeroSection = () => {
	const { t } = useTranslation();
	return /* @__PURE__ */ jsxs("section", {
		className: "relative min-h-[90vh] flex items-center justify-center bg-neutral-950 overflow-hidden px-4 pt-20",
		children: [/* @__PURE__ */ jsx(Box, {
			className: "absolute inset-0 z-0 opacity-25 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-950 to-neutral-950",
			"aria-hidden": "true"
		}), /* @__PURE__ */ jsx(Box, {
			className: "relative z-10 text-center max-w-5xl mx-auto",
			children: /* @__PURE__ */ jsxs(motion.div, {
				initial: {
					opacity: 0,
					y: 25
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: {
					duration: .8,
					ease: "easeOut"
				},
				children: [
					/* @__PURE__ */ jsx(Typography, {
						variant: "h1",
						className: "mb-6 font-hero font-bold tracking-normal",
						children: /* @__PURE__ */ jsx(Trans, {
							i18nKey: "hero.title",
							components: { highlight: /* @__PURE__ */ jsx("span", { className: theme.colors.primaryText }) }
						})
					}),
					/* @__PURE__ */ jsx(Typography, {
						variant: "subtitle",
						className: "mt-4 max-w-2xl mx-auto mb-10",
						children: t("hero.subtitle")
					}),
					/* @__PURE__ */ jsxs(motion.div, {
						className: "flex flex-col sm:flex-row justify-center gap-4",
						initial: { opacity: 0 },
						animate: { opacity: 1 },
						transition: {
							delay: .3,
							duration: .6
						},
						children: [/* @__PURE__ */ jsx("a", {
							href: "#galeria",
							className: `px-8 py-4 ${theme.colors.primary} font-bold tracking-widest uppercase rounded-sm transition-colors shadow-lg shadow-orange-600/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950`,
							children: t("hero.catalogCta")
						}), /* @__PURE__ */ jsxs("a", {
							href: "https://www.etsy.com/es/shop/Laurelenlienzo?etsrc=sdt",
							target: "_blank",
							rel: "noopener noreferrer",
							className: `px-8 py-4 bg-transparent border border-neutral-700 hover:border-white text-white font-bold tracking-widest uppercase rounded-sm transition-all focus-visible:outline-none focus-visible:ring-2 ${theme.colors.primaryFocus} focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 flex items-center justify-center gap-2`,
							children: [
								/* @__PURE__ */ jsx(ShoppingBag, {
									className: "w-5 h-5",
									"aria-hidden": "true"
								}),
								" ",
								t("hero.etsyCta")
							]
						})]
					})
				]
			})
		})]
	});
};
//#endregion
//#region src/components/ui/Modal.tsx
var Modal = ({ isOpen, onClose, title, children }) => {
	const { t } = useTranslation();
	const panelRef = useRef(null);
	useEffect(() => {
		if (!isOpen) return;
		const handleKeyDown = (event) => {
			if (event.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handleKeyDown);
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		panelRef.current?.focus();
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = previousOverflow;
		};
	}, [isOpen, onClose]);
	if (!isOpen) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4",
		children: [/* @__PURE__ */ jsx("button", {
			type: "button",
			className: "absolute inset-0 bg-neutral-950/85 backdrop-blur-sm cursor-default",
			onClick: onClose,
			"aria-label": t("a11y.closeDialog"),
			tabIndex: -1
		}), /* @__PURE__ */ jsxs("div", {
			ref: panelRef,
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "workshop-signup-title",
			tabIndex: -1,
			className: "relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-2xl focus:outline-none",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between mb-5",
				children: [/* @__PURE__ */ jsx("h2", {
					id: "workshop-signup-title",
					className: "text-lg font-bold text-white uppercase tracking-wider pr-4",
					children: title
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: onClose,
					"aria-label": t("common.close"),
					className: "p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600",
					children: /* @__PURE__ */ jsx(X, {
						className: "w-5 h-5",
						"aria-hidden": "true"
					})
				})]
			}), children]
		})]
	});
};
//#endregion
//#region src/components/WorkshopSignupForm.tsx
var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var WorkshopSignupForm = ({ workshop, onRegister, onClose }) => {
	const { t } = useTranslation();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorCode, setErrorCode] = useState(null);
	const [isSuccess, setIsSuccess] = useState(false);
	const instagramUrl = "https://www.instagram.com/laurelenlienzo?cplk=Ynl4anVvemtlNzhw";
	const tiktokUrl = "https://www.tiktok.com/@laurelenlienzo?_r=1&_t=ZN-9AgTExlNL7u";
	const handleSubmit = async (event) => {
		event.preventDefault();
		setErrorCode(null);
		const trimmedName = name.trim();
		const trimmedEmail = email.trim();
		if (!trimmedName || !trimmedEmail) {
			setErrorCode("required");
			return;
		}
		if (!EMAIL_PATTERN.test(trimmedEmail)) {
			setErrorCode("invalidEmail");
			return;
		}
		setIsSubmitting(true);
		try {
			await onRegister({
				name: trimmedName,
				email: trimmedEmail
			});
			setIsSuccess(true);
		} catch (err) {
			setErrorCode(getRegistrationErrorCode(err));
		} finally {
			setIsSubmitting(false);
		}
	};
	const socialNoticeKey = "workshop.social.both";
	if (isSuccess) return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "text-center space-y-4",
				children: [/* @__PURE__ */ jsx("div", {
					className: "flex justify-center",
					children: /* @__PURE__ */ jsx("div", {
						className: "w-12 h-12 bg-green-950/60 border border-green-800/60 rounded-full flex items-center justify-center",
						children: /* @__PURE__ */ jsx(CheckCircle, {
							className: "w-6 h-6 text-green-400",
							"aria-hidden": "true"
						})
					})
				}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
					className: "text-white font-semibold",
					children: t("workshop.form.successTitle")
				}), /* @__PURE__ */ jsx("p", {
					className: `${theme.colors.textMuted} text-sm mt-1`,
					children: t("workshop.form.successBody", { title: workshop.title })
				})] })]
			}),
			/* @__PURE__ */ jsx(CalendarEventActions, {
				workshop,
				attendee: {
					name,
					email
				}
			}),
			/* @__PURE__ */ jsxs(Box, {
				className: "p-3 bg-neutral-950 border border-neutral-800 rounded-lg flex items-start gap-2 text-sm text-neutral-300",
				children: [/* @__PURE__ */ jsx(Bell, {
					className: "w-4 h-4 mt-0.5 flex-shrink-0 text-orange-400",
					"aria-hidden": "true"
				}), /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx(Trans, {
					i18nKey: socialNoticeKey,
					components: {
						instagram: /* @__PURE__ */ jsx("a", {
							href: instagramUrl,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "text-orange-400 hover:text-orange-300 underline underline-offset-2 font-medium",
							"aria-label": t("workshop.social.instagramAria")
						}),
						tiktok: /* @__PURE__ */ jsx("a", {
							href: tiktokUrl,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "text-orange-400 hover:text-orange-300 underline underline-offset-2 font-medium",
							"aria-label": t("workshop.social.tiktokAria")
						})
					}
				}) })]
			}),
			/* @__PURE__ */ jsx(Button, {
				type: "button",
				variant: "primary",
				className: "w-full",
				onClick: onClose,
				children: t("common.close")
			})
		]
	});
	return /* @__PURE__ */ jsxs("form", {
		onSubmit: handleSubmit,
		className: "space-y-4",
		noValidate: true,
		children: [
			/* @__PURE__ */ jsx("p", {
				className: `${theme.colors.textMuted} text-sm`,
				children: t("workshop.form.intro", { title: workshop.title })
			}),
			/* @__PURE__ */ jsx(Input, {
				id: "signup-name",
				label: t("workshop.form.nameLabel"),
				required: true,
				value: name,
				onChange: (event) => setName(event.target.value),
				placeholder: t("workshop.form.namePlaceholder"),
				autoComplete: "name",
				autoFocus: true
			}),
			/* @__PURE__ */ jsx(Input, {
				id: "signup-email",
				label: t("workshop.form.emailLabel"),
				type: "email",
				required: true,
				value: email,
				onChange: (event) => setEmail(event.target.value),
				placeholder: t("workshop.form.emailPlaceholder"),
				autoComplete: "email"
			}),
			errorCode && /* @__PURE__ */ jsxs(Box, {
				className: "p-3 bg-red-950/40 border border-red-800/60 rounded-lg flex items-center gap-2 text-red-300 text-sm",
				role: "alert",
				children: [/* @__PURE__ */ jsx(AlertCircle, {
					className: "w-4 h-4 flex-shrink-0 text-red-500",
					"aria-hidden": "true"
				}), /* @__PURE__ */ jsx("span", { children: t(`workshop.form.errors.${errorCode}`) })]
			}),
			/* @__PURE__ */ jsx(Button, {
				type: "submit",
				variant: "primary",
				className: "w-full",
				disabled: isSubmitting,
				children: isSubmitting ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(LoaderCircle, {
					className: "w-4 h-4 animate-spin",
					"aria-hidden": "true"
				}), t("workshop.form.submitting")] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(UserPlus, {
					className: "w-4 h-4",
					"aria-hidden": "true"
				}), t("workshop.form.submit")] })
			})
		]
	});
};
//#endregion
//#region src/components/ProductCard.tsx
var itemVariants = {
	hidden: {
		opacity: 0,
		y: 20
	},
	show: {
		opacity: 1,
		y: 0,
		transition: {
			duration: .5,
			ease: "easeOut"
		}
	}
};
var statusBadgeVariants = {
	disponible: "primary",
	reservado: "neutral",
	vendido: "outline"
};
var ProductCard = ({ item, spotsCount, onRegister }) => {
	const { t, i18n } = useTranslation();
	const language = i18n.resolvedLanguage ?? i18n.language;
	const currentStatus = item.status || "disponible";
	const statusBadgeVariant = statusBadgeVariants[currentStatus];
	const [isSignupOpen, setIsSignupOpen] = useState(false);
	const isWorkshop = item.category === "talleres";
	const hasOffer = isOfferActive(item);
	const priceCents = item.priceCents ?? null;
	const finalPrice = formatPriceForLanguage(hasOffer ? getDiscountedCents(priceCents, item.discountPercent) : priceCents, item.currency, language);
	const originalPrice = formatPriceForLanguage(priceCents, item.currency, language);
	const cupo = item.cupo ?? null;
	const spotsLeft = cupo === null ? null : Math.max(cupo - (spotsCount ?? 0), 0);
	const isFull = spotsLeft === 0;
	const isFinished = currentStatus === "vendido";
	const canSignup = isWorkshop && Boolean(onRegister) && !isFull && !isFinished;
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(motion.article, {
		variants: itemVariants,
		className: `group ${theme.colors.surface}/90 rounded-lg overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-orange-950/20 transition-all duration-300 border ${item.featured ? "border-orange-500/60 ring-1 ring-orange-500/40" : theme.colors.border} hover:border-neutral-700 focus-within:ring-2 ${theme.colors.primaryFocus}`,
		children: [/* @__PURE__ */ jsxs(Box, {
			className: "relative aspect-square overflow-hidden bg-neutral-800",
			children: [
				/* @__PURE__ */ jsx("img", {
					src: item.image,
					alt: t("product.imageAlt", { title: item.title }),
					className: `w-full h-full object-cover object-center grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-in-out ${currentStatus === "vendido" ? "opacity-50" : ""}`,
					loading: "lazy"
				}),
				/* @__PURE__ */ jsx(Box, {
					className: "absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-80",
					"aria-hidden": "true"
				}),
				item.featured && /* @__PURE__ */ jsxs(Box, {
					className: "absolute top-3 left-3 bg-orange-600 text-white font-bold text-[10px] uppercase px-2 py-1 rounded shadow-md flex items-center gap-1",
					children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3 h-3" }), t("product.featured")]
				}),
				/* @__PURE__ */ jsxs(Box, {
					className: "absolute top-3 right-3 flex flex-col items-end gap-1.5",
					children: [hasOffer && /* @__PURE__ */ jsxs("span", {
						className: "bg-orange-600 text-white font-bold text-[10px] uppercase px-2 py-1 rounded shadow-md",
						children: [
							"-",
							item.discountPercent,
							"%"
						]
					}), /* @__PURE__ */ jsx("span", {
						className: "bg-neutral-950/80 backdrop-blur-sm border border-neutral-700 text-orange-400 font-bold text-xs uppercase px-2.5 py-1 rounded-sm",
						"aria-label": priceCents == null ? t("product.priceOnRequest") : hasOffer ? t("product.offerAria", {
							finalPrice,
							originalPrice,
							discount: item.discountPercent
						}) : t("product.priceAria", { price: finalPrice }),
						children: priceCents == null ? t("product.consult") : hasOffer ? /* @__PURE__ */ jsxs("span", {
							className: "inline-flex items-center gap-1.5",
							children: [/* @__PURE__ */ jsx("s", {
								className: "text-neutral-400 font-medium normal-case",
								children: originalPrice
							}), /* @__PURE__ */ jsx("span", { children: finalPrice })]
						}) : finalPrice
					})]
				})
			]
		}), /* @__PURE__ */ jsxs(Box, {
			className: "p-6 flex flex-col flex-grow",
			children: [
				/* @__PURE__ */ jsxs(Box, {
					className: "mb-2",
					children: [/* @__PURE__ */ jsxs(Box, {
						className: "flex items-center gap-2 mb-1",
						children: [/* @__PURE__ */ jsx(Badge, {
							variant: "primary",
							children: t(categoryTranslationKeys[item.category])
						}), /* @__PURE__ */ jsx(Badge, {
							variant: statusBadgeVariant,
							children: t(availabilityTranslationKeys[currentStatus])
						})]
					}), /* @__PURE__ */ jsx(Typography, {
						variant: "h4",
						className: "mt-1",
						children: item.title
					})]
				}),
				item.category === "talleres" && (item.eventDate || item.eventLocation) && /* @__PURE__ */ jsxs(Box, {
					className: "my-2 p-2.5 rounded bg-neutral-950 border border-neutral-800 space-y-1 text-xs text-neutral-300",
					children: [item.eventDate && /* @__PURE__ */ jsxs(Box, {
						className: "flex items-center gap-2 text-orange-400 font-medium capitalize",
						children: [/* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5 flex-shrink-0" }), /* @__PURE__ */ jsx("span", { children: formatWorkshopDateForLanguage(item.eventDate, language) })]
					}), item.eventLocation && /* @__PURE__ */ jsxs(Box, {
						className: "flex items-center gap-2 text-neutral-400",
						children: [/* @__PURE__ */ jsx(MapPin, { className: "w-3.5 h-3.5 flex-shrink-0" }), /* @__PURE__ */ jsx("span", { children: item.eventLocation })]
					})]
				}),
				/* @__PURE__ */ jsx(Typography, {
					variant: "body",
					className: "mb-6 flex-grow",
					children: item.description
				}),
				/* @__PURE__ */ jsxs(Box, {
					className: "flex flex-col gap-2.5 mt-auto",
					children: [
						isWorkshop && !isFinished && /* @__PURE__ */ jsxs(Box, {
							className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider",
							children: [/* @__PURE__ */ jsx(Users, {
								className: "w-3.5 h-3.5 flex-shrink-0 text-orange-400",
								"aria-hidden": "true"
							}), cupo === null ? /* @__PURE__ */ jsx("span", {
								className: "text-neutral-400",
								children: t("product.spotsOpen")
							}) : isFull ? /* @__PURE__ */ jsx("span", {
								className: "text-red-400",
								children: t("product.spotsFull")
							}) : /* @__PURE__ */ jsx("span", {
								className: "text-green-400",
								children: t("product.spotsLeft", {
									spots: spotsLeft,
									total: cupo
								})
							})]
						}),
						canSignup && /* @__PURE__ */ jsxs(Button, {
							type: "button",
							variant: "outline",
							className: "w-full",
							onClick: () => setIsSignupOpen(true),
							"aria-label": t("product.signupAria", { title: item.title }),
							children: [/* @__PURE__ */ jsx(UserPlus, {
								className: "w-4 h-4",
								"aria-hidden": "true"
							}), t("product.signup")]
						}),
						isWorkshop && isFull && !isFinished && /* @__PURE__ */ jsx(Box, {
							className: "text-center py-2.5 text-xs text-red-400 font-semibold uppercase tracking-wider bg-red-950/30 rounded border border-red-900/50",
							children: t("product.workshopFull")
						}),
						!isWorkshop && item.etsyLink && currentStatus !== "vendido" && /* @__PURE__ */ jsxs("a", {
							href: item.etsyLink,
							target: "_blank",
							rel: "noopener noreferrer",
							className: `w-full inline-flex justify-center items-center gap-2 ${theme.colors.primary} font-semibold py-3 px-4 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 text-sm`,
							"aria-label": t("product.buyEtsyAria", { title: item.title }),
							children: [/* @__PURE__ */ jsx(ShoppingBag, {
								className: "w-4 h-4",
								"aria-hidden": "true"
							}), t("product.buyEtsy")]
						}),
						!isWorkshop && item.vintedLink && currentStatus !== "vendido" && /* @__PURE__ */ jsxs("a", {
							href: item.vintedLink,
							target: "_blank",
							rel: "noopener noreferrer",
							className: `w-full inline-flex justify-center items-center gap-2 bg-transparent border border-neutral-700 hover:border-neutral-400 text-neutral-300 hover:text-white font-semibold py-3 px-4 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 ${theme.colors.primaryFocus} focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 text-sm`,
							"aria-label": t("product.viewVintedAria", { title: item.title }),
							children: [/* @__PURE__ */ jsx(Tag, {
								className: "w-4 h-4",
								"aria-hidden": "true"
							}), t("product.viewVinted")]
						}),
						currentStatus === "vendido" && /* @__PURE__ */ jsx(Box, {
							className: "text-center py-2.5 text-xs text-neutral-500 font-semibold uppercase tracking-wider bg-neutral-950 rounded border border-neutral-800",
							children: t("product.unavailable")
						})
					]
				})
			]
		})]
	}), /* @__PURE__ */ jsx(Modal, {
		isOpen: isSignupOpen,
		onClose: () => setIsSignupOpen(false),
		title: t("product.signupModalTitle"),
		children: onRegister && /* @__PURE__ */ jsx(WorkshopSignupForm, {
			workshop: item,
			onRegister,
			onClose: () => setIsSignupOpen(false)
		})
	})] });
};
//#endregion
//#region src/components/ProductCardSkeleton.tsx
var ProductCardSkeleton = () => {
	return /* @__PURE__ */ jsxs("div", {
		className: `${theme.colors.surface}/90 rounded-lg overflow-hidden border ${theme.colors.border}`,
		children: [/* @__PURE__ */ jsx(Skeleton, {
			className: "aspect-square w-full",
			rounded: "none"
		}), /* @__PURE__ */ jsxs("div", {
			className: "p-6 space-y-4",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx(Skeleton, {
						className: "h-5 w-24",
						rounded: "full"
					}), /* @__PURE__ */ jsx(Skeleton, {
						className: "h-5 w-20",
						rounded: "full"
					})]
				}),
				/* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-3/4" }),
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-full" }),
						/* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-5/6" }),
						/* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-2/3" })
					]
				}),
				/* @__PURE__ */ jsx(Skeleton, { className: "h-11 w-full" })
			]
		})]
	});
};
//#endregion
//#region src/components/GallerySection.tsx
var categories = [
	"todas",
	"ilustraciones",
	"camisetas",
	"talleres",
	"personalizados"
];
var SKELETON_ITEMS = 6;
var containerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: { staggerChildren: .1 }
	}
};
var GallerySection = ({ items, activeCategory, onSelectCategory, offersOnly = false, onToggleOffers, spotsCounts, onRegister, isLoading, error, onRetry, spotsError, onRetrySpots }) => {
	const { t } = useTranslation();
	const visibleItems = items.filter((item) => item.isVisible !== false);
	const offersCount = visibleItems.filter(isOfferActive).length;
	const categoryItems = activeCategory === "todas" ? visibleItems : visibleItems.filter((item) => item.category === activeCategory);
	const filteredItems = offersOnly ? categoryItems.filter(isOfferActive) : categoryItems;
	return /* @__PURE__ */ jsx("section", {
		id: "galeria",
		className: "py-24 bg-neutral-950 min-h-screen",
		children: /* @__PURE__ */ jsxs(Box, {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
			children: [
				/* @__PURE__ */ jsxs(Box, {
					className: "flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6",
					children: [/* @__PURE__ */ jsxs(Box, { children: [/* @__PURE__ */ jsxs(Typography, {
						variant: "h2",
						className: "mb-3",
						children: [
							t("catalog.heading"),
							" ",
							/* @__PURE__ */ jsx("span", {
								className: theme.colors.textSubtle,
								children: t("catalog.headingAccent")
							})
						]
					}), /* @__PURE__ */ jsx(Box, { className: "h-1 w-20 bg-orange-600" })] }), /* @__PURE__ */ jsxs(Box, {
						className: "flex flex-wrap gap-2",
						role: "toolbar",
						"aria-label": t("catalog.filterAria"),
						children: [categories.map((category) => {
							const isActive = activeCategory === category;
							return /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => onSelectCategory(category),
								className: `px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 ${theme.colors.primaryFocus} ${isActive ? "bg-orange-600 text-white shadow-md shadow-orange-600/30" : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800"}`,
								"aria-pressed": isActive,
								children: t(categoryTranslationKeys[category])
							}, category);
						}), onToggleOffers && /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: onToggleOffers,
							className: `inline-flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-md border transition-all focus-visible:outline-none focus-visible:ring-2 ${theme.colors.primaryFocus} ${offersOnly ? "bg-orange-600 border-orange-600 text-white shadow-md shadow-orange-600/30" : "bg-neutral-900 border-orange-600/60 text-orange-400 hover:bg-orange-600/10"}`,
							"aria-pressed": offersOnly,
							children: [
								/* @__PURE__ */ jsx(Tag, {
									className: "w-3.5 h-3.5",
									"aria-hidden": "true"
								}),
								t("catalog.offers"),
								offersCount > 0 && /* @__PURE__ */ jsx("span", {
									className: `min-w-5 rounded-full px-1.5 py-0.5 text-[10px] leading-none ${offersOnly ? "bg-neutral-950/40 text-white" : "bg-orange-600/20 text-orange-300"}`,
									children: offersCount
								})
							]
						})]
					})]
				}),
				spotsError && /* @__PURE__ */ jsxs(Box, {
					role: "alert",
					className: "mb-8 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-orange-900/60 bg-orange-950/20 p-4 text-sm text-orange-300",
					children: [/* @__PURE__ */ jsx("span", { children: spotsError }), onRetrySpots && /* @__PURE__ */ jsx(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => void onRetrySpots(),
						children: t("common.retry")
					})]
				}),
				/* @__PURE__ */ jsx(AnimatePresence, {
					mode: "wait",
					children: isLoading ? /* @__PURE__ */ jsxs(motion.div, {
						initial: { opacity: 0 },
						animate: { opacity: 1 },
						exit: { opacity: 0 },
						className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
						role: "status",
						"aria-label": t("catalog.loading"),
						children: [/* @__PURE__ */ jsx("span", {
							className: "sr-only",
							children: t("catalog.loading")
						}), Array.from({ length: SKELETON_ITEMS }, (_, index) => /* @__PURE__ */ jsx(ProductCardSkeleton, {}, index))]
					}, "loading") : error ? /* @__PURE__ */ jsx(motion.div, {
						initial: { opacity: 0 },
						animate: { opacity: 1 },
						exit: { opacity: 0 },
						children: /* @__PURE__ */ jsx(ErrorState, {
							title: t("catalog.errorTitle"),
							description: t("catalog.errorDescription"),
							onRetry,
							retryLabel: t("common.retry")
						})
					}, "error") : filteredItems.length > 0 ? /* @__PURE__ */ jsx(motion.div, {
						className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
						variants: containerVariants,
						initial: "hidden",
						animate: "show",
						children: filteredItems.map((item) => /* @__PURE__ */ jsx(ProductCard, {
							item,
							spotsCount: spotsCounts?.[item.id],
							onRegister: onRegister ? (data) => onRegister(item, data) : void 0
						}, item.id))
					}, activeCategory) : /* @__PURE__ */ jsx(motion.div, {
						initial: { opacity: 0 },
						animate: { opacity: 1 },
						exit: { opacity: 0 },
						children: /* @__PURE__ */ jsx(Box, {
							className: "text-center py-20 bg-neutral-900/50 rounded-lg border border-neutral-800",
							children: /* @__PURE__ */ jsx(Typography, {
								variant: "body",
								className: "text-lg",
								children: offersOnly ? t("catalog.emptyOffers") : t("catalog.empty")
							})
						})
					}, "empty")
				})
			]
		})
	});
};
//#endregion
//#region src/components/seo/JsonLd.tsx
var JsonLd = ({ data }) => {
	const frameworkContext = useContext(UNSAFE_FrameworkContext);
	const documentNonce = typeof document !== "undefined" ? Array.from(document.scripts).find((script) => script.nonce)?.nonce : void 0;
	const nonce = frameworkContext?.nonce ?? documentNonce;
	const content = JSON.stringify(data).replace(/</g, "\\u003c");
	return /* @__PURE__ */ jsx("script", {
		type: "application/ld+json",
		nonce,
		dangerouslySetInnerHTML: { __html: content }
	});
};
//#endregion
//#region src/hooks/useWorkshopSpots.ts
var useWorkshopSpots = () => {
	const { t } = useTranslation();
	const [counts, setCounts] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const loadSpots = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const data = await fetchRegistrationCounts();
			setCounts(data);
		} catch (err) {
			logError("useWorkshopSpots.loadSpots", err);
			setError(t("catalog.spotsError"));
		} finally {
			setIsLoading(false);
		}
	}, [t]);
	useEffect(() => {
		let isCancelled = false;
		const init = async () => {
			try {
				const data = await fetchRegistrationCounts();
				if (!isCancelled) {
					setCounts(data);
					setError(null);
				}
			} catch (err) {
				if (!isCancelled) {
					logError("useWorkshopSpots.init", err);
					setError(t("catalog.spotsError"));
				}
			} finally {
				if (!isCancelled) setIsLoading(false);
			}
		};
		init();
		return () => {
			isCancelled = true;
		};
	}, [t]);
	const register = async (productId, data, cupo) => {
		await createRegistration(productId, data, cupo);
		setCounts((prev) => ({
			...prev,
			[productId]: (prev[productId] || 0) + 1
		}));
	};
	return {
		counts,
		isLoading,
		error,
		register,
		refreshSpots: loadSpots
	};
};
//#endregion
//#region src/seo/jsonLd.ts
var absoluteUrl = (siteUrl, path) => {
	return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
};
var getSocialLinks = () => [
	"https://www.etsy.com/es/shop/Laurelenlienzo?etsrc=sdt",
	"https://www.instagram.com/laurelenlienzo?cplk=Ynl4anVvemtlNzhw",
	"https://www.tiktok.com/@laurelenlienzo?_r=1&_t=ZN-9AgTExlNL7u"
].filter((value) => Boolean(value));
var buildHomeStructuredData = (language, description, options) => {
	const { siteUrl, socialLinks = [] } = options;
	const organizationId = `${siteUrl}/#organization`;
	const websiteId = `${siteUrl}/#website`;
	return {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "Organization",
				"@id": organizationId,
				name: SITE_NAME,
				url: `${siteUrl}/`,
				logo: absoluteUrl(siteUrl, "/favicon.svg"),
				...socialLinks.length > 0 ? { sameAs: socialLinks } : {}
			},
			{
				"@type": "WebSite",
				"@id": websiteId,
				name: SITE_NAME,
				url: absoluteUrl(siteUrl, `/${language}`),
				description,
				inLanguage: language,
				publisher: { "@id": organizationId }
			},
			{
				"@type": "WebPage",
				"@id": `${absoluteUrl(siteUrl, `/${language}`)}#webpage`,
				url: absoluteUrl(siteUrl, `/${language}`),
				name: SITE_NAME,
				description,
				inLanguage: language,
				isPartOf: { "@id": websiteId },
				about: { "@id": organizationId },
				primaryImageOfPage: absoluteUrl(siteUrl, DEFAULT_OG_IMAGE_PATH)
			}
		]
	};
};
//#endregion
//#region src/pages/CatalogPage.tsx
var CatalogPage = () => {
	const { t, i18n } = useTranslation();
	const language = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language);
	const structuredData = useMemo(() => buildHomeStructuredData(language, t("meta.description"), {
		siteUrl: getSiteUrl(),
		socialLinks: getSocialLinks()
	}), [language, t]);
	const [activeCategory, setActiveCategory] = useState("todas");
	const [offersOnly, setOffersOnly] = useState(false);
	const { products, isLoading, error, refreshProducts } = useProducts();
	const { counts, register, error: spotsError, refreshSpots } = useWorkshopSpots();
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-neutral-950 min-h-screen text-neutral-50 selection:bg-orange-600 selection:text-white font-sans overflow-x-hidden",
		children: [
			/* @__PURE__ */ jsx(JsonLd, { data: structuredData }),
			/* @__PURE__ */ jsx("a", {
				href: "#main-content",
				className: "sr-only focus:not-sr-only focus:fixed focus:z-[100] focus:p-4 focus:bg-orange-600 focus:text-white focus:top-4 focus:left-4 rounded-md shadow-lg",
				children: t("a11y.skipToContent")
			}),
			/* @__PURE__ */ jsx(Navbar, {
				activeCategory,
				onSelectCategory: setActiveCategory
			}),
			/* @__PURE__ */ jsxs("main", {
				id: "main-content",
				children: [/* @__PURE__ */ jsx(HeroSection, {}), /* @__PURE__ */ jsx(GallerySection, {
					items: products,
					activeCategory,
					onSelectCategory: setActiveCategory,
					offersOnly,
					onToggleOffers: () => setOffersOnly((prev) => !prev),
					spotsCounts: counts,
					onRegister: (item, data) => register(item.id, data, item.cupo ?? null),
					isLoading,
					error,
					onRetry: refreshProducts,
					spotsError,
					onRetrySpots: refreshSpots
				})]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
};
//#endregion
//#region src/routes/catalog.tsx
var catalog_exports = /* @__PURE__ */ __exportAll({
	default: () => catalog_default,
	meta: () => meta$1
});
function meta$1({ matches }) {
	return getHomeMeta(getRootLanguage(matches));
}
var catalog_default = UNSAFE_withComponentProps(function CatalogRoute() {
	return /* @__PURE__ */ jsx(CatalogPage, {});
});
//#endregion
//#region src/routes/not-found.tsx
var not_found_exports = /* @__PURE__ */ __exportAll({
	default: () => not_found_default,
	loader: () => loader,
	meta: () => meta
});
function loader() {
	return data(null, { status: 404 });
}
function meta({ matches }) {
	return getNotFoundMeta(getRootLanguage(matches));
}
var not_found_default = UNSAFE_withComponentProps(function NotFoundRoute() {
	return /* @__PURE__ */ jsx(NotFoundPage, {});
});
//#endregion
//#region \0virtual:react-router/server-manifest
var server_manifest_default = {
	"entry": {
		"module": "/assets/entry.client-fe5BN2a1.js",
		"imports": ["/assets/jsx-runtime-yfTzyxww.js"],
		"css": []
	},
	"routes": {
		"root": {
			"id": "root",
			"parentId": void 0,
			"path": "",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/root-zByw_EUN.js",
			"imports": [
				"/assets/jsx-runtime-yfTzyxww.js",
				"/assets/meta-C_74IwXA.js",
				"/assets/logger-gpPTUsCN.js",
				"/assets/NotFoundPage-CyKVA-pL.js",
				"/assets/useDocumentTitle-D8lZ4Lhy.js"
			],
			"css": ["/assets/root-Dnl5RjrS.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/language-redirect": {
			"id": "routes/language-redirect",
			"parentId": "root",
			"path": void 0,
			"index": true,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": false,
			"hasErrorBoundary": false,
			"module": "/assets/language-redirect-BvRk9kiK.js",
			"imports": [],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/admin": {
			"id": "routes/admin",
			"parentId": "root",
			"path": "admin",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/admin-DuiX96pV.js",
			"imports": [
				"/assets/jsx-runtime-yfTzyxww.js",
				"/assets/meta-C_74IwXA.js",
				"/assets/logger-gpPTUsCN.js",
				"/assets/registrationService-DM0F47Ur.js",
				"/assets/useDocumentTitle-D8lZ4Lhy.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/sitemap": {
			"id": "routes/sitemap",
			"parentId": "root",
			"path": "sitemap.xml",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": false,
			"hasErrorBoundary": false,
			"module": "/assets/sitemap-BvRk9kiK.js",
			"imports": [],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/es": {
			"id": "routes/es",
			"parentId": "root",
			"path": "es",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/language-layout-DUiik81j.js",
			"imports": ["/assets/jsx-runtime-yfTzyxww.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/es/catalog": {
			"id": "routes/es/catalog",
			"parentId": "routes/es",
			"path": void 0,
			"index": true,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/catalog-IvTGZsrL.js",
			"imports": [
				"/assets/jsx-runtime-yfTzyxww.js",
				"/assets/meta-C_74IwXA.js",
				"/assets/logger-gpPTUsCN.js",
				"/assets/registrationService-DM0F47Ur.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/es/not-found": {
			"id": "routes/es/not-found",
			"parentId": "routes/es",
			"path": "*",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/not-found-CjpdWdpJ.js",
			"imports": [
				"/assets/jsx-runtime-yfTzyxww.js",
				"/assets/meta-C_74IwXA.js",
				"/assets/NotFoundPage-CyKVA-pL.js",
				"/assets/useDocumentTitle-D8lZ4Lhy.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/en": {
			"id": "routes/en",
			"parentId": "root",
			"path": "en",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/language-layout-DUiik81j.js",
			"imports": ["/assets/jsx-runtime-yfTzyxww.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/en/catalog": {
			"id": "routes/en/catalog",
			"parentId": "routes/en",
			"path": void 0,
			"index": true,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/catalog-IvTGZsrL.js",
			"imports": [
				"/assets/jsx-runtime-yfTzyxww.js",
				"/assets/meta-C_74IwXA.js",
				"/assets/logger-gpPTUsCN.js",
				"/assets/registrationService-DM0F47Ur.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/en/not-found": {
			"id": "routes/en/not-found",
			"parentId": "routes/en",
			"path": "*",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/not-found-CjpdWdpJ.js",
			"imports": [
				"/assets/jsx-runtime-yfTzyxww.js",
				"/assets/meta-C_74IwXA.js",
				"/assets/NotFoundPage-CyKVA-pL.js",
				"/assets/useDocumentTitle-D8lZ4Lhy.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/not-found": {
			"id": "routes/not-found",
			"parentId": "root",
			"path": "*",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/not-found-CjpdWdpJ.js",
			"imports": [
				"/assets/jsx-runtime-yfTzyxww.js",
				"/assets/meta-C_74IwXA.js",
				"/assets/NotFoundPage-CyKVA-pL.js",
				"/assets/useDocumentTitle-D8lZ4Lhy.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		}
	},
	"url": "/assets/manifest-81dc849b.js",
	"version": "81dc849b",
	"sri": void 0
};
//#endregion
//#region \0virtual:react-router/server-build
var assetsBuildDirectory = "build/client";
var basename = "/";
var future = {
	"unstable_optimizeDeps": false,
	"v8_passThroughRequests": false,
	"v8_trailingSlashAwareDataRequests": false,
	"unstable_previewServerPrerendering": false,
	"v8_middleware": false,
	"v8_splitRouteModules": false,
	"v8_viteEnvironmentApi": false
};
var ssr = true;
var isSpaMode = false;
var prerender = [];
var routeDiscovery = {
	"mode": "lazy",
	"manifestPath": "/__manifest"
};
var publicPath = "/";
var entry = { module: entry_server_exports };
var routes = {
	"root": {
		id: "root",
		parentId: void 0,
		path: "",
		index: void 0,
		caseSensitive: void 0,
		module: root_exports
	},
	"routes/language-redirect": {
		id: "routes/language-redirect",
		parentId: "root",
		path: void 0,
		index: true,
		caseSensitive: void 0,
		module: language_redirect_exports
	},
	"routes/admin": {
		id: "routes/admin",
		parentId: "root",
		path: "admin",
		index: void 0,
		caseSensitive: void 0,
		module: admin_exports
	},
	"routes/sitemap": {
		id: "routes/sitemap",
		parentId: "root",
		path: "sitemap.xml",
		index: void 0,
		caseSensitive: void 0,
		module: sitemap_exports
	},
	"routes/es": {
		id: "routes/es",
		parentId: "root",
		path: "es",
		index: void 0,
		caseSensitive: void 0,
		module: language_layout_exports
	},
	"routes/es/catalog": {
		id: "routes/es/catalog",
		parentId: "routes/es",
		path: void 0,
		index: true,
		caseSensitive: void 0,
		module: catalog_exports
	},
	"routes/es/not-found": {
		id: "routes/es/not-found",
		parentId: "routes/es",
		path: "*",
		index: void 0,
		caseSensitive: void 0,
		module: not_found_exports
	},
	"routes/en": {
		id: "routes/en",
		parentId: "root",
		path: "en",
		index: void 0,
		caseSensitive: void 0,
		module: language_layout_exports
	},
	"routes/en/catalog": {
		id: "routes/en/catalog",
		parentId: "routes/en",
		path: void 0,
		index: true,
		caseSensitive: void 0,
		module: catalog_exports
	},
	"routes/en/not-found": {
		id: "routes/en/not-found",
		parentId: "routes/en",
		path: "*",
		index: void 0,
		caseSensitive: void 0,
		module: not_found_exports
	},
	"routes/not-found": {
		id: "routes/not-found",
		parentId: "root",
		path: "*",
		index: void 0,
		caseSensitive: void 0,
		module: not_found_exports
	}
};
var allowedActionOrigins = false;
//#endregion
export { allowedActionOrigins, server_manifest_default as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, prerender, publicPath, routeDiscovery, routes, ssr };
