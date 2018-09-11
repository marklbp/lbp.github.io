import { setOwnerId, getOwnerId, extractInfoFromHash, getUserFromCookie } from './utils/utils'

export default function({ store, req, route, redirect }) {
	if(!store.state.isAuthenticated || req.url.indexOf('/auth/sign-in') < 0){
		redirect("/auth/sign-in")
	}
}
