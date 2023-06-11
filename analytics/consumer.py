import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer
import django
django.setup()
from channels.db import database_sync_to_async
from .models import PageView
from datetime import datetime,timezone

class WebrtcRealTime(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.user_uuid = self.scope["url_route"]["kwargs"]["user_uuid"]
        self.user_pk = self.scope["url_route"]["kwargs"]["user_pk"]
        self.room_group_name = "webrtc_realtime"
        await self.channel_layer.group_add(
            self.room_group_name, 
            self.channel_name
        )
        await self.accept()

    @database_sync_to_async
    def get_real_time_user_count(self):
        db = PageView.objects.filter(is_active=True)
        count = db.count()
        return count

    @database_sync_to_async 
    def set_as_non_real_time(self):
        try:
            a = datetime.now(timezone.utc)
            page = PageView.objects.get(pk=self.user_pk ,uuid=self.user_uuid)
            b = page.timestamp
            rem = (a-b).total_seconds()
            page.is_active = False
            page.duration = str(rem)
            page.save()
        except Exception as e:
            print(e)

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        if not self.user_uuid == 'admin':
            await self.set_as_non_real_time()
            await self.channel_layer.group_send(
                self.room_group_name, {"type": "send_message", "message": self.user_uuid}
            )
        print('disconnected',self.user_uuid)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "send_message", "message": message}
        )

    async def send_message(self, event):
        user_count= await self.get_real_time_user_count()
        message = event["message"]
        await self.send(text_data=json.dumps({"message": message,"user_count":user_count}))

