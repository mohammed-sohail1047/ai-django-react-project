from django.shortcuts import render

# Create your views here.


from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import AiTask
from .Serializers import AiTaskSerializer
from .services import get_openrouter_response

@api_view(['POST'])
def process_ai_task(request):
    prompt = request.data.get('prompt')

    if not prompt:
        return Response({"error": "Prompt is required"}, status=400)

    # Call AI
    response_text = get_openrouter_response(prompt)

    # Save to DB
    task = AiTask.objects.create(
        user_prompt=prompt,
        ai_response=response_text
    )

    serializer = AiTaskSerializer(task)
    return Response(serializer.data)

@api_view(['GET'])
def get_all_tasks(request):
    tasks = AiTask.objects.all().order_by('-created_at')
    serializer = AiTaskSerializer(tasks, many=True)
    return Response(serializer.data)