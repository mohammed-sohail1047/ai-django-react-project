from django.urls import path
from .views import process_ai_task, get_all_tasks

urlpatterns = [
    path('process/', process_ai_task),
    path('tasks/', get_all_tasks),
]