# Generated by Django 5.0.1 on 2024-01-12 07:09

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("solar_app", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="membership",
            name="Ccode",
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name="register",
            name="Ccode",
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name="register",
            name="User",
            field=models.CharField(max_length=20),
        ),
    ]
