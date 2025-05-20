from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Service(models.Model):
    name = models.CharField(max_length=100)  # Service name
    description = models.TextField(blank=True, null=True)  # Optional description
    category = models.CharField(max_length=50, blank=True, null=True)  # Optional category
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp for creation

    def __str__(self):
        return self.name


class Feedback(models.Model):
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='feedbacks')
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='feedbacks', default=1)
    message = models.TextField()
    rating = models.IntegerField(default=5)  # New field
    sentiment = models.CharField(max_length=10, choices=[('positive', 'Positive'), ('neutral', 'Neutral'), ('negative', 'Negative')], default='neutral')
    sentiment_label_1 = models.CharField(max_length=50, blank=True, null=True)  # New field
    sentiment_label_2 = models.CharField(max_length=50, blank=True, null=True)  # New field
    message_in_english = models.TextField(blank=True, null=True)  # New field
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer.username} - {self.service.name} - {self.sentiment}"