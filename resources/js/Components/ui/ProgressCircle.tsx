interface ProgressCircleProps {
    value: number; // 0-100
    size?: number;
    strokeWidth?: number;
    children?: React.ReactNode; // Custom content inside the circle
}

export function ProgressCircle({ value, size = 24, strokeWidth = 4, children }: ProgressCircleProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference + value * circumference;

    return (
        <div className="relative flex items-center justify-center stroke-green" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    fill="none"
                    opacity={0.25}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
            </svg>
            <div className="absolute p-1">{children}</div>
        </div>
    );
}
