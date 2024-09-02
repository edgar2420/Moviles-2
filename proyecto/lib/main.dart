import 'package:flutter/material.dart';
import 'package:proyecto/service/login.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  final AuthService _authService = AuthService();

  void _login() async {
    String email = _emailController.text;
    String password = _passwordController.text;

    // Perform login
    Map<String, dynamic> result = await _authService.loginUser(email, password);

    if (result['success']) {
      // Login successful, navigate to the next screen or perform any other action
      print(result['message']);
    } else {
      // Login failed, show an error message
      print(result['message']);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Proyecto Final Moviles'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Facebook-style logo or image can be added here
            TextField(
              controller: _emailController,
              decoration: InputDecoration(
                labelText: 'Correo',
                prefixIcon: Icon(Icons.email),
              ),
            ),
            TextField(
              controller: _passwordController,
              obscureText: true,
              decoration: InputDecoration(
                labelText: 'Contraseña',
                prefixIcon: Icon(Icons.lock),
              ),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: _login,
              child: Text('Iniciar Sesión'),
            ),
          ],
        ),
      ),
    );
  }
}

void main() {
  runApp(const MaterialApp(
    home: LoginScreen(),
  ));
}
