from django.urls import path
from . import views

urlpatterns = [
    path('submit/', views.submit_feedback, name='submit_feedback'),
    path('view/', views.view_feedback, name='view_feedback'),
    path('add-service/', views.add_service, name='add_service'),
    path('categories/', views.get_categories, name='get_categories'),
    path('services/', views.get_services, name='get_services'),
    path('services/<int:service_id>/delete/', views.delete_service, name='delete_service'),
    path('can-give-feedback/', views.can_give_feedback, name='can_give_feedback'),
    path('recent-feedbacks/', views.recent_feedbacks, name='recent_feedbacks'),
    path('all-feedbacks/', views.all_feedbacks, name='all_feedbacks'),
    path('admin-feedback-settings/', views.admin_feedback_settings, name='admin_feedback_settings'),
]