from rest_framework import serializers
from .models import Feedback

class FeedbackSerializer(serializers.ModelSerializer):
    user_first_name = serializers.CharField(source='customer.first_name', default='—')
    cooperative = serializers.CharField(source='customer.last_name', default='—')
    service_name = serializers.CharField(source='service.name', default='—')
    category = serializers.CharField(source='service.category', default='—')
    customer = serializers.CharField(source='customer.first_name', default='—')

    class Meta:
        model = Feedback
        fields = [
            'user_first_name',
            'cooperative',
            'service_name',
            'category',
            'rating',
            'sentiment',
            'message_in_english',
            'message',
            'created_at',
            'customer',
            'summarized',
        ]