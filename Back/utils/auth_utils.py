import bcrypt
import jwt 
import datetime

# Chave secreta para assinar os tokens (ninguém pode saber!)
JWT_SECRET = "banana-de-pijamas"

# Função para criptografar a senha antes de salvar
def hash_password(password):
    # Crio um 'sal' aleatório e misturo com a senha
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed

# Função para ver se a senha digitada bate com a criptografada
def check_password(password, hashed):
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

# Função para criar o token de login (JWT)
def create_token(user_id, user_role):
    payload = {
        'user_id': user_id,
        'role': user_role,
        # Token vale por 24 horas
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }
    # Assino o token com minha chave secreta
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
    return token

# Função para ler e validar um token recebido
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