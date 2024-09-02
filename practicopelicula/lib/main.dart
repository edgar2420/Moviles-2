import 'package:flutter/material.dart';
import 'package:practicopelicula/models/movie_detalle.dart';
import 'models/movie.dart';
import 'service/servicio.dart';

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
        '/detallePelicula': (context) => MovieDetailPage(),
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

  void _loadMovies({String query = '', bool loadPopular = true}) async {
    try {
      final movieData =
          await _servicio.fetchMovies(query: query, loadPopular: loadPopular);
      setState(() {
        movies = movieData.take(20).toList();
      });
    } catch (e) {
      print('Error al cargar las películas: $e');
    }
  }

  void _searchMovies(String query) {
    if (query.isNotEmpty) {
      _loadMovies(query: query, loadPopular: false);
    } else {
      _loadMovies(loadPopular: true);
    }
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
        backgroundColor: Color(0xFF032541), // Color de fondo personalizado
        title: Row(
          children: [
            Icon(Icons.search,
                color: Colors.white), // Ícono de búsqueda personalizado
            SizedBox(width: 8), // Espacio entre el ícono y el campo de búsqueda
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
          ],
        ),
      ),
      body: ListView.builder(
        itemCount: movies.length,
        itemBuilder: (context, index) {
          final movie = movies[index];
          return GestureDetector(
            onTap: () {
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
                        image: NetworkImage(
                            'https://image.tmdb.org/t/p/w500${movie.posterPath}'),
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
                                fontSize: 18, fontWeight: FontWeight.bold),
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
