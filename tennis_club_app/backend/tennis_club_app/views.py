from django.shortcuts import render

def landing_page_view(request):
    return render(request, 'landing_page.html')

from django.contrib.auth.decorators import login_required

@login_required
def dashboard_view(request):
    return render(request, 'dashboard.html')

from django.contrib.auth import logout
from django.shortcuts import redirect

def custom_logout_view(request):
    logout(request)  # Log the user out
    return redirect('landing-page')  # Redirect to the landing page after logout
