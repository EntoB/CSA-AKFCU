from django.shortcuts import render
from django.contrib.auth.decorators import user_passes_test
from django.http import JsonResponse
from .models import Feedback, Service
from accounts.helpers.utils import parse_json_request
from feedback.helpers.utils import analyze_sentiment, translate_text, generalize_feedback
from django.contrib.sessions.models import Session
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.utils import timezone
from datetime import timedelta
from django.views.decorators.http import require_GET
from feedback.helpers.utils import classify_sentiment_with_api
from accounts.models import User


@csrf_exempt
def submit_feedback(request):
    if request.method == 'POST':
        data, error = parse_json_request(request)
        if error:
            return error

        customer = request.user
        service_id = data.get('service_id')
        message = data.get('message')
        rating = data.get('rating', 5)
        specific_service = data.get('specific_service', '')

        # Always translate to English using autodetect
        translated = translate_text(message, "Autodetect")
        message_in_english = translated if translated else ""

        # Sentiment analysis should be on the English message
        sentiment = analyze_sentiment(message_in_english)

        # --- Call your custom sentiment API here ---
        sentiment_labels = classify_sentiment_with_api(message_in_english)
        sentiment_label_1 = ""
        sentiment_label_2 = ""
        if (
            sentiment_labels
            and sentiment_labels.get("status") == "success"
            and "predictions" in sentiment_labels
        ):
            sentiment_label_1 = sentiment_labels["predictions"]["custom_model"]["sentiment"]
            sentiment_label_2 = sentiment_labels["predictions"]["pretrained_model"]["sentiment"]

        try:
            service = Service.objects.get(id=service_id)
        except Service.DoesNotExist:
            return JsonResponse({'error': 'Service not found.'}, status=404)

        # --- Responses Remaining Logic ---
        last_feedback = (
            Feedback.objects
            .filter(customer=customer, service=service)
            .order_by('-created_at')
            .first()
        )
        if last_feedback:
            responses_remaining = max(last_feedback.responses_remaining - 1, 0)
        else:
            # Get admin's number_of_farmers or default to 5
            admin = User.objects.filter(is_superuser=True).first()
            responses_remaining = getattr(admin, 'number_of_farmers', 5)

        # Summarize feedback using Gemini/LLM
        summarized = generalize_feedback(message_in_english, service.name, service.category)
        if summarized == True:
            return JsonResponse({'error': 'Gemini generalization error'}, status=500)
        feedback = Feedback.objects.create(
            customer=customer,
            service=service,
            message=message,
            rating=rating,
            sentiment=sentiment,
            sentiment_label_1=sentiment_label_1,
            sentiment_label_2=sentiment_label_2,
            message_in_english=message_in_english,
            specific_service=specific_service,
            summarized=summarized,
            responses_remaining=responses_remaining,  # <-- set here
        )
        return JsonResponse({'message': 'Feedback submitted successfully', 'sentiment': sentiment, 'summary': summarized}, status=201)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


from .serializers import FeedbackSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view
@api_view(['GET'])
def all_feedbacks(request):
    feedbacks = Feedback.objects.all()
    serializer = FeedbackSerializer(feedbacks, many=True)
    return Response({'feedbacks': serializer.data})

# @user_passes_test(lambda u: u.role == 'superadmin')
def view_feedback(request):
    if request.method == 'GET':
        feedbacks = Feedback.objects.all()
        feedback_data = list(feedbacks.values('id', 'customer__username', 'message', 'sentiment', 'created_at'))
        return JsonResponse({'feedbacks': feedback_data}, status=200)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

# @user_passes_test(lambda u: u.is_superuser == 1,login_url='/')  # Restrict access to superadmins

# @csrf_exempt  # For local development; for production, use CSRF tokens properly
def add_service(request):
    user = request.user
    if user.is_superuser != 1:
        return JsonResponse({'error': 'Unauthorized access'}, status=403)

    if request.method == 'POST':
        data, error = parse_json_request(request)
        if error:
            return error
        name = data.get('name')
        name_am = data.get('name_am', '')
        name_or = data.get('name_or', '')
        description = data.get('description', '')
        category = data.get('category', '')

        if not name:
            return JsonResponse({'error': 'Service name is required'}, status=400)

        service = Service.objects.create(
            name=name,
            name_am=name_am,
            name_or=name_or,
            description=description,
            category=category
        )
        return JsonResponse({'message': 'Service added successfully', 'service_id': service.id}, status=201)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


from django.views.decorators.http import require_GET

@require_GET
def get_categories(request):
    # Get all unique, non-empty categories from Service
    categories = Service.objects.values_list('category', flat=True).distinct()
    categories = [cat for cat in categories if cat]  # Remove empty/null categories
    return JsonResponse({'categories': categories}, status=200)

from django.views.decorators.http import require_GET

@require_GET
def get_services(request):
    services = Service.objects.all()
    service_data = [
        {
            "id": service.id,
            "name": service.name,
            "description": service.description,
            "category": service.category,
        }
        for service in services
    ]
    return JsonResponse(service_data, safe=False)


from accounts.models import User
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def delete_service(request, service_id):
    if request.method == 'DELETE':
        try:
            service = Service.objects.get(id=service_id)
            # Fetch all users and remove service_id from active_services in Python
            users = User.objects.all()
            for user in users:
                if user.active_services and service_id in user.active_services:
                    user.active_services = [sid for sid in user.active_services if sid != service_id]
                    user.save()
            service.delete()
            return JsonResponse({'message': 'Service deleted successfully and removed from users.'})
        except Service.DoesNotExist:
            return JsonResponse({'error': 'Service not found.'}, status=404)
    return JsonResponse({'error': 'Invalid request method.'}, status=405)


from django.utils import timezone
from datetime import timedelta
from accounts.models import User

@require_GET
def can_give_feedback(request):
    user = request.user
    service_id = request.GET.get('service_id')
    if not service_id:
        return JsonResponse({'error': 'service_id is required'}, status=400)
    feedbacks = Feedback.objects.filter(customer=user, service_id=service_id).order_by('-created_at')
    if feedbacks.exists():
        last_feedback = feedbacks.first()
        # Check responses_remaining
        if hasattr(last_feedback, "responses_remaining") and last_feedback.responses_remaining == 0:
            return JsonResponse({'allowed': False, 'reason': 'You have no responses remaining for this service.'})
        # Check time since last feedback
        admin = User.objects.filter(is_superuser=True).first()
        try:
            # last_name is a string representing days (e.g., "2" for 2 days)
            wait_days = int(admin.last_name) if admin and admin.last_name and admin.last_name.isdigit() else 1
        except Exception:
            wait_days = 1
        wait_delta = timedelta(days=wait_days)
        time_since_last = timezone.now() - last_feedback.created_at
        if time_since_last < wait_delta:
            hours_left = int((wait_delta - time_since_last).total_seconds() // 3600) + 1
            return JsonResponse({
                'allowed': False,
                'reason': f'You must wait {wait_days} day(s) ({hours_left} hour(s) left) before submitting another feedback for this service.'
            })
        return JsonResponse({'allowed': True})
    else:
        # No feedback found, allow by default
        return JsonResponse({'allowed': True})
    

from django.views.decorators.http import require_GET

@require_GET
def recent_feedbacks(request):
    feedbacks = (
        Feedback.objects
        .select_related('customer', 'service')
        .order_by('-created_at')[:50]
    )
    feedback_data = [
        {
            'id': fb.id,
            'customer': fb.customer.username,
            'service': fb.service.name if fb.service else '',
            'message': fb.message,
            'sentiment': fb.sentiment,
            'created_at': fb.created_at.strftime('%Y-%m-%d %H:%M'),
        }
        for fb in feedbacks
    ]
    return JsonResponse({'feedbacks': feedback_data}, status=200)




from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

@csrf_exempt
@require_http_methods(["GET", "POST"])
def admin_feedback_settings(request):
    admins = User.objects.filter(is_superuser=True)
    if not admins.exists():
        return JsonResponse({'error': 'Admin user not found.'}, status=404)

    if request.method == "GET":
        # Use the first admin as the source of truth
        admin = admins.first()
        return JsonResponse({
            "response_limit": getattr(admin, "number_of_farmers", 5),
            "consecutive_days_limit": getattr(admin, "last_name", "1"),
        })

    if request.method == "POST":
        data, error = parse_json_request(request)
        if error:
            return error
        response_limit = data.get("response_limit")
        consecutive_days_limit = data.get("consecutive_days_limit")
        for admin in admins:
            if response_limit is not None:
                admin.number_of_farmers = int(response_limit)
            if consecutive_days_limit is not None:
                admin.last_name = str(consecutive_days_limit)
            admin.save()
        return JsonResponse({"message": "Settings updated successfully."})