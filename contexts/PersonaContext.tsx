import React, { createContext, useState, useMemo, useContext, ReactNode } from 'react';

export type Persona = 'default' | 'rp' | 'la' | 'nhs';

const terminology = {
    // Singular, lowercase
    person: { default: 'person we support', rp: 'tenant', la: 'client', nhs: 'patient' },
    care: { default: 'care', rp: 'support', la: 'service', nhs: 'care' },
    tenancy: { default: 'tenancy', rp: 'tenancy', la: 'placement', nhs: 'admission' },
    
    // Singular, capitalized
    person_singular_capitalized: { default: 'Person We Support', rp: 'Tenant', la: 'Client', nhs: 'Patient' },

    // Plural, lowercase
    people_plural_lowercase: { default: 'people we support', rp: 'tenants', la: 'clients', nhs: 'patients' },
    
    // Plural, capitalized
    people_plural_capitalized: { default: 'People', rp: 'Tenants', la: 'Clients', nhs: 'Patients' },
};


interface PersonaContextType {
  persona: Persona;
  setPersona: (persona: Persona) => void;
  t: (key: keyof typeof terminology) => string;
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

export const PersonaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [persona, setPersona] = useState<Persona>('default');

  const t = (key: keyof typeof terminology): string => {
    return terminology[key]?.[persona] || key;
  };

  const value = useMemo(() => ({ persona, setPersona, t }), [persona]);

  return (
    <PersonaContext.Provider value={value}>
      {children}
    </PersonaContext.Provider>
  );
};

export const usePersona = (): PersonaContextType => {
  const context = useContext(PersonaContext);
  if (context === undefined) {
    throw new Error('usePersona must be used within a PersonaProvider');
  }
  return context;
};
