import 'dart:convert';
import 'package:http/http.dart' as http;

class AuthService {
  final String loginUrl = "http://24.199.117.47/api/loginuser";
  final String registerUrl = "http://24.199.117.47/api/auth/registeruser";

  Future<Map<String, dynamic>> loginUser(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse(loginUrl),
        body: jsonEncode({
          "email": email,
          "password": password,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        // Inicio de sesión exitoso
        return {'success': true, 'message': 'Inicio de sesión exitoso'};
      } else {
        // Fallo en el inicio de sesión
        Map<String, dynamic> errorResponse = jsonDecode(response.body);
        return {'success': false, 'message': errorResponse['error']};
      }
    } catch (e) {
      // Manejar excepciones, como respuestas inesperadas
      print('Error durante el inicio de sesión: $e');
      print(
          'Cuerpo de la respuesta: ${e is http.Response ? e.body : 'No hay información adicional'}');
      print(
          'Código de estado de la respuesta: ${e is http.Response ? e.statusCode : 'No hay información adicional'}');
      return {
        'success': false,
        'message': 'Se produjo un error inesperado durante el inicio de sesión'
      };
    }
  }

  Future<Map<String, dynamic>> registerUser(
      String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse(registerUrl),
        body: jsonEncode({
          "email": email,
          "password": password,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 201) {
        // Registro exitoso
        return {'success': true, 'message': 'Registro exitoso'};
      } else {
        // Fallo en el registro
        Map<String, dynamic> errorResponse = jsonDecode(response.body);
        return {'success': false, 'message': errorResponse['error']};
      }
    } catch (e) {
      // Manejar excepciones, como respuestas inesperadas
      print('Error durante el registro: $e');
      print(
          'Cuerpo de la respuesta: ${e is http.Response ? e.body : 'No hay información adicional'}');
      print(
          'Código de estado de la respuesta: ${e is http.Response ? e.statusCode : 'No hay información adicional'}');
      return {
        'success': false,
        'message': 'Se produjo un error inesperado durante el registro'
      };
    }
  }
}
