import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export enum UserFontUse {
	DARK = 'dark',
	LIGHT = 'light',
	AUTO = 'auto',
}

interface State {
	darkMode: boolean,
	userMode: UserFontUse,
	setMode: (dark: boolean)=> void,
	resetStore: ()=> void,
	setUserMode: (userMode: UserFontUse)=> void,
}

const initialState: Pick<State, 'darkMode' | 'userMode' > = {
	darkMode: false,
	userMode: UserFontUse.AUTO,
};

const useUserModeStore = create<State>()(persist(
	(set) => ({
		...initialState,
		setMode: (dark: boolean) => set(()=>{
			document.body.classList.toggle('dark', dark);
			return { darkMode: dark };
		}),
		setUserMode(userMode) {
			console.log(userMode);
			set({ userMode: userMode });
		},
		resetStore: () => set(() => {
			document.body.classList.remove('dark');
			return { darkMode: false };
		})
	}), {
		name: 'user-mode',
	},
));

if (useUserModeStore.getState().darkMode) {
	document.body.classList.add('dark');
}

export default useUserModeStore;
