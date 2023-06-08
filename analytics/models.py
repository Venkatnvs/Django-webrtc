from django.db import models
import datetime
import uuid

class PageView(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False)
    url = models.URLField(null=True,blank=True)
    title = models.CharField(max_length=255,blank=True,null=True)
    duration = models.CharField(max_length=255,blank=True,null=True)
    timestamp = models.DateTimeField(default=datetime.datetime.now())
    devicetype = models.CharField(max_length=255,blank=True,null=True)
    useragent = models.TextField(default="",blank=True,null=True)
    ipaddress = models.CharField(max_length=255,null=True,blank=True)
    is_geolocation = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.uuid}'

class GeoLocation(models.Model):
    page = models.OneToOneField(PageView,on_delete=models.CASCADE)
    city = models.CharField(max_length=255,default=None, null=True,blank=True)
    continent_code = models.CharField(max_length=255,default=None, null=True,blank=True)
    continent_name = models.CharField(max_length=255,default=None, null=True,blank=True)
    country_code = models.CharField(max_length=255,default=None, null=True,blank=True)
    country_name = models.CharField(max_length=255,default=None, null=True,blank=True)
    dma_code = models.CharField(max_length=255,default=None, null=True,blank=True)
    is_in_european_union = models.CharField(max_length=255,default=None, null=True,blank=True)
    postal_code = models.CharField(max_length=255,default=None, null=True,blank=True)
    region = models.CharField(max_length=255,default=None, null=True,blank=True)
    time_zone = models.CharField(max_length=255,default=None, null=True,blank=True)
    latitude = models.FloatField(default=0,blank=True,null=True)
    longitude = models.FloatField(default=0,blank=True,null=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f'{self.page.uuid}  ---{self.country_name}'