import { Property, MaintenanceJob, IvolveStaff, PpmSchedule, MaintenanceStatus, ComplianceItem, Document } from '../types';

export const completeComplianceJob = (
    properties: Property[],
    ppmSchedules: PpmSchedule[],
    currentUser: IvolveStaff | null,
    jobId: string,
    newCertificateName: string
): Property[] => {
    let targetProperty: Property | undefined;
    let targetJob: MaintenanceJob | undefined;

    for (const p of properties) {
        const job = p.maintenanceJobs.find(j => j.id === jobId);
        if (job) {
            targetProperty = p;
            targetJob = job;
            break;
        }
    }

    if (!targetProperty || !targetJob || !targetJob.linkedComplianceId) {
        console.error("Could not find property or job for compliance completion.");
        return properties;
    }
    
    const propId = targetProperty.id;
    // Deep clone to avoid direct mutation
    const updatedProperty = JSON.parse(JSON.stringify(targetProperty));

    // 1. Update the Maintenance Job
    const jobIndex = updatedProperty.maintenanceJobs.findIndex((j: MaintenanceJob) => j.id === jobId);
    updatedProperty.maintenanceJobs[jobIndex].status = MaintenanceStatus.Completed;
    updatedProperty.maintenanceJobs[jobIndex].activityLog.push({
        date: new Date().toISOString(),
        actor: currentUser?.name || 'System',
        action: `Compliance certificate uploaded. Job completed.`
    });

    // 2. Update the linked Compliance Item
    const complianceIndex = updatedProperty.complianceItems.findIndex((c: ComplianceItem) => c.id === targetJob!.linkedComplianceId);
    if (complianceIndex > -1) {
        const complianceItem = updatedProperty.complianceItems[complianceIndex];
        complianceItem.lastCheck = new Date().toISOString().split('T')[0];
        const nextCheckDate = new Date();
        const frequency = ppmSchedules.find(p => p.complianceType === complianceItem.type)?.frequencyMonths || 12;
        nextCheckDate.setMonth(nextCheckDate.getMonth() + frequency);
        complianceItem.nextCheck = nextCheckDate.toISOString().split('T')[0];
        complianceItem.status = 'Compliant';
        complianceItem.reportUrl = `/docs/${newCertificateName}.pdf`;
    }

    // 3. Add the new certificate to the Documents list
    updatedProperty.documents.push({
        id: `doc-${Date.now()}`,
        name: newCertificateName,
        type: 'PDF',
        date: new Date().toISOString().split('T')[0],
        year: new Date().getFullYear(),
        url: `/docs/${newCertificateName}.pdf`,
        linkedJobRef: targetJob.ref,
    } as Document);

    // 4. Return the new array of properties
    return properties.map(p => p.id === propId ? updatedProperty : p);
};
