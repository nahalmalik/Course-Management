# Generated by Django 5.2.1 on 2025-07-25 17:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='customuser',
            old_name='user_type',
            new_name='role',
        ),
        migrations.RemoveField(
            model_name='customuser',
            name='profile_image',
        ),
    ]
