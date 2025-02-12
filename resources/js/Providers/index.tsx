import { ReactNode } from "react";
import { LaravelReactI18nProvider } from 'laravel-react-i18n';
import ReactIntlProvider from "./ReactIntlProvider"
import ReportActionProvider from "./ReportActionProvider";

export default function Providers({ children }: { children: ReactNode }) {

    return <LaravelReactI18nProvider files={import.meta.glob('/lang/*.json')}>
        <ReactIntlProvider>
            <ReportActionProvider>
                {children}
            </ReportActionProvider>
        </ReactIntlProvider>
    </LaravelReactI18nProvider>
}
