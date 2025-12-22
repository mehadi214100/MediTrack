from django.db import models
from django.core.exceptions import ValidationError
import datetime
from django.core.validators import MinValueValidator
class Category(models.Model):
    name = models.CharField(max_length=200,unique=True)
    description = models.TextField(blank=True,null=True)


    def __str__(self):
        return self.name

class Supplier(models.Model):
    name = models.CharField(max_length=200)
    contact_email = models.EmailField(max_length=100,blank=True)
    phone = models.CharField(max_length=15)
    icon = models.ImageField(upload_to="supplier/",blank=True)

    def __str__(self):
        return f'{self.name} - {self.contact_email} - {self.phone}'
    
class Medicine(models.Model):
    name = models.CharField(max_length=200)
    generic_name = models.CharField(max_length=300)
    category = models.ForeignKey(Category,related_name="medicines",on_delete=models.CASCADE)
    reorder_level = models.PositiveIntegerField()

    created_at = models.DateTimeField(auto_now_add= True)
    updated_at = models.DateTimeField(auto_now= True)

    def __str__(self):
        return f"{self.name} - {self.category}"

class Batch(models.Model):
    medicine = models.ForeignKey(Medicine,related_name="medicine_batches",on_delete=models.CASCADE)
    supplier = models.ForeignKey(Supplier,related_name="supplier_batches",on_delete=models.CASCADE) 
    batch_number = models.CharField(max_length=100,unique=True)
    buy_price = models.DecimalField(max_digits=10,decimal_places=3)
    mfg_date = models.DateField()
    exp_date  = models.DateField()
    invoice_no = models.CharField(max_length=50, blank=True)
    additional_note = models.TextField(blank=True)
    profit_percentage = models.IntegerField()
    current_quantity = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add= True)
    updated_at = models.DateTimeField(auto_now= True)

    def clean(self):
        if self.mfg_date and self.exp_date:
            if self.mfg_date > self.exp_date:
                raise ValidationError({'exp_date': "Expiry date cannot be before Manufacturing date!"})

        if self.exp_date < datetime.date.today():
            raise ValidationError({'exp_date': "Medicine is already expired!"})

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    @property
    def selling_price(self):
        profit = (self.buy_price * self.profit_percentage) / 100
        return self.buy_price + profit

    def __str__(self):
        return f"{self.medicine.name} - {self.supplier.name}"
    

CHOICES = [
    ('in','IN'),
    ('out','OUT'),
]

class Transaction(models.Model):
    batch = models.ForeignKey(Batch,related_name="transactions",on_delete=models.CASCADE)
    transaction_type = models.CharField(choices=CHOICES,max_length=5)
    quantity = models.IntegerField(validators=[MinValueValidator(1)])
    timestamp = models.DateTimeField(auto_now_add=True)
    remarks = models.TextField(blank=True)

    def save(self,*args, **kwargs):

        if not self.pk:

            if self.batch.exp_date < datetime.date.today():
                raise ValidationError("Cannot sell expired medicine!")

            if self.transaction_type == 'in':
                self.batch.current_quantity += self.quantity
            elif self.transaction_type == 'out':

                if self.batch.current_quantity>=self.quantity:
                    self.batch.current_quantity -= self.quantity
                else:
                    raise ValidationError(f"Stock not available! Current stock: {self.batch.current_quantity}")

            self.batch.save()

        return super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.transaction_type.upper()} - {self.batch.medicine.name} ({self.quantity})"
    