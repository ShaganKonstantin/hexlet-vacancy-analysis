from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('parser', '0002_hhvacancy_region_superjobvacancy_region'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='hhvacancy',
            name='area',
        ),
    ]
