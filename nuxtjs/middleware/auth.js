export default function ({ store, error, redirect }) {
  if (!store.state.authUser) {
		redirect("/")
  }
}