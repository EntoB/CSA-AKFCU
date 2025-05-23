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


from django.views.decorators.http import require_GET

@require_GET
def all_feedbacks(request):
    feedbacks = (
        Feedback.objects
        .select_related('customer', 'service')
        .order_by('-created_at')
    )
    feedback_data = [
        {
            'id': fb.id,
            'customer': fb.customer.username if fb.customer else '',
            'service_id': fb.service.id if fb.service else None,
            'service_name': fb.service.name if fb.service else '',
            'category': fb.service.category if fb.service else '',
            'cooperative': getattr(fb.customer, 'last_name', ''),  # adjust if you have a better field for cooperative
            'message': fb.message,
            'sentiment': fb.sentiment,
            'created_at': fb.created_at.strftime('%Y-%m-%d'),
            'summarized': fb.summarized,
        }
        for fb in feedbacks
    ]
    return JsonResponse({'feedbacks': feedback_data}, status=200)

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

        sentiment_label_1 = ''
        sentiment_label_2 = ''

        # Always translate to English using autodetect
        translated = translate_text(message, "Autodetect")
        message_in_english = translated if translated else ""

        # Sentiment analysis should be on the English message
        sentiment = analyze_sentiment(message_in_english)

        try:
            service = Service.objects.get(id=service_id)
        except Service.DoesNotExist:
            return JsonResponse({'error': 'Service not found.'}, status=404)

        # Summarize feedback using Gemini/LLM
        summarized = generalize_feedback(message_in_english, service.name)
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
        )
        return JsonResponse({'message': 'Feedback submitted successfully', 'sentiment': sentiment, 'summary': summarized}, status=201)

    return JsonResponse({'error': 'Invalid request method'}, status=405)
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
from django.views.decorators.http import require_GET

@require_GET
def can_give_feedback(request):
    user = request.user
    service_id = request.GET.get('service_id')
    if not service_id:
        return JsonResponse({'error': 'service_id is required'}, status=400)
    feedbacks = Feedback.objects.filter(customer=user, service_id=service_id).order_by('-created_at')
    count = feedbacks.count()
    if count >= 3:
        return JsonResponse({'allowed': False, 'reason': 'You have reached the feedback limit for this service.'})
    if count > 0:
        last_feedback = feedbacks.first()
        if timezone.now() - last_feedback.created_at < timedelta(seconds=24* 60 * 60):
            return JsonResponse({'allowed': False, 'reason': 'You must wait 24 hours before submitting another feedback for this service.'})
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