import 'dart:convert';
import 'package:http/http.dart' as http;
import 'models.dart';

class ApiService {
  static const String baseUrl = 'http://4.236.133.92:8010/quizzes'; 

  // Fetch all quizzes
  Future<List<Quiz>> getQuizzes() async {
    final response = await http.get(Uri.parse('$baseUrl/quizzes/'));
    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      return data.map((q) => Quiz.fromJson(q)).toList();
    } else {
      throw Exception('Failed to load quizzes');
    }
  }

  // Fetch a single quiz
  Future<Quiz> getQuiz(int quizId) async {
    final response = await http.get(Uri.parse('$baseUrl/quizzes/$quizId'));
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return Quiz.fromJson(data);
    } else {
      throw Exception('Failed to load quiz');
    }
  }

  Future<void> deleteQuiz(int id) async {
  final response = await http.delete(Uri.parse('$baseUrl/quizzes/$id'));
  if (response.statusCode != 200) {
    throw Exception('Failed to delete quiz');
  }
}


Future<bool> createQuiz(Map<String, dynamic> quizData) async {
  final response = await http.post(
    Uri.parse('$baseUrl/quizzes/'), // use baseUrl here
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode(quizData),
  );

  if (response.statusCode == 200 || response.statusCode == 201) {
    print("Quiz created successfully: ${response.body}");
    return true;
  } else {
    print("Failed to create quiz: ${response.statusCode} ${response.body}");
    return false;
  }
}



  // Submit quiz answers
  Future<Map<String, dynamic>> submitQuiz(
      int quizId, Map<int, String> answers) async {
    // Convert int keys to strings before sending
    final Map<String, String> stringAnswers =
        answers.map((key, value) => MapEntry(key.toString(), value));

    final url = Uri.parse('$baseUrl/quizzes/$quizId/submit');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'answers': stringAnswers}),
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to submit quiz: ${response.body}');
    }
  }
}
