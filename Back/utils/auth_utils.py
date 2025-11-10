import bcrypt
import jwt 
import datetime

# Chave secreta para tokens.
JWT_SECRET = "banana-de-pijamas"

def hash_password(password):
    # Gera um "hash" seguro da senha
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed

def check_password(password, hashed):
    # Verifica se a senha digitada bate com o hash salvo no banco
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id, user_role):
    # Cria um token JWT que expira em 24 horas
    payload = {
        'user_id': user_id,
        'role': user_role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
    return token

def verify_token(token):
    # Tenta decodificar um token. Retorna os dados (payload) ou None.
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        print("Token expirado")
        return None
    except jwt.InvalidTokenError:
        print("Token inválido")
        return None