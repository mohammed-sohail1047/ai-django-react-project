from django.urls import path
from .views import process_ai_task

urlpatterns = [
    path('process/', process_ai_task),
]