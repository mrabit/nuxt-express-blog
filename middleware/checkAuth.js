export default function({
  route,
  store,
  redirect
}) {
  // 中间件可在服务端渲染时候就执行,在页面mounted前
  // 当前页面不为登录页并且vuex不存在登录信息,跳转到登录页
  if (!/^\/admin\/login(?:\/(?=$))?$/i.test(route.path) && !store.getters['admin/getTokenAuth']) {
    redirect('/admin/login?redirect=' + route.path);
  }
}
