from django.http import HttpResponse

def report_generate_view(request):
    return HttpResponse("This is the report generation view.")

def report_view(request):
    return HttpResponse("This is the report view.")
