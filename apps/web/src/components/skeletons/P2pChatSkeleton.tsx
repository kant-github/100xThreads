'use client';

import React from 'react';

export default function P2pChatSkeleton() {
    const chatBubbles = [
        { align: 'left', nameWidth: 100, contentWidth: '80%', contentHeight: 50 },
        { align: 'right', nameWidth: 150, contentWidth: '60%', contentHeight: 50 },
        { align: 'left', nameWidth: 120, contentWidth: '75%', contentHeight: 80 },
        { align: 'right', nameWidth: 140, contentWidth: '65%', contentHeight: 60 },
        { align: 'left', nameWidth: 130, contentWidth: '70%', contentHeight: 70 },
    ];

    return (
        <div className="flex flex-col gap-6 px-4 pt-8 h-full w-full relative bg-neutral-800 dark:bg-neutral-800 rounded-lg overflow-y-auto">
            {/* Header skeleton */}
            <div className="sticky top-0 flex items-center justify-between w-full pb-4 border-b border-neutral-700">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-700 animate-pulse"></div>
                    <div className="h-6 w-32 bg-neutral-700 rounded animate-pulse"></div>
                </div>
                <div className="h-8 w-24 bg-neutral-700 rounded animate-pulse"></div>
            </div>
            
            {/* Chat bubbles */}
            {chatBubbles.map((bubble, index) => (
                <div key={index} className={`flex items-start gap-3 ${bubble.align === 'right' ? 'flex-row-reverse' : 'flex-row'} ${index === 0 ? 'mt-6' : ''}`}>
                    <div className="w-10 h-10 rounded-full bg-neutral-700 animate-pulse"></div>
                    <div className={`flex flex-col gap-1 min-w-[70%] max-w-[70%] ${bubble.align === 'right' ? 'items-end' : 'items-start'}`}>
                        <div className="h-5 bg-neutral-700 rounded animate-pulse" style={{ width: `${bubble.nameWidth}px` }}></div>
                        <div 
                            className="bg-neutral-700 rounded-lg animate-pulse" 
                            style={{ 
                                width: bubble.contentWidth, 
                                height: `${bubble.contentHeight}px`,
                                borderRadius: '12px',
                                borderTopLeftRadius: bubble.align === 'left' ? '4px' : '12px',
                                borderTopRightRadius: bubble.align === 'right' ? '4px' : '12px',
                            }}
                        ></div>
                    </div>
                </div>
            ))}

            {/* Input area skeleton */}
            <div className="sticky bottom-0 mt-auto pb-4 pt-2 bg-neutral-800 dark:bg-neutral-900">
                <div className="flex items-center gap-2 p-2 border border-neutral-700 rounded-full bg-neutral-800 dark:bg-neutral-900">
                    <div className="w-8 h-8 rounded-full bg-neutral-700 animate-pulse ml-2"></div>
                    <div className="h-8 flex-1 bg-neutral-700 rounded-full animate-pulse"></div>
                    <div className="w-8 h-8 rounded-full bg-neutral-700 animate-pulse mr-2"></div>
                </div>
            </div>
        </div>
    );
}