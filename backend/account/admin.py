from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.hashers import make_password
from WellPlay_app.backend.account.models import User


class UserAdmin(BaseUserAdmin):
    list_display = ('user_id', 'email', 'profile_name', 'lol_name')
    list_filter = ('user_id',)
    search_fields = ('user_id', 'profile_name')

    fieldsets = ("info", {'fields': ('user_id', 'email', 'password', 'profile_name', 'lol_name')}),
    ('Permissions', {'fields': ('is_admin', 'is_active',)},)

    filter_horizontal = []

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return ('user_id',)
        else:
            pass

    def create(self, validation_data):
        password = validation_data.pop('password')
        password = make_password(password)
        validation_data['password'] = password


admin.site.register(User, UserAdmin)
