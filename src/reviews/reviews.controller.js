const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const methodNotAllowed = require("../errors/methodNotAllowed");
const { column } = require("../db/connection");

async function reviewExists(request, response, next) {
  // TODO: Write your code here
  // console.log(`request params: ${JSON.stringify(request.params)}`);

  const review = await service.read(request.params.reviewId);
  // console.log("review: ", review);

  if (review) {
    response.locals.review = review;
    return next();
  }

  next({
    status: 404,
    message: `Review cannot be found.`,
  });
}

async function destroy(request, response) {
  // TODO: Write your code here
  const { review } = response.locals;
  await service.destroy(review.review_id);
  response.sendStatus(204);
}

async function list(request, response) {
  // TODO: Write your code here
  const data = await service.list(request.params.movieId);
  // console.log("-----------------------");
  // console.log("reviews: ", data);
  response.json({ data });
}

function hasMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return next();
  }
  methodNotAllowed(request, response, next);
}

function noMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return methodNotAllowed(request, response, next);
  }
  next();
}

async function update(request, response) {
  // TODO: Write your code here
  // console.log("-----------------");
  // console.log("req.body.data: ", request.body.data);

  const updatedReview = {
    ...response.locals.review,
    ...request.body.data,
    review_id: response.locals.review.review_id,
  };
  // console.log("updatedReview: ", updatedReview);
  const data = await service.update(updatedReview);
  response.json({ data });
}

module.exports = {
  destroy: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(destroy),
  ],
  list: [hasMovieIdInPath, asyncErrorBoundary(list)],
  update: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(update),
  ],
};
