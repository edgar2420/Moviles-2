import 'dart:convert';
import 'package:http/http.dart' as http;
import '/models/movie.dart';

class Servicio {
  static const String apiKey = '4c0b02eee0e931b2a7fa943e741451d9';
  static const String baseUrl = 'https://api.themoviedb.org/3/search/movie';
  static const String popularUrl = 'https://api.themoviedb.org/3/movie/popular';

  Future<List<Movie>> fetchMovies(
      {String query = '', bool loadPopular = false}) async {
    final String url = loadPopular
        ? '$popularUrl?api_key=$apiKey&language=en-US&page=1'
        : '$baseUrl?api_key=$apiKey&language=en-US&page=1&query=$query';
    final response = await http.get(
      Uri.parse(url),
    );
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      List<Movie> movies = (data['results'] as List)
          .map((item) => Movie(
                id: item['id'],
                title: item['title'],
                overview: item['overview'],
                posterPath: item['poster_path'],
              ))
          .toList();
      return movies;
    } else {
      throw Exception('Fallo al cargar las películas');
    }
  }
}
