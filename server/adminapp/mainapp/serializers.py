from rest_framework.serializers import ModelSerializer, SerializerMethodField

from .models import CareerCategory, Question, Answer, User, Survey, University, FeedBack


class SurveySerializer(ModelSerializer):
    class Meta:
        model = Survey
        fields = ["id", "result", "participant", "created_date"]


class FeedBackSerializer(ModelSerializer):

    class Meta:
        model = FeedBack
        fields = ["id", "user", "title", "content"]


class UserSerializer(ModelSerializer):
    # avatar = SerializerMethodField()
    #
    # def get_avatar(self, user):
    #     if user.avatar is not None:
    #         request = self.context['request']
    #         name = user.avatar.name
    #         if name.startswith("static/"):
    #             path = '/%s' % name
    #         else:
    #             path = '/static/%s' % name
    #         return request.build_absolute_uri(path)

    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "username", "password", "email", "day_of_birth", "avatar"]

        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(user.password)  # Hash code password
        user.save()

        return user


class UniversitySerializer(ModelSerializer):
    image = SerializerMethodField()

    def get_image(self, university):
        if university.image is not None:
            request = self.context['request']
            name = university.image.name
            if name.startswith("static/"):
                path = '/%s' % name
            else:
                path = '/static/%s' % name
            return request.build_absolute_uri(path)

    class Meta:
        model = University
        fields = "__all__"


class CareerCategorySerializer(ModelSerializer):
    image = SerializerMethodField()

    def get_image(self, career_category):
        request = self.context['request']
        name = career_category.image.name
        if name.startswith("static/"):
            path = '/%s' % name
        else:
            path = '/static/%s' % name
        return request.build_absolute_uri(path)

    class Meta:
        model = CareerCategory
        fields = "__all__"


class AnswerSerializer(ModelSerializer):
    class Meta:
        model = Answer
        fields = "__all__"


class QuestionSerializer(ModelSerializer):
    answers = AnswerSerializer(many=True)

    class Meta:
        model = Question
        fields = "__all__"


