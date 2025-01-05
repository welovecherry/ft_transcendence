from django.apps import AppConfig

class SubProjectConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'sub_project'  # 여기에는 앱의 실제 경로를 작성합니다.
    # name = 'sub_game.sub_project'  # 여기에는 앱의 실제 경로를 작성합니다.
