
export default function (a) {
  if(process.env.NODE_ENV !== 'production')console.log("鉴权校验", a, a.store.state.isAuthenticated);
  if (!a.store.state.isAuthenticated && a.route.path.indexOf("/auth/sign-in") < 0) {
  	if(process.env.NODE_ENV !== 'production')console.log("未登录，请登录后访问 ")
    return a.app.router.replace('/auth/sign-in')
  }
}