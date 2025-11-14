import json
from database.db_utils import get_db_connection
from utils.response_utils import parse_json_body, send_json_response, send_error_response 
import mysql.connector

# Lista de colunas que permitimos que sejam editadas.
EDIT_COLUMNS_WHITELIST = ['titulo', 'ano', 'sinopse', 'poster_url']

def handle_get_pending_filmes(handler_instance):
    
    conn = get_db_connection()
    if not conn:
        send_error_response(handler_instance, 500, "Erro interno do servidor (Banco de dadso).")
        return

    cursor = conn.cursor(dictionary=True)
    
    query = """
        SELECT s.*, u.nome AS solicitado_por_nome
        FROM solicitacoes_adicao s
        LEFT JOIN usuarios u ON s.solicitado_por_id = u.id
        WHERE s.status = 'pendente'
        ORDER BY data_solicitacao ASC;
    """
    
    try:
        cursor.execute(query)
        solicitacoes = cursor.fetchall()
        
        send_json_response(handler_instance, 200, solicitacoes)
        
    except mysql.connector.Error as err:
        send_error_response(handler_instance, 500, f"Erro no banco de dados: {err.errno} ({err.sqlstate}): {err.msg}")
    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn and conn.is_connected():
            conn.close()


def _processar_e_linkar_dados(cursor, filme_id, tabela_catalogo, tabela_link, coluna_link, texto_csv):
    """
    Função helper interna para processar texto (ex: "Ator1, Ator2")
    """
    if not texto_csv: 
        return
        
    nomes = [nome.strip() for nome in texto_csv.split(',')]
    for nome in nomes:
        if not nome: continue 

        cursor.execute(f"SELECT id FROM {tabela_catalogo} WHERE nome = %s", (nome,))
        resultado = cursor.fetchone()
        
        if resultado:
            item_id = resultado['id']
        else:
            cursor.execute(f"INSERT INTO {tabela_catalogo} (nome) VALUES (%s)", (nome,))
            item_id = cursor.lastrowid 
            
        cursor.execute(f"INSERT IGNORE INTO {tabela_link} (filme_id, {coluna_link}) VALUES (%s, %s)", (filme_id, item_id))


def handle_approve_filme(handler_instance, solicitacao_id):

    
    conn = get_db_connection()
    if not conn:
        send_error_response(handler_instance, 500, "Erro interno do servidor (DB).")
        return

    conn.autocommit = False 
    cursor = conn.cursor(dictionary=True)
    
    try:
        cursor.execute("SELECT * FROM solicitacoes_adicao WHERE id = %s AND status = 'pendente'", (solicitacao_id,))
        solicitacao = cursor.fetchone()
        
        if not solicitacao:
            send_error_response(handler_instance, 404, "Solicitação não encontrada ou já processada.")
            return

        query_filme = """
            INSERT INTO filmes (titulo, ano, sinopse, poster_url)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(query_filme, (
            solicitacao['titulo'], solicitacao['ano'], 
            solicitacao['sinopse'], solicitacao['poster_url']
        ))
        
        filme_id = cursor.lastrowid 

        _processar_e_linkar_dados(cursor, filme_id, 'generos', 'filmes_generos', 'genero_id', solicitacao['generos_texto'])
        _processar_e_linkar_dados(cursor, filme_id, 'diretores', 'filmes_diretores', 'diretor_id', solicitacao['diretores_texto'])
        _processar_e_linkar_dados(cursor, filme_id, 'atores', 'filmes_atores', 'ator_id', solicitacao['atores_texto'])

        cursor.execute("UPDATE solicitacoes_adicao SET status = 'aprovado' WHERE id = %s", (solicitacao_id,))
        
        conn.commit()
        
        send_json_response(handler_instance, 200, {
            "mensagem": "Filme aprovado e publicado com sucesso.",
            "filme_id_criado": filme_id
        })

    except mysql.connector.Error as err:
        conn.rollback()
        send_error_response(handler_instance, 500, f"Erro no banco de dados durante a transação: {err}")
    except Exception as e:
        conn.rollback()
        send_error_response(handler_instance, 500, f"Erro inesperado: {e}")
    finally:
        conn.autocommit = True
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn and conn.is_connected():
            conn.close()


def handle_delete_filme(handler_instance, filme_id):

    
    conn = get_db_connection()
    if not conn:
        send_error_response(handler_instance, 500, "Erro interno do servidor (DB).")
        return

    cursor = conn.cursor()
    
    try:
        query = "DELETE FROM filmes WHERE id = %s"
        cursor.execute(query, (filme_id,))
        
        if cursor.rowcount == 0:
            send_error_response(handler_instance, 404, "Filme não encontrado para deletar.")
        else:
            conn.commit() 
            send_json_response(handler_instance, 200, {
                "mensagem": "Filme deletado com sucesso."
            })
        
    except mysql.connector.Error as err:
        conn.rollback() 
        send_error_response(handler_instance, 500, f"Erro no banco de dados: {err}")
    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn and conn.is_connected():
            conn.close()

def handle_approve_edit(handler_instance, solicitacao_id):

    conn = get_db_connection()
    if not conn:
        send_error_response(handler_instance, 500, "Erro interno do servidor (DB).")
        return
        
    conn.autocommit = False
    cursor = conn.cursor(dictionary=True)
    
    try:
        cursor.execute("SELECT * FROM solicitacoes_edicao WHERE id = %s AND status = 'pendente'", (solicitacao_id,))
        solicitacao = cursor.fetchone()
        
        if not solicitacao:
            send_error_response(handler_instance, 404, "Solicitação de edição não encontrada ou já processada.")
            return

        filme_id = solicitacao['filme_id']
        campo = solicitacao['campo_alterado']
        valor_novo = solicitacao['valor_novo']
        
        if campo not in EDIT_COLUMNS_WHITELIST:
            raise ValueError(f"A edição do campo '{campo}' não é permitida por razões de segurança.")
        
        query_update = f"UPDATE filmes SET {campo} = %s WHERE id = %s"
        cursor.execute(query_update, (valor_novo, filme_id))

        cursor.execute("UPDATE solicitacoes_edicao SET status = 'aprovado' WHERE id = %s", (solicitacao_id,))
        
        conn.commit()
        send_json_response(handler_instance, 200, {"mensagem": f"Alteração do campo '{campo}' aprovada com sucesso."})

    except (mysql.connector.Error, ValueError) as err:
        conn.rollback() 
        send_error_response(handler_instance, 500, f"Erro ao aprovar edição: {err}")
    finally:
        conn.autocommit = True
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn and conn.is_connected():
            conn.close()


def handle_reject_edit(handler_instance, solicitacao_id):
    
    conn = get_db_connection()
    if not conn:
        send_error_response(handler_instance, 500, "Erro interno do servidor (DB).")
        return
        
    cursor = conn.cursor()
    
    try:
        query = "UPDATE solicitacoes_edicao SET status = 'rejeitado' WHERE id = %s AND status = 'pendente'"
        cursor.execute(query, (solicitacao_id,))
        
        if cursor.rowcount == 0:
            send_error_response(handler_instance, 404, "Solicitação de edição não encontrada ou já processada.")
        else:
            conn.commit()
            send_json_response(handler_instance, 200, {"mensagem": "Solicitação de edição rejeitada com sucesso."})
            
    except mysql.connector.Error as err:
        conn.rollback()
        send_error_response(handler_instance, 500, f"Erro ao rejeitar edição: {err}")
    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn and conn.is_connected():
            conn.close()

def handle_get_solicitacao_by_id(handler_instance, solicitacao_id):

    conn = get_db_connection()
    if not conn:
        send_error_response(handler_instance, 500, "Erro interno do servidor (DB).")
        return

    cursor = conn.cursor(dictionary=True)
    
    query = """
        SELECT s.*, u.nome AS solicitado_por_nome
        FROM solicitacoes_adicao s
        JOIN usuarios u ON s.solicitado_por_id = u.id
        WHERE s.id = %s;
    """
    
    try:
        cursor.execute(query, (solicitacao_id,))
        solicitacao = cursor.fetchone()
        
        if not solicitacao:
            send_error_response(handler_instance, 404, "Solicitação não encontrada.")
            return
            
        send_json_response(handler_instance, 200, solicitacao)
        
    except mysql.connector.Error as err:
        send_error_response(handler_instance, 500, f"Erro no banco de dados: {err}")
    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn and conn.is_connected():
            conn.close()


def handle_reject_filme(handler_instance, solicitacao_id):
    
    conn = get_db_connection()
    if not conn:
        send_error_response(handler_instance, 500, "Erro interno do servidor (DB).")
        return
        
    cursor = conn.cursor()
    
    try:
        query = "UPDATE solicitacoes_adicao SET status = 'rejeitado' WHERE id = %s AND status = 'pendente'"
        cursor.execute(query, (solicitacao_id,))
        
        if cursor.rowcount == 0:
            send_error_response(handler_instance, 404, "Solicitação de adição não encontrada ou já processada.")
        else:
            conn.commit()
            send_json_response(handler_instance, 200, {"mensagem": "Solicitação de adição rejeitada com sucesso."})
            
    except mysql.connector.Error as err:
        conn.rollback()
        send_error_response(handler_instance, 500, f"Erro ao rejeitar adição: {err}")
    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn and conn.is_connected():
            conn.close()


def handle_direct_create_filme(handler_instance, user_data):

    
    body = parse_json_body(handler_instance)
    if not body:
        send_error_response(handler_instance, 400, "Corpo da requisição inválido ou vazio.")
        return

    titulo = body.get('titulo')
    sinopse = body.get('sinopse')
    poster_url = body.get('poster_url')
    
    if not titulo or not sinopse or not poster_url:
        send_error_response(handler_instance, 400, "Campos 'titulo', 'sinopse' e 'poster_url' são obrigatórios.")
        return

    conn = get_db_connection()
    if not conn:
        send_error_response(handler_instance, 500, "Erro interno do servidor (DB).")
        return

    conn.autocommit = False 
    cursor = conn.cursor(dictionary=True)
    
    try:
        query_filme = """
            INSERT INTO filmes (titulo, ano, sinopse, poster_url)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(query_filme, (
            titulo, body.get('ano'), 
            sinopse, poster_url
        ))
        
        filme_id = cursor.lastrowid 

        _processar_e_linkar_dados(cursor, filme_id, 'generos', 'filmes_generos', 'genero_id', body.get('generos_texto'))
        _processar_e_linkar_dados(cursor, filme_id, 'diretores', 'filmes_diretores', 'diretor_id', body.get('diretores_texto'))
        _processar_e_linkar_dados(cursor, filme_id, 'atores', 'filmes_atores', 'ator_id', body.get('atores_texto'))

        conn.commit()
        
        send_json_response(handler_instance, 201, {
            "mensagem": "Filme criado e publicado com sucesso (Adição Direta).",
            "filme_id_criado": filme_id
        })

    except mysql.connector.Error as err:
        conn.rollback()
        send_error_response(handler_instance, 500, f"Erro no banco de dados durante a transação: {err}")
    except Exception as e:
        conn.rollback()
        send_error_response(handler_instance, 500, f"Erro inesperado: {e}")
    finally:
        conn.autocommit = True
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn and conn.is_connected():
            conn.close()


def handle_direct_edit_filme(handler_instance, filme_id, user_data):

    
    body = parse_json_body(handler_instance)
    if not body:
        send_error_response(handler_instance, 400, "Corpo da requisição inválido ou vazio.")
        return

    conn = get_db_connection()
    if not conn:
        send_error_response(handler_instance, 500, "Erro interno do servidor (DB).")
        return

    conn.autocommit = False 
    cursor = conn.cursor(dictionary=True)
    
    try:
        cursor.execute("SELECT id FROM filmes WHERE id = %s", (filme_id,))
        if not cursor.fetchone():
            send_error_response(handler_instance, 404, "Filme não encontrado para editar.")
            return

        query_update_filme = """
            UPDATE filmes 
            SET 
                titulo = COALESCE(%s, titulo),
                ano = COALESCE(%s, ano),
                sinopse = COALESCE(%s, sinopse),
                poster_url = COALESCE(%s, poster_url)
            WHERE id = %s
        """
        cursor.execute(query_update_filme, (
            body.get('titulo'), body.get('ano'),
            body.get('sinopse'), body.get('poster_url'),
            filme_id
        ))
 
        if 'generos_texto' in body:
            cursor.execute("DELETE FROM filmes_generos WHERE filme_id = %s", (filme_id,))
            _processar_e_linkar_dados(cursor, filme_id, 'generos', 'filmes_generos', 'genero_id', body.get('generos_texto'))

        if 'diretores_texto' in body:
            cursor.execute("DELETE FROM filmes_diretores WHERE filme_id = %s", (filme_id,))
            _processar_e_linkar_dados(cursor, filme_id, 'diretores', 'filmes_diretores', 'diretor_id', body.get('diretores_texto'))

        if 'atores_texto' in body:
            cursor.execute("DELETE FROM filmes_atores WHERE filme_id = %s", (filme_id,))
            _processar_e_linkar_dados(cursor, filme_id, 'atores', 'filmes_atores', 'ator_id', body.get('atores_texto'))

        conn.commit()
        
        send_json_response(handler_instance, 200, {
            "mensagem": "Filme atualizado com sucesso (Edição Direta)."
        })

    except mysql.connector.Error as err:
        conn.rollback()
        send_error_response(handler_instance, 500, f"Erro no banco de dados durante a transação: {err}")
    except Exception as e:
        conn.rollback()
        send_error_response(handler_instance, 500, f"Erro inesperado: {e}")
    finally:
        conn.autocommit = True
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn and conn.is_connected():
            conn.close()