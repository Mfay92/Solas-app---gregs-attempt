import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import PropertyHub from './components/PropertyHub';
import PropertyHubEnhanced from './components/PropertyHub/PropertyHubEnhanced';
import StyleGuide from './components/StyleGuide';
import DeveloperSettings from './components/DeveloperSettings';
import { DashboardLayout } from './components/Dashboard/DashboardLayout';
import FinancePage from './components/Finance';
import { ComplianceHub } from './components/Compliance';
import PeopleHub from './components/PeopleHub';
import ReferralsHub from './components/ReferralsHub';
import VoidManagement from './components/VoidManagement';
import MeetingsHub from './components/MeetingsHub';
import ProjectsHub from './components/ProjectsHub';
import ReportCentre from './components/ReportCentre';
import DevelopmentHub from './components/DevelopmentHub';
import RepairsHub from './components/RepairsHub';
import LegalHub from './components/LegalHub';
import Library from './components/Library';
import AddressBook from './components/AddressBook';
import { ToastProvider } from './components/ToastProvider';
import ErrorBoundary from './components/ErrorBoundary';
import { AppProvider } from './context/AppContext';
import { PopOutProvider } from './context/PopOutContext';
import { MinimizedTray } from './components/PopOut';

function AppRoutes() {
    return (
        <PopOutProvider>
            <ToastProvider>
                <Layout>
                    <Routes>
                        <Route path="/" element={<DashboardLayout />} />
                        <Route path="/meetings" element={<MeetingsHub />} />
                        <Route path="/projects" element={<ProjectsHub />} />
                        <Route path="/reports" element={<ReportCentre />} />
                        <Route path="/development" element={<DevelopmentHub />} />
                        <Route path="/properties" element={<PropertyHubEnhanced />} />
                        <Route path="/properties/:propertyId" element={<PropertyHub />} />
                        <Route path="/people" element={<PeopleHub />} />
                        <Route path="/referrals" element={<ReferralsHub />} />
                        <Route path="/voids" element={<VoidManagement />} />
                        <Route path="/repairs" element={<RepairsHub />} />
                        <Route path="/compliance" element={<ComplianceHub />} />
                        <Route path="/legal" element={<LegalHub />} />
                        <Route path="/finance" element={<FinancePage />} />
                        <Route path="/library" element={<Library />} />
                        <Route path="/address-book" element={<AddressBook />} />
                        <Route path="/settings" element={<DeveloperSettings />} />
                        <Route path="/settings/style-guide" element={<StyleGuide />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                    <MinimizedTray />
                </Layout>
            </ToastProvider>
        </PopOutProvider>
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
