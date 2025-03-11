from django.db import models

class Game(models.Model):
    word = models.CharField(max_length=5)
    attempts = models.IntegerField(default=0)
    is_complete = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.word}-{self.attempts}"

class Guess(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    guess_word = models.CharField(max_length=5)
    feedback = models.CharField(max_length=5)
    created_at = models.DateTimeField(auto_now_add=True)