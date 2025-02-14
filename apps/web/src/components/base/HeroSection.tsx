"use client";
import { ImFire } from 'react-icons/im';
import ContainerScrollAnimation from '../ui/ContainerScrollAnimation';
import UnclickableTicker from '../ui/UnclickableTicker';
import FeatureSection from './FeatureSection';
import FeatureSectionPrime from './FeatureSectionPrime';
import Footer from '../footer/Footer';
import LampEffect from './LampEffect';

export default function HeroSection() {
    return (
        <div className="bg-[#F1F1F1] dark:bg-[#131212] dark:text-gray-400 w-full h-full">
            <ContainerScrollAnimation />
            <div className=' bg-[#0f0f0f] border-t border-neutral-600'>
                <div className='mx-[8rem] flex flex-col relative'>
                    <UnclickableTicker className='absolute left-[60%] -top-3'>
                        <ImFire className='mt-0.5' />
                        Featured section
                    </UnclickableTicker>
                    <FeatureSectionPrime />
                    <FeatureSection />
                </div>
                <LampEffect />
                <Footer />
            </div>
        </div>
    );
}