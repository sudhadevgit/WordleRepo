from django.db import models

class Game(models.Model):
    word = models.CharField(max_length=5)  # Store the target word (could be fetched randomly)
    attempts = models.IntegerField(default=0)  # Number of attempts the player has made
    is_complete = models.BooleanField(default=False)

    # def __str__(self):
    #     return f"Game for {self.user.username}"

class Guess(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    guess_word = models.CharField(max_length=5)  # Player's guess
    feedback = models.CharField(max_length=5)  # Feedback, could be a string like 'YYYYG'
    created_at = models.DateTimeField(auto_now_add=True)

    # def __str__(self):
    #     return f"Guess for {self.game.user.username}"