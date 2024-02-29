# Generated by Django 5.0.1 on 2024-01-12 05:51

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Company",
            fields=[
                (
                    "Ccode",
                    models.IntegerField(default=0, primary_key=True, serialize=False),
                ),
                ("Pw", models.CharField(blank=True, max_length=30, null=True)),
                ("Call", models.CharField(blank=True, max_length=20, null=True)),
                ("Add", models.CharField(blank=True, max_length=50, null=True)),
                ("Cname", models.CharField(blank=True, max_length=15, null=True)),
            ],
            options={
                "db_table": "company",
            },
        ),
        migrations.CreateModel(
            name="Membership",
            fields=[
                (
                    "User",
                    models.CharField(max_length=20, primary_key=True, serialize=False),
                ),
                ("Pw", models.CharField(max_length=30)),
                ("Name", models.CharField(max_length=20)),
                ("Hp", models.CharField(blank=True, max_length=20, null=True)),
                ("Level", models.CharField(blank=True, max_length=10, null=True)),
                ("Count", models.IntegerField(default=0)),
                (
                    "Ccode",
                    models.ForeignKey(
                        db_column="Ccode",
                        on_delete=django.db.models.deletion.CASCADE,
                        to="solar_app.company",
                    ),
                ),
            ],
            options={
                "db_table": "membership",
            },
        ),
        migrations.CreateModel(
            name="Register",
            fields=[
                ("Bunho", models.AutoField(primary_key=True, serialize=False)),
                ("Add", models.CharField(blank=True, max_length=50, null=True)),
                ("Imgurl", models.CharField(blank=True, max_length=50, null=True)),
                ("Title", models.CharField(blank=True, max_length=50, null=True)),
                ("Time", models.DateTimeField(blank=True, null=True)),
                ("Workcode", models.CharField(blank=True, max_length=20, null=True)),
                (
                    "Ccode",
                    models.ForeignKey(
                        db_column="Ccode",
                        on_delete=django.db.models.deletion.CASCADE,
                        to="solar_app.company",
                    ),
                ),
                (
                    "User",
                    models.ForeignKey(
                        db_column="User",
                        on_delete=django.db.models.deletion.CASCADE,
                        to="solar_app.membership",
                    ),
                ),
            ],
            options={
                "db_table": "register",
            },
        ),
    ]