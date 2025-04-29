import { createContext, useContext } from 'react';
import { Ability } from './ability';

const AbilityContext = createContext<Ability | null>(null);

export const AbilityProvider: React.FC<{ ability: Ability; children: React.ReactNode }> = ({ ability, children }) => (
    <AbilityContext.Provider value={ability}>
        {children}
    </AbilityContext.Provider>
);

export const useAbility = () => {
    const ability = useContext(AbilityContext);
    if (!ability) {
        throw new Error('useAbility must be used within an AbilityProvider');
    }
    return ability;
};