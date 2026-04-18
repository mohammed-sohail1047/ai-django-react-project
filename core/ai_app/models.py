from django.db import models

# Create your models here.

class AiTask(models.Model):
    user_prompt = models.TextField()
    ai_response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user_prompt