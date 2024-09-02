import 'package:flutter/material.dart';
import '/models/movie.dart';

class MovieDetailPage extends StatelessWidget {
  final Movie movie;

  const MovieDetailPage({Key? key, required this.movie}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          movie.title,
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.black,
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Imagen de fondo (imagen de portada)
          Container(
            height: 300,
            decoration: BoxDecoration(
              image: DecorationImage(
                image: NetworkImage(movie.backdropUrl),
                fit: BoxFit.cover,
              ),
            ),
          ),
          // Detalles de la película
          Expanded(
            child: SingleChildScrollView(
              padding: EdgeInsets.all(16),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Imagen principal
                  Container(
                    width: 100,
                    height: 150,
                    margin: EdgeInsets.only(right: 16),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(8),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.5),
                          blurRadius: 8,
                          offset: Offset(0, 4),
                        ),
                      ],
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Image.network(
                        movie.posterUrl,
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  // Detalles de la película
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // porcentaje de usuarios
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Porcentaje de usuarios:',
                              style: TextStyle(
                                  fontSize: 16, fontWeight: FontWeight.bold),
                            ),
                            SizedBox(
                              width: 100,
                              child: Stack(
                                alignment: Alignment.center,
                                children: [
                                  CircularProgressIndicator(
                                    value: movie.userRating /
                                        10, // Normaliza el valor entre 0 y 1
                                    strokeWidth: 10,
                                    backgroundColor: Colors.grey[300],
                                    valueColor: AlwaysStoppedAnimation<Color>(
                                        Color.fromARGB(255, 145, 40, 40)),
                                  ),
                                  Text(
                                    '${movie.userRatingPercentage}',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.black,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        // Director
                        Text(
                          'Director: ${movie.director}',
                          style: TextStyle(
                              fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        SizedBox(height: 8),
                        // Lista de personas involucradas
                        Text(
                          'Personas involucradas:',
                          style: TextStyle(
                              fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        SizedBox(height: 4),
                        Wrap(
                          spacing: 8,
                          children: (movie.cast != null &&
                                  movie.cast.isNotEmpty)
                              ? movie.cast
                                  .map((person) => Chip(label: Text(person)))
                                  .toList()
                              : [Text('Nombre de la persona')],
                        ),

                        SizedBox(height: 8),
                        // Sinopsis
                        Text(
                          'Sinopsis',
                          style: TextStyle(
                              fontSize: 20, fontWeight: FontWeight.bold),
                        ),
                        SizedBox(height: 4),
                        Text(
                          movie.overview,
                          style: TextStyle(fontSize: 16, color: Colors.grey),
                        ),
                        SizedBox(height: 8),
                        // Géneros
                        Text(
                          'Géneros',
                          style: TextStyle(
                              fontSize: 20, fontWeight: FontWeight.bold),
                        ),
                        SizedBox(height: 4),
                        Wrap(
                          spacing: 8,
                          children: movie.genres
                              .map((genre) => Chip(label: Text(genre)))
                              .toList(),
                        ),
                        SizedBox(height: 8),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
