{"filter":false,"title":"views.py","tooltip":"/tennis_club_app/backend/payments/views.py","undoManager":{"mark":0,"position":0,"stack":[[{"start":{"row":0,"column":0},"end":{"row":3,"column":0},"action":"remove","lines":["from django.shortcuts import render","","# Create your views here.",""],"id":2},{"start":{"row":0,"column":0},"end":{"row":7,"column":0},"action":"insert","lines":["from django.http import HttpResponse","","def payment_process_view(request):","    return HttpResponse(\"This is the payment processing view.\")","","def payment_history_view(request):","    return HttpResponse(\"This is the payment history view.\")",""]}]]},"ace":{"folds":[],"scrolltop":0,"scrollleft":0,"selection":{"start":{"row":7,"column":0},"end":{"row":7,"column":0},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":0},"timestamp":1726031999183,"hash":"f6f54cd1e33e26eef1aeab600c14e8da81a7098d"}