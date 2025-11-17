import json
from urllib.parse import urlparse, parse_qs
from database.db_utils import get_db_connection
from utils.response_utils import parse_json_body, send_json_response, send_error_response 
import mysql.connector

# Pega todos os filmes para mostrar na tela principal
def handle_get_all_filmes(handler_instance):

    conn = get_db_connection()
    if not conn:
        send_error_response(handler_instance, 500, "Erro interno do servidor.")
        return

    cursor = conn.cursor(dictionary=True)
    
    # Busco os filmes e junto os gêneros numa string só, separada por vírgula
    query = """
        SELECT 
            f.id, f.titulo, f.ano, f.sinopse, f.poster_url,
            GROUP_CONCAT(DISTINCT g.nome SEPARATOR ', ') AS generos
        FROM filmes f
        LEFT JOIN filmes_generos fg ON f.id = fg.filme_id
        LEFT JOIN generos g ON fg.genero_id = g.id
        GROUP BY f.id, f.titulo, f.ano, f.sinopse, f.poster_url;
    """
    
    try:
        cursor.execute(query)
        filmes = cursor.fetchall()
        
        # Transformo a string de gêneros em uma lista de verdade pro Python
        for filme in filmes:
            if filme['generos']:
                filme['generos'] = filme['generos'].split(', ')
            else:
                filme['generos'] = []
        
        send_json_response(handler_instance, 200, filmes)
        
    except mysql.connector.Error as err:
        send_error_response(handler_instance, 500, f"Erro no banco de dados: {err}")
    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn and conn.is_connected():
            conn.close()


# Busca um filme específico pelo ID (para a tela de detalhes)
def handle_get_filme_by_id(handler_instance, filme_id):

    conn = get_db_connection()
    if not conn:
        send_error_response(handler_instance, 500, "Erro interno do servidor.")
        return

    cursor = conn.cursor(dictionary=True)
    
    query = """
        SELECT 
            f.id, f.titulo, f.ano, f.sinopse, f.poster_url,
            GROUP_CONCAT(DISTINCT g.nome SEPARATOR ', ') AS generos,
            GROUP_CONCAT(DISTINCT d.nome SEPARATOR ', ') AS diretores,
            GROUP_CONCAT(DISTINCT a.nome SEPARATOR ', ') AS atores
        FROM filmes f
        LEFT JOIN filmes_generos fg ON f.id = fg.filme_id
        LEFT JOIN generos g ON fg.genero_id = g.id
        LEFT JOIN filmes_diretores fd ON f.id = fd.filme_id
        LEFT JOIN diretores d ON fd.diretor_id = d.id
        LEFT JOIN filmes_atores fa ON f.id = fa.filme_id
        LEFT JOIN atores a ON fa.ator_id = a.id
        WHERE f.id = %s
        GROUP BY f.id, f.titulo, f.ano, f.sinopse, f.poster_url;
    """
    
    try:
        cursor.execute(query, (filme_id,))
        filme = cursor.fetchone()
        
        if not filme:
            send_error_response(handler_instance, 404, "Filme não encontrado.")
            return

        def split_to_list(value):
            if value:
                return value.split(', ')
            return []

        filme['generos'] = split_to_list(filme['generos'])
        filme['diretores'] = split_to_list(filme['diretores'])
        filme['atores'] = split_to_list(filme['atores'])
        
        send_json_response(handler_instance, 200, filme)
        
    except mysql.connector.Error as err:
        send_error_response(handler_instance, 500, f"Erro no banco: {err}")
    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn and conn.is_connected():
            conn.close()


# Cria uma solicitação de filme (para usuários comuns)
def handle_create_filme(handler_instance, user_data):
    
    body = parse_json_body(handler_instance)
    if not body:
        send_error_response(handler_instance, 400, "Requisição inválida.")
        return

    titulo = body.get('titulo')
    sinopse = body.get('sinopse')
    poster_url = body.get('poster_url')
    if not titulo or not sinopse or not poster_url:
        send_error_response(handler_instance, 400, "Campos obrigatórios faltando.")
        return

    solicitado_por_id = user_data['user_id']
    
    conn = get_db_connection()
    if not conn:
        send_error_response(handler_instance, 500, "Erro no DB.")
        return

    cursor = conn.cursor()
    
    # Insiro na tabela de SOLICITAÇÕES, não na de filmes
    query = """
        INSERT INTO solicitacoes_adicao 
        (titulo, ano, sinopse, poster_url, generos_texto, diretores_texto, atores_texto, 
         solicitado_por_id, status) 
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    
    dados_para_inserir = (
        titulo, body.get('ano'), sinopse, poster_url, 
        body.get('generos_texto'), body.get('diretores_texto'), body.get('atores_texto'),
        solicitado_por_id,
        'pendente'
    )
    
    try:
        cursor.execute(query, dados_para_inserir)
        conn.commit()
        send_json_response(handler_instance, 201, {
            "mensagem": "Filme enviado para aprovação com sucesso."
        })
        
    except mysql.connector.Error as err:
        send_error_response(handler_instance, 500, f"Erro no banco: {err}")
    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn and conn.is_connected():
            conn.close()


# Função de busca avançada com filtros
def handle_search_filmes(handler_instance):
    
    # Pego os parâmetros da URL (ex: ?titulo=Batman&ano=2008)
    parsed_path = urlparse(handler_instance.path)
    query_params = parse_qs(parsed_path.query)

    conn = get_db_connection()
    if not conn:
        send_error_response(handler_instance, 500, "Erro no DB.")
        return

    cursor = conn.cursor(dictionary=True)
    
    base_query = """
        SELECT 
            f.id, f.titulo, f.ano, f.sinopse, f.poster_url,
            GROUP_CONCAT(DISTINCT g.nome SEPARATOR ', ') AS generos,
            GROUP_CONCAT(DISTINCT d.nome SEPARATOR ', ') AS diretores,
            GROUP_CONCAT(DISTINCT a.nome SEPARATOR ', ') AS atores
        FROM filmes f
        LEFT JOIN filmes_generos fg ON f.id = fg.filme_id
        LEFT JOIN generos g ON fg.genero_id = g.id
        LEFT JOIN filmes_diretores fd ON f.id = fd.filme_id
        LEFT JOIN diretores d ON fd.diretor_id = d.id
        LEFT JOIN filmes_atores fa ON f.id = fa.filme_id
        LEFT JOIN atores a ON fa.ator_id = a.id
    """
    
    where_clauses = [] 
    params = []        

    # Vou montando a query dinamicamente com base no que o usuário preencheu
    if 'titulo' in query_params:
        titulo = query_params['titulo'][0]
        where_clauses.append("f.titulo LIKE %s")
        params.append(f"%{titulo}%") 

    if 'ano' in query_params:
        ano = query_params['ano'][0]
        where_clauses.append("f.ano = %s")
        params.append(ano)
        
    if 'genero' in query_params:
        genero = query_params['genero'][0]
        where_clauses.append("g.nome = %s")
        params.append(genero)
        
    if 'diretor' in query_params:
        diretor = query_params['diretor'][0]
        where_clauses.append("d.nome LIKE %s")
        params.append(f"%{diretor}%")
        
    if 'ator' in query_params:
        ator = query_params['ator'][0]
        where_clauses.append("a.nome LIKE %s")
        params.append(f"%{ator}%")

    query = base_query
    if where_clauses:
        query += " WHERE " + " AND ".join(where_clauses)
        
    query += " GROUP BY f.id, f.titulo, f.ano, f.sinopse, f.poster_url;"
    
    try:
        cursor.execute(query, tuple(params))
        filmes = cursor.fetchall()
        
        def split_to_list(value):
            if value:
                return value.split(', ')
            return []

        for filme in filmes:
            filme['generos'] = split_to_list(filme['generos'])
            filme['diretores'] = split_to_list(filme['diretores'])
            filme['atores'] = split_to_list(filme['atores'])

        send_json_response(handler_instance, 200, filmes)
        
    except mysql.connector.Error as err:
        send_error_response(handler_instance, 500, f"Erro no banco: {err}")
    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn and conn.is_connected():
            conn.close()

# Cria uma solicitação de edição
def handle_edit_filme(handler_instance, filme_id, user_data):
    
    body = parse_json_body(handler_instance)
    if not body:
        send_error_response(handler_instance, 400, "Requisição inválida.")
        return

    solicitado_por_id = user_data['user_id']

    conn = get_db_connection()
    if not conn:
        send_error_response(handler_instance, 500, "Erro no DB.")
        return

    conn.autocommit = False 
    cursor = conn.cursor(dictionary=True)
    
    try:
        cursor.execute("SELECT * FROM filmes WHERE id = %s", (filme_id,))
        filme_original = cursor.fetchone()
        
        if not filme_original:
            send_error_response(handler_instance, 404, "Filme não encontrado.")
            return

        query_insert = """
            INSERT INTO solicitacoes_edicao
            (filme_id, campo_alterado, valor_antigo, valor_novo, 
             solicitado_por_id, status)
            VALUES (%s, %s, %s, %s, %s, 'pendente')
        """
        
        alteracoes_enviadas = 0
        
        # Verifico cada campo para ver se mudou
        for campo, valor_novo in body.items():

            if campo in filme_original and campo != 'id':
                valor_antigo = str(filme_original[campo])
                valor_novo_str = str(valor_novo)

                # Só crio a solicitação se o valor for diferente do atual
                if valor_novo_str != valor_antigo:
                    cursor.execute(query_insert, (
                        filme_id,
                        campo,
                        valor_antigo,
                        valor_novo_str,
                        solicitado_por_id
                    ))
                    alteracoes_enviadas += 1

        if alteracoes_enviadas > 0:
            conn.commit()
            send_json_response(handler_instance, 202, {
                "mensagem": f"{alteracoes_enviadas} alterações enviadas para aprovação."
            })
        else:
            send_json_response(handler_instance, 200, {
                "mensagem": "Nenhuma alteração detectada."
            })

    except mysql.connector.Error as err:
        conn.rollback()
        send_error_response(handler_instance, 500, f"Erro no banco: {err}")
    except Exception as e:
        conn.rollback()
        send_error_response(handler_instance, 500, f"Erro: {e}")
    finally:
        conn.autocommit = True
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn and conn.is_connected():
            conn.close()