import React, { useState } from 'react';
import { LibraryIcon, BookOpenIcon, BeakerIcon, NewspaperIcon, QuestionMarkCircleIcon, SparklesIcon } from '../Icons';
import Card from '../Card';
import Modal from '../Modal';
import { GoogleGenAI } from '@google/genai';
import SplitText from '../SplitText';

const mockBooks = [
    { id: 1, title: 'Understanding Social Housing Finance' },
    { id: 2, title: 'A Guide to Supported Living Frameworks' },
    { id: 3, title: 'Best Practices in Property Compliance' },
];

const mockJournals = [
    { id: 1, title: 'What is Autism Spectrum Disorder?' },
    { id: 2, title: 'Approaches to Mental Health Support' },
    { id: 3, title: 'Understanding Learning Disabilities' },
];

const mockNews = [
    { id: 1, title: 'Sector Update: New Housing Legislation' },
    { id: 2, title: 'ivolve Group Acquires New Services in the Midlands' },
    { id: 3, title: 'Annual Quality Report Published' },
];

const ArticleCard: React.FC<{ title: string, onClick: () => void }> = ({ title, onClick }) => (
    <button onClick={onClick} className="p-4 bg-white border rounded-lg shadow-sm text-center transition-all hover:shadow-lg hover:-translate-y-1 w-full">
        <p className="font-semibold text-solas-dark">{title}</p>
        <p className="text-xs text-gray-400 mt-2">Coming Soon</p>
    </button>
);

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <section>
        <h2 className="text-2xl font-bold text-solas-dark pb-2 mb-4 border-b-2 border-gray-200 flex items-center">
            <span className="mr-3 text-ivolve-blue">{icon}</span>
            {title}
        </h2>
        {children}
    </section>
);

const LibraryView: React.FC = () => {
  const [modalTitle, setModalTitle] = useState<string | null>(null);
  
  // State for the smart search guide
  const [isSummarizingSearch, setIsSummarizingSearch] = useState(false);
  const [searchSummary, setSearchSummary] = useState<string | null>(null);
  const [searchSummaryError, setSearchSummaryError] = useState<string | null>(null);


  const handleArticleClick = (title: string) => {
    setModalTitle(title);
  };
    
    const searchGuideText = `
    What is Smart Search? The Smart Search bar at the top of every page is powered by Google's Gemini AI. It allows you to find properties using natural, conversational language instead of manually applying filters.
    How it Works: Simply type what you're for into the search bar and press Enter or click "Smart Search". The AI will analyze your request and automatically apply the relevant filters to the Property Database. For example, if you type "show me void supported living properties in the north", the AI will select "Void", "Supported Living", and "North" in the filter options for you.
    Example Queries: "All my void units in Wales", "Show residential services run by Harbour Light", "Find me occupied properties in the Midlands", "STRE01" (it still handles direct ID searches too!).
  `;

  const handleSummarizeSearch = async () => {
    setIsSummarizingSearch(true);
    setSearchSummary(null);
    setSearchSummaryError(null);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Please summarize the following guide into a few clear, concise bullet points for a busy professional:\n\n${searchGuideText}`,
        });
        
        const text = response.text;
        setSearchSummary(text);

    } catch (e) {
        console.error(e);
        setSearchSummaryError('Sorry, the AI summary could not be generated at this time.');
    } finally {
        setIsSummarizingSearch(false);
    }
  };


  return (
    <div className="h-full flex flex-col">
        {modalTitle && (
            <Modal title="Content Coming Soon" onClose={() => setModalTitle(null)}>
                <p className="text-center text-solas-gray">
                    The article <strong className="text-solas-dark">"{modalTitle}"</strong> is currently being written and will be available shortly.
                </p>
            </Modal>
        )}

        <header className="bg-app-header text-app-header-text p-4 shadow-md z-10">
            <div className="flex items-center space-x-4">
                <LibraryIcon />
                <h1 className="text-3xl font-bold tracking-wider animated-heading" aria-label="THE LIBRARY"><SplitText>THE LIBRARY</SplitText></h1>
            </div>
        </header>

        <main className="flex-grow overflow-y-auto p-6 space-y-8">
            <Section title="Books" icon={<BookOpenIcon />}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mockBooks.map(book => <ArticleCard key={book.id} title={book.title} onClick={() => handleArticleClick(book.title)} />)}
                </div>
            </Section>

            <Section title="Journals" icon={<BeakerIcon />}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mockJournals.map(item => <ArticleCard key={item.id} title={item.title} onClick={() => handleArticleClick(item.title)} />)}
                </div>
            </Section>

            <Section title="News Reports" icon={<NewspaperIcon />}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mockNews.map(item => <ArticleCard key={item.id} title={item.title} onClick={() => handleArticleClick(item.title)} />)}
                </div>
            </Section>

            <Section title="Tech Support" icon={<QuestionMarkCircleIcon />}>
                 <Card 
                    title={
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold">Guide: Using Smart Search</h3>
                            <button 
                                onClick={handleSummarizeSearch}
                                disabled={isSummarizingSearch}
                                className="flex items-center space-x-2 bg-ivolve-blue text-white text-sm font-bold px-3 py-1.5 rounded-md hover:bg-opacity-90 shadow-sm disabled:bg-gray-400"
                            >
                                <SparklesIcon />
                                <span>{isSummarizingSearch ? 'Summarizing...' : 'Summarize with AI'}</span>
                            </button>
                        </div>
                    }
                    titleClassName="bg-ivolve-dark-green text-white"
                    className="mt-6"
                >
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-bold text-lg text-solas-dark">What is Smart Search?</h3>
                            <p className="mt-1 text-sm text-solas-gray">The Smart Search bar at the top of every page is powered by Google's Gemini AI. It allows you to find properties using natural, conversational language instead of manually applying filters.</p>
                        </div>
                        
                        <div>
                            <h3 className="font-bold text-lg text-solas-dark">How it Works</h3>
                            <p className="mt-1 text-sm text-solas-gray">Simply type what you're looking for into the search bar and press Enter or click "Smart Search". The AI will analyze your request and automatically apply the relevant filters to the Property Database. For example, if you type "show me void supported living properties in the north", the AI will select "Void", "Supported Living", and "North" in the filter options for you.</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg text-solas-dark">Example Queries</h3>
                            <ul className="mt-2 list-disc list-inside text-sm space-y-1 text-solas-gray">
                                <li>"All my void units in Wales"</li>
                                <li>"Show residential services run by Harbour Light"</li>
                                <li>"Find me occupied properties in the Midlands"</li>
                                <li>"STRE01" (it still handles direct ID searches too!)</li>
                            </ul>
                        </div>
                    </div>
                    {(isSummarizingSearch || searchSummaryError || searchSummary) && (
                        <div className="mt-6 pt-6 border-t-2 border-dashed border-ivolve-blue/30">
                            <h3 className="font-bold text-lg text-solas-dark flex items-center mb-2">
                                <SparklesIcon className="text-ivolve-blue mr-2" />
                                AI-Generated Summary
                            </h3>
                            {isSummarizingSearch && (
                                <div className="flex items-center space-x-2 text-solas-gray">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-ivolve-blue"></div>
                                    <span>Generating summary...</span>
                                </div>
                            )}
                            {searchSummaryError && (
                                <div className="p-3 bg-red-100 text-red-800 border border-red-200 rounded-md">
                                    {searchSummaryError}
                                </div>
                            )}
                            {searchSummary && (
                                <div className="prose prose-sm max-w-none text-solas-gray space-y-1">
                                    {searchSummary.split('\n').map((line, index) => {
                                        const trimmedLine = line.trim();
                                        if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
                                            return <p key={index} className="flex items-start"><span className="mr-2 mt-1"> • </span><span>{trimmedLine.substring(2)}</span></p>;
                                        }
                                        if (trimmedLine) {
                                            return <p key={index}>{trimmedLine}</p>;
                                        }
                                        return null;
                                    })}
                                    <button onClick={() => setSearchSummary(null)} className="text-xs text-gray-500 hover:underline mt-2">Clear summary</button>
                                </div>
                            )}
                        </div>
                    )}
                 </Card>
            </Section>
        </main>
    </div>
  );
};

export default LibraryView;