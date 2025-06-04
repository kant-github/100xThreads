import React from 'react';
import { Box } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

export default function TermsOfServiceSkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-yellow-50/30 dark:from-primDark dark:via-secDark dark:to-terDark py-16 px-4">
            <div className="max-w-3xl mx-auto">

                {/* Compact Header */}
                <div className="text-center mb-10 flex flex-col items-center justify-center gap-y-2">
                    <div className="flex items-center justify-center gap-x-4 mb-8">
                        <Skeleton
                            animation="wave"
                            variant="rounded"
                            width={50}
                            height={50}
                            sx={{ bgcolor: '#3a3a3a' }}
                        />
                        <Skeleton
                            animation="wave"
                            variant="text"
                            width={180}
                            height={48}
                            sx={{ bgcolor: '#3a3a3a' }}
                        />
                    </div>
                    <Skeleton
                        animation="wave"
                        variant="text"
                        width={200}
                        height={32}
                        sx={{ bgcolor: '#3a3a3a' }}
                    />
                    <Skeleton
                        animation="wave"
                        variant="text"
                        width={320}
                        height={20}
                        sx={{ bgcolor: '#3a3a3a' }}
                    />
                    <Skeleton
                        animation="wave"
                        variant="text"
                        width={120}
                        height={16}
                        sx={{ bgcolor: '#3a3a3a' }}
                    />
                </div>

                {/* Key Points */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    {[1, 2, 3].map((index) => (
                        <div key={index} className="bg-white/70 dark:bg-secDark/70 backdrop-blur-sm border border-amber-200/50 dark:border-amber-500/20 rounded-[6px] p-4 text-center hover:bg-white dark:hover:bg-secDark transition-all duration-300">
                            <Skeleton
                                animation="wave"
                                variant="rounded"
                                width={40}
                                height={40}
                                sx={{ bgcolor: '#3a3a3a', mx: 'auto', mb: 1 }}
                            />
                            <Skeleton
                                animation="wave"
                                variant="text"
                                width={80}
                                height={18}
                                sx={{ bgcolor: '#3a3a3a' }}
                            />
                            <Skeleton
                                animation="wave"
                                variant="text"
                                width={100}
                                height={14}
                                sx={{ bgcolor: '#3a3a3a' }}
                            />
                        </div>
                    ))}
                </div>

                {/* Main Terms Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {[1, 2, 3, 4].map((index) => (
                        <div key={index} className="bg-white/80 dark:bg-secDark/80 backdrop-blur-sm rounded-[6px] p-6 hover:shadow-lg transition-all duration-300 border border-amber-100/50 dark:border-amber-500/10">
                            <Box className="flex items-center mb-4">
                                <Skeleton
                                    animation="wave"
                                    variant="rounded"
                                    width={8}
                                    height={8}
                                    sx={{ bgcolor: '#3a3a3a', mr: 1.5 }}
                                />
                                <Skeleton
                                    animation="wave"
                                    variant="text"
                                    width={120}
                                    height={24}
                                    sx={{ bgcolor: '#3a3a3a' }}
                                />
                            </Box>
                            <Box className="space-y-2">
                                {[1, 2, 3, 4].map((itemIndex) => (
                                    <Box key={itemIndex} className="flex items-start">
                                        <Skeleton
                                            animation="wave"
                                            variant="circular"
                                            width={4}
                                            height={4}
                                            sx={{ bgcolor: '#3a3a3a', mt: 1, mr: 1, flexShrink: 0 }}
                                        />
                                        <Skeleton
                                            animation="wave"
                                            variant="text"
                                            width={`${Math.random() * 50 + 50}%`}
                                            height={18}
                                            sx={{ bgcolor: '#3a3a3a' }}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-white/80 dark:bg-secDark/80 backdrop-blur-sm rounded-[6px] p-6 text-center mb-6 border border-amber-100/50 dark:border-amber-500/10">
                    <Skeleton
                        animation="wave"
                        variant="text"
                        width={100}
                        height={28}
                        sx={{ bgcolor: '#3a3a3a', mx: 'auto', mb: 1 }}
                    />
                    <Skeleton
                        animation="wave"
                        variant="text"
                        width={200}
                        height={20}
                        sx={{ bgcolor: '#3a3a3a', mx: 'auto', mb: 2 }}
                    />
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Skeleton
                            animation="wave"
                            variant="rounded"
                            width={130}
                            height={36}
                            sx={{ bgcolor: '#3a3a3a' }}
                        />
                        <Skeleton
                            animation="wave"
                            variant="rounded"
                            width={110}
                            height={36}
                            sx={{ bgcolor: '#3a3a3a' }}
                        />
                    </div>
                </div>

                {/* Legal Footer */}
                <div className="bg-white/50 dark:bg-secDark/50 backdrop-blur-sm rounded-[6px] p-4 border border-amber-100/50 dark:border-amber-500/10">
                    <div className="text-center">
                        <Skeleton
                            animation="wave"
                            variant="text"
                            width={90}
                            height={20}
                            sx={{ bgcolor: '#3a3a3a', mx: 'auto', mb: 1 }}
                        />
                        <Box className="max-w-2xl mx-auto">
                            <Skeleton
                                animation="wave"
                                variant="text"
                                width="85%"
                                height={16}
                                sx={{ bgcolor: '#3a3a3a', mx: 'auto' }}
                            />
                            <Skeleton
                                animation="wave"
                                variant="text"
                                width="65%"
                                height={16}
                                sx={{ bgcolor: '#3a3a3a', mx: 'auto' }}
                            />
                        </Box>
                    </div>
                </div>

                {/* Bottom Agreement */}
                <div className="mt-6 text-center">
                    <Skeleton
                        animation="wave"
                        variant="text"
                        width={170}
                        height={16}
                        sx={{ bgcolor: '#3a3a3a', mx: 'auto' }}
                    />
                </div>
            </div>
        </div>
    );
}