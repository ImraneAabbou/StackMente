import { ReactNode } from "react";
import { LaravelReactI18nProvider } from 'laravel-react-i18n';
import ReactIntlProvider from "./ReactIntlProvider"
import ReportActionProvider from "./ReportActionProvider";
import ProfileDeleteProvider from "./ProfileDeleteProvider";
import ThemeProvider from "./ThemeProvider"

export default function Providers({ children }: { children: ReactNode }) {

    return <ThemeProvider>
        <LaravelReactI18nProvider files={import.meta.glob('/lang/*.json')}>
            <ReactIntlProvider>
                <ReportActionProvider>
                    <ProfileDeleteProvider>
                        {children}
                    </ProfileDeleteProvider>
                </ReportActionProvider>
            </ReactIntlProvider>
        </LaravelReactI18nProvider>
    </ThemeProvider>
}
