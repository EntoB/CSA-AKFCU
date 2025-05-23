from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Service(models.Model):
    name = models.CharField(max_length=100)  # Service name (default, e.g. English)
    name_am = models.CharField(max_length=100, blank=True, null=True)  # Amharic name
    name_or = models.CharField(max_length=100, blank=True, null=True)  # Oromic name
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Feedback(models.Model):
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='feedbacks')
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='feedbacks', default=1)
    message = models.TextField()
    rating = models.IntegerField(default=5)
    sentiment = models.CharField(max_length=10, choices=[('positive', 'Positive'), ('neutral', 'Neutral'), ('negative', 'Negative')], default='neutral')
    sentiment_label_1 = models.CharField(max_length=50, blank=True, null=True)
    sentiment_label_2 = models.CharField(max_length=50, blank=True, null=True)
    message_in_english = models.TextField(blank=True, null=True)
    specific_service = models.CharField(max_length=255, blank=True, null=True)  # New column
    summarized = models.TextField(blank=True, null=True)  # New column
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer.username} - {self.service.name} - {self.sentiment}"