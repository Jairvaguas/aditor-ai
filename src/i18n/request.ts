import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
    // Leemos la cookie para el idioma. Por defecto, español.
    const cookieStore = await cookies();
    const locale = cookieStore.get('NEXT_LOCALE')?.value || 'es';

    return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default
    };
});
