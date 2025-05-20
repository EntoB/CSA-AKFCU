from django.shortcuts import render
from django.contrib.auth.decorators import user_passes_test
from django.http import JsonResponse
from .models import Feedback, Service
from accounts.helpers.utils import parse_json_request
from feedback.helpers.utils import analyze_sentiment
from django.contrib.sessions.models import Session
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse


from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def submit_feedback(request):
    if request.method == 'POST':
        data, error = parse_json_request(request)
        if error:
            return error  # Return error response if JSON parsing fails

        customer = request.user
        service_id = data.get('service_id')
        message = data.get('message')
        rating = data.get('rating', 5)
        sentiment_label_1 = ''
        sentiment_label_2 = ''
        message_in_english = ''

        # Analyze sentiment (optional, can be replaced by ML later)
        sentiment = analyze_sentiment(message)

        # Validate service
        try:
            service = Service.objects.get(id=service_id)
        except Service.DoesNotExist:
            return JsonResponse({'error': 'Service not found.'}, status=404)

        # Save feedback
        feedback = Feedback.objects.create(
            customer=customer,
            service=service,
            message=message,
            rating=rating,
            sentiment=sentiment,
            sentiment_label_1=sentiment_label_1,
            sentiment_label_2=sentiment_label_2,
            message_in_english=message_in_english,
        )
        return JsonResponse({'message': 'Feedback submitted successfully', 'sentiment': sentiment}, status=201)

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
    # Ensure the user is authorized (e.g., superadmin)
    if user.is_superuser != 1:
        return JsonResponse({'error': 'Unauthorized access'}, status=403)

    if request.method == 'POST':
        data, error = parse_json_request(request)
        if error:
            return error  # Return error response if JSON parsing fails
        print(f"Received data: {data}")
        # Extract service details
        name = data.get('name')
        description = data.get('description', '')
        category = data.get('category', '')

        if not name:
            return JsonResponse({'error': 'Service name is required'}, status=400)

        # Create and save the service
        service = Service.objects.create(name=name, description=description, category=category)
        print(f"Service created: {service}")
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