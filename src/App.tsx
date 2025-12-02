import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import PropertyHub from './components/PropertyHub';
import PropertyHubEnhanced from './components/PropertyHub/PropertyHubEnhanced';
import StyleGuide from './components/StyleGuide';
import { DashboardLayout } from './components/Dashboard/DashboardLayout';
import FinancePage from './components/Finance';
import { ToastProvider } from './components/ToastProvider';
import ErrorBoundary from './components/ErrorBoundary';
import { AppProvider } from './context/AppContext';

function AppRoutes() {
    return (
        <ToastProvider>
            <Layout>
                <Routes>
                    <Route path="/" element={<DashboardLayout />} />
                    <Route path="/properties" element={<PropertyHubEnhanced />} />
                    <Route path="/properties/:propertyId" element={<PropertyHub />} />
                    <Route path="/finance" element={<FinancePage />} />
                    <Route path="/settings" element={<StyleGuide />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Layout>
        </ToastProvider>
    );
}

function App() {
    return (
        <ErrorBoundary>
            <BrowserRouter>
                <AppProvider>
                    <AppRoutes />
                </AppProvider>
            </BrowserRouter>
        </ErrorBoundary>
    );
}

export default App;
