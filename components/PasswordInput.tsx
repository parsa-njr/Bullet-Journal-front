"use client";

import { useState } from "react";

interface PasswordInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    minLength?: number;
    autoComplete?: string;
}

function EyeIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
            <path
                d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
        </svg>
    );
}

function EyeOffIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
            <path
                d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.24 4.24M9.9 4.24A11 11 0 0 1 12 4c7 0 11 7 11 7a13.4 13.4 0 0 1-3.15 3.85M6.2 6.2A13.4 13.4 0 0 0 1 11s4 7 11 7a10.9 10.9 0 0 0 3.9-.72"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default function PasswordInput({
    value,
    onChange,
    placeholder = "رمز عبور",
    required,
    minLength,
    autoComplete = "new-password",
}: PasswordInputProps) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="relative">
            <input
                type={visible ? "text" : "password"}
                required={required}
                minLength={minLength}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                dir="rtl"
                autoComplete={autoComplete}
                className="w-full rounded-lg border border-line bg-paper px-3 py-2 pl-10 text-sm text-ink focus:border-ink-light focus:outline-none"
            />
            <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                tabIndex={-1}
                aria-label={visible ? "مخفی کردن رمز" : "نمایش رمز"}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-ink-light hover:text-ink"
            >
                {visible ? <EyeOffIcon /> : <EyeIcon />}
            </button>
        </div>
    );
}