from django.db import models
from django.utils.timezone import now, timedelta
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    id = models.AutoField(primary_key=True, auto_created=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    role = models.CharField(max_length=20, choices=[('admin', 'Admin'), ('cooperative', 'Cooperative'), ('farmer', 'Farmer')])
    number_of_farmers = models.IntegerField(null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    active_services = models.JSONField(default=list, blank=True, null=True)

class RegistrationKey(models.Model):
    key = models.CharField(max_length=20, unique=True)
    for_role = models.CharField(max_length=20, choices=[('cooperative', 'Cooperative'), ('farmer', 'Farmer')])
    created_at = models.DateTimeField(auto_now_add=True)
    created_by_role = models.CharField(max_length=20, blank=True)
    created_by_name = models.CharField(max_length=150, null=True, blank=True)
    name = models.CharField(max_length=150, null=True, blank=True)
    number_of_farmers = models.IntegerField(null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    pc = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='pc_id')
    def is_valid(self):
        return now() < self.created_at + timedelta(days=1)