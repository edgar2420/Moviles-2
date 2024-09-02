import 'package:flutter/material.dart';
import 'package:path/path.dart';
import 'package:prueba4/nota.dart';

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
  final NotesDatabase _database = NotesDatabase();
  List<Note> _notes = [];
  Note? _editingNote;
  Color? selectedColor;

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

  @override
  void initState() {
    super.initState();
    _loadNotes();
  }

  Future<void> _loadNotes() async {
    final notes = await _database.getAllNotes();
    setState(() {
      _notes = notes;
    });
  }

  void _changeNoteColor(Color color) {
    setState(() {
      selectedColor = color;
    });
  }

  Future<void> _saveNote() async {
    final title = _titleController.text;
    final content = _contentController.text;

    if (title.isNotEmpty || content.isNotEmpty) {
      final note = Note(
        title: title,
        content: content,
        color:
            selectedColor != null ? selectedColor!.value : Colors.white.value,
      );

      if (_editingNote == null) {
        await _database.insert(note);
      } else {
        note.id = _editingNote!.id;
        await _database.update(note);
      }

      _titleController.clear();
      _contentController.clear();
      _editingNote = null;
      _loadNotes();
      selectedColor = null;
    }
    Navigator.of(context as BuildContext).pop();
  }

  Future<void> _editNote(Note note) async {
    _titleController.text = note.title;
    _contentController.text = note.content;
    setState(() {
      _editingNote = note;
      selectedColor = note.color != null ? Color(note.color) : Colors.white;
    });

    onPressed:
    () {
      BuildContext outerContext =
          context as BuildContext; // Almacena el contexto aquí
      showDialog(
        context: outerContext, // Utiliza el contexto almacenado
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
    };
  }

  Context get newMethod => context;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Bloc de Notas Practico4'),
        actions: [
          IconButton(
            icon: Icon(Icons.search),
            onPressed: () {
              showSearch(
                context: context,
                delegate: NoteSearchDelegate(_notes),
              );
            },
          ),
        ],
      ),
      body: GridView.builder(
        gridDelegate: SliverGridDelegateWithMaxCrossAxisExtent(
          maxCrossAxisExtent: 200.0,
          crossAxisSpacing: 8.0,
          mainAxisSpacing: 8.0,
        ),
        itemCount: _notes.length,
        itemBuilder: (context, index) {
          final note = _notes[index];
          return GestureDetector(
            onTap: () {
              _editNote(note);
            },
            child: Card(
              color: Color(note.color),
              elevation: 2,
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      note.title,
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                    SizedBox(height: 8.0),
                    Text(note.content),
                  ],
                ),
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

class NoteSearchDelegate extends SearchDelegate<Note> {
  final List<Note> notes;

  NoteSearchDelegate(this.notes);

  @override
  List<Widget> buildActions(BuildContext context) {
    return [
      IconButton(
        icon: Icon(Icons.clear),
        onPressed: () {
          query = '';
        },
      ),
    ];
  }

  @override
  buildLeading(BuildContext context) {
    return IconButton(
      icon: Icon(Icons.arrow_back),
      onPressed: () {
        var result = null;
        close(context, result);
      },
    );
  }

  @override
  Widget buildResults(BuildContext context) {
    final results = notes.where((note) =>
        note.title.toLowerCase().contains(query.toLowerCase()) ||
        note.content.toLowerCase().contains(query.toLowerCase()));

    return GridView.builder(
      gridDelegate: SliverGridDelegateWithMaxCrossAxisExtent(
        maxCrossAxisExtent: 200.0,
        crossAxisSpacing: 8.0,
        mainAxisSpacing: 8.0,
      ),
      itemCount: results.length,
      itemBuilder: (context, index) {
        final note = results.elementAt(index);
        return GestureDetector(
          onTap: () {
            _editNoteFromSearch(note);
          },
          child: Card(
            color: Color(note.color),
            elevation: 2,
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    note.title,
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 8.0),
                  Text(note.content),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  @override
  Widget buildSuggestions(BuildContext context) {
    final suggestions = notes.where((note) =>
        note.title.toLowerCase().contains(query.toLowerCase()) ||
        note.content.toLowerCase().contains(query.toLowerCase()));

    return ListView.builder(
      itemCount: suggestions.length,
      itemBuilder: (context, index) {
        final note = suggestions.elementAt(index);
        return ListTile(
          title: Text(note.title),
          subtitle: Text(note.content),
          onTap: () {
            _editNoteFromSearch(note);
          },
        );
      },
    );
  }

  void _editNoteFromSearch(Note note) {
    // Open the edit note dialog with the selected note.
    close(context as BuildContext, note);
  }
}
