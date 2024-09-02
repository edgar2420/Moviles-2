import 'dart:convert';
import 'package:http/http.dart' as http;
import '/models/movie.dart';

class Servicio {
  static const String apiKey = '4c0b02eee0e931b2a7fa943e741451d9';
  static const String baseUrl = 'https://api.themoviedb.org/3';
  static const String searchUrl = '$baseUrl/search/movie';
  static const String popularUrl = '$baseUrl/movie/popular';

  Future<List<Movie>> fetchMovies(
      {String query = '', bool loadPopular = false}) async {
    final String url = loadPopular
        ? '$popularUrl?api_key=$apiKey&language=en-US&page=1'
        : '$searchUrl?api_key=$apiKey&language=en-US&page=1&query=$query';
    final response = await http.get(Uri.parse(url));
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      if (data['results'] != null && data['results'] is List) {
        List<Movie> movies = (data['results'] as List)
            .map((item) => Movie.fromJson(item))
            .toList();
        for (var movie in movies) {
          final detailsResponse = await http.get(Uri.parse(
              '$baseUrl/movie/${movie.id}?api_key=$apiKey&language=en-US'));
          final creditsResponse = await http.get(Uri.parse(
              '$baseUrl/movie/${movie.id}/credits?api_key=$apiKey&language=en-US'));
          if (detailsResponse.statusCode == 200 &&
              creditsResponse.statusCode == 200) {
            final detailsData = json.decode(detailsResponse.body);
            final creditsData = json.decode(creditsResponse.body);
            // Obtener el nombre del director
            if (creditsData['crew'] != null && creditsData['crew'] is List) {
              var directorData = (creditsData['crew'] as List).firstWhere(
                  (crewMember) => crewMember['job'] == 'Director',
                  orElse: () => null);
              if (directorData != null) {
                movie.director = directorData['name'];
              }
            }
            // Obtener los géneros de la película
            if (detailsData['genres'] != null &&
                detailsData['genres'] is List) {
              List<String> genres = (detailsData['genres'] as List)
                  .map((genre) => genre['name'].toString())
                  .toList();
              movie.genres = genres;
            }
            // Obtener la lista de personas involucradas
            if (creditsData['cast'] != null && creditsData['cast'] is List) {
              List<String> cast = (creditsData['cast'] as List)
                  .map((person) => person['name'].toString())
                  .toList();
              movie.cast = cast;
            }
          }
        }
        return movies;
      } else {
        return [];
      }
    } else {
      throw Exception('Fallo al cargar las películas');
    }
  }
}
