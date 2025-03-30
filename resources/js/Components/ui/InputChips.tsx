import { useState } from "react";
import Input from "@/Components/ui/Input"
import { useCallback } from "react"
import { debounce } from "lodash"
import { Tag as TagType } from "@/types/tag"
import Tag from "@/Components/ui/Tag"
import { router, usePage } from '@inertiajs/react'
import { uniq } from "lodash";

interface InputChipsProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    onChange: (chips: string[]) => any
    value: string[],
    className?: string
}

export default function InputChips({ onChange, value, className, maxLength, ...props }: InputChipsProps) {
    const [inputValue, setInputValue] = useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!["Space", " ", ",", ";", "Enter"].includes(e.key)) return;
        e.preventDefault();
        if (inputValue.trim() && !value.includes(inputValue.trim()) && (!maxLength || maxLength > value.length)) {
            onChange(uniq([...value, inputValue.trim()]))
        }
        setInputValue("");
    }

    const { tags_completions } = usePage().props

    const x = useCallback(
        debounce((querySearchValue: string) => {
            router.visit(
                route(
                    route().current() as string,
                    { ...route().params, _query: { ...route().queryParams, tags_completions_query: querySearchValue } }
                ), {
                only: ["tags_completions"],
                preserveScroll: true,
                preserveState: true,
                replace: true,
            })
        }, 500), [])


    return <div>
        <Input
            type="text"
            value={inputValue}
            onChange={
                (e) => {
                    setInputValue(e.target.value)
                    x(e.target.value)
                }
            }
            onKeyDown={handleKeyDown}
            className={className}
            {...props}
        />
        <div className="flex flex-col relative">
            {
                !!tags_completions?.length && inputValue &&
                <ul className="absolute max-h-64 z-10 w-full overflow-y-auto bg-surface-light dark:bg-surface-dark text-onSurface-dark dark:text-onSurface-light top-1 rounded py-1 px-2 flex flex-col gap-1 shadow-lg">
                    {
                        tags_completions.map(t => <li>
                            <CompletionItem
                                {...t}
                                onSelect={(t) => {
                                    onChange(uniq([...value, t]))
                                    setInputValue("")
                                }}
                            />
                        </li>)
                    }
                </ul>
            }
        </div>
    </div>
}

function CompletionItem({ name, description, onSelect }: (TagType & { onSelect: (t: string) => any })) {
    const { tags_completions_query } = route().queryParams
    const handleSelect = () => {
        onSelect(name)
    }

    return <button onClick={handleSelect} className="flex flex-col gap-1 text-start hover:bg-background-light dark:hover:bg-background-dark py-1 px-2 rounded">
        <div>
            <Tag className="px-1">
                <span
                    dangerouslySetInnerHTML={{
                        __html:
                            name
                                .replace(
                                    new RegExp(tags_completions_query, "gi"),
                                    `<span class="font-bold text-primary">${tags_completions_query}</span>`
                                )
                    }}
                />
            </Tag>
        </div>
        <p className="text-secondary text-xs break-all"
            dangerouslySetInnerHTML={{
                __html:
                    description.replace(
                        new RegExp(tags_completions_query, "gi"),
                        `<span class="font-bold">${tags_completions_query}</span>`
                    )
            }}
        />
    </button >
}
