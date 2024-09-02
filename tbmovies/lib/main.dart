import 'dart:async';
import 'package:flutter/material.dart';
import 'package:tbmovies/models/movie.dart';
import 'package:tbmovies/models/movie_detalle.dart';
import 'package:tbmovies/service/servicio.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'PRACTICO PELICULAS',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => MyHomePage(),
        '/detallePelicula': (context) {
          final Movie movie =
              ModalRoute.of(context)!.settings.arguments as Movie;
          return MovieDetailPage(movie: movie);
        },
      },
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({Key? key});

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  final TextEditingController _searchController = TextEditingController();
  final Servicio _servicio = Servicio();
  List<Movie> movies = [];
  bool _isLoading = false;
  Timer? _debounceTimer;

  void _loadMovies({String query = '', bool loadPopular = true}) async {
    setState(() {
      _isLoading = true;
    });

    try {
      final movieData =
          await _servicio.fetchMovies(query: query, loadPopular: loadPopular);
      setState(() {
        movies = movieData.take(20).toList();
        _isLoading = false;
      });
    } catch (e) {
      print('Error al cargar las películas: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _searchMovies(String query) {
    if (_debounceTimer?.isActive ?? false) {
      _debounceTimer?.cancel();
    }

    _debounceTimer = Timer(const Duration(milliseconds: 100), () {
      if (query.isNotEmpty) {
        _loadMovies(query: query, loadPopular: false);
      } else {
        _loadMovies(loadPopular: true);
      }
    });
  }

  void _showSearchHistory() {
    Navigator.of(context)
        .push(MaterialPageRoute(builder: (context) => HistorialPage()));
  }

  @override
  void initState() {
    super.initState();
    _loadMovies();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Color(0xFF032541),
        title: Row(
          children: [
            Icon(Icons.search, color: Colors.white),
            SizedBox(width: 8),
            Expanded(
              child: TextField(
                controller: _searchController,
                style: TextStyle(color: Colors.white),
                decoration: InputDecoration(
                  hintText: 'Buscar películas',
                  hintStyle: TextStyle(color: Colors.white),
                  border: InputBorder.none,
                ),
                onChanged: (query) {
                  _searchMovies(query);
                },
                onSubmitted: (query) {
                  _searchMovies(query);
                },
              ),
            ),
            IconButton(
              icon: Icon(Icons.search),
              onPressed: () {
                _searchMovies(_searchController.text);
              },
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.history),
            onPressed: _showSearchHistory,
          ),
        ],
      ),
      body: _isLoading
          ? Center(
              child: CircularProgressIndicator(),
            )
          : ListView.builder(
              itemCount: movies.length,
              itemBuilder: (context, index) {
                final movie = movies[index];
                return GestureDetector(
                  onTap: () async {
                    await (movie);
                    Navigator.of(context)
                        .pushNamed('/detallePelicula', arguments: movie);
                  },
                  child: Card(
                    elevation: 5,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(15.0),
                    ),
                    margin: EdgeInsets.all(10),
                    child: Row(
                      children: [
                        Container(
                          width: 120,
                          height: 180,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(15.0),
                            image: DecorationImage(
                              image: NetworkImage(movie.posterUrl),
                              fit: BoxFit.cover,
                            ),
                          ),
                        ),
                        Expanded(
                          child: Padding(
                            padding: const EdgeInsets.all(10),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  movie.title,
                                  style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold),
                                ),
                                SizedBox(height: 8),
                                Text(
                                  movie.overview,
                                  style: TextStyle(fontSize: 16),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}

class HistorialPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Historial de Búsqueda'),
      ),
      body: Center(
        child: Text('Página de Historial'),
      ),
    );
  }
}
