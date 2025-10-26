from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('parser', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='hhvacancy',
            name='region',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='superjobvacancy',
            name='region',
            field=models.CharField(max_length=100, null=True),
        ),
    ]
