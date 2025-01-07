from django.db import models

class User(models.Model):
	intra_name = models.CharField(max_length=50)
	win_count = models.IntegerField(default=0)
	total_count = models.IntegerField(default=0)

	def __str__(self):
		return self.intra_name
	
	# [ ]명시적 선언을 통해 Meta 클래스를 통해 app_label을 지정해줌으로써
	# Django가 이 모델을 어느 앱에 속한 것으로 간주해야 하는지 알 수 있게 해준다.
	class Meta:
		app_label = 'sub'

# Rock: 1, Scissors: 2, Paper: 3
class Match(models.Model):
	me = models.ForeignKey(User, on_delete=models.CASCADE, related_name='matches_as_me')
	me_choice = models.CharField(
		max_length=10, null=True, blank=True)
	other = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='matches_as_other')
	other_choice = models.CharField(
		max_length=10, null=True, blank=True)
	# 이긴 사람의 id를 저장
	winner = models.ForeignKey(
		User, on_delete=models.SET_NULL, null=True, blank=True, related_name='matches_as_winner')
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"{self.me.intra_name} vs {self.other.intra_name if self.other else 'NO other User'}"
	class Meta:
		app_label = 'sub'
		db_table = 'sub_match'
