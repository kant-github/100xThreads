
import React from 'react';
import { Users, Shield, CheckCircle } from 'lucide-react';
import UnclickableTicker from '@/components/ui/UnclickableTicker';
import { GiDoubleDragon } from 'react-icons/gi';
import DashNav from '@/components/dashboard/DashNav';
import { Button } from '@/components/ui/button';
import DesignButton from '@/components/buttons/DesignButton';

export default function () {
    const keyTerms = [
        { icon: <Users className="w-5 h-5" />, text: "Use responsibly", desc: "Manage organizations ethically" },
        { icon: <Shield className="w-5 h-5" />, text: "Respect privacy", desc: "Protect user data always" },
        { icon: <CheckCircle className="w-5 h-5" />, text: "Stay compliant", desc: "Follow all terms & policies" }
    ];

    const sections = [
        {
            title: "Account & Usage",
            items: [
                "Create one account with accurate information",
                "Keep your credentials secure and private",
                "Use service lawfully and respect others",
                "Organization admins manage member access"
            ]
        },
        {
            title: "Google Calendar",
            items: [
                "You control calendar access permissions",
                "We only modify calendars per your actions",
                "Revoke access anytime through Google",
                "Report integration issues immediately"
            ]
        },
        {
            title: "Data & Privacy",
            items: [
                "You own your content and calendar data",
                "We process data only to provide services",
                "Respect confidential organization info",
                "Report security issues to our team"
            ]
        },
        {
            title: "Billing & Service",
            items: [
                "Subscriptions bill monthly/annually",
                "Fees are non-refundable except as required",
                "30-day notice for price changes",
                "Service provided 'as is' without warranties"
            ]
        }
    ];

    return (
        <div className="min-h-screen w-full flex flex-col">
            <div className="min-h-[60px] sm:min-h-[70px] h-20 bg-emerald-200">
                <DashNav />
            </div>
            <div className="max-w-3xl mx-auto pt-8">

                {/* Compact Header */}
                <div className="text-center mb-10 flex flex-col items-center justify-center gap-y-2">
                    <div className="flex items-center justify-center gap-x-4 mb-8">
                        <GiDoubleDragon
                            size={50}
                            className="text-[#f2a633] dark:text-[#f2a633]"
                        />
                        <div className="text-3xl md:text-5xl tracking-widest text-black dark:text-gray-300 flex items-center font-afacad">
                            Shelv<span className="text-red-500">R</span>
                        </div>
                    </div>
                    <UnclickableTicker>
                        Terms of Service
                    </UnclickableTicker>
                    <p className="text-gray-600 dark:text-gray-300 text-sm max-w-lg mx-auto">
                        Simple rules for using Shelvr's organization and calendar management platform
                    </p>
                    <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                        Updated {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                </div>

                {/* Key Points */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    {keyTerms.map((term, index) => (
                        <div key={index} className="bg-white/70 dark:bg-secDark/70 backdrop-blur-sm border border-amber-200/50 dark:border-amber-500/20 rounded-[6px] p-4 text-center hover:bg-white dark:hover:bg-secDark transition-all duration-300">
                            <div className="inline-flex items-center justify-center w-10 h-10 bg-primary rounded-[6px]  -8 mb-2">
                                {term.icon}
                            </div>
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{term.text}</h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{term.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Main Terms Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {sections.map((section, index) => (
                        <div key={index} className="bg-white/80 dark:bg-secDark/80 backdrop-blur-sm rounded-[6px]  -12 p-6 hover:shadow-lg transition-all duration-300 border border-amber-100/50 dark:border-amber-500/10">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                                <div className="w-2 h-2 bg-primary rounded-[6px] mr-3"></div>
                                {section.title}
                            </h2>
                            <ul className="space-y-2">
                                {section.items.map((item, itemIndex) => (
                                    <li key={itemIndex} className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                                        <div className="w-1 h-1 bg-amber-400 rounded-[6px] mt-2 mr-2 flex-shrink-0"></div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-primary rounded-[6px]  -16 p-6 text-center text-white mb-6 dark:text-secDark">
                    <h2 className="text-xl font-bold mb-2">Need Help?</h2>
                    <p className="text-amber-100 text-sm mb-4 dark:text-terDark">Questions about terms or need support?</p>
                    <div className="flex flex-col sm:flex-row gap-x-4 justify-center">
                        <DesignButton className={"bg-neutral-800"}>
                            Contact Support
                        </DesignButton>
                        <Button variant="outline" className="px-3 flex items-center justify-center gap-x-1 border border-yellow-500 bg-yellow-600/60 rounded-[6px] text-[11px] tracking-wide">
                            Download PDF
                        </Button>
                    </div>
                </div>

                {/* Legal Footer */}
                <div className="bg-white/50 dark:bg-secDark/50 backdrop-blur-sm rounded-[6px] p-4 border border-amber-100/50 dark:border-amber-500/10">
                    <div className="text-center">
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Legal Notice</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
                            These terms are governed by applicable laws. Disputes resolved through arbitration.
                            Using Shelvr means you accept these terms and our Privacy Policy.
                        </p>
                    </div>
                </div>

                {/* Bottom Agreement */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        By using Shelvr, you agree to these terms ✨
                    </p>
                </div>
            </div>
        </div>
    );
};