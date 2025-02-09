import { atom } from 'recoil';

interface EditingState {
    messageId: string;
    originalMessage: string;
}

export const messageEditingState = atom<EditingState | null>({
    key: 'messageEditingState',
    default: null,
});