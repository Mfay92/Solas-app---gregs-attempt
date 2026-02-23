import React from 'react';
import { BookOpen, ArrowLeft, Plus, FileText, Newspaper, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Library: React.FC = () => {
    return (
        <div className="min-h-screen bg-ivolve-paper -m-6">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 w-full shadow-md">
                <div className="px-6 py-6">
                    {/* Back Button */}
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        <span className="text-sm">Back to Dashboard</span>
                    </Link>

                    {/* Header Content */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                                <BookOpen size={28} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">The Library</h1>
                                <p className="text-white/80 mt-1">
                                    Knowledge base, articles, news, training resources, and community content
                                </p>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 bg-white text-emerald-600 px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors">
                            <Plus size={18} />
                            Add Content
                        </button>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-4 gap-4 mt-6">
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                <FileText size={14} />
                                Articles
                            </div>
                            <p className="text-2xl font-bold text-white mt-1">0</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                <Newspaper size={14} />
                                News Updates
                            </div>
                            <p className="text-2xl font-bold text-white mt-1">0</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                <GraduationCap size={14} />
                                Training Resources
                            </div>
                            <p className="text-2xl font-bold text-white mt-1">0</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                <BookOpen size={14} />
                                Categories
                            </div>
                            <p className="text-2xl font-bold text-white mt-1">0</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="p-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                        <BookOpen size={32} className="text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">The Library - Coming Soon</h2>
                    <p className="text-gray-500 max-w-md mx-auto">
                        A community-focused knowledge base with carousels of articles, news feeds,
                        training on disabilities, sector updates, new legislation, and company announcements.
                        Link content to properties and alert relevant staff.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Library;
