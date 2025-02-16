"use client";
import { ImFire } from 'react-icons/im';
import ContainerScrollAnimation from '../ui/ContainerScrollAnimation';
import UnclickableTicker from '../ui/UnclickableTicker';
import FeatureSection from './FeatureSection';
import Footer from '../footer/Footer';
import StarsBackground from '../ui/StarsBackground';
import ShootingStars from '../ui/ShootingStars';
import HomeCards from '../dashboard/HomeCards';

export default function HeroSection() {
    return (
        <div className="bg-[#F1F1F1] dark:bg-[#131212] dark:text-gray-400 w-full h-full">
            <div>
                <ContainerScrollAnimation />
                <StarsBackground />
                <ShootingStars />
            </div>
            <div className='bg-gradient-to-br from-neutral-950 via-neutral-900 to-[#1c1c1c] border-t border-neutral-600'>
                <div className='mx-[8rem] flex flex-col relative'>
                    <UnclickableTicker className='absolute left-[60%] -top-3'>
                        <ImFire className='mt-0.5' />
                        Featured section
                    </UnclickableTicker>
                    <HomeCards className='my-16'  />
                    <FeatureSection />
                </div>
                <Footer />
            </div>
        </div>
    );
}