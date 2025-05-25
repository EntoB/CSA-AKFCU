from django.urls import path
from . import views

urlpatterns = [
    path('generate-registration-key/', views.generate_registration_key, name='generate_registaration_key'),
    path('register/', views.register_user, name='register_user'),
    path('login/', views.login_user, name='login_user'),
    path('set-status/', views.set_status, name='set_status'),
    path('delete-user/', views.delete_user, name='delete_user'),
    path('view-customers/', views.view_customers, name='view_customers'),
    path('view-admins/', views.view_admins, name='view_admins'),  
    path('users/', views.get_users, name='get_users'),
    path('coop-farmers/', views.get_coop_farmers, name='get_coop_farmers'),
    path('update-user-services/', views.update_user_services, name='update_user_services'),
    path('pcs/<int:pc_id>/update-farmers/', views.update_pc_farmers, name='update_pc_farmers'),
    path('pcs/<int:pc_id>/toggle-active/', views.toggle_pc_active, name='toggle_pc_active'),
    path('farmers/<int:farmer_id>/toggle-active/', views.toggle_farmer_active, name='toggle_farmer_active'),
    path('users/me/', views.get_current_user, name='get_current_user'),
    path('farmers/<int:farmer_id>/reset-password/', views.reset_password_registration_key, name='generate_reset_password_key'),
    path('reset-password/', views.reset_password, name='reset_password'),
]#add view admins and view customers
