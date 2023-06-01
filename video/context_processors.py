class Usrs:
    def __init__(self, name=None):
        self.UserNameJs = name

    def __str__(self):
        return self.UserNameJs

a=Usrs('Guest')

def get_data_user(request,user_n=False):
    global a
    if request.user.is_authenticated:
        a=Usrs(request.user.username)
    elif user_n:
        a=Usrs(user_n)
    else:
        a=Usrs('Guest')

def get_current_username(request):
    global a
    print(a)
    cr_user = a.UserNameJs

    return {
        'current_user' : cr_user,
    }
