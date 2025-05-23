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

def generate_recommendations(request):
    """
    Generates recommendations for each service based on summarized feedbacks.
    Only non-empty summarized feedbacks are used.
    """
    feedbacks = load_all_feedback()
    service_feedbacks = {}
    service_cache = {}

    for fb in feedbacks:
        summarized = fb.get('summarized', '')
        if summarized is None or not summarized.strip():
            continue  # Skip empty or None summaries
        service_id = fb.get('service_id')
        if service_id not in service_feedbacks:
            service_feedbacks[service_id] = []
        service_feedbacks[service_id].append(summarized.strip())

    results = []
    for service_id, summaries in service_feedbacks.items():
        # Get service name (cache to avoid repeated DB hits)
        if service_id not in service_cache:
            try:
                service_cache[service_id] = Service.objects.get(id=service_id).name
            except Service.DoesNotExist:
                service_cache[service_id] = None
        service_name = service_cache[service_id]
        # Only call recommendations if service_name is not None
        if service_name:
            recommendations = generate_recommendations_from_feedbacks(summaries, service_name)
        else:
            recommendations = "No service name available."
        results.append({
            "service_id": service_id,
            "service_name": service_name,
            "recommendations": recommendations,
            "feedback_count": len(summaries)
        })

    return JsonResponse(results, safe=False)