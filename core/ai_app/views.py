from django.shortcuts import render
from django.core.cache import cache
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.pagination import CursorPagination
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from .models import AiTask
from .Serializers import AiTaskSerializer
from .services import get_openrouter_response
import hashlib

class TaskCursorPagination(CursorPagination):
    page_size = 10
    ordering = '-created_at'

@api_view(['POST'])
def process_ai_task(request):
    prompt = request.data.get('prompt')

    if not prompt:
        return Response({"error": "Prompt is required"}, status=400)

    # Fast Cache Lookup (Generate MD5 hash for the cache key)
    prompt_hash = hashlib.md5(prompt.encode('utf-8')).hexdigest()
    cache_key = f"ai_response_{prompt_hash}"
    cached_response = cache.get(cache_key)

    if cached_response:
        # Save to DB asynchronously if you like, but here we just return the cached result for blazing speed
        # Alternatively, we just return the cached data and recreate the log
        task = AiTask.objects.create(
            user_prompt=prompt,
            ai_response=cached_response + "\n\n*(Speed-boost: Served from cache)*"
        )
        serializer = AiTaskSerializer(task)
        return Response(serializer.data)

    # Call AI (if not cached)
    response_text = get_openrouter_response(prompt)

    # Save to Cache for 10 minutes (600 seconds)
    cache.set(cache_key, response_text, timeout=600)

    # Save to DB
    task = AiTask.objects.create(
        user_prompt=prompt,
        ai_response=response_text
    )

    serializer = AiTaskSerializer(task)
    return Response(serializer.data)

@api_view(['GET'])
def get_all_tasks(request):
    tasks = AiTask.objects.all()
    paginator = TaskCursorPagination()
    paginated_tasks = paginator.paginate_queryset(tasks, request)
    serializer = AiTaskSerializer(paginated_tasks, many=True)
    return paginator.get_paginated_response(serializer.data)