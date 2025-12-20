from django.shortcuts import render

def dashboard(request):
    return render(request,'index.html')

def stock_in(request):
    return render(request,'stock_in.html')

def dispense(request):
    return render(request,'dispense.html')

def reports(request):
    return render(request,'reports.html')

def inventory(request):
    return render(request,'inventory.html')
