import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export interface LinkPreviewType {
    title: string;
    description: string;
    image: string;
    url: string;
}

const extractUrls = (text: string): string[] => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
};

export default function ({ url }: { url: string }) {
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
                setPreview(data);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Unknown error'));
            } finally {
                setLoading(false);
            }
        };

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