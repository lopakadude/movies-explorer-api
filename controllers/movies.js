const mongoose = require('mongoose');
const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const Movie = require('../models/movie');

module.exports.getMovies = (req, res, next) => {
  const owner = req.user;
  Movie.find({ owner })
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(err));
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  const owner = req.user;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.status(201).send({ data: movie }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequest(
          'Переданы некорректные данные при создании фильма.',
        ));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const userId = req.user._id;

  Movie.findById({ _id: movieId })
    .then((cardInfo) => {
      if (cardInfo) {
        if (cardInfo.owner._id.toString() === userId) {
          Movie.deleteOne({ _id: movieId })
            .then((card) => {
              if (card) {
                res.send({ data: movieId });
              }
            })
            .catch((err) => next(err));
        } else { next(new ForbiddenError('Отсутствие прав на удаление фильма.')); }
      } else {
        throw new NotFoundError('Фильм по указанному id не найден');
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequest('Некорректный формат id для данного фильма.'));
      } else {
        next(err);
      }
    });
};
