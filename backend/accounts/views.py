from django.http import JsonResponse
from django.contrib.auth import authenticate, login as auth_login
from .models import User, RegistrationKey
from django.contrib.auth.hashers import make_password

from accounts.helpers.utils import generate_random_key
from accounts.helpers.utils import parse_json_request


def generate_registration_key(request):
    if request.method == 'POST':
        user_role = request.user.role
        data, error = parse_json_request(request)
        if error:
            return error

        # Set fields based on who is generating the key
        if user_role == 'admin':
            for_role = 'cooperative'
            number_of_farmers = data.get('number_of_farmers')
            address = data.get('address')
            name = data.get('name')
            pc = None
        elif user_role == 'cooperative':
            for_role = 'farmer'
            number_of_farmers = None
            address = request.user.address 
            pc = request.user
            name = None
        else:
            return JsonResponse({'error': 'Unauthorized access'}, status=403)

        key = generate_random_key()
        RegistrationKey.objects.create(
            key=key,
            for_role=for_role,
            created_by_role=request.user.role,
            created_by_name=request.user.username,
            number_of_farmers=number_of_farmers,
            address=address,
            pc=pc,
            name=name
        )
        return JsonResponse({'registration_key': key})

    return JsonResponse({'error': 'Invalid request method'}, status=405)

# User registration
def register_user(request):
    if request.method == 'POST':
        data, error = parse_json_request(request)
        if error:
            return error  # Return error response if JSON parsing fails

        key = data.get('registration_key')
        password = data.get('password')
        phone_number = data.get('phone_number')

        try:
            registration_key = RegistrationKey.objects.get(key=key)
            if not registration_key.is_valid():
                return JsonResponse({'error': 'Key has expired'}, status=400)

            if registration_key.for_role == 'farmer':
                # For farmer: username and phone_number are the phone number (must be unique), last_name from key.name
                first_name = data.get('first_name')
                user = User.objects.create(
                    username=phone_number,
                    phone_number=phone_number,
                    password=make_password(password),
                    role='farmer',
                    last_name=registration_key.created_by_name,
                    number_of_farmers=None,
                    address=registration_key.address,
                    first_name=first_name
                )
            elif registration_key.for_role == 'cooperative':
                # For cooperative: username from key.name, phone_number as provided
                user = User.objects.create(
                    username=registration_key.name,
                    phone_number=phone_number,
                    password=make_password(password),
                    role='cooperative',
                    number_of_farmers=registration_key.number_of_farmers,
                    address=registration_key.address,
                )
            else:
                return JsonResponse({'error': 'Invalid registration key role'}, status=400)

            registration_key.delete()  # Invalidate the key after use
            return JsonResponse({
                'message': 'User registered successfully',
                'role': user.role,
                'username': user.username,
                'last_name': user.last_name,
                'number_of_farmers': user.number_of_farmers,
                'address': user.address
            }, status=201)
        except RegistrationKey.DoesNotExist:
            return JsonResponse({'error': 'Invalid registration key'}, status=400)

# User login
def login_user(request):
    if request.method == 'POST':
        data, error = parse_json_request(request)
        if error:
            return error

        username = data.get('username')
        password = data.get('password')

        user = authenticate(username=username, password=password)
        if user:
            if user.is_active:
                auth_login(request, user)
                return JsonResponse({
                    'message': 'Login successful',
                    'role': user.role,
                    'last_login': user.last_login.isoformat() if user.last_login else None
                }, status=200)
            else:
                return JsonResponse({'error': 'Account is deactivated. Please contact support.'}, status=403)
        else:
            return JsonResponse({'error': 'Invalid username or password'}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

# Set user status (activate/deactivate) - accessible by superadmins only
def set_status(request):
    if request.method == 'POST':
        data, error = parse_json_request(request)
        if error:
            return error  # Return error response if JSON parsing fails

        if request.user.role != 'superadmin':  # Ensure only superadmins can perform this action
            return JsonResponse({'error': 'Unauthorized access'}, status=403)

        user_id = data.get('user_id')  # ID of the user to activate/deactivate
        action = data.get('action')  # 'activate' or 'deactivate'

        try:
            user = User.objects.get(id=user_id)
            if user.id == request.user.id:
                return JsonResponse({'error': 'You cannot deactivate your own account.'}, status=400)

            if action == 'activate':
                user.is_active = True
                user.save()
                return JsonResponse({'message': f'User {user.username} has been activated.'})
            elif action == 'deactivate':
                user.is_active = False
                user.save()
                return JsonResponse({'message': f'User {user.username} has been deactivated.'})
            else:
                return JsonResponse({'error': 'Invalid action. Use "activate" or "deactivate".'}, status=400)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found.'}, status=404)   
        
# delete user - accessible by superadmins only
def delete_user(request):
    if request.method == 'POST':
        data, error = parse_json_request(request)
        if error:
            return error  # Return error response if JSON parsing fails

        if request.user.role != 'superadmin':  # Ensure only superadmins can perform this action
            return JsonResponse({'error': 'Unauthorized access'}, status=403)

        user_id = data.get('user_id')  # ID of the user to delete

        try:
            user = User.objects.get(id=user_id)

            # Prevent superadmins from deleting themselves
            if user.id == request.user.id:
                return JsonResponse({'error': 'You cannot delete your own account.'}, status=400)

            user.delete()
            return JsonResponse({'message': f'User {user.username} has been deleted.'})
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found.'}, status=404)
        
# View all customers - accessible by superadmins only
def view_customers(request):
    if request.method == 'GET':
        # Check if the requesting user is a superadmin
        if request.user.role != 'superadmin':
            return JsonResponse({'error': 'Unauthorized access'}, status=403)

        # Fetch all users with the role 'customer'
        customers = User.objects.filter(role='customer')
        customer_data = list(customers.values('id', 'username', 'phone_number', 'email', 'is_active'))
        return JsonResponse({'customers': customer_data}, status=200)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

# View all admins - accessible by superadmins only
def view_admins(request):
    if request.method == 'GET':
        # Check if the requesting user is a superadmin
        if request.user.role != 'superadmin':
            return JsonResponse({'error': 'Unauthorized access'}, status=403)

        # Fetch all users with the role 'admin'
        admins = User.objects.filter(role='admin')
        admin_data = list(admins.values('id', 'username', 'phone_number', 'email', 'is_active'))
        return JsonResponse({'admins': admin_data}, status=200)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

from django.views.decorators.http import require_GET

@require_GET
def get_users(request):
    # Map query param to actual role value in your DB
    role_param = request.GET.get('role', '').lower()
    if role_param == 'pcs':
        role = 'cooperative'
    elif role_param == 'farmers':
        role = 'farmer'
    elif role_param == 'admins':
        role = 'admin'
    else:
        # Default: return all users
        users = User.objects.all()
        user_data = [
            {
                "id": user.id,
                "username": user.username,
                "role": user.role,  
                "phone_number": user.phone_number,
                "is_active": user.is_active,
                "active_services": user.active_services or [],
                "address": user.address,
                "number_of_farmers": getattr(user, "number_of_farmers", None),
                "last_name": user.last_name,
            }
            for user in users
        ]
        return JsonResponse(user_data, safe=False)

    users = User.objects.filter(role=role)
    user_data = [
        {
            "id": user.id,
            "username": user.username,
            "phone_number": user.phone_number,
            "is_active": user.is_active,
            "active_services": user.active_services or [],    
            "address": user.address,
            "number_of_farmers": user.number_of_farmers,
            "last_name": user.last_name,
        }
        for user in users
    ]
    return JsonResponse(user_data, safe=False)


@require_GET
def get_coop_farmers(request):
    coop_username = request.user.username
    print(f"Cooperative username: {coop_username}")

    farmers = User.objects.filter(role='farmer')
    filtered_farmers = [
        farmer for farmer in farmers if farmer.last_name == coop_username
    ]
    farmers_data = [
        {
            "id": farmer.id,
            "username": farmer.username,
            "phone_number": farmer.phone_number,
            "active_services": farmer.active_services or [],
            "address": farmer.address,
            "first_name": getattr(farmer, "first_name", ""),
            "last_name": farmer.last_name,
            "is_active": farmer.is_active,
        }
        for farmer in filtered_farmers
    ]
    print(f"Filtered farmers: {farmers_data}")
    return JsonResponse({
        "coopname": coop_username,
        "farmers": farmers_data,
        "active_services": request.user.active_services or []
    }, status=200)


from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def update_user_services(request):
    if request.method == 'POST':
        data, error = parse_json_request(request)
        if error:
            return error
        users = data.get('users', [])
        for user_data in users:
            try:
                user = User.objects.get(id=user_data['id'])
                user.active_services = user_data.get('active_services', [])
                user.save()
            except User.DoesNotExist:
                continue
        return JsonResponse({'message': 'User services updated successfully.'})
    return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
def update_pc_farmers(request, pc_id):
    if request.method == 'POST':
        data, error = parse_json_request(request)
        if error:
            return error
        try:
            pc = User.objects.get(id=pc_id, role="cooperative")
            number_of_farmers = data.get("number_of_farmers")
            if number_of_farmers is not None:
                pc.number_of_farmers = number_of_farmers
                pc.save()
                return JsonResponse({"message": "Number of farmers updated.", "number_of_farmers": pc.number_of_farmers})
            else:
                return JsonResponse({"error": "Missing number_of_farmers."}, status=400)
        except User.DoesNotExist:
            return JsonResponse({"error": "PC not found."}, status=404)
    return JsonResponse({"error": "Invalid request method."}, status=405)


@csrf_exempt
def toggle_pc_active(request, pc_id):
    if request.method == 'POST':
        # Use the helper to parse JSON
        data, error = parse_json_request(request)
        if error:
            return error

        try:
            pc = User.objects.get(id=pc_id, role="cooperative")
            is_active = data.get("is_active", True)
            pc.is_active = is_active
            pc.save()
            return JsonResponse({"message": "PC active state updated.", "is_active": pc.is_active})
        except User.DoesNotExist:
            return JsonResponse({"error": "PC not found."}, status=404)
    return JsonResponse({"error": "Invalid request method."}, status=405)

@csrf_exempt
def toggle_farmer_active(request, farmer_id):
    if request.method == 'POST':
        data, error = parse_json_request(request)
        if error:
            return error
        try:
            farmer = User.objects.get(id=farmer_id, role="farmer")
            is_active = data.get("is_active", True)
            farmer.is_active = is_active
            farmer.save()
            return JsonResponse({"message": "Farmer active state updated.", "is_active": farmer.is_active})
        except User.DoesNotExist:
            return JsonResponse({"error": "Farmer not found."}, status=404)
    return JsonResponse({"error": "Invalid request method."}, status=405)

@require_GET
def get_current_user(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({'error': 'Authentication required.'}, status=401)
    return JsonResponse({
        "id": user.id,
        "username": user.username,
        "role": user.role,
        "phone_number": user.phone_number,
        "is_active": user.is_active,
        "active_services": user.active_services or [],
        "address": user.address,
        "number_of_farmers": getattr(user, "number_of_farmers", None),
        "last_name": user.last_name,
        "first_name": getattr(user, "first_name", ""),
    }, status=200)