from rest_framework import serializers
from .models import AiTask

class AiTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = AiTask
        fields = '__all__'


