import React from 'react';
import { Calendar, Users, Lock, Eye, Database, Globe } from 'lucide-react';
import { GiDoubleDragon } from 'react-icons/gi';
import { Button } from '@/components/ui/button';
import UnclickableTicker from '@/components/ui/UnclickableTicker';
import DesignButton from '@/components/buttons/DesignButton';
import DashNav from '@/components/dashboard/DashNav';

export default function PrivacyPage() {
    const sections = [
        {
            icon: <Database className="w-6 h-6" />,
            title: "Information We Collect",
            content: [
                "Account information (name, email address) when you register",
                "Organization and channel data you create within Shelvr",
                "Event information you choose to sync with Google Calendar",
                "Usage analytics to improve our service"
            ]
        },
        {
            icon: <Calendar className="w-6 h-6" />,
            title: "Google Calendar Integration",
            content: [
                "We access your Google Calendar only to create, read, update, and delete events as you request",
                "Calendar data is processed in real-time and not stored permanently on our servers",
                "You can revoke calendar access at any time through your Google account settings",
                "We only access calendars you explicitly authorize through Google's OAuth flow"
            ]
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "Organization & Channel Data",
            content: [
                "Organization information is shared only with members you invite",
                "Channel data is visible to organization members based on permissions you set",
                "Event details are synced to individual Google Calendars as configured",
                "We don't share your organizational data with third parties"
            ]
        },
        {
            icon: <Lock className="w-6 h-6" />,
            title: "Data Security",
            content: [
                "All data transmission is encrypted using industry-standard SSL/TLS",
                "Google Calendar integration uses OAuth 2.0 for secure authentication",
                "We implement role-based access controls within organizations",
                "Regular security audits and monitoring protect your information"
            ]
        },
        {
            icon: <Eye className="w-6 h-6" />,
            title: "Your Privacy Rights",
            content: [
                "Access and download your personal data at any time",
                "Delete your account and associated data permanently",
                "Control which calendar events are synced and shared",
                "Manage organization membership and permissions"
            ]
        },
        {
            icon: <Globe className="w-6 h-6" />,
            title: "Data Sharing",
            content: [
                "We never sell your personal information to third parties",
                "Calendar events are shared only as you configure within your organization",
                "Anonymous usage statistics may be used to improve our service",
                "Legal compliance may require data disclosure only when legally mandated"
            ]
        }
    ];

    return (
        <div className="min-h-screen w-full flex flex-col">
            <div className="min-h-[60px] sm:min-h-[70px] h-20 bg-emerald-200">
                <DashNav />
            </div>
            <div className="w-[56rem] mx-auto pt-8">

                {/* Header */}
                <div className="text-center mb-16">
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
                        Privacy Policy
                    </UnclickableTicker>
                    <p className="text-sm text-gray-600 dark:text-gray-300 max-w-3xl mx-auto my-4">
                        Your privacy matters to us. This policy explains how Shelvr handles your data when you use our
                        organization and event management platform with Google Calendar integration.
                    </p>
                    <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                        Updated {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                </div>

                {/* Quick Summary */}
                <div className="bg-amber-50 dark:bg-terDark border border-amber-200 dark:border-amber-700/30 p-6 mb-12 rounded-[6px]">
                    <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-100 mb-4">Privacy at a Glance</h2>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center text-amber-800 dark:text-amber-200">
                            <Calendar className="w-4 h-4 mr-2" />
                            Google Calendar access only as you authorize
                        </div>
                        <div className="flex items-center text-amber-800 dark:text-amber-200">
                            <Users className="w-4 h-4 mr-2" />
                            Organization data shared only with your team
                        </div>
                        <div className="flex items-center text-amber-800 dark:text-amber-200">
                            <Lock className="w-4 h-4 mr-2" />
                            End-to-end encryption for all data
                        </div>
                        <div className="flex items-center text-amber-800 dark:text-amber-200">
                            <Eye className="w-4 h-4 mr-2" />
                            Full control over your data and privacy
                        </div>
                    </div>
                </div>

                {/* Main Sections - 2 Column Grid */}
                <div className="grid lg:grid-cols-2 gap-6 mb-12">
                    {sections.map((section, index) => (
                        <div key={index} className="bg-white/80 dark:bg-secDark/80 backdrop-blur-sm rounded-[6px]  -12 p-6 hover:shadow-lg transition-all duration-300 border border-amber-100/50 dark:border-amber-500/10">
                            <div className="flex items-center mb-4">
                                <div className="bg-amber-500/70 p-2 rounded-[6px] text-white dark:text-primDark mr-3">
                                    {section.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                    {section.title}
                                </h3>
                            </div>
                            <ul className="space-y-2">
                                {section.content.map((item, itemIndex) => (
                                    <li key={itemIndex} className="flex items-start text-gray-600 dark:text-gray-300 text-[13px] font-normal tracking-wider">
                                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Contact Section */}
                <div className="bg-primary rounded-[6px] text-white p-8 text-center mb-8">
                    <h2 className="text-xl font-bold mb-4 dark:text-primDark">Questions About Your Privacy?</h2>
                    <p className="text-amber-100 mb-6 max-w-2xl mx-auto text-sm font-normal dark:text-neutral-800">
                        We're committed to transparency. If you have any questions about how we handle your data
                        or need to exercise your privacy rights, don't hesitate to reach out.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-x-4 justify-center">
                        <DesignButton className={"bg-neutral-800"}>
                            Contact Support
                        </DesignButton>
                        <Button variant="outline" className="px-2  flex items-center justify-center gap-x-1 border border-yellow-500 bg-yellow-600/60 rounded-[6px] text-[11px]">
                            Download My Data
                        </Button>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
                    <p>
                        By using Shelvr, you agree to this Privacy Policy. We may update this policy from time to time,
                        and we'll notify you of any significant changes.
                    </p>
                </div>
            </div>
        </div>
    );
};