export function getCSRFToken() {
	const cookies = document.cookie.split('\n');
	for (let cookie of cookies) {
		cookie = cookie.trim();
		if (cookie.startsWith('csrftoken=')) {
			return cookie.substring('csrftoken='.length);
		}
	}
	return null;
}