from django.contrib import admin
from .models import PageView,GeoLocation

class ClassPageAdmin(admin.ModelAdmin):
    list_display=('uuid','is_active','ipaddress','devicetype','timestamp')
    readonly_fields = ['created_at','updated_at']

class ClassGeoLocationAdmin(admin.ModelAdmin):
    list_display=('get_uuid','country_name','city','get_latlong','is_active')

    @admin.display(ordering='uuid', description='uuid')
    def get_uuid(self,obj):
        return obj.page.uuid
    @admin.display(ordering='latlong', description='Longitude - Latitude')
    def get_latlong(self,obj):
        return f'{obj.latitude} - {obj.longitude}'

admin.site.register(PageView,ClassPageAdmin)
admin.site.register(GeoLocation,ClassGeoLocationAdmin)