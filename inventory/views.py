from django.shortcuts import render
from .models import Category,Medicine,Batch,Supplier
from django.http import JsonResponse
from django.db.models import Count

def dashboard(request):
    return render(request,'index.html')

def stock_in(request):
    return render(request,'stock_in.html')

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
        return JsonResponse({"status":1})
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