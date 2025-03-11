from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils.crypto import get_random_string
from .models import Game, Guess
from .serializers import GameSerializer

class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

    @action(detail=True, methods=['post'])
    def make_guess(self, request, pk=None):
        game = self.get_object()
        if game.is_complete:
            return Response({"error": "This word was already guessed."}, status=status.HTTP_412_PRECONDITION_FAILED)
        elif game.attempts >=6:
            return Response({"error": f"Sorry, attempts no more available. Word is {game.word}"}, status=status.HTTP_412_PRECONDITION_FAILED)
        guess_word = request.data.get('guess_word', '').lower()

        if len(guess_word) != 5:
            return Response({"error": "Guess must be a 5-letter word."}, status=status.HTTP_400_BAD_REQUEST)

        feedback = self.get_feedback(game.word, guess_word)
        
        guess = Guess.objects.create(game=game, guess_word=guess_word, feedback=feedback)
        
        print('Game now is: ', game.attempts)
        game.attempts += 1
        if feedback == "GGGGG":
            game.is_complete = True
            
        game.save()

        return Response({'guess_word': guess_word, 'feedback': feedback, 'attempts': game.attempts})

    def get_feedback(self, word, guess):
        feedback = []
        for i in range(5):
            if guess[i] == word[i]:
                feedback.append('G')  # Correct letter, correct position
            elif guess[i] in word:
                feedback.append('Y')  # Correct letter, wrong position
            else:
                feedback.append('X')  # Incorrect letter
        return ''.join(feedback)
