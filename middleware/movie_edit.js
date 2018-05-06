export default function({ route, redirect }) {
  // 修改观影记录,无电影id需跳转到观影记录列表
  if (!/^\d+$/.test(route.query.id)) {
    return redirect('/admin/moviesList');
  }
}
