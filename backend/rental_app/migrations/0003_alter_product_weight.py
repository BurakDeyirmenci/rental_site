# Generated by Django 4.2.13 on 2024-05-24 05:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rental_app', '0002_brand_category_productmodel_product_weight_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='weight',
            field=models.DecimalField(decimal_places=2, default=1, max_digits=10),
        ),
    ]
