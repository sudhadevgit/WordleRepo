from rest_framework.test import APITestCase
from .models import Game, Guess
from .serializers import GuessSerializer, GameSerializer

class GuessSerializerTest(APITestCase):
    def setUp(self):
        self.game = Game.objects.create(word='HELLO', attempts=5, is_complete=False)
        self.guess = Guess.objects.create(guess_word='HELLO', feedback='correct', game=self.game)

    def test_guess_serializer_valid(self):
        serializer = GuessSerializer(self.guess)
        self.assertEqual(serializer.data['guess_word'], 'HELLO')
        self.assertEqual(serializer.data['feedback'], 'correct')
        self.assertEqual(serializer.data['game'], self.game.id)

    def test_guess_serializer_invalid(self):
        invalid_data = {'guess_word': '', 'feedback': '', 'game': None}
        serializer = GuessSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(len(serializer.errors), 3)

    def test_guess_serializer_create(self):
        data = {'guess_word': 'WORLD', 'feedback': 'incorrect', 'game': self.game.id}
        serializer = GuessSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        guess = serializer.save()
        self.assertEqual(guess.guess_word, 'WORLD')
        self.assertEqual(guess.feedback, 'incorrect')
        self.assertEqual(guess.game, self.game)