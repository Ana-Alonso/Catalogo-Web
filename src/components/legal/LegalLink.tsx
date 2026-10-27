import React, { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { cn } from '../../design-system/utils/cn';
import { normalizeLanguage } from '../../i18n/languages';
import { getPathLanguage } from '../../i18n/paths';
import { buildLegalPath, type LegalDocumentKind } from '../../data/legal/paths';
import { NavLink } from '../ui';

const LEGAL_LINK_CLASSES =
  'px-0 py-0 text-xs font-normal normal-case tracking-normal text-orange-500 underline underline-offset-2 hover:text-orange-400';

export interface LegalLinkProps {
  kind: LegalDocumentKind;
  className?: string;
  children?: ReactNode;
}

export const LegalLink: React.FC<LegalLinkProps> = ({ kind, className, children }) => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const language = getPathLanguage(location.pathname) ?? normalizeLanguage(i18n.language);

  return (
    <NavLink to={buildLegalPath(language, kind)} className={cn(LEGAL_LINK_CLASSES, className)}>
      {children}
    </NavLink>
  );
};

export default LegalLink;
