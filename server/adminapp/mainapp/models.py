from django.contrib.auth.models import AbstractUser
from django.db import models
from ckeditor.fields import RichTextField


# Create your models here.
class User(AbstractUser):
    avatar = models.ImageField(upload_to='uploads/user/%Y/%m', null=True)
    day_of_birth = models.DateField(null=True, blank=True)

    def __str__(self):
        return str(self.last_name) + " " + str(self.first_name)


class CareerCategory(models.Model):
    category_name = models.TextField(null=False, blank=False)
    explained_content = models.TextField(null=False, blank=False)
    detail = models.TextField(null=False, blank=False)
    career_content = models.TextField(null=False, blank=False)
    image = models.ImageField(upload_to='images/category/%Y/%m', null=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return self.category_name


class Question(models.Model):
    question_content = models.TextField(null=False, blank=False)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return str(self.id) + " - Active: " + str(self.is_active)


class Answer(models.Model):
    answer_content = models.TextField(null=False, blank=False)
    career_category = models.ForeignKey(CareerCategory, related_name='answers', on_delete=models.SET_NULL, null=True)
    question = models.ForeignKey(Question, related_name='answers', on_delete=models.SET_NULL, null=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return self.answer_content


class Survey(models.Model):
    participant = models.ForeignKey(User, related_name='surveys', on_delete=models.CASCADE, null=True)
    created_date = models.DateTimeField(auto_now_add=True)
    result = RichTextField(null=True)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return str(self.participant) + " --> " + str(self.created_date)


class University(models.Model):
    name = models.TextField(null=False, blank=True)
    link = models.TextField(null=False, blank=False)
    image = models.ImageField(upload_to='images/university/%Y/%m', null=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class FeedBack(models.Model):
    title = models.TextField(null=False, blank=True)
    content = models.TextField(null=False, blank=True)
    user = models.ForeignKey(User, related_name='feedbacks', on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.title
