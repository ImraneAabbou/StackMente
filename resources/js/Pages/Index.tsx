import { useLaravelReactI18n } from "laravel-react-i18n";

export default function Index() {
    const { t: lang, tChoice } = useLaravelReactI18n()

    const message = ':name It has survived not only :count centuries, but also the leap into :epochType typesetting, remaining :remaining unchanged.';

    const replacements = { count: 'five', epochType: 'electronic', remaining: 'essentially', name: "Ranny" };

    return <div>
        <h1>Hi there !</h1>
        <div>{lang("Welcome, :name!", { name: <span className="bold" key={1}>Ranny</span> })}</div>
        <div>{lang(message, replacements)}</div>
        <div>
            {tChoice('{0} There are none|[1,19] There are some :count|[20,*] There are many', 18, {count: <b>5</b>})}
        </div>
    </div>
}
