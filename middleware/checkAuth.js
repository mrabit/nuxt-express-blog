import WebStorageCache from 'web-storage-cache';
export default function({
  store,
  redirect
}) {
  if (!store.getters['admin/getTokenAuth']) {
    redirect('/admin/login');
  }
}
