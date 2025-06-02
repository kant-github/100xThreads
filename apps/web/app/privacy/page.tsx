import React from 'react';
import { Calendar, Users, Lock, Eye, Database, Globe } from 'lucide-react';
import { GiDoubleDragon } from 'react-icons/gi';

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-primDark dark:to-secDark py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-x-4 mb-6">
                        <GiDoubleDragon
                            size={50}
                            className="transition-transform transform group-hover:-translate-x-[3px] text-[#f2a633] dark:text-[#f2a633]"
                        />
                        <div
                            className={`text-xl md:text-5xl tracking-widest text-black dark:text-gray-300 flex items-center font-afacad`}>
                            Shelv<span className="text-red-500">R</span>
                        </div>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Your privacy matters to us. This policy explains how Shelvr handles your data when you use our
                        organization and event management platform with Google Calendar integration.
                    </p>
                    <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        Last updated: {new Date().toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                </div>

                {/* Quick Summary */}
                <div className="bg-amber-50 dark:bg-terDark border-l-4 border-amber-500 p-6 mb-8 rounded-[8px]">
                    <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-100 mb-3">Privacy at a Glance</h2>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-amber-800 dark:text-amber-200">
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            Google Calendar access only as you authorize
                        </div>
                        <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            Organization data shared only with your team
                        </div>
                        <div className="flex items-center">
                            <Lock className="w-4 h-4 mr-2" />
                            End-to-end encryption for all data
                        </div>
                        <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-2" />
                            Full control over your data and privacy
                        </div>
                    </div>
                </div>

                {/* Main Sections */}
                <div className="space-y-8">
                    {sections.map((section, index) => (
                        <div key={index} className="bg-white dark:bg-secDark rounded-[8px] shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                            <div className="p-8">
                                <div className="flex items-center mb-6">
                                    <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-3 rounded-[8px] text-white mr-4">
                                        {section.icon}
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{section.title}</h2>
                                </div>
                                <ul className="space-y-3">
                                    {section.content.map((item, itemIndex) => (
                                        <li key={itemIndex} className="flex items-start text-gray-600 dark:text-gray-300">
                                            <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <span className="leading-relaxed text-sm">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact Section */}
                <div className="mt-12 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl text-white p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Questions About Your Privacy?</h2>
                    <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
                        We're committed to transparency. If you have any questions about how we handle your data
                        or need to exercise your privacy rights, don't hesitate to reach out.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-white text-amber-600 px-6 py-3 rounded-[8px] font-semibold hover:bg-amber-50 transition-colors">
                            Contact Support
                        </button>
                        <button className="border-2 border-white text-white px-6 py-3 rounded-[8px] font-semibold hover:bg-white hover:text-amber-600 transition-colors">
                            Download My Data
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                    <p>
                        By using Shelvr, you agree to this Privacy Policy. We may update this policy from time to time,
                        and we'll notify you of any significant changes.
                    </p>
                </div>
            </div>
        </div>
    );
};