from django.http import JsonResponse
from .helpers.utils import load_all_feedback, generate_recommendations_from_feedbacks
from feedback.models import Service



def all_feedbacks(request):
    """
    View that returns a list of dicts with summarized feedback and associated service name.
    """
    feedbacks = load_all_feedback()
    result = []
    # Optionally, cache service names to avoid repeated DB hits
    service_cache = {}

    for fb in feedbacks:
        service_id = fb.get('service_id')
        if service_id not in service_cache:
            try:
                service_cache[service_id] = Service.objects.get(id=service_id).name
            except Service.DoesNotExist:
                service_cache[service_id] = None
        result.append({
            "summarized": fb.get('summarized'),
            "service_name": service_cache[service_id]
        })

    return JsonResponse(result, safe=False)

import json
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

@csrf_exempt
@require_http_methods(["POST"])
def generate_recommendations(request):
    """
    Generates recommendations based on filtered summarized feedbacks and admin needs sent from the frontend.
    Expects POST data: { "summaries": [...], "admin_needs": "..." }
    """
    try:
        data = json.loads(request.body.decode("utf-8"))
        summaries = data.get("summaries", [])
        admin_needs = data.get("admin_needs", "general recommendations")
    except Exception:
        return JsonResponse({"recommendations": [], "message": "Invalid request data."}, safe=False)

    rec_result = generate_recommendations_from_feedbacks(summaries, admin_needs)
    # rec_result is a dict: {"recommendations": [...], "message": "..."}

    return JsonResponse(rec_result, safe=False)

import json
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from .models import SavedRecommendation

@csrf_exempt
@require_http_methods(["POST"])
def save_recommendations(request):
    try:
        data = json.loads(request.body.decode("utf-8"))
        recommendations = data.get("recommendations", [])
        filters = data.get("filters", {})
        SavedRecommendation.objects.create(
            recommendations=json.dumps(recommendations),
            filters=json.dumps(filters)
        )
        return JsonResponse({"message": "Recommendations and filters saved successfully."})
    except Exception as e:
        return JsonResponse({"message": f"Failed to save: {str(e)}"}, status=400)