import bcrypt
import jwt 
import datetime

JWT_SECRET = "banana-de-pijamas"

def hash_password(password):
  
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed

def check_password(password, hashed):

    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id, user_role):

    payload = {
        'user_id': user_id,
        'role': user_role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
    return token

def verify_token(token):

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        print("Token expirado")
        return None
    except jwt.InvalidTokenError:
        print("Token inválido")
        return None