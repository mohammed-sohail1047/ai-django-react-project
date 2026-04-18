import requests
from django.conf import settings

def get_openrouter_response(prompt):
    url = "https://openrouter.ai/api/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }

    data = {
    "model": "nvidia/nemotron-3-super-120b-a12b:free",
    "messages": [
        {
            "role": "system",
            "content": "You are a helpful assistant. Answer in maximum 10 bullet points."
        },
        {
            "role": "user",
            "content": prompt
        }
    ]
}

    try:
        response = requests.post(url, headers=headers, json=data)

        print("Status:", response.status_code)
        print("Response:", response.text)

        if response.status_code == 200:
            res_json = response.json()
            return res_json['choices'][0]['message']['content']
        else:
            return f"API Error: {response.text}"

    except Exception as e:
        return f"Exception: {str(e)}"