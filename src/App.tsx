import { useState } from 'react';
import Layout from './components/Layout';
import PropertyHub from './components/PropertyHub';
import RentBreakdownModal from './components/RentBreakdownModal';
import StyleGuide from './components/StyleGuide';
import { DashboardLayout } from './components/Dashboard/DashboardLayout';
import FinancePage from './components/Finance';
import { ToastProvider } from './components/ToastProvider';
import ErrorBoundary from './components/ErrorBoundary';
import { AppProvider, useApp } from './context/AppContext';

function AppContent() {
    const { activeView } = useApp();
    const [isRentModalOpen, setIsRentModalOpen] = useState(false);

    // Mock Data for Demo
    const mockRentItems = [
        { id: 'rent-1', label: 'Lease Cost/Base Rent PA', amount: 228.08, description: 'The base cost of leasing the property from the landlord. This is the core rent amount before any additional charges.' },
        { id: 'rent-2', label: 'Utilities', amount: 68.43, description: 'Covers communal utilities including water rates and any shared energy costs for communal areas.' },
        { id: 'rent-3', label: 'Management Fee', amount: 65.00, description: 'Administrative costs for managing the tenancy, handling queries, coordinating repairs, and general property oversight.' },
        { id: 'rent-4', label: 'Statutory Compliance', amount: 25.08, description: 'Legal safety requirements including fire safety checks, gas safety certificates, electrical testing, and health & safety compliance.' },
        { id: 'rent-5', label: 'Cyclical Works', amount: 21.67, description: 'Planned maintenance and redecoration on a regular cycle (e.g., painting, flooring replacement) to keep the property in good condition.' },
    ];

    const renderContent = () => {
        if (activeView === 'Properties') {
            return <PropertyHub />;
        }

        if (activeView === 'Finance') {
            return <FinancePage />;
        }

        if (activeView === 'Settings') {
            return <StyleGuide />;
        }

        // Dashboard View
        return <DashboardLayout />;
    };

    return (
        <ToastProvider>
            <Layout>
                {renderContent()}

                <RentBreakdownModal
                    isOpen={isRentModalOpen}
                    onClose={() => setIsRentModalOpen(false)}
                    propertyAddress="68 Woodhurst Avenue, Watford WD25 9RW"
                    rentItems={mockRentItems}
                />
            </Layout>
        </ToastProvider>
    );
}

function App() {
    return (
        <ErrorBoundary>
            <AppProvider>
                <AppContent />
            </AppProvider>
        </ErrorBoundary>
    );
}

export default App;
