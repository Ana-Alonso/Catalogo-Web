import { redirect, type LoaderFunctionArgs } from 'react-router';
import { resolvePreferredLanguage } from '../i18n/server';

export function loader({ request }: LoaderFunctionArgs) {
  return redirect(`/${resolvePreferredLanguage(request)}`);
}
