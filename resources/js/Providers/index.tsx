import { ReactNode } from "react";
import { LaravelReactI18nProvider } from 'laravel-react-i18n';

export default function Providers({ children }: { children: ReactNode }) {

    return <LaravelReactI18nProvider files={import.meta.glob('/lang/*.json')}>
            {children}
    </LaravelReactI18nProvider>
}
