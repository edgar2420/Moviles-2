import 'package:flutter/material.dart';
import 'package:practico4notaskeep/nota.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: NoteList(),
      theme: ThemeData(
        primarySwatch: Colors.amber,
      ),
    );
  }
}

class NoteList extends StatefulWidget {
  @override
  _NoteListState createState() => _NoteListState();
}

class _NoteListState extends State<NoteList> {
  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _contentController = TextEditingController();
  final TextEditingController _searchController = TextEditingController();
  final NotesDatabase _database = NotesDatabase();
  List<Note> _notes = [];
  List<Note> _searchedNotes = []; // Lista de notas buscadas
  Note? _editingNote; // Nota que se está editando
  Color? selectedColor; // Color seleccionado

  List<Color> noteColors = [
    Colors.white,
    Colors.red,
    Colors.blue,
    Colors.green,
    Colors.yellow,
    Colors.purple,
    Colors.orange,
    Colors.pink,
  ];

  bool _isSearching = false; // Indica si se está buscando

  @override
  void initState() {
    super.initState();
    _loadNotes();
  }

  // Cargar todas las notas
  Future<void> _loadNotes() async {
    final notes = await _database.getAllNotes();
    setState(() {
      _notes = notes;
    });
  }

  // Cambiar el color de la nota
  void _changeNoteColor(Color color) {
    setState(() {
      selectedColor = color;
    });
  }

  // Guardar la nota
  Future<void> _saveNote() async {
    final title = _titleController.text;
    final content = _contentController.text;
    // Si el título o el contenido no están vacíos
    if (title.isNotEmpty || content.isNotEmpty) {
      final note = Note(
        title: title,
        content: content,
        color:
            selectedColor != null ? selectedColor!.value : Colors.white.value,
      );
      // Si no se está editando una nota, insertar una nueva
      if (_editingNote == null) {
        await _database.insert(note);
        // Si se está editando una nota, actualizarla
      } else {
        note.id = _editingNote!.id;
        await _database.update(note);
      }
      // Limpiar los controladores y actualizar la lista de notas
      _titleController.clear();
      _contentController.clear();
      _editingNote = null;
      // Si se está buscando, actualizar la lista de notas buscadas
      if (_isSearching) {
        _searchNotes(_searchController.text);
        // Si no se está buscando, actualizar la lista de notas
      } else {
        _loadNotes();
      }
      selectedColor = null;
    }
    // Cerrar el diálogo
    Navigator.of(context).pop();
  }

  // Editar una nota
  Future<void> _editNote(Note note) async {
    _titleController.text = note.title;
    _contentController.text = note.content;
    // Si la nota tiene un color, seleccionarlo
    setState(() {
      // Guardar la nota que se está editando
      _editingNote = note;
      selectedColor = note.color != null ? Color(note.color) : Colors.white;
    });

    showDialog(
      // Mostrar el diálogo
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text('Editar Nota'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              TextField(
                controller: _titleController,
                decoration: InputDecoration(
                  hintText: 'Título',
                ),
              ),
              TextField(
                controller: _contentController,
                decoration: InputDecoration(
                  hintText: 'Añadir nota...',
                ),
              ),
              ElevatedButton(
                onPressed: () {
                  showDialog(
                    context: context,
                    builder: (context) {
                      return AlertDialog(
                        title: Text('Seleccionar color'),
                        content: SingleChildScrollView(
                          child: Column(
                            children: noteColors.map((color) {
                              return InkWell(
                                onTap: () {
                                  _changeNoteColor(color);
                                  Navigator.of(context).pop();
                                },
                                child: Container(
                                  width: 50,
                                  height: 50,
                                  color: color,
                                ),
                              );
                            }).toList(),
                          ),
                        ),
                      );
                    },
                  );
                },
                child: Icon(
                  Icons.palette,
                  color: Colors.white,
                ),
              ),
            ],
          ),
          actions: <Widget>[
            TextButton(
              onPressed: () {
                _saveNote();
              },
              child: Text('Guardar'),
            ),
          ],
        );
      },
    );
  }

  Future<void> _deleteNote(int id) async {
    await _database.delete(id);
    // Si se está buscando, actualizar la lista de notas buscadas
    if (_isSearching) {
      _searchNotes(_searchController.text);
      // Si no se está buscando, actualizar la lista de notas
    } else {
      _loadNotes();
    }
  }

  void _searchNotes(String query) async {
    // Si la consulta no está vacía, buscar notas
    final searchedNotes = await _database.searchNotes(query);
    setState(() {
      _searchedNotes = searchedNotes;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: _isSearching
            ? TextField(
                controller: _searchController,
                onChanged: (query) {
                  _searchNotes(query);
                },
                decoration: InputDecoration(
                  hintText: 'Buscar notas...',
                  icon: Icon(Icons.search),
                ),
              )
            : Text('Bloc de Notas Practico4'),
        actions: [
          IconButton(
            icon: _isSearching ? Icon(Icons.cancel) : Icon(Icons.search),
            onPressed: () {
              setState(() {
                _isSearching = !_isSearching;
                if (!_isSearching) {
                  _searchController.clear();
                  _searchedNotes.clear();
                  _loadNotes(); // Cargar todas las notas cuando se cancela la búsqueda
                }
              });
            },
          ),
        ],
      ),
      body: GridView.builder(
        gridDelegate: SliverGridDelegateWithMaxCrossAxisExtent(
          maxCrossAxisExtent: 200.0,
        ),
        itemCount: _isSearching ? _searchedNotes.length : _notes.length,
        itemBuilder: (context, index) {
          final note = _isSearching ? _searchedNotes[index] : _notes[index];
          return GestureDetector(
            onTap: () {
              _editNote(note);
            },
            child: Card(
              color: Color(note.color),
              elevation: 2,
              child: Stack(
                children: [
                  Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        note.title,
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      Text(note.content),
                    ],
                  ),
                  Positioned(
                    top: 0,
                    right: 0,
                    child: IconButton(
                      icon: Icon(Icons.delete),
                      color: const Color.fromARGB(255, 0, 0, 0),
                      onPressed: () {
                        _deleteNote(note.id!);
                      },
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          _titleController.clear();
          _contentController.clear();
          _editingNote = null;

          showDialog(
            context: context,
            builder: (context) {
              return AlertDialog(
                title: Text('Nueva Nota'),
                content: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: <Widget>[
                    TextField(
                      controller: _titleController,
                      decoration: InputDecoration(
                        hintText: 'Título',
                      ),
                    ),
                    TextField(
                      controller: _contentController,
                      decoration: InputDecoration(
                        hintText: 'Añadir nota...',
                      ),
                    ),
                    ElevatedButton(
                      onPressed: () {
                        showDialog(
                          context: context,
                          builder: (context) {
                            return AlertDialog(
                              title: Text('Seleccionar color'),
                              content: SingleChildScrollView(
                                child: Column(
                                  children: noteColors.map((color) {
                                    return InkWell(
                                      onTap: () {
                                        _changeNoteColor(color);
                                        Navigator.of(context).pop();
                                      },
                                      child: Container(
                                        width: 50,
                                        height: 50,
                                        color: color,
                                      ),
                                    );
                                  }).toList(),
                                ),
                              ),
                            );
                          },
                        );
                      },
                      child: Icon(
                        Icons.palette,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
                actions: <Widget>[
                  TextButton(
                    onPressed: () {
                      _saveNote();
                    },
                    child: Text('Guardar'),
                  ),
                ],
              );
            },
          );
        },
        child: Icon(Icons.add),
      ),
    );
  }
}
