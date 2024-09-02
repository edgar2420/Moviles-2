import 'package:flutter/material.dart';
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

class NotesDatabase {
  final String notesTable = "notes"; // Nombre de la tabla de notas
  static Database? _database; // Instancia de la base de datos

  Future<Database> get database async {
    // Verifica si la base de datos ya está abierta y, en ese caso, la devuelve.
    if (_database != null) return _database!;

    // Si la base de datos no está abierta, la abre y la inicializa.
    _database = await openDatabase(
      // Se especifica la ubicación de la base de datos en el dispositivo.
      join(await getDatabasesPath(), 'base_nota.db'),
      // La función onCreate se ejecuta la primera vez que se crea la base de datos.
      onCreate: (db, version) {
        db.execute(
          // Se ejecuta una sentencia SQL para crear la tabla de notas.
          "CREATE TABLE $notesTable(id INTEGER PRIMARY KEY, title TEXT, content TEXT, color INTEGER, isCheckbox INTEGER)",
        );
      },
      // Se especifica la versión de la base de datos.
      version: 1,
    );

    // Finalmente, se devuelve la instancia de la base de datos (ya abierta o recién creada).
    return _database!;
  }

  Future<void> insert(Note note) async {
    final db = await database;
    await db.insert(
        notesTable, note.toMap()); // Inserta una nota en la tabla de notas
  }

  Future<List<Note>> getAllNotes() async {
    final db = await database;
    final List<Map<String, dynamic>> maps =
        await db.query(notesTable); // Obtiene todas las notas de la tabla
    return List.generate(maps.length, (i) {
      return Note(
        id: maps[i]['id'],
        title: maps[i]['title'],
        content: maps[i]['content'],
        color: maps[i]['color'] ?? Colors.white.value,
        isCheckboxChecked: maps[i]['isCheckbox'] == 1,
      );
    });
  }

  Future<List<Note>> searchNotes(String searchTerm) async {
    final db = await database;
    final List<Map<String, dynamic>> maps = await db.query(
      notesTable,
      where: "title LIKE ? OR content LIKE ?",
      whereArgs: ['%$searchTerm%', '%$searchTerm%'],
    );

    return List.generate(maps.length, (i) {
      return Note(
        id: maps[i]['id'],
        title: maps[i]['title'],
        content: maps[i]['content'],
        color: maps[i]['color'] ?? Colors.white.value,
        isCheckboxChecked: maps[i]['isCheckbox'] == 1,
      );
    });
  }

  Future<void> update(Note note) async {
    final db = await database;
    await db.update(
      notesTable,
      note.toMap(),
      where: "id = ?",
      whereArgs: [note.id],
    ); // Actualiza una nota en la tabla de notas
  }

  Future<void> delete(int id) async {
    final db = await database;
    await db.delete(
      notesTable,
      where: "id = ?",
      whereArgs: [id],
    ); // Elimina una nota de la tabla de notas
  }
}

class Note {
  int? id;
  final String title;
  final String content;
  int color;
  bool isCheckboxChecked;

  Note({
    this.id,
    required this.title,
    required this.content,
    this.color = 0xFFFFFFFF,
    this.isCheckboxChecked = false,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'title': title,
      'content': content,
      'color': color,
      'isCheckbox': isCheckboxChecked ? 1 : 0,
    };
  }
}
