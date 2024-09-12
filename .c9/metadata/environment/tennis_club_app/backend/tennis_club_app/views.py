{"filter":false,"title":"views.py","tooltip":"/tennis_club_app/backend/tennis_club_app/views.py","undoManager":{"mark":9,"position":9,"stack":[[{"start":{"row":0,"column":0},"end":{"row":4,"column":0},"action":"insert","lines":["from django.shortcuts import render","","def landing_page_view(request):","    return render(request, 'index.html')",""],"id":4}],[{"start":{"row":4,"column":0},"end":{"row":5,"column":0},"action":"insert","lines":["",""],"id":5}],[{"start":{"row":5,"column":0},"end":{"row":11,"column":0},"action":"insert","lines":["from django.shortcuts import render","from django.contrib.auth.decorators import login_required","","@login_required","def dashboard_view(request):","    return render(request, 'dashboard.html')",""],"id":6}],[{"start":{"row":5,"column":0},"end":{"row":6,"column":0},"action":"remove","lines":["from django.shortcuts import render",""],"id":7}],[{"start":{"row":3,"column":32},"end":{"row":3,"column":33},"action":"remove","lines":["x"],"id":9},{"start":{"row":3,"column":31},"end":{"row":3,"column":32},"action":"remove","lines":["e"]},{"start":{"row":3,"column":30},"end":{"row":3,"column":31},"action":"remove","lines":["d"]},{"start":{"row":3,"column":29},"end":{"row":3,"column":30},"action":"remove","lines":["n"]},{"start":{"row":3,"column":28},"end":{"row":3,"column":29},"action":"remove","lines":["i"]}],[{"start":{"row":3,"column":28},"end":{"row":3,"column":29},"action":"insert","lines":["l"],"id":10},{"start":{"row":3,"column":29},"end":{"row":3,"column":30},"action":"insert","lines":["a"]},{"start":{"row":3,"column":30},"end":{"row":3,"column":31},"action":"insert","lines":["n"]},{"start":{"row":3,"column":31},"end":{"row":3,"column":32},"action":"insert","lines":["d"]},{"start":{"row":3,"column":32},"end":{"row":3,"column":33},"action":"insert","lines":["i"]},{"start":{"row":3,"column":33},"end":{"row":3,"column":34},"action":"insert","lines":["n"]},{"start":{"row":3,"column":34},"end":{"row":3,"column":35},"action":"insert","lines":["g"]},{"start":{"row":3,"column":35},"end":{"row":3,"column":36},"action":"insert","lines":["_"]},{"start":{"row":3,"column":36},"end":{"row":3,"column":37},"action":"insert","lines":["p"]},{"start":{"row":3,"column":37},"end":{"row":3,"column":38},"action":"insert","lines":["a"]},{"start":{"row":3,"column":38},"end":{"row":3,"column":39},"action":"insert","lines":["g"]},{"start":{"row":3,"column":39},"end":{"row":3,"column":40},"action":"insert","lines":["e"]}],[{"start":{"row":10,"column":0},"end":{"row":11,"column":0},"action":"insert","lines":["",""],"id":11}],[{"start":{"row":10,"column":0},"end":{"row":11,"column":0},"action":"remove","lines":["",""],"id":12}],[{"start":{"row":10,"column":0},"end":{"row":16,"column":0},"action":"insert","lines":["from django.contrib.auth import logout","from django.shortcuts import redirect","","def custom_logout_view(request):","    logout(request)  # Log the user out","    return redirect('landing-page')  # Redirect to the landing page after logout",""],"id":13}],[{"start":{"row":10,"column":0},"end":{"row":11,"column":0},"action":"insert","lines":["",""],"id":14}]]},"ace":{"folds":[],"scrolltop":0,"scrollleft":0,"selection":{"start":{"row":0,"column":35},"end":{"row":0,"column":35},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":{"row":146,"mode":"ace/mode/python"}},"timestamp":1726037959347,"hash":"66d27dda6f2aea291e530fa36ab05ad354f0b9a4"}