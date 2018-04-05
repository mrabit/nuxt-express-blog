import WebStorageCache from 'web-storage-cache';
export default function({
  route,
  store,
  redirect
}) {
  if (!/^\/admin\/login(?:\/(?=$))?$/i.test(route.path) && !store.getters['admin/getTokenAuth']) {
    redirect('/admin/login?redirect=' + route.path);
  }
}
