interface ErrorMessageProps {
    error?: string;
}

export default function ({ error }: ErrorMessageProps) {
    console.log("error is : ", error);
    return (
        <div className="absolute -top-2 right-0">{
            error && <span className="text-red-500 text-xs">{error}</span>
        }</div>
    )
}