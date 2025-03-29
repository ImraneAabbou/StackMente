import { useState } from "react";
import Input from "@/Components/ui/Input"

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
            onChange([...value, inputValue.trim()])
        }
        setInputValue("");
    }

    return <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className={className}
        {...props}
    />
}
