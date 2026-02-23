import { MessageSquare, Plus, Clock } from 'lucide-react';

export default function NotesTab() {
    // Sample notes for demonstration
    const sampleNotes = [
        {
            id: '1',
            content: 'Initial contact made with referrer. Assessment scheduled for next week.',
            createdBy: 'Matt Fay',
            createdAt: '2026-01-15T10:30:00Z',
            type: 'General'
        }
    ];

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            {/* Add Note */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Plus className="text-ivolve-mid" size={20} />
                    Add Note
                </h2>
                <textarea
                    placeholder="Write a note about this referral..."
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent transition-all resize-none"
                    rows={4}
                />
                <div className="mt-3 flex justify-end">
                    <button className="px-4 py-2 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-dark transition-all duration-200 font-semibold">
                        Add Note
                    </button>
                </div>
            </div>

            {/* Notes Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <MessageSquare className="text-ivolve-mid" size={20} />
                    Activity Timeline
                </h2>
                <div className="space-y-4">
                    {sampleNotes.map((note) => (
                        <div key={note.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-ivolve-mid text-white flex items-center justify-center text-sm font-bold">
                                        {note.createdBy.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-800">{note.createdBy}</div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Clock size={12} />
                                            {formatDateTime(note.createdAt)}
                                        </div>
                                    </div>
                                </div>
                                <span className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-semibold text-gray-600">
                                    {note.type}
                                </span>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                                {note.content}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
