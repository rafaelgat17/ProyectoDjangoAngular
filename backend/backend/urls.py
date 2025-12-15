"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/circuitos/', include('circuitos.urls')),
    path('api/auth/', include('usuarios.urls')),
]

# Si el usuario hace por ejemplo una peticion a api/circuitos/test, primeramente
# se redireccionara aqui y comprobara que efectivamente empieza por api/circuitos, la cual
# tiene un include que señala a el urls.py de la app circuitos, en donde acabara buscando por /test

