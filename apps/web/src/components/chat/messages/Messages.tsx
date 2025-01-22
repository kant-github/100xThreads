import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { LinkPreviewType, PreviewProps, MessageContentProps, MessagesProps } from '@/types';

const extractUrls = (text: string): string[] => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
};

const LinkPreview: React.FC<PreviewProps> = ({ url }) => {
    const [preview, setPreview] = useState<LinkPreviewType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [imageError, setImageError] = useState<boolean>(false);

    useEffect(() => {
        const fetchPreview = async () => {
            try {
                const response = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`);
                if (!response.ok) throw new Error('Failed to fetch preview');
                const data: LinkPreviewType = await response.json();
                console.log("metadata feched finally is : ", data);
                setPreview(data);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Unknown error'));
            } finally {
                setLoading(false);
            }
        };
        console.log("hi");
        fetchPreview();
    }, [url]);

    if (loading) {
        return (
            <div className="animate-pulse h-24 bg-gray-100 rounded-md w-full" />
        );
    }

    if (error || !preview) return null;

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block max-w-full mt-2 border rounded-md overflow-hidden hover:bg-gray-50 transition"
        >
            <div className="flex p-3 gap-3">
                {preview.image && !imageError && (
                    <div className="relative flex-shrink-0 w-16 h-16">
                        <Image
                            src={preview.image}
                            alt={preview.title || 'Link preview'}
                            fill
                            className="object-cover rounded"
                            onError={() => setImageError(true)}
                            sizes="(max-width: 64px) 100vw, 64px"
                            priority={false}
                        />
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                        {preview.title}
                    </h4>
                    <p className="text-sm text-gray-500 line-clamp-2">
                        {preview.description}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-1">
                        {new URL(url).hostname}
                    </p>
                </div>
            </div>
        </a>
    );
};

const MessageContent: React.FC<MessageContentProps> = ({ message }) => {
    const urls = extractUrls(message.message);
    const messageText = message.message;

    return (
        <div className="flex-shrink-0 space-y-2">
            <p className="text-[13px] whitespace-pre-wrap break-words">
                {messageText}
            </p>
            {urls.map((url, index) => (
                <LinkPreview key={`${url}-${index}`} url={url} />
            ))}
        </div>
    );
};

const Messages: React.FC<MessagesProps> = ({ message, chatUser }) => {
    return (
        <div key={message.id} className="flex gap-x-2">
            <div className="flex-shrink-0 gap-x-1">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                    {message.name[0]}
                </div>
            </div>
            <div className="flex flex-col max-w-[70%]">
                <span className="text-sm font-semibold">{message.name}</span>
                <MessageContent message={message} />
            </div>
        </div>
    );
};

export default Messages;