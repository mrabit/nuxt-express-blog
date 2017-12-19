export default function({ route, redirect }) {
    // 修改文章,无文章id需跳转到文章列表
    if (!/^\d+$/.test(route.params.id)) {
        return redirect('/admin/articleList');
    }
}