import mysql.connector
from .db_config import DB_CONFIG

# Função simples para abrir conexão com o banco
def get_db_connection():
    try:
        # Tento conectar usando as configurações do arquivo db_config
        conn = mysql.connector.connect(**DB_CONFIG)
        return conn
    except mysql.connector.Error as err:
        print(f"Erro ao conectar ao Banco de dados: {err}")
        return None