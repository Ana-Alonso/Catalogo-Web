import { useEffect } from 'react';

const NOINDEX_CONTENT = 'noindex, nofollow';

export const useNoindex = (): void => {
  useEffect(() => {
    const existing = document.head.querySelector<HTMLMetaElement>(
      'meta[name="robots"]'
    );
    const previousContent = existing?.content ?? null;
    const meta = existing ?? document.createElement('meta');

    if (!existing) {
      meta.name = 'robots';
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

export default useNoindex;
