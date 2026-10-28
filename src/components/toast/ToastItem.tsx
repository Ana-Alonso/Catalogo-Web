import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useReducedMotion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import {
  Animated,
  Icon,
  IconButton,
  Typography,
  type BoxProps,
  type IconGlyphProps,
} from '../ui';
import type { ToastKind, ToastRecord } from '../../types/toast';

type BackgroundToken = NonNullable<BoxProps['background']>;
type BorderToneToken = NonNullable<BoxProps['borderTone']>;
type ToneToken = NonNullable<BoxProps['tone']>;

interface ToastStyle {
  background: BackgroundToken;
  borderTone: BorderToneToken;
  glyph: React.ComponentType<IconGlyphProps>;
  iconTone: ToneToken;
  textTone: ToneToken;
  isAssertive: boolean;
}

const TOAST_STYLE: Record<ToastKind, ToastStyle> = {
  success: {
    background: 'successSoft',
    borderTone: 'success',
    glyph: CheckCircle,
    iconTone: 'success',
    textTone: 'successSoft',
    isAssertive: false,
  },
  error: {
    background: 'dangerSoft',
    borderTone: 'danger',
    glyph: AlertCircle,
    iconTone: 'danger',
    textTone: 'dangerSoft',
    isAssertive: true,
  },
  info: {
    background: 'card',
    borderTone: 'strong',
    glyph: Info,
    iconTone: 'soft',
    textTone: 'soft',
    isAssertive: false,
  },
};

interface ToastItemProps {
  toast: ToastRecord;
  onDismiss: (id: string) => void;
}

export const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const { t } = useTranslation();
  const isReducedMotion = useReducedMotion();
  const style = TOAST_STYLE[toast.kind];

  useEffect(() => {
    if (toast.durationMs <= 0) {
      return;
    }

    const timer = window.setTimeout(() => onDismiss(toast.id), toast.durationMs);

    return () => window.clearTimeout(timer);
  }, [toast.id, toast.durationMs, toast.createdAt, onDismiss]);

  return (
    <Animated
      role={style.isAssertive ? 'alert' : 'status'}
      aria-atomic="true"
      initial={{ opacity: 0, y: isReducedMotion ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: isReducedMotion ? 0 : 8 }}
      display="flex"
      align="center"
      gap="sm"
      width="full"
      padding="tight"
      rounded="lg"
      shadow="elevated"
      border
      borderTone={style.borderTone}
      background={style.background}
    >
      <Icon as={style.glyph} size="lg" tone={style.iconTone} shrink={false} />
      <Typography as="span" variant="plain" size="sm" tone={style.textTone} grow>
        {toast.message}
      </Typography>
      <IconButton
        variant="ghost"
        size="sm"
        className="min-h-11 min-w-11 shrink-0"
        onClick={() => onDismiss(toast.id)}
        aria-label={t('common.close')}
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </IconButton>
    </Animated>
  );
};

export default ToastItem;
