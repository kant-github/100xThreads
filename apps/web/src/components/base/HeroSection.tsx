"use client";
import { ImFire } from 'react-icons/im';
import ContainerScrollAnimation from '../ui/ContainerScrollAnimation';
import UnclickableTicker from '../ui/UnclickableTicker';
import FeatureSection from './FeatureSection';
import Footer from '../footer/Footer';
import HomeCards from '../dashboard/HomeCards';
import Image from 'next/image';

export default function HeroSection() {
    return (
        <div className="bg-[#F1F1F1] dark:bg-[#131212] dark:text-gray-400 w-full h-full relative">
            <div className="absolute inset-0 w-full h-full z-0">
                <Image
                    src="/images/finaldash2.jpg"
                    alt="Dashboard background"
                    width={1440}
                    height={3260}
                    className="object-cover"
                    priority
                />
                
            </div>
            <div className="relative z-10">
                <div>
                    <ContainerScrollAnimation />
                </div>
                <div className='bg-gradient-to-br from-neutral-950 via-neutral-900 to-[#1c1c1c] border-t border-neutral-600'>
                    <div className='mx-[8rem] flex flex-col relative'>
                        <UnclickableTicker className='absolute left-[60%] -top-3'>
                            <ImFire className='mt-0.5' />
                            Featured section
                        </UnclickableTicker>
                        <HomeCards className='my-16' />
                        <FeatureSection />
                    </div>
                    <Footer />
                </div>
            </div>
        </div>
    );
}