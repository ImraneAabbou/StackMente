import { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import Quill from "quill";
import { ToolbarConfig } from "quill/modules/toolbar";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import ImageResize from "quill-resize-image";
import clsx from "clsx";


interface EditorProps {
    readOnly?: boolean;
    defaultValue?: string;
    onClick?: () => any;
    onChange?: (...args: any[]) => void;
    onSelect?: (...args: any[]) => void;
    placeholder?: string;
    toolbar?: ToolbarConfig;
    theme?: string;
    className?: string
}

const DEFAULT_TOOLBAR: ToolbarConfig = [
    [{ header: 1 }, { header: 2 }],

    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['blockquote', 'code-block'],

    [{ 'align': [] }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],


    ['link', 'image', 'video', 'formula'],

    [{ 'script': 'sub' }, { 'script': 'super' }],

    ['clean']
]

const DEFAULT_THEME = "bubble"

Quill.register("modules/imageResize", ImageResize);

const Editor = forwardRef<Quill | null, EditorProps>(
    ({
        readOnly = false,
        defaultValue,
        onChange,
        onClick,
        onSelect,
        placeholder = "",
        theme = DEFAULT_THEME,
        toolbar = DEFAULT_TOOLBAR,
        className
    }, ref) => {
        const containerRef = useRef<HTMLDivElement | null>(null);
        const onChangeRef = useRef(onChange);
        const onSelectRef = useRef(onSelect);

        useLayoutEffect(() => {
            onChangeRef.current = onChange;
            onSelectRef.current = onSelect;
        });

        useEffect(() => {
            if (typeof ref === "object" && ref !== null) {
                ref.current?.enable(!readOnly);
            }
        }, [ref, readOnly]);

        useEffect(() => {
            if (!containerRef.current) return;

            const container = containerRef.current;
            const editorContainer = container.appendChild(
                document.createElement("div")
            );

            const quill = new Quill(editorContainer, {
                modules: {
                    toolbar: readOnly ? false : toolbar,
                    imageResize: readOnly ? undefined : {
                        displaySize: true,
                    },
                },
                placeholder,
                theme,
                readOnly
            });

            if (typeof ref === "object" && ref !== null) {
                ref.current = quill;
            }

            if (defaultValue) quill.clipboard.dangerouslyPasteHTML(defaultValue);

            quill.on(Quill.events.TEXT_CHANGE, (...args) => {
                onChangeRef.current?.(...args);
            });

            quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
                onSelectRef.current?.(...args);
            });

            return () => {
                if (typeof ref === "object" && ref !== null) {
                    ref.current = null;
                }
                container.innerHTML = "";
            };
        }, [ref]);

        return <div onClick={onClick} className={clsx(`max-w-none`, className)} ref={containerRef}></div>;
    }
);

Editor.displayName = "Editor";

export default Editor;
