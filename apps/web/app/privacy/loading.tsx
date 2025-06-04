import React from 'react';
import { Box } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

// Mock DashNav skeleton
const DashNavSkeleton = () => (
    <div className="flex flex-row justify-between items-center w-full h-full px-8 border-b border-neutral-300 dark:border-zinc-700">
        <div className="flex items-center gap-x-2">
            <Skeleton animation="wave" variant="circular" width={40} height={40} sx={{ bgcolor: '#3a3a3a' }} />
            <Skeleton animation="wave" variant="text" width={80} height={30} sx={{ bgcolor: '#3a3a3a' }} />
        </div>
        <div className="flex flex-row justify-center items-center gap-x-6">
            <Skeleton animation="wave" variant="text" width={120} height={30} sx={{ bgcolor: '#3a3a3a' }} />
            <Skeleton animation="wave" variant="rounded" width={100} height={35} sx={{ bgcolor: '#3a3a3a' }} />
            <Skeleton animation="wave" variant="rounded" width={340} height={40} sx={{ bgcolor: '#3a3a3a' }} />
            <Skeleton animation="wave" variant="circular" width={40} height={40} sx={{ bgcolor: '#3a3a3a' }} />
        </div>
    </div>
);

export default function PrivacyPageSkeleton() {
    const sectionSkeletons = Array(6).fill(null);

    return (
        <div className="min-h-screen w-full flex flex-col" style={{ backgroundColor: '#1a1a1a' }}>
            {/* Navigation Skeleton */}
            <div className="min-h-[60px] sm:min-h-[70px] h-20">
                <DashNavSkeleton />
            </div>
            
            <div className="w-[60rem] mx-auto pt-8 px-4">
                {/* Header Skeleton */}
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-x-4 mb-8">
                        <Skeleton animation="wave" variant="circular" width={50} height={50} sx={{ bgcolor: '#3a3a3a' }} />
                        <Skeleton animation="wave" variant="text" width={200} height={60} sx={{ bgcolor: '#3a3a3a' }} />
                    </div>
                    <Skeleton animation="wave" variant="text" width={300} height={50} sx={{ bgcolor: '#3a3a3a', margin: '0 auto 16px' }} />
                    <Skeleton animation="wave" variant="text" width={500} height={20} sx={{ bgcolor: '#3a3a3a', margin: '0 auto 8px' }} />
                    <Skeleton animation="wave" variant="text" width={400} height={20} sx={{ bgcolor: '#3a3a3a', margin: '0 auto 16px' }} />
                    <Skeleton animation="wave" variant="text" width={150} height={15} sx={{ bgcolor: '#3a3a3a', margin: '0 auto' }} />
                </div>

                {/* Quick Summary Skeleton */}
                <Box className="p-6 mb-12 rounded-[6px]" sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
                    <Skeleton animation="wave" variant="text" width={180} height={30} sx={{ bgcolor: '#3a3a3a', mb: 2 }} />
                    <div className="grid md:grid-cols-2 gap-4">
                        {Array(4).fill(null).map((_, index) => (
                            <div key={index} className="flex items-center">
                                <Skeleton animation="wave" variant="circular" width={16} height={16} sx={{ bgcolor: '#3a3a3a', mr: 1 }} />
                                <Skeleton animation="wave" variant="text" width={200} height={20} sx={{ bgcolor: '#3a3a3a' }} />
                            </div>
                        ))}
                    </div>
                </Box>

                {/* Main Sections Skeleton - 2 Column Grid */}
                <div className="grid lg:grid-cols-2 gap-6 mb-12">
                    {sectionSkeletons.map((_, index) => (
                        <Box key={index} className="p-6 rounded-[6px]" sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
                            <div className="flex items-center mb-4">
                                <Skeleton animation="wave" variant="rounded" width={40} height={40} sx={{ bgcolor: '#3a3a3a', mr: 2 }} />
                                <Skeleton animation="wave" variant="text" width={150} height={25} sx={{ bgcolor: '#3a3a3a' }} />
                            </div>
                            <div className="space-y-2">
                                {Array(4).fill(null).map((_, itemIndex) => (
                                    <div key={itemIndex} className="flex items-start">
                                        <Skeleton animation="wave" variant="circular" width={6} height={6} sx={{ bgcolor: '#3a3a3a', mt: 1, mr: 2, flexShrink: 0 }} />
                                        <Skeleton 
                                            animation="wave" 
                                            variant="text" 
                                            width={`${Math.random() * 40 + 60}%`} 
                                            height={18} 
                                            sx={{ bgcolor: '#3a3a3a' }} 
                                        />
                                    </div>
                                ))}
                            </div>
                        </Box>
                    ))}
                </div>

                {/* Contact Section Skeleton */}
                <Box className="p-8 text-center mb-8 rounded-[6px]" sx={{ bgcolor: '#3a3a3a' }}>
                    <Skeleton animation="wave" variant="text" width={280} height={30} sx={{ bgcolor: '#4a4a4a', margin: '0 auto 16px' }} />
                    <Skeleton animation="wave" variant="text" width={400} height={20} sx={{ bgcolor: '#4a4a4a', margin: '0 auto 8px' }} />
                    <Skeleton animation="wave" variant="text" width={350} height={20} sx={{ bgcolor: '#4a4a4a', margin: '0 auto 24px' }} />
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Skeleton animation="wave" variant="rounded" width={140} height={40} sx={{ bgcolor: '#4a4a4a' }} />
                        <Skeleton animation="wave" variant="rounded" width={140} height={40} sx={{ bgcolor: '#4a4a4a' }} />
                    </div>
                </Box>

                {/* Footer Skeleton */}
                <div className="text-center mb-8">
                    <Skeleton animation="wave" variant="text" width={450} height={18} sx={{ bgcolor: '#3a3a3a', margin: '0 auto 4px' }} />
                    <Skeleton animation="wave" variant="text" width={380} height={18} sx={{ bgcolor: '#3a3a3a', margin: '0 auto' }} />
                </div>
            </div>
        </div>
    );
};