import json
from database.db_utils import get_db_connection
from utils.response_utils import parse_json_body, send_json_response, send_error_response
from utils.auth_utils import hash_password, check_password, create_token
import mysql.connector

# Essa função cuida do cadastro de novos usuários no sistema
def handle_register(handler_instance):
 
    # Primeiro, eu leio os dados que vieram na requisição (JSON)
    body = parse_json_body(handler_instance)
    if not body:
        send_error_response(handler_instance, 400, "Corpo da requisição inválido ou vazio.")
        return
    
    # Pego os campos que o usuário preencheu
    nome = body.get('nome')
    email = body.get('email')
    senha = body.get('senha')

    # Se não mandarem o 'role', eu assumo que é um usuário 'comum'
    role_nome = body.get('role', 'comum') 

    # Verifico se não faltou nada importante
    if not nome or not email or not senha:
        send_error_response(handler_instance, 400, "Campos 'nome', 'email' e 'senha' são obrigatórios.")
        return

    # Só aceito 'comum' ou 'adm' como tipo de usuário
    if role_nome not in ['comum', 'adm']:
        send_error_response(handler_instance, 400, "Role deve ser 'comum' ou 'adm'.")
        return

    # Traduzo o nome do role para o ID que está no banco (1 ou 2)
    role_id_para_inserir = 1 if role_nome == 'comum' else 2

    # Criptografo a senha antes de salvar, por segurança
    senha_hashed = hash_password(senha)

    # Tento conectar no banco de dados
    conn = get_db_connection()
    if not conn:
        send_error_response(handler_instance, 500, "Erro interno do servidor (Banco de dados).")
        return
    
    cursor = conn.cursor()
    # Preparo o comando SQL para inserir o novo usuário
    query = "INSERT INTO usuarios (nome, email, senha, role_id) VALUES (%s, %s, %s, %s)"
    
    try:
        # Executo o comando e salvo as alterações
        cursor.execute(query, (nome, email, senha_hashed, role_id_para_inserir))
        conn.commit()
        # Se der tudo certo, aviso que o usuário foi criado
        send_json_response(handler_instance, 201, {"mensagem": "Usuário criado com sucesso."})

    except mysql.connector.Error as err:
        # Se o erro for 1062, é porque o email já existe
        if err.errno == 1062: 
            send_error_response(handler_instance, 409, "Email já cadastrado.")
        else:
            send_error_response(handler_instance, 500, f"Erro no banco de dados: {err.errno} ({err.sqlstate}): {err.msg}")
    finally:
        # Fecho a conexão para não deixar aberta à toa
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn and conn.is_connected():
            conn.close()


# Essa função cuida do login e gera o token de acesso
def handle_login(handler_instance):
   
    # Leio os dados enviados (email e senha)
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
        send_error_response(handler_instance, 500, "Erro interno do servidor (Banco de dados).")
        return
    
    cursor = conn.cursor(dictionary=True) 
    
    # Busco o usuário e o tipo dele (role) pelo email
    query = """
        SELECT u.*, r.nome AS role_nome 
        FROM usuarios u
        JOIN roles r ON u.role_id = r.id
        WHERE u.email = %s
    """
    
    try:
        cursor.execute(query, (email,))
        usuario = cursor.fetchone()

        # Se não achar ninguém com esse email, aviso que está errado
        if not usuario:
            send_error_response(handler_instance, 404, "Usuário ou senha inválidos.")
            return 

        # Pego a senha criptografada que estava no banco
        senha_hashed_do_banco = usuario['senha']

        # Comparo a senha digitada com a do banco
        if check_password(senha_digitada, senha_hashed_do_banco):
            # Se bater, crio um token que vale por 24h
            token = create_token(user_id=usuario['id'], user_role=usuario['role_nome'])
            
            # Devolvo o token e os dados do usuário pro frontend
            send_json_response(handler_instance, 200, {
                "mensagem": "Login bem-sucedido!",
                "token": token,
                "usuario": {
                    "nome": usuario['nome'],
                    "email": usuario['email'],
                    "role": usuario['role_nome'] 
                }
            })
        else:
            # Se a senha não bater, erro 401
            send_error_response(handler_instance, 401, "Usuário ou senha inválidos.")
            
    except mysql.connector.Error as err:
        send_error_response(handler_instance, 500, f"Erro no banco de dados: {err.errno} ({err.sqlstate}): {err.msg}")
    
    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn and conn.is_connected():
            conn.close()