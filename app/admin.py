from django.contrib import admin
from .models import Post

# Register your models here.
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'content_type', 'published', 'created_at')
    list_filter = ('content_type', 'published', 'created_at', 'author')
    search_fields = ('title', 'content')
    readonly_fields = ('author', 'created_at', 'updated_at')

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.author = request.user
        if not request.user.is_superuser:
            return super().save_model(request, obj, form, change)
        obj.save()