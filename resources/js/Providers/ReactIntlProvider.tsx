import { useLaravelReactI18n } from "laravel-react-i18n";
import { ReactNode } from "react";
import { IntlProvider } from "react-intl";

export default function ReactIntlProvider({ children }: { children: ReactNode }) {
    const { currentLocale } = useLaravelReactI18n()

    return <IntlProvider locale={currentLocale()}>
        {children}
    </IntlProvider>
}
