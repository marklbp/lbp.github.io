export default function ({ store, error, redirect, req, route}) {
  //debugger
  let url = req && req.url || route && route.path;
  if (!store.state.authUser) {
		redirect("/login")
  }else if(url && url.indexOf('/login') > -1){
    redirect("/");
  }
}