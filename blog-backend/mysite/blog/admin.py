from django.contrib import admin

# Register your models here.
admin.site.site_header = "Blog Admin"
admin.site.site_title = "Blog Admin Portal"
admin.site.index_title = "Welcome to the Blog Admin Portal"

from .models import User, Post, Comment, Like, Repost, Bookmark, Tag
admin.site.register(User)
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Like)
admin.site.register(Repost)
admin.site.register(Tag)
admin.site.register(Bookmark)
