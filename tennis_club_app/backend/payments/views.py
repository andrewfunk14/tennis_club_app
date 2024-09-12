from django.http import HttpResponse

def payment_process_view(request):
    return HttpResponse("This is the payment processing view.")

def payment_history_view(request):
    return HttpResponse("This is the payment history view.")
