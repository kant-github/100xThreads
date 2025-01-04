interface ErrorMessageProps {
    error?: string | undefined;
}

export default function ({ error }: ErrorMessageProps) {
    return (
        <div className="absolute -top-2 right-0 mr-1">{
            error && <span className="text-red-500 text-[10px]">{error}</span>
        }</div>
    )
}