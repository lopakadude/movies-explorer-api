const router = require('express').Router();
const celebrates = require('../middlewares/celebrates');
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', celebrates.createMovie, createMovie);
router.delete('/:movieId', celebrates.deleteMovie, deleteMovie);

module.exports = router;
