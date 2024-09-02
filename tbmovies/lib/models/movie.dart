class Movie {
  final int id;
  final String title;
  final String overview;
  final String posterPath;
  final String posterUrl;
  final String backdropPath;
  final String backdropUrl;
  final String releaseDate;
  String _director;
  List<String> _genres;
  List<String> _cast;
  int duration = 0;
  double userRating = 0.0;

  Movie({
    required this.id,
    required this.title,
    required this.overview,
    required this.posterPath,
    required this.backdropPath,
    required this.releaseDate,
    required String director,
    required List<String> genres,
    required List<String> cast,
  })  : _director = director,
        _genres = genres,
        _cast = cast,
        posterUrl = 'https://image.tmdb.org/t/p/w500$posterPath',
        backdropUrl = 'https://image.tmdb.org/t/p/w1280$backdropPath';

  String get director => _director;

  set director(String value) {
    _director = value;
  }

  List<String> get genres => _genres;

  set genres(List<String> value) {
    _genres = value;
  }

  List<String> get cast => _cast;

  set cast(List<String> value) {
    _cast = value;
  }

  String get userRatingPercentage {
    int maxRating = 10;
    int percentage = (userRating / maxRating * 100).round();
    return '$percentage%';
  }

  factory Movie.fromJson(Map<String, dynamic> json) {
    return Movie(
      id: json['id'],
      title: json['title'],
      overview: json['overview'],
      posterPath: json['poster_path'] ?? '',
      backdropPath: json['backdrop_path'] ?? '',
      releaseDate: json['release_date'] ?? '',
      director: json['director'] ?? '',
      genres: (json['genres'] != null && json['genres'] is List)
          ? (json['genres'] as List)
              .map((genre) => genre['name'].toString())
              .toList()
          : [],
      cast: json['cast'] != null && json['cast'] is List
          ? (json['cast'] as List)
              .map((person) => person['name'].toString())
              .toList()
          : [],
    )..userRating =
        json['vote_average'] != null ? (json['vote_average'] as double) : 0.0;
  }
}
