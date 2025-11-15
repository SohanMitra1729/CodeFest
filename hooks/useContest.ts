import { useContext } from 'react';
import { ContestContext } from '../contexts/ContestContext';
import { ContestContextType } from '../types';

export const useContest = (): ContestContextType => {
  const context = useContext(ContestContext);
  if (context === undefined) {
    throw new Error('useContest must be used within a ContestProvider');
  }
  return context;
};
