set -o errexit

pip install -r requirements.txt
export DJANGO_SETTINGS_MODULE=webrtc.settings
python manage.py migrate
