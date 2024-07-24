const db = require("../db/connection");

async function list(is_showing) {
  return db("movies")
    .select("movies.*")
    .modify((queryBuilder) => {
      if (is_showing) {
        queryBuilder
          .join(
            "movies_theaters",
            "movies.movie_id",
            "movies_theaters.movie_id"
          )
          .where({ "movies_theaters.is_showing": true })
          .groupBy("movies.movie_id");
      }
    });
}

async function read(movie_id) {
  // TODO: Add your code here
  return db("movies").select("*").where({ movie_id }).first();
}

// async function listTheatersForMovie(movie_id) {
//   return db("movies")
//     .join("movies_theaters", "movies.movie_id", "movies_theaters.movie_id")
//     .join("theaters as t", "movies_theaters.theater_id", "theaters.theater_id")
//     .select("theaters.theater_id", "theaters.name")
//     .where({ "movies.movie_id": movie_id, "movies_theaters.is_showing": true });
// }

module.exports = {
  list,
  read,
  // listTheatersForMovie,
};
