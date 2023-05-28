import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer

class WebrtcVideo(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "webrtc_%s" % self.room_name

        await self.channel_layer.group_add(
            self.room_group_name, 
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        print('disconnected')

    async def receive(self, text_data):
        recever_dict = json.loads(text_data)
        # message = recever_dict['message']
        # action = recever_dict['action']
        # recever_dict['message']['reciver_channel_name'] = self.channel_name

        # if action == 'new-offer' or action=='new-answer':
        #     # reciver_channel_name = recever_dict['message']['reciver_channel_name']
        #     # recever_dict['message']['reciver_channel_name'] = self.channel_name

        #     await self.channel_layer.send(
        #         self.channel_name,
        #         {
        #             'type': 'send_webrtc_spd',
        #             'recever_dict':recever_dict
        #         }
        #     )


        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'send_webrtc_spd',
                'recever_dict':recever_dict
            }
        )

    async def send_webrtc_spd(self, event):
        recever_dict = event['recever_dict']

        await self.send(text_data=json.dumps(recever_dict))

