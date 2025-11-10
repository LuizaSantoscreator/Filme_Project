import json
from database.db_utils import get_db_connection
from utils.response_utils import parse_json_body, send_json_response, send_error_response
from utils.auth_utils import hash_password, check_password, create_token
import mysql.connector

def handle_register(handler_instance):
    """ Lida com [POST] /register - Registro de novo usuário."""
    body = parse_json_body(handler_instance)
    if not body:
        send_error_response(handler_instance, 400, "Corpo da requisição inválido ou vazio.")
        return

    # Validação dos campos
    nome = body.get('nome')
    email = body.get('email')
    senha = body.get('senha')
    
    # Pega o NOME do role ('comum' ou 'adm')
    role_nome = body.get('role', 'comum') 

    if not nome or not email or not senha:
        send_error_response(handler_instance, 400, "Campos 'nome', 'email' e 'senha' são obrigatórios.")
        return

    if role_nome not in ['comum', 'adm']:
        send_error_response(handler_instance, 400, "Role deve ser 'comum' ou 'adm'.")
        return
    
    # Converte o nome para o ID
    role_id_para_inserir = 1 if role_nome == 'comum' else 2

    # Criptografa a senha antse de salvar
    senha_hashed = hash_password(senha)

    conn = get_db_connection()
    if not conn:
        send_error_response(handler_instance, 500, "Erro interno do servidor (Banco de dados).")
        return
    
    cursor = conn.cursor()
    query = "INSERT INTO usuarios (nome, email, senha, role_id) VALUES (%s, %s, %s, %s)"
    
    try:
        #Passa o numero para a query
        cursor.execute(query, (nome, email, senha_hashed, role_id_para_inserir))
        conn.commit()
        send_json_response(handler_instance, 201, {"mensagem": "Usuário criado com sucesso."})

    except mysql.connector.Error as err:
        if err.errno == 1062: # Código de erro para email já existe
            send_error_response(handler_instance, 409, "Email já cadastrado.")
        else:
            # Envia o erro do mysql
            send_error_response(handler_instance, 500, f"Erro no banco de dados: {err.errno} ({err.sqlstate}): {err.msg}")
    finally:
        # Fecha a conexão e o cursor
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn and conn.is_connected():
            conn.close()


def handle_login(handler_instance):
    """ Lida com [POST] /login - Login do usuário."""
    body = parse_json_body(handler_instance)
    if not body:
        send_error_response(handler_instance, 400, "Corpo da requisição inválido ou vazio.")
        return

    email = body.get('email')
    senha_digitada = body.get('senha')

    if not email or not senha_digitada:
        send_error_response(handler_instance, 400, "Campos 'email' e 'senha' são obrigatórios.")
        return

    conn = get_db_connection()
    if not conn:
        send_error_response(handler_instance, 500, "Erro interno do servidor (BAncod e dados).")
        return
    
    cursor = conn.cursor(dictionary=True) 
    
    #Busca o usuário e o nome do seu role
    query = """
        SELECT u.*, r.nome AS role_nome 
        FROM usuarios u
        JOIN roles r ON u.role_id = r.id
        WHERE u.email = %s
    """
    
    try:
        cursor.execute(query, (email,))
        usuario = cursor.fetchone()

        if not usuario:
            send_error_response(handler_instance, 404, "Usuário ou senha inválidos.")
            return 

        # Pega a senha HASHED do banco
        senha_hashed_do_banco = usuario['senha']

        # Compara a senha digitada com a senha hashed do banco
        if check_password(senha_digitada, senha_hashed_do_banco):
            token = create_token(user_id=usuario['id'], user_role=usuario['role_nome'])
            
            # Envia o token para o front-end
            send_json_response(handler_instance, 200, {
                "mensagem": "Login bem-sucedido!",
                "token": token,
                "usuario": {
                    "nome": usuario['nome'],
                    "email": usuario['email'],
                    "role": usuario['role_nome'] # Envia o NOME do role
                }
            })
        else:
            # Senha incorreta
            send_error_response(handler_instance, 401, "Usuário ou senha inválidos.")
            
    except mysql.connector.Error as err:
        send_error_response(handler_instance, 500, f"Erro no banco de dados: {err.errno} ({err.sqlstate}): {err.msg}")
    
    finally:
        # O finally é executado
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn and conn.is_connected():
            conn.close()