from rest_framework import serializers
from .models import Game, Guess

class GuessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guess
        fields = ['guess_word', 'feedback','game']

class GameSerializer(serializers.ModelSerializer):
    guesses = GuessSerializer(many=True, read_only=True)

    class Meta:
        model = Game
        fields = ['id', 'word', 'attempts', 'is_complete', 'guesses']