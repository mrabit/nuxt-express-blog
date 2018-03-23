import WebStorageCache from 'web-storage-cache';
export default function({
    isServer,
    route,
    store,
    redirect
}) {
    debugger;
    if (!isServer) {
        let reg = /\/admin\/login*/;
            // 是否是后台登录页面
        let isLogin = reg.test(route.path);
        let wsCache = new WebStorageCache();
        let token = wsCache.get('token');
        if (!token && !isLogin) window.location.href = '/admin/login'
        else return
    } else return
}