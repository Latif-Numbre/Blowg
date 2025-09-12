from django.contrib.contenttypes.models import ContentType
from rest_framework import serializers
from .models import User, Post, Comment, Like, Repost, Bookmark, Tag


# -----------------------------
# USER SERIALIZER (for nesting)
# -----------------------------
class UserSerializer(serializers.ModelSerializer):
    

    class Meta:
        model = User
        fields = ['id', 'full_name', 'username', 'email', 'bio', 'phone_number', 'avatar_url', 'password',]

    def create(self, validated_data):
        user = User.objects.create_user(
            full_name=validated_data.get("full_name"),
            username=validated_data["username"],
            email=validated_data.get("email"),
            password=validated_data.get("password"),
            
        )
        return user


# -----------------------------
# POST SERIALIZER
# -----------------------------
class PostSerializer(serializers.ModelSerializer):
    tags = serializers.ListField(
        child=serializers.CharField(max_length=50), write_only=True, required=False
    )
    tag_list = serializers.SerializerMethodField(read_only=True)



    author = UserSerializer(read_only=True)  # Nested author details
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    reposts_count = serializers.SerializerMethodField()
    bookmarks_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id', 'author', 'title', 'content', 'created_at', 'tags', 'tag_list', 'excerpt',
            'likes_count', 'comments_count', 'reposts_count', 'bookmarks_count'
        ]

    def get_tag_list(self, obj):
        return [tag.name for tag in obj.tags.all()]



    def get_likes_count(self, obj):
        content_type = ContentType.objects.get_for_model(Post)
        return Like.objects.filter(content_type=content_type, object_id=obj.id).count()
        

    def get_comments_count(self, obj):
        return obj.comments.count()

    def get_reposts_count(self, obj):
        content_type = ContentType.objects.get_for_model(Post)
        return Repost.objects.filter(content_type=content_type, object_id=obj.id).count()

    def get_bookmarks_count(self, obj):
        content_type = ContentType.objects.get_for_model(Post)
        return Bookmark.objects.filter(content_type=content_type, object_id=obj.id).count()
    
    def create(self, validated_data):
        tags_data = validated_data.pop("tags", [])
        post = Post.objects.create(**validated_data)
        for tag_name in tags_data:
            tag_obj, _ = Tag.objects.get_or_create(name=tag_name)
            post.tags.add(tag_obj)
        return post
    
    def update(self, instance, validated_data):
        tags_data = validated_data.pop("tags", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if tags_data is not None:
            instance.tags.clear()
            for tag_name in tags_data:
                tag_obj, _ = Tag.objects.get_or_create(name=tag_name)
                instance.tags.add(tag_obj)
        return instance

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["tags"] = [tag.name for tag in instance.tags.all()]  # list of strings
        return rep


# -----------------------------
# COMMENT SERIALIZER (nested)
# -----------------------------
class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)  # Nested author details
    replies = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    reposts_count = serializers.SerializerMethodField()
    bookmarks_count = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            'id', 'author', 'content', 'created_at', 'parent',
            'likes_count', 'reposts_count', 'bookmarks_count', 'replies'
        ]

    def get_replies(self, obj):
        return CommentSerializer(obj.replies.all(), many=True).data

    def get_likes_count(self, obj):
        content_type = ContentType.objects.get_for_model(Comment)
        return Like.objects.filter(content_type=content_type, object_id=obj.id).count()

    def get_reposts_count(self, obj):
        content_type = ContentType.objects.get_for_model(Comment)
        return Repost.objects.filter(content_type=content_type, object_id=obj.id).count()

    def get_bookmarks_count(self, obj):
        content_type = ContentType.objects.get_for_model(Comment)
        return Bookmark.objects.filter(content_type=content_type, object_id=obj.id).count()


# -----------------------------
# GENERIC SERIALIZERS (Flat)
# -----------------------------
class LikeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Like
        fields = ['id', 'user', 'content_type', 'object_id', 'created']


class RepostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Repost
        fields = ['id', 'user', 'content_type', 'object_id', 'created']


class BookmarkSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Bookmark
        fields = ['id', 'user', 'content_type', 'object_id', 'created']
