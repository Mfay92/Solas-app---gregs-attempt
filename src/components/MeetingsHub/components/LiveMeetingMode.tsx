import { useState, useEffect } from 'react';
import { Meeting, ActionItem } from '../../../types';
import {
    Play,
    Pause,
    SkipForward,
    SkipBack,
    Check,
    CheckCircle,
    CheckSquare,
    X,
    Clock,
    Users,
    FileText,
    ListTodo,
    Mic,
    MicOff,
    ChevronLeft,
    MessageSquare,
    Plus,
    Save,
    Flag,
    Sparkles
} from 'lucide-react';

interface LiveMeetingModeProps {
    meeting: Meeting;
    onUpdateMeeting: (meeting: Meeting) => void;
    onEndMeeting: () => void;
    onClose: () => void;
}

type MeetingPhase = 'start' | 'agenda' | 'summary';

export default function LiveMeetingMode({
    meeting,
    onUpdateMeeting,
    onEndMeeting,
    onClose
}: LiveMeetingModeProps) {
    const [phase, setPhase] = useState<MeetingPhase>('start');
    const [currentAgendaIndex, setCurrentAgendaIndex] = useState(0);
    const [agendaNotes, setAgendaNotes] = useState<Record<string, string>>({});
    const [newAction, setNewAction] = useState({ title: '', assigneeName: '' });
    const [sessionActions, setSessionActions] = useState<ActionItem[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Timer effect
    useEffect(() => {
        if (phase !== 'start' && !isPaused) {
            const interval = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [phase, isPaused]);

    const formatElapsedTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const currentAgendaItem = meeting.agenda[currentAgendaIndex];

    const handleStartMeeting = () => {
        setPhase('agenda');
    };

    const handleNextAgendaItem = () => {
        if (currentAgendaIndex < meeting.agenda.length - 1) {
            setCurrentAgendaIndex(prev => prev + 1);
        } else {
            setPhase('summary');
        }
    };

    const handlePrevAgendaItem = () => {
        if (currentAgendaIndex > 0) {
            setCurrentAgendaIndex(prev => prev - 1);
        }
    };

    const handleMarkAgendaComplete = () => {
        const updatedAgenda = meeting.agenda.map((item, index) =>
            index === currentAgendaIndex ? { ...item, completed: true } : item
        );
        onUpdateMeeting({ ...meeting, agenda: updatedAgenda });
        handleNextAgendaItem();
    };

    const handleAddAction = () => {
        if (!newAction.title.trim() || !newAction.assigneeName.trim()) return;

        const action: ActionItem = {
            id: `action-${Date.now()}`,
            title: newAction.title,
            assigneeName: newAction.assigneeName,
            status: 'Pending',
            createdAt: new Date().toISOString()
        };

        setSessionActions(prev => [...prev, action]);
        setNewAction({ title: '', assigneeName: '' });
    };

    const handleEndMeeting = () => {
        // Compile all notes into minutes
        const compiledMinutes = Object.entries(agendaNotes)
            .filter(([_, notes]) => notes.trim())
            .map(([agendaId, notes]) => {
                const agendaItem = meeting.agenda.find(a => a.id === agendaId);
                return `## ${agendaItem?.title || 'Notes'}\n${notes}`;
            })
            .join('\n\n');

        // Update meeting with minutes and actions
        const updatedMeeting: Meeting = {
            ...meeting,
            minutes: compiledMinutes || meeting.minutes,
            actionItems: [...(meeting.actionItems || []), ...sessionActions],
            status: 'Completed',
            updatedAt: new Date().toISOString()
        };

        onUpdateMeeting(updatedMeeting);
        onEndMeeting();
    };

    const handleToggleDictation = () => {
        setIsRecording(!isRecording);
        // Placeholder - in future this would connect to speech-to-text
        console.log(isRecording ? 'Stopping dictation...' : 'Starting dictation...');
    };

    const completedAgendaItems = meeting.agenda.filter(a => a.completed).length;
    const progress = (completedAgendaItems / meeting.agenda.length) * 100;

    // Start Screen
    if (phase === 'start') {
        return (
            <div className="fixed inset-0 bg-gradient-to-br from-ivolve-dark via-ivolve-mid to-ivolve-dark/90 z-50 flex items-center justify-center">
                <div className="max-w-2xl w-full mx-4 text-center">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all"
                    >
                        <X size={24} />
                    </button>

                    {/* Animated Icon */}
                    <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center animate-pulse">
                        <Sparkles size={64} className="text-white" />
                    </div>

                    {/* Meeting Title */}
                    <h1 className="text-4xl font-bold text-white mb-4">
                        {meeting.title}
                    </h1>

                    {/* Meeting Details */}
                    <div className="flex items-center justify-center gap-6 text-white/70 mb-8">
                        <span className="flex items-center gap-2">
                            <Clock size={18} />
                            {meeting.scheduledTime.substring(0, 5)}
                        </span>
                        <span className="flex items-center gap-2">
                            <Users size={18} />
                            {meeting.participants.length} attendees
                        </span>
                        <span className="flex items-center gap-2">
                            <FileText size={18} />
                            {meeting.agenda.length} agenda items
                        </span>
                    </div>

                    {/* Agenda Preview */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 text-left">
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <ListTodo size={18} />
                            Agenda Items
                        </h3>
                        <div className="space-y-2">
                            {meeting.agenda.slice(0, 5).map((item, index) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-3 text-white/80"
                                >
                                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                                        {index + 1}
                                    </div>
                                    <span className="flex-1 truncate">{item.title}</span>
                                    {item.duration && (
                                        <span className="text-sm text-white/50">{item.duration} min</span>
                                    )}
                                </div>
                            ))}
                            {meeting.agenda.length > 5 && (
                                <p className="text-white/50 text-sm pl-9">
                                    +{meeting.agenda.length - 5} more items
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Start Button */}
                    <button
                        onClick={handleStartMeeting}
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-ivolve-dark font-bold text-lg rounded-xl hover:bg-ivolve-bright hover:scale-105 transition-all shadow-2xl"
                    >
                        <Play size={24} className="group-hover:animate-pulse" />
                        Start Meeting
                    </button>
                </div>
            </div>
        );
    }

    // Summary/End Screen
    if (phase === 'summary') {
        return (
            <div className="fixed inset-0 bg-gradient-to-br from-green-700 via-green-600 to-teal-600 z-50 flex items-center justify-center">
                <div className="max-w-3xl w-full mx-4">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all"
                    >
                        <X size={24} />
                    </button>

                    <div className="text-center mb-8">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                            <CheckCircle size={48} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Meeting Complete</h1>
                        <p className="text-white/70">Duration: {formatElapsedTime(elapsedTime)}</p>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                            <p className="text-3xl font-bold text-white">{completedAgendaItems}</p>
                            <p className="text-sm text-white/70">Agenda Items Completed</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                            <p className="text-3xl font-bold text-white">{sessionActions.length}</p>
                            <p className="text-sm text-white/70">Actions Created</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                            <p className="text-3xl font-bold text-white">
                                {Object.values(agendaNotes).filter(n => n.trim()).length}
                            </p>
                            <p className="text-sm text-white/70">Notes Recorded</p>
                        </div>
                    </div>

                    {/* Actions Created */}
                    {sessionActions.length > 0 && (
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-8">
                            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                                <ListTodo size={16} />
                                Actions Created
                            </h3>
                            <div className="space-y-2">
                                {sessionActions.map(action => (
                                    <div key={action.id} className="flex items-center gap-2 text-white/80">
                                        <Check size={14} className="text-green-300" />
                                        <span>{action.title}</span>
                                        <span className="text-white/50">→ {action.assigneeName}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* End Meeting Button */}
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => setPhase('agenda')}
                            className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors"
                        >
                            <ChevronLeft size={18} />
                            Back to Meeting
                        </button>
                        <button
                            onClick={handleEndMeeting}
                            className="flex items-center gap-2 px-8 py-3 bg-white text-green-700 font-bold rounded-lg hover:bg-green-50 transition-colors shadow-lg"
                        >
                            <Save size={18} />
                            Save & Close Meeting
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Agenda Item View (Main Meeting Mode)
    return (
        <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
            {/* Top Bar */}
            <div className="bg-gradient-to-r from-ivolve-dark to-ivolve-mid px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <div>
                        <h2 className="text-white font-bold">{meeting.title}</h2>
                        <p className="text-white/60 text-sm">{meeting.meetingRef}</p>
                    </div>
                </div>

                {/* Timer & Controls */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                        <Clock size={16} className="text-white/70" />
                        <span className="text-white font-mono text-lg">{formatElapsedTime(elapsedTime)}</span>
                    </div>
                    <button
                        onClick={() => setIsPaused(!isPaused)}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                        title={isPaused ? 'Resume' : 'Pause'}
                    >
                        {isPaused ? <Play size={20} /> : <Pause size={20} />}
                    </button>
                    <button
                        onClick={() => setPhase('summary')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
                    >
                        <Flag size={16} />
                        End Meeting
                    </button>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-gray-800">
                <div
                    className="h-full bg-gradient-to-r from-ivolve-bright to-green-400 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Agenda Navigation */}
                <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
                    <div className="p-4 border-b border-gray-700">
                        <h3 className="text-white font-semibold flex items-center gap-2">
                            <ListTodo size={16} />
                            Agenda
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">
                            {completedAgendaItems}/{meeting.agenda.length} completed
                        </p>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {meeting.agenda.map((item, index) => (
                            <button
                                key={item.id}
                                onClick={() => setCurrentAgendaIndex(index)}
                                className={`
                                    w-full p-3 flex items-start gap-3 text-left transition-colors
                                    ${index === currentAgendaIndex
                                        ? 'bg-ivolve-mid/30 border-l-4 border-ivolve-bright'
                                        : 'hover:bg-gray-700/50 border-l-4 border-transparent'
                                    }
                                `}
                            >
                                <div className={`
                                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                                    ${item.completed
                                        ? 'bg-green-500 text-white'
                                        : index === currentAgendaIndex
                                            ? 'bg-ivolve-bright text-white'
                                            : 'bg-gray-700 text-gray-400'
                                    }
                                `}>
                                    {item.completed ? <Check size={12} /> : index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium truncate ${
                                        item.completed ? 'text-gray-500 line-through' : 'text-white'
                                    }`}>
                                        {item.title}
                                    </p>
                                    {item.duration && (
                                        <p className="text-xs text-gray-500">{item.duration} min</p>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Center: Current Agenda Item */}
                <div className="flex-1 flex flex-col bg-gray-900">
                    {/* Current Item Header */}
                    <div className="bg-gradient-to-r from-ivolve-mid/20 to-transparent p-6 border-b border-gray-800">
                        <div className="flex items-center gap-4 mb-2">
                            <span className="px-3 py-1 bg-ivolve-mid text-white text-sm font-bold rounded-full">
                                Item {currentAgendaIndex + 1} of {meeting.agenda.length}
                            </span>
                            {currentAgendaItem?.duration && (
                                <span className="flex items-center gap-1 text-gray-400 text-sm">
                                    <Clock size={14} />
                                    Est. {currentAgendaItem.duration} min
                                </span>
                            )}
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">
                            {currentAgendaItem?.title}
                        </h1>
                        {currentAgendaItem?.description && (
                            <p className="text-gray-400">{currentAgendaItem.description}</p>
                        )}
                        {currentAgendaItem?.presenter && (
                            <p className="text-ivolve-bright text-sm mt-2">
                                Presenter: {currentAgendaItem.presenter}
                            </p>
                        )}
                    </div>

                    {/* Notes Area */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        <div className="max-w-3xl mx-auto">
                            {/* Notes Input */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-white font-medium flex items-center gap-2">
                                        <MessageSquare size={16} />
                                        Notes for this item
                                    </label>
                                    <button
                                        onClick={handleToggleDictation}
                                        className={`
                                            flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                                            ${isRecording
                                                ? 'bg-red-500 text-white animate-pulse'
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }
                                        `}
                                    >
                                        {isRecording ? (
                                            <>
                                                <MicOff size={14} />
                                                Stop Dictation
                                            </>
                                        ) : (
                                            <>
                                                <Mic size={14} />
                                                Start Dictation
                                            </>
                                        )}
                                    </button>
                                </div>
                                <textarea
                                    value={agendaNotes[currentAgendaItem?.id || ''] || ''}
                                    onChange={(e) => setAgendaNotes(prev => ({
                                        ...prev,
                                        [currentAgendaItem?.id || '']: e.target.value
                                    }))}
                                    placeholder="Type your notes here, or use dictation..."
                                    className="w-full h-40 bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-ivolve-mid focus:border-transparent resize-none"
                                />
                            </div>

                            {/* Quick Add Action */}
                            <div className="bg-gray-800 rounded-xl p-4">
                                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                                    <Plus size={16} />
                                    Quick Add Action
                                </h3>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newAction.title}
                                        onChange={(e) => setNewAction(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="Action description..."
                                        className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 text-sm"
                                    />
                                    <input
                                        type="text"
                                        value={newAction.assigneeName}
                                        onChange={(e) => setNewAction(prev => ({ ...prev, assigneeName: e.target.value }))}
                                        placeholder="Assignee..."
                                        className="w-40 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 text-sm"
                                    />
                                    <button
                                        onClick={handleAddAction}
                                        disabled={!newAction.title.trim() || !newAction.assigneeName.trim()}
                                        className="px-4 py-2 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>

                                {/* Session Actions List */}
                                {sessionActions.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-700">
                                        <p className="text-gray-400 text-xs uppercase font-semibold mb-2">
                                            Actions this session ({sessionActions.length})
                                        </p>
                                        <div className="space-y-2 max-h-32 overflow-y-auto">
                                            {sessionActions.map(action => (
                                                <div
                                                    key={action.id}
                                                    className="flex items-center gap-2 text-sm bg-gray-700/50 px-3 py-2 rounded-lg"
                                                >
                                                    <CheckSquare size={14} className="text-ivolve-bright" />
                                                    <span className="text-white flex-1 truncate">{action.title}</span>
                                                    <span className="text-gray-400">→ {action.assigneeName}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Navigation Footer */}
                    <div className="bg-gray-800 border-t border-gray-700 p-4 flex items-center justify-between">
                        <button
                            onClick={handlePrevAgendaItem}
                            disabled={currentAgendaIndex === 0}
                            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <SkipBack size={18} />
                            Previous Item
                        </button>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleMarkAgendaComplete}
                                className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors shadow-lg"
                            >
                                <Check size={18} />
                                Mark Complete & Continue
                            </button>
                        </div>

                        <button
                            onClick={handleNextAgendaItem}
                            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
                        >
                            {currentAgendaIndex === meeting.agenda.length - 1 ? 'Finish' : 'Skip'}
                            <SkipForward size={18} />
                        </button>
                    </div>
                </div>

                {/* Right: Attendees Panel */}
                <div className="w-64 bg-gray-800 border-l border-gray-700 flex flex-col">
                    <div className="p-4 border-b border-gray-700">
                        <h3 className="text-white font-semibold flex items-center gap-2">
                            <Users size={16} />
                            Attendees
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-2">
                            {meeting.participants.map(participant => (
                                <div
                                    key={participant.id}
                                    className="flex items-center gap-3 p-2 bg-gray-700/50 rounded-lg"
                                >
                                    <div className={`
                                        w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                                        ${participant.role === 'Organizer'
                                            ? 'bg-ivolve-mid text-white'
                                            : participant.role === 'Apologies'
                                                ? 'bg-gray-600 text-gray-400'
                                                : 'bg-gray-600 text-white'
                                        }
                                    `}>
                                        {participant.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium truncate ${
                                            participant.role === 'Apologies' ? 'text-gray-500' : 'text-white'
                                        }`}>
                                            {participant.name}
                                        </p>
                                        <p className="text-xs text-gray-500">{participant.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
