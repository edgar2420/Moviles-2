import 'package:flutter/material.dart';
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

class NotesDatabase {
  final String notesTable = "notes"; // Nombre de la tabla
  static Database? _database; // Instancia de la base de datos

  Future<Database> get database async {
    // Obtener la base de datos
    if (_database != null)
      return _database!; // Si ya existe, retornar la instancia

    _database = await openDatabase(
      // Si no existe, crearla
      join(await getDatabasesPath(),
          'base_nota.db'), // Nombre de la base de datos
      onCreate: (db, version) {
        // Crear la tabla
        db.execute(
          // Ejecutar la consulta
          "CREATE TABLE $notesTable(id INTEGER PRIMARY KEY, title TEXT, content TEXT, color INTEGER)",
        ); // Crear la tabla
      },
      version: 1, // Versión de la base de datos
    );

    return _database!; // Retornar la instancia
  }

  Future<void> insert(Note note) async {
    // Insertar una nota
    final db = await database;
    await db.insert(notesTable, note.toMap()); // Insertar la nota en la tabla
  }

  Future<List<Note>> getAllNotes() async {
    // Obtener todas las notas
    final db = await database;
    final List<Map<String, dynamic>> maps = await db.query(notesTable);
    return List.generate(maps.length, (i) {
      return Note(
        id: maps[i]['id'],
        title: maps[i]['title'],
        content: maps[i]['content'],
        color: maps[i]['color'] ?? Colors.white.value,
      );
    });
  }

  Future<void> update(Note note) async {
    // Actualizar una nota
    final db = await database;
    await db.update(
      notesTable,
      note.toMap(),
      where: "id = ?",
      whereArgs: [note.id],
    );
  }

  Future<void> delete(int id) async {
    final db = await database;
    await db.delete(
      notesTable,
      where: "id = ?",
      whereArgs: [id],
    );
  }

  Future<List<Note>> searchNotes(String query) async {
    // Buscar notas
    final db = await database;
    final List<Map<String, dynamic>> maps = await db.query(
      // Ejecutar la consulta
      notesTable,
      where: "title LIKE ? OR content LIKE ?",
      whereArgs: ["%$query%", "%$query%"],
    );
    return List.generate(maps.length, (i) {
      return Note(
        id: maps[i]['id'],
        title: maps[i]['title'],
        content: maps[i]['content'],
        color: maps[i]['color'] ?? Colors.white.value,
      );
    });
  }
}

class Note {
  int? id;
  final String title;
  final String content;
  int color;

  Note({
    this.id,
    required this.title,
    required this.content,
    this.color = 0xFFFFFFFF,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'title': title,
      'content': content,
      'color': color,
    };
  }
}
