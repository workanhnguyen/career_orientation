from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework import viewsets, generics, status, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.http import Http404
from rest_framework.views import APIView
from django.shortcuts import render
from rest_framework import viewsets, generics
from django.conf import settings
import os

from .models import CareerCategory, Question, Answer, User, Survey, University, FeedBack
from .serializers import (CareerCategorySerializer,
                          QuestionSerializer,
                          AnswerSerializer,
                          UserSerializer,
                          SurveySerializer,
                          UniversitySerializer,
                          FeedBackSerializer)


# Create your views here.

class CareerCategoryViewSet(viewsets.ViewSet,
                            generics.ListAPIView,
                            generics.RetrieveAPIView):
    queryset = CareerCategory.objects.all()
    serializer_class = CareerCategorySerializer

    permission_classes = [permissions.IsAuthenticated]

    @action(methods=['get'], detail=True, url_path='answers')
    def get_answers(self, request, pk):
        answers = CareerCategory.objects.get(pk=pk).answers

        return Response(AnswerSerializer(answers, many=True).data,
                        status=status.HTTP_200_OK)

    @action(methods=['get'], detail=False, url_path='total-category')
    def get_total_category(self, request):
        count = CareerCategory.objects.count()

        return Response(count, status=status.HTTP_200_OK)


class QuestionViewSet(viewsets.ViewSet,
                      generics.ListAPIView,
                      generics.RetrieveAPIView):
    queryset = Question.objects.filter(is_active=True)
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(methods=['get'], detail=True, url_path='answers')
    def get_answers(self, request, pk):
        answers = Question.objects.get(pk=pk).answers

        return Response(AnswerSerializer(answers, many=True).data,
                        status=status.HTTP_200_OK)


class AnswerViewSet(viewsets.ViewSet,
                    generics.ListAPIView,
                    generics.RetrieveAPIView):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    permission_classes = [permissions.IsAuthenticated]


class UserViewSet(viewsets.ViewSet,
                  generics.CreateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    parser_classes = [MultiPartParser, ]

    def get_permissions(self):
        if ["get_current_user", "get_surveys", "add_survey"].__contains__(self.action):
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    @action(methods=['patch'], detail=False, url_path='current-user/update')
    def update_user(self, request):
        user = User.objects.get(id=request.user.id)

        user.first_name = request.POST.get('first_name')
        user.last_name = request.POST.get('last_name')
        user.email = request.POST.get('email')
        user.day_of_birth = request.POST.get('day_of_birth')

        if len(request.FILES) != 0:
            if len(user.avatar) > 0:
                os.remove(user.avatar.path)
            user.avatar = request.FILES['avatar']
        user.save()

        return Response(self.serializer_class(User.objects.get(pk=request.user.id)).data,
                        status=status.HTTP_200_OK)

    @action(methods=['get'], detail=False, url_path='current-user')
    def get_current_user(self, request):
        return Response(self.serializer_class(request.user).data,
                        status=status.HTTP_200_OK)

    @action(methods=['get'], detail=False, url_path='current-user/surveys')
    def get_surveys(self, request):
        return Response(SurveySerializer(request.user.surveys, many=True).data,
                        status=status.HTTP_200_OK)

    @action(methods=['post'], detail=False, url_path='current-user/add-survey')
    def add_survey(self, request):
        current_user = request.user
        s = Survey.objects.create(participant=request.user,
                                  result=request.data.get('result'))
        current_user.surveys.add(s)
        current_user.save()
        return Response(SurveySerializer(s).data,
                        status=status.HTTP_201_CREATED)


class AuthInfo(APIView):
    def get(self, request):
        return Response(settings.OAUTH2_INFO, status=status.HTTP_200_OK)


class SurveyViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Survey.objects.all()
    serializer_class = SurveySerializer

    permission_classes = [permissions.IsAuthenticated]


class UniversityViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = University.objects.all()
    serializer_class = UniversitySerializer

    permission_classes = [permissions.AllowAny]


class FeedBackViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView):
    queryset = FeedBack.objects.all()
    serializer_class = FeedBackSerializer
    parser_classes = [MultiPartParser, ]

    permission_classes = [permissions.IsAuthenticated]

    @action(methods=['post'], detail=False, url_path='add-feedback')
    def add_feedback(self, request):
        current_user = request.user
        f = FeedBack.objects.create(user=request.user,
                                    title=request.data.get('title'),
                                    content=request.data.get('content'))
        current_user.feedbacks.add(f)
        current_user.save()
        return Response(FeedBackSerializer(f).data,
                        status=status.HTTP_201_CREATED)
