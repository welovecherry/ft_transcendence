from django.db import models

class User(models.Model):
	intra_name = models.CharField(max_length=50)
	choice = models.CharField(max_length=10, null=True, blank=True)
	
	def __str__(self):
		return self.intra_name
	
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
	
	me_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='matches_as_me')
	me_choice = models.CharField(
		max_length=10, null=True, blank=True)
	other_id = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='matches_as_other')
	other_choice = models.CharField(
		max_length=10, null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
	status = models.CharField(
		max_length=10,
		choices=STATUS_CURRENT,
		default=STATUS_WAITING
	)

	def __str__(self):
		return f"{self.me_id.intra_name} vs {self.other_id.intra_name if self.other_id else 'NO other User'}"
	
	class Meta:
		app_label = 'sub'
		db_table = 'sub_match'
