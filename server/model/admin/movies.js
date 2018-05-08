const query = require('../db');

const Movies = params => {}

Movies.get_movies_lists = params => {
  params['start'] = (params.page - 1) * params.length;
  let sql = "select id,movie_name,movie_img,movie_url,watch_time from tp_movies";
  let map = [];
  if (params.movie_name) {
    map.push("`movie_name` LIKE '%" + params.movie_name + "%'");
  }
  if (params.startime && params.endtime) {
    map.push("( `watch_time` >= " + params.startime + " AND `watch_time` <= " + params.endtime + "  )");
  }
  let map_str = "";
  for (let i in map) {
    map_str += (map[i] + " AND ");
  }
  if (map.length) {
    sql += " WHERE ";
  }
  map_str = map_str.substring(0, map_str.length - (" AND ")
    .length);
  sql += (map_str + " ORDER BY id desc LIMIT ?,?");

  return new Promise((resolve, reject) => {
    query(sql, [params.start, params.length], (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    })
  })
}

Movies.get_movies_count = params => {
  let sql = 'SELECT count(*) as count from tp_movies';
  let map = [];
  if (params.movie_name) {
    map.push("`movie_name` LIKE '%" + params.movie_name + "%'");
  }
  if (params.startime) {
    map.push("`watch_time` >= " + params.startime);
  }
  if (params.endtime) {
    map.push("`watch_time` <= " + params.endtime);
  }
  let map_str = "";
  for (let i in map) {
    map_str += (map[i] + " AND ");
  }
  if (map.length) {
    sql += " WHERE ";
  }
  sql += (map_str.substring(0, map_str.length - (" AND ")
    .length));
  return new Promise((resolve, reject) => {
    query(sql, (err, result) => {
      if (err) reject(err.message);
      resolve(result[0]['count']);
    }, false)
  })
}

Movies.insert_movie = movies => {
  let sql = "INSERT INTO `tp_movies` (`movie_name`, `movie_img`, `watch_time`, `movie_url`) VALUES (?,?,?,?);";
  return new Promise((resolve, reject) => {
    let map = [
      movies.movie_name,
      movies.movie_img,
      movies.watch_time,
      movies.movie_url
    ]
    query(sql, map, (err, insert_id) => {
      if (err) reject(err.message);
      resolve(insert_id.insertId);
    });
  })
}

Movies.delete_movie_by_id = id => {
  let sql = "delete from tp_movies where id = " + id;
  return new Promise((resolve, reject) => {
    query(sql, (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    })
  })
}

Movies.get_movie_by_id = id => {
  let sql = 'SELECT * from tp_movies where id = ?';
  return new Promise((resolve, reject) => {
    query(sql, id, (err, result) => {
      if (err) reject(err.message);
      resolve(result[0]);
    })
  });
}

Movies.update_movie_by_id = params => {
  let sql = "update tp_movies set movie_name=?,movie_img=?,watch_time=?,movie_url=? where id=?";
  let map = [
    params.movie_name,
    params.movie_img,
    params.watch_time,
    params.movie_url,
    params.id
  ]
  return new Promise((resolve, reject) => {
    query(sql, map, (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    });
  })
}

module.exports = Movies;
