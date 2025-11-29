import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: undefined });
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-ivolve-paper flex items-center justify-center p-8">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md text-center">
                        <div className="bg-red-50 p-4 rounded-full w-fit mx-auto mb-6">
                            <AlertCircle size={48} className="text-red-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-ivolve-dark mb-2">Something went wrong</h1>
                        <p className="text-ivolve-slate mb-6">
                            An unexpected error occurred. Please try refreshing the page.
                        </p>
                        <button
                            onClick={this.handleReset}
                            className="inline-flex items-center px-6 py-3 bg-ivolve-mid text-white font-bold rounded-lg hover:bg-ivolve-dark transition-colors"
                        >
                            <RefreshCw size={18} className="mr-2" />
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
