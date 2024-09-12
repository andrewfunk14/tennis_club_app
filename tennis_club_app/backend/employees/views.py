from django.http import HttpResponse

def employee_management_view(request):
    return HttpResponse("This is the employee management view.")

def employee_list_view(request):
    return HttpResponse("This is the list of employees.")
