"""
Configuration des URLs pour Para-plus.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView
from django.http import JsonResponse

def health_check(request):
    """Endpoint de santé pour les services de monitoring"""
    return JsonResponse({'status': 'ok', 'service': 'para-plus-api'})

urlpatterns = [
    path('admin/', admin.site.urls),

    # Health check
    path('health/', health_check, name='health_check'),

    # API URLs
    path('api/auth/', include('apps.authentication.urls')),
    path('api/produits/', include('apps.produits.urls')),
    path('api/commandes/', include('apps.commandes.urls')),
    path('api/locations/', include('apps.locations.urls')),
    path('api/panier/', include('apps.panier.urls')),
    path('api/paiements/', include('apps.paiements.urls')),

    # JWT Token refresh
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# Servir les fichiers media en développement
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Configuration du site admin
admin.site.site_header = "Administration Para-plus.tn"
admin.site.site_title = "Para-plus Admin"
admin.site.index_title = "Gestion de la marketplace"
