class Movie {
  final int id;
  final String title;
  final String overview;
  final String posterPath;

  // Agrega una nueva propiedad para la URL del póster
  final String posterUrl;

  Movie({
    required this.id,
    required this.title,
    required this.overview,
    required this.posterPath,
  }) : posterUrl =
            'https://image.tmdb.org/t/p/w500$posterPath'; // URL completa del póster
}
