import requests
from django.shortcuts import redirect, render
from django.conf import settings
from django.contrib.auth import logout

# Homepage
def index(request):
	user = request.session.get('user')
	return render(request, 'index.html', {'user': user})

# Start to login in OAuth
def oauth_login(request):
	authorization_url = (
		f"{settings.AUTHORIZATION_URL}"
		f"?client_id={settings.CLIENT_ID}"
		f"&redirect_uri={settings.REDIRECT_URI}"
		f"&response_type=code"
	)
	return redirect(authorization_url)

# Process doing OAuth callback
def oauth_callback(request):
	code = request.GET.get('code')
	if not code:
		return render(request, 'error.html', {'message': 'Authorization failed.'})
	
	# Request access token
	token_response = requests.post(
		settings.TOKEN_URL,
		data={
			'grant_type': 'authorization_code',
			'client_id': settings.CLIENT_ID,
			'client_secret': settings.CLIENT_SECRET,
			'code': code,
			'redirect_uri': settings.REDIRECT_URI,
		},
	)

	if token_response.status_code != 200:
		return render(request, 'error.html', {'message': 'Failed to get access token.'})

	token_data = token_response.json()
	access_token = token_data.get('access_token')

	# Request user's info
	user_response = requests.get(
		settings.USER_INFO_URL,
		headers={'Authorization': f'Bearer {access_token}'},
	)

	if user_response.status_code != 200:
		return render(request, 'error.html', {'message': 'Failed to get user information.'})
	user_data = user_response.json()

	# Save user's info in session
	request.session['user'] = {
		'id': user_data['id'],
		'login': user_data['login'],
		'email': user_data.get('email'),
	}

	return redirect(settings.LOGIN_REDIRECT_URL)

def logout_view(request):
	logout(request)
	return redirect(settings.LOGOUT_REDIRECT_URL)