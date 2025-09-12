from django.urls import path
from . import views

urlpatterns = [
    # Posts
    path("posts/", views.post_list_create, name="post-list-create"),
    path("posts/<int:pk>/", views.post_detail, name="post-detail"),
    path("posts/<int:pk>/like/", views.post_like, name="post-like"),
    path("posts/<int:pk>/bookmark/", views.post_bookmark, name="post-bookmark"),
    path("posts/<int:pk>/repost/", views.post_repost, name="post-repost"),

    # Comments
    path("posts/<int:post_id>/comments/", views.comment_list_create, name="comment-list-create"),
    path("comments/<int:pk>/", views.comment_detail, name="comment-detail"),
    path("comments/<int:pk>/like/", views.comment_like, name="comment-like"),
    path("comments/<int:pk>/bookmark/", views.comment_bookmark, name="comment-bookmark"),
    path("comments/<int:pk>/repost/", views.comment_repost, name="comment-repost"),

    # Lists
    path("likes/", views.like_list, name="like-list"),
    path("bookmarks/", views.bookmark_list, name="bookmark-list"),
    path("reposts/", views.repost_list, name="repost-list"),


    # User Registration
    path("register/", views.signup, name="register"),
    path("me/", views.current_user, name="current-user"),
    path("signin/", views.signin, name="signin"),
]
