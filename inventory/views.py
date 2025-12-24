from django.shortcuts import render
from .models import Category,Medicine,Batch,Supplier,Transaction
from django.http import JsonResponse
from django.db.models import Count
from django.utils import timezone
from django.utils.timesince import timesince


def dashboard(request):
    return render(request,'index.html')

def stock_in(request):
    medichines = Medicine.objects.all()
    suppliers = Supplier.objects.all()
    transactions = Transaction.objects.select_related('batch__medicine').all().order_by('-timestamp')
    context = {
        "medichines":medichines,
        "suppliers":suppliers,
        'transactions':transactions,
    }
    return render(request,'stock_in.html',context)

def dispense(request):
    return render(request,'dispense.html')

def reports(request):
    return render(request,'reports.html')

def inventory(request):
    categories = Category.objects.annotate(
        medichine_count = Count('medicines')
    )

    suppliers = Supplier.objects.all()

    context = {
        "categories":categories,
        "suppliers":suppliers,
    }

    return render(request,'inventory.html',context)


def add_category(request):
    if request.method=='POST':
        catid = request.POST.get('catid')
        name = request.POST.get('name')
        description = request.POST.get('description')

        if catid:
            cat = Category.objects.get(id=catid)
            cat.name = name
            cat.description = description
            cat.save()
        else:
            Category.objects.create(
                name=name,
                description=description
            )

        categories = list(Category.objects.annotate(
            medicine_count=Count('medicines')
        ).values(
            'id', 'name', 'medicine_count'
        ))

        

        return JsonResponse({'status':'save','categories':categories})
    

def delete_category(request):

    if request.method=='POST':
        id = request.POST.get('catid')
        cat = Category.objects.get(id=id)
        cat.delete()
        categories = list(Category.objects.values())

        return JsonResponse({"status":1,"categories":categories})
    else:
        return JsonResponse({"status":0})

def edit_category(request):

    if request.method=='POST':
        id = request.POST.get('catid')
        cat = Category.objects.get(id=id)
        
        data = {
            'id':cat.id,
            'name':cat.name,
            'description':cat.description,
        }

        return JsonResponse(data)

def add_supplier(request):
    if request.method=='POST':
        supid = request.POST.get('supid')
        name = request.POST.get('name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')

        if supid:
            sup = Supplier.objects.get(id=supid)
            sup.name = name
            sup.contact_email = email
            sup.phone = phone
            sup.save()
        else:
            Supplier.objects.create(
                name = name,
                contact_email = email,
                phone = phone
            )

        suppliers = list(Supplier.objects.values())

        print(suppliers)
        

        return JsonResponse({'status':'save','suppliers':suppliers})
    

def delete_supplier(request):

    if request.method=='POST':
        id = request.POST.get('supid')
        sup = Supplier.objects.get(id=id)
        sup.delete()
        return JsonResponse({"status":1})
    else:
        return JsonResponse({"status":0})


def edit_supplier(request):


    if request.method=='POST':
        supid = request.POST.get('supid')
        cat = Supplier.objects.get(id=supid)
        
        data = {
            'id':cat.id,
            'name':cat.name,
            'email':cat.contact_email,
            'phone':cat.phone,
        }

        return JsonResponse(data)
    

def add_medichine(request):
    if(request.method == 'POST'):
        medicineName = request.POST.get('medicineName')
        medicineGeneric = request.POST.get('medicineGeneric')
        medicineReorder = request.POST.get('medicineReorder')
        medicineCategory = request.POST.get('medicineCategory')

        cat = Category.objects.get(id=medicineCategory)
        Medicine.objects.create(
            name = medicineName,
            generic_name = medicineGeneric,
            category = cat,
            reorder_level = medicineReorder

        )
       
        categories = list(Category.objects.annotate(
            medicine_count=Count('medicines')
        ).values(
            'id', 'name', 'medicine_count'
        ))
        return JsonResponse({"status":"save","categories":categories})
    else:
        return JsonResponse({"status":"failed"})
    

def generate_batch_number(request):
    medichine_id = request.GET.get('medicine_id')

    if medichine_id:
        try:
            medichine = Medicine.objects.get(id=medichine_id)

            words = medichine.name.split()
            initials = "".join([word[0] for word in words])
            current_year = timezone.now().year

            current_batch_id = Batch.objects.filter(
                medicine = medichine,
                created_at__year = current_year
            ).count()

            next_serial = str(current_batch_id + 1)
            batch_number = f"{initials}-{current_year}-{next_serial}"


            return JsonResponse({'batch_number': batch_number, 'status': 'success'})
        
        except Medicine.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Medicine not found'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request'})


def save_batch(request):
    if request.method=="POST":
        
        medicineId = request.POST.get('medicineId')
        supplierId = request.POST.get('supplierId')
        batch_number = request.POST.get('batchId')
        buy_price = float(request.POST.get('buyingPrice'))
        mfg_date = request.POST.get('mfgDate')
        exp_date  = request.POST.get('expDate')
        invoice_no = request.POST.get('invoiceNumber')
        additional_note = request.POST.get('additionalNote')
        profit_percentage = int(request.POST.get('profitPercentage'))
        quantity = int(request.POST.get('quantity'))
        
        
        medicine = Medicine.objects.get(id=medicineId)
        supplier = Supplier.objects.get(id=supplierId)
        

        batch = Batch.objects.create(
            medicine=medicine,
            supplier=supplier,
            batch_number=batch_number,
            buy_price=buy_price,
            mfg_date=mfg_date,
            exp_date=exp_date,
            invoice_no=invoice_no,
            additional_note=additional_note,
            profit_percentage=profit_percentage,
        )

        Transaction.objects.create(
            batch = batch,
            transaction_type = 'in',
            quantity = quantity
        )
        new_data = {
                "batch_number": batch.batch_number,
                "medicine_name": medicine.generic_name, 
                "quantity": quantity,
                "time": "Just now"
            }

        return JsonResponse({"status":"save","new_transactions":new_data})
    else:
        print("Not Received")
