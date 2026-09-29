import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getDefaultCMSData, CMSData } from '../data/defaultCMSData';
import { fetchPublicContent } from '../services/api';

interface CMSContextType {
  cmsData: CMSData;
  isLoading: boolean;
  refreshPublicContent: () => Promise<void>;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export function CMSProvider({ children }: { children: ReactNode }) {
  const [cmsData, setCmsData] = useState<CMSData>(getDefaultCMSData());
  const [isLoading, setIsLoading] = useState(true);

  const loadContent = async () => {
    try {
      const data = await fetchPublicContent();
      if (data && data.settings) {
        setCmsData(prev => ({
          ...prev,
          ...data
        }));
      }
    } catch (err) {
      console.warn('Using local fallback CMS data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  return (
    <CMSContext.Provider
      value={{
        cmsData,
        isLoading,
        refreshPublicContent: loadContent
      }}
    >
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
}
