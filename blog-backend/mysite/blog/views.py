from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.contenttypes.models import ContentType
from rest_framework.permissions import AllowAny

from .models import Post, Comment, Like, Bookmark, Repost
from .serializers import (
    PostSerializer, CommentSerializer,
    LikeSerializer, BookmarkSerializer, RepostSerializer, UserSerializer
)
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth import authenticate








from rest_framework.pagination import PageNumberPagination

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10  # default page size
    page_size_query_param = 'page_size'  # allow client to override ?page_size=5
    max_page_size = 100


#################################################
# POSTS
#################################################
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticatedOrReadOnly])
def post_list_create(request):
    if request.method == "GET":
        posts = Post.objects.all().select_related("author")

        # --- Filtering ---
        author = request.query_params.get("author")
        search = request.query_params.get("search")

        if author:
            posts = posts.filter(author__id=author)
        if search:
            posts = posts.filter(title__icontains=search) | posts.filter(content__icontains=search)

        # --- Pagination ---
        paginator = StandardResultsSetPagination()
        paginated_posts = paginator.paginate_queryset(posts, request)
        serializer = PostSerializer(paginated_posts, many=True)
        return paginator.get_paginated_response(serializer.data)

    if request.method == "POST":
        print(request.data)
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticatedOrReadOnly])
def post_detail(request, pk):
    post = get_object_or_404(Post, pk=pk)

    if request.method == "GET":
        serializer = PostSerializer(post)
        return Response(serializer.data)

    if request.method == "PUT":
        if post.author != request.user:
            return Response({"detail": "Not allowed"}, status=403)
        serializer = PostSerializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    if request.method == "DELETE":
        if post.author != request.user:
            return Response({"detail": "Not allowed"}, status=403)
        post.delete()
        return Response(status=204)
    

# -----------------------------
# POST ACTIONS: like, bookmark, repost
# -----------------------------
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def post_like(request, pk):
    post = get_object_or_404(Post, pk=pk)
    ct = ContentType.objects.get_for_model(Post)
    like, created = Like.objects.get_or_create(user=request.user, content_type=ct, object_id=post.id)
    if not created:
        like.delete()
        return Response({"detail": "Unliked"}, status=200)
    return Response({ "detail": LikeSerializer(like).data})





@api_view(["POST"])
@permission_classes([IsAuthenticated])
def post_bookmark(request, pk):
    post = get_object_or_404(Post, pk=pk)
    ct = ContentType.objects.get_for_model(Post)
    bm, created = Bookmark.objects.get_or_create(user=request.user, content_type=ct, object_id=post.id)
    if not created:
        bm.delete()
        return Response({"detail": "Bookmark removed"}, status=200)
    return Response({"detail": BookmarkSerializer(bm).data})

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def post_repost(request, pk):
    post = get_object_or_404(Post, pk=pk)
    ct = ContentType.objects.get_for_model(Post)
    repost, created = Repost.objects.get_or_create(user=request.user, content_type=ct, object_id=post.id)
    if not created:
        repost.delete()
        return Response({"detail": "Repost removed"}, status=200)
    return Response({"detail": RepostSerializer(repost).data})







############## COMMENTS #####################

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticatedOrReadOnly])
def comment_list_create(request, post_id):
    if request.method == "GET":
        comments = Comment.objects.filter(post_id=post_id).select_related("author", "parent")

        # --- Filtering ---
        author = request.query_params.get("author")
        if author:
            comments = comments.filter(author__id=author)

        # --- Pagination ---
        paginator = StandardResultsSetPagination()
        paginated_comments = paginator.paginate_queryset(comments, request)
        serializer = CommentSerializer(paginated_comments, many=True)
        return paginator.get_paginated_response(serializer.data)

    if request.method == "POST":
        parent_id = request.data.get("parent")
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            parent = Comment.objects.filter(id=parent_id).first() if parent_id else None
            serializer.save(author=request.user, post_id=post_id, parent=parent)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticatedOrReadOnly])
def comment_detail(request, pk):
    comment = get_object_or_404(Comment, pk=pk)

    if request.method == "GET":
        serializer = CommentSerializer(comment)
        return Response(serializer.data)

    if request.method == "PUT":
        if comment.author != request.user:
            return Response({"detail": "Not allowed"}, status=403)
        serializer = CommentSerializer(comment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    if request.method == "DELETE":
        if comment.author != request.user:
            return Response({"detail": "Not allowed"}, status=403)
        comment.delete()
        return Response(status=204)
    



@api_view(["GET"])
@permission_classes([IsAuthenticatedOrReadOnly])
def like_list(request):
    likes = Like.objects.all().select_related("user")

    # --- Filtering ---
    user = request.query_params.get("user")
    content_type = request.query_params.get("type")  # "post" or "comment"
    object_id = request.query_params.get("object_id")

    if user:
        likes = likes.filter(user__id=user)
    if content_type and object_id:
        ct = ContentType.objects.get(model=content_type)
        likes = likes.filter(content_type=ct, object_id=object_id)

    # --- Pagination ---
    paginator = StandardResultsSetPagination()
    paginated = paginator.paginate_queryset(likes, request)
    serializer = LikeSerializer(paginated, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticatedOrReadOnly])
def bookmark_list(request):
    bookmarks = Bookmark.objects.all().select_related("user")

    # --- Filtering ---
    user = request.query_params.get("user")
    if user:
        bookmarks = bookmarks.filter(user__id=user)

    paginator = StandardResultsSetPagination()
    paginated = paginator.paginate_queryset(bookmarks, request)
    serializer = BookmarkSerializer(paginated, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticatedOrReadOnly])
def repost_list(request):
    reposts = Repost.objects.all().select_related("user")

    # --- Filtering ---
    user = request.query_params.get("user")
    if user:
        reposts = reposts.filter(user__id=user)

    paginator = StandardResultsSetPagination()
    paginated = paginator.paginate_queryset(reposts, request)
    serializer = RepostSerializer(paginated, many=True)
    return paginator.get_paginated_response(serializer.data)



# -----------------------------
# COMMENT ACTIONS: like, bookmark, repost
# -----------------------------
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def comment_like(request, pk):
    comment = get_object_or_404(Comment, pk=pk)
    ct = ContentType.objects.get_for_model(Comment)
    like, created = Like.objects.get_or_create(user=request.user, content_type=ct, object_id=comment.id)
    if not created:
        return Response({"detail": "Already liked"}, status=400)
    return Response(LikeSerializer(like).data)



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def comment_bookmark(request, pk):
    comment = get_object_or_404(Comment, pk=pk)
    ct = ContentType.objects.get_for_model(Comment)
    bm, created = Bookmark.objects.get_or_create(user=request.user, content_type=ct, object_id=comment.id)
    if not created:
        return Response({"detail": "Already bookmarked"}, status=400)
    return Response(BookmarkSerializer(bm).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def comment_repost(request, pk):
    comment = get_object_or_404(Comment, pk=pk)
    ct = ContentType.objects.get_for_model(Comment)
    repost, created = Repost.objects.get_or_create(user=request.user, content_type=ct, object_id=comment.id)
    if not created:
        return Response({"detail": "Already reposted"}, status=400)
    return Response(RepostSerializer(repost).data)




@api_view(["POST"])
@permission_classes([AllowAny])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






@api_view(["POST"])
@permission_classes([AllowAny])  # anyone can attempt sign in
def signin(request):
    username = request.data.get("username")
    password = request.data.get("password")
    print(username, password)
    

    user = authenticate(request, username=username, password=password)
    print(user)

    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "full_name": user.full_name,
                "bio": user.bio,
                "phone_number": user.phone_number,
                "avatar_url": user.avatar_url,
            }
        }, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)










