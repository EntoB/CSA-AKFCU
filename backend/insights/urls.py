from django.urls import path
from . import views

urlpatterns = [
    path('all-feedbacks/', views.all_feedbacks, name='all_feedbacks'),
    path('recommendations/', views.generate_recommendations, name='generate_recommendations'),
    path('save-recommendations/', views.save_recommendations, name='save_recommendations'),
]