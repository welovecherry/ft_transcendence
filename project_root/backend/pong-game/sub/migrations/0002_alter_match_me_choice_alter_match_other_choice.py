# Generated by Django 5.1.4 on 2025-01-06 04:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sub', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='match',
            name='me_choice',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='match',
            name='other_choice',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
    ]