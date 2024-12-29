import random
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# Mock data
mock_data = {
    "enroll": [
        {"id": 1, "select": "Rock"},
        {"id": 2, "select": "Scissors"}
    ],
    "history": [
        {"id": 1, "match": [{"me_id": 1}, {"me_select": "Rock"}, {"other_id": 2}, {"other_select": "Scissors"}]},
        {"id": 2, "match": [{"me_id": 2}, {"me_select": "Paper"}, {"other_id": 3}, {"other_select": "Rock"}]},
        {"id": 3, "match": [{"me_id": 2}, {"me_select": "Scissors"}, {"other_id": 1}, {"other_select": "Paper"}]},
    ]
}

# Helper functions
def find_by_id(data_list, user_id):
    return next((item for item in data_list if item["id"] == user_id), None)

def filter_by_user_id(data_list, user_id):
    return [item for item in data_list if any(d.get("me_id") == user_id or d.get("other_id") == user_id for d in item.get("match", []))]

# GET /api/enroll/{user_id}
def get_enroll(request, user_id):
    data = find_by_id(mock_data["enroll"], user_id)
    if data:
        return JsonResponse(data)
    return JsonResponse({}, status=200)

# POST /api/enroll
@csrf_exempt
def post_enroll(request):
    if request.method == "POST":
        try:
            body = json.loads(request.body)
            mock_data["enroll"].append(body)
            return JsonResponse({"message": "User enrolled successfully", "data": body}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=405)

# GET /api/match/{user_id}
def get_match(request, user_id):
    other_matches = [item for item in mock_data["enroll"] if item["id"] != user_id]
    if other_matches:
        random_match = random.choice(other_matches)
        return JsonResponse(random_match)
    return JsonResponse({"error": "No matches available"}, status=404)

# POST /api/match
@csrf_exempt
def post_match(request):
    if request.method == "POST":
        try:
            body = json.loads(request.body)
            mock_data["history"].append(body)
            return JsonResponse({"message": "Match created successfully", "data": body}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=405)

# GET /api/history/{user_id}
def get_history(request, user_id):
    filtered_history = filter_by_user_id(mock_data["history"], user_id)
    if filtered_history:
        return JsonResponse(filtered_history, safe=False)
    return JsonResponse({"error": "History not found"}, status=404)
