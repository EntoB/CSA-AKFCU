from django.db import models

class SavedRecommendation(models.Model):
    recommendations = models.TextField()  # Store as JSON string
    filters = models.TextField(blank=True, null=True)  # Store filter as JSON string
    created_at = models.DateTimeField(auto_now_add=True)