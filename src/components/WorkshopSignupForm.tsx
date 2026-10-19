import React, { useState, type FormEvent } from 'react';
import { CheckCircle, AlertCircle, UserPlus, LoaderCircle, Bell } from 'lucide-react';
import { Button, Input, Box, CalendarEventActions } from './ui';
import { theme } from '../theme';
import type { CatalogItem } from '../types/catalog';
import type { RegistrationFormData } from '../types/registrations';

interface WorkshopSignupFormProps {
  workshop: CatalogItem;
  onRegister: (data: RegistrationFormData) => Promise<void>;
  onClose: () => void;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const WorkshopSignupForm: React.FC<WorkshopSignupFormProps> = ({
  workshop,
  onRegister,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL;
  const tiktokUrl = import.meta.env.VITE_TIKTOK_URL;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail) {
      setErrorMessage('Por favor indica tu nombre y tu email.');
      return;
    }

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setErrorMessage('Introduce un email válido.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onRegister({ name: trimmedName, email: trimmedEmail });
      setIsSuccess(true);
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'No se pudo completar la inscripción. Inténtalo de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-4">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-green-950/60 border border-green-800/60 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" aria-hidden="true" />
            </div>
          </div>
          <div>
            <p className="text-white font-semibold">¡Inscripción completada!</p>
            <p className={`${theme.colors.textMuted} text-sm mt-1`}>
              Te has apuntado al taller «{workshop.title}».
            </p>
          </div>
        </div>

        <CalendarEventActions workshop={workshop} attendee={{ name, email }} />

        <Box className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg flex items-start gap-2 text-sm text-neutral-300">
          <Bell className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-400" aria-hidden="true" />
          <span>
            Estate atento a nuestras redes sociales: publicaremos novedades y
            actualizaciones sobre el taller
            {instagramUrl || tiktokUrl ? ' en ' : '.'}
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-orange-300 underline underline-offset-2 font-medium"
                aria-label="Ver novedades del taller en Instagram"
              >
                Instagram
              </a>
            )}
            {instagramUrl && tiktokUrl && ' y '}
            {tiktokUrl && (
              <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-orange-300 underline underline-offset-2 font-medium"
                aria-label="Ver novedades del taller en TikTok"
              >
                TikTok
              </a>
            )}
            {(instagramUrl || tiktokUrl) && '.'}
          </span>
        </Box>

        <Button type="button" variant="primary" className="w-full" onClick={onClose}>
          Cerrar
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <p className={`${theme.colors.textMuted} text-sm`}>
        Deja tus datos para reservar tu plaza en «{workshop.title}».
      </p>

      <Input
        id="signup-name"
        label="Tu nombre *"
        required
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Nombre y apellidos"
        autoComplete="name"
        autoFocus
      />

      <Input
        id="signup-email"
        label="Tu email *"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="tu@email.com"
        autoComplete="email"
      />

      {errorMessage && (
        <Box
          className="p-3 bg-red-950/40 border border-red-800/60 rounded-lg flex items-center gap-2 text-red-300 text-sm"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" aria-hidden="true" />
          <span>{errorMessage}</span>
        </Box>
      )}

      <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <LoaderCircle className="w-4 h-4 animate-spin" aria-hidden="true" />
            Inscribiendo...
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4" aria-hidden="true" />
            Apuntarme al taller
          </>
        )}
      </Button>
    </form>
  );
};

export default WorkshopSignupForm;
