# Generated by Django 5.1.7 on 2025-05-24 12:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('feedback', '0007_feedback_responses_remaining'),
    ]

    operations = [
        migrations.AlterField(
            model_name='feedback',
            name='responses_remaining',
            field=models.IntegerField(default=5),
        ),
    ]
