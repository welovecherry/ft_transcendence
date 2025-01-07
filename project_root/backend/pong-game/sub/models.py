from django.db import models

class User(models.Model):
	intra_name = models.CharField(max_length=50)
	user_choice = models.CharField(max_length=10, null=True, blank=True)

	def __str__(self):
		return self.intra_name
	
	# [ ]명시적 선언을 통해 Meta 클래스를 통해 app_label을 지정해줌으로써
	# Django가 이 모델을 어느 앱에 속한 것으로 간주해야 하는지 알 수 있게 해준다.
	class Meta:
		app_label = 'sub'

class Match(models.Model):
	# status 상수 정의
	STATUS_WAITING = 'waiting'     # 초기 상태: 매칭 대기 중
	STATUS_PENDING = 'pending'     # 매칭 진행 중: 상대방이 선택하고 응답 대기 중
	STATUS_COMPLETED = 'completed' # 매칭 완료: 게임 결과 생성됨
	
	STATUS_CURRENT = [
		(STATUS_WAITING, 'Waiting'),
		(STATUS_PENDING, 'Pending'),
		(STATUS_COMPLETED, 'Completed'),
	]
	
	me = models.ForeignKey(User, on_delete=models.CASCADE, related_name='matches_as_me')
	me_choice = models.CharField(
		max_length=10, null=True, blank=True)
	other = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='matches_as_other')
	other_choice = models.CharField(
		max_length=10, null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)  # 상태 변경 시간 추적용
	status = models.CharField(
		max_length=10,
		current=STATUS_CURRENT,
		default=STATUS_WAITING
	)

	def __str__(self):
		return f"{self.me.intra_name} vs {self.other.intra_name if self.other else 'NO other User'}"
	class Meta:
		app_label = 'sub'
		db_table = 'sub_match'
