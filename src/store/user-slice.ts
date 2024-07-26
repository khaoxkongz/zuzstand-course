import { StateCreator } from 'zustand'

type UserState = {
	fullName: string
	userName: string
	age: number
	address: string
}

type UserActions = {
	setAddress: (address: string) => void
	fetchUser: () => Promise<unknown>
}

export type UserSlice = UserState & UserActions

const initialState: UserState = {
	fullName: '',
	userName: '',
	age: 0,
	address: '',
}

export const createUserSlice: StateCreator<UserSlice, [['zustand/immer', never]], [], UserSlice> = (set) => ({
	...initialState,
	setAddress: (address) =>
		set((state) => {
			state.address = address
		}),
	fetchUser: async () => {
		await new Promise((resolve) => setTimeout(resolve, 1000))
		set({
			userName: 'khaoxkongz',
			fullName: 'Thanapat Makkwal',
			age: 23,
			address: 'Thailand',
		})
	},
})
