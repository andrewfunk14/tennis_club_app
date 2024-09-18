from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout

def landing_page_view(request):
    return render(request, 'landing_page.html')

@login_required
def dashboard_view(request):
    return render(request, 'dashboard.html')

def custom_logout_view(request):
    logout(request)  # Log the user out
    return redirect('landing_page')  # Corrected: Redirect to 'landing_page' (use underscore)
