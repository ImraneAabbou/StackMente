import { ReactNode } from "react";
import { LaravelReactI18nProvider } from 'laravel-react-i18n';
import ReactIntlProvider from "./ReactIntlProvider"

export default function Providers({ children }: { children: ReactNode }) {

    return <LaravelReactI18nProvider files={import.meta.glob('/lang/*.json')}>
        <ReactIntlProvider>
            {children}
        </ReactIntlProvider>
    </LaravelReactI18nProvider>
}
