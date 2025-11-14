from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import re
from handlers import auth_handler
from handlers import filmes_handler
from handlers import admin_handler 
from utils.auth_utils import verify_token
from utils.response_utils import send_json_response, send_error_response

from handlers.admin_handler import (
    handle_get_solicitacao_by_id, 
    handle_reject_filme, 
    handle_direct_create_filme,
    handle_direct_edit_filme
)

class SimpleAPIHandler(BaseHTTPRequestHandler):


    def _send_cors_headers(self):

        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization') 

    def do_OPTIONS(self):
        self.send_response(204) 
        self._send_cors_headers()
        self.end_headers()

    def _get_user_data_from_token(self):

        auth_header = self.headers.get('Authorization')
        if not auth_header:
            return None
        
        try:
            token_type, token = auth_header.split(' ')
            if token_type.lower() != 'bearer':
                return None
            return verify_token(token)
        except Exception as e:
            print(f"Erro ao validar token: {e}")
            return None


    def do_GET(self):
        
        if self.path.startswith('/filmes/buscar'):
            filmes_handler.handle_search_filmes(self) 
            
        elif re.match(r'/filmes/(\d+)', self.path):
            try:
                filme_id = int(re.match(r'/filmes/(\d+)', self.path).group(1))
                filmes_handler.handle_get_filme_by_id(self, filme_id) 
            except ValueError:
                send_error_response(self, 400, "ID do filme inválido.")

        elif self.path == '/filmes':
            filmes_handler.handle_get_all_filmes(self) 
            
        elif self.path == '/admin/solicitacoes':
            user_data = self._get_user_data_from_token()
            if user_data and user_data['role'] == 'adm':
                admin_handler.handle_get_pending_filmes(self)
            else:
                send_error_response(self, 403, "Acesso negado. Rota exclusiva para administradores.")
        
        elif re.match(r'/admin/solicitacoes/(\d+)', self.path):
            user_data = self._get_user_data_from_token()
            if user_data and user_data['role'] == 'adm':
                try:
                    solicitacao_id = int(re.match(r'/admin/solicitacoes/(\d+)', self.path).group(1))
                    handle_get_solicitacao_by_id(self, solicitacao_id) # <-- ATIVADO
                except ValueError:
                    send_error_response(self, 400, "ID da solicitação inválido.")
            else:
                send_error_response(self, 403, "Acesso negado. Rota exclusiva para administradores.")
        
        else:
            send_error_response(self, 404, "Rota não encontrada.")

    def do_POST(self):
        
        if self.path == '/login':
            auth_handler.handle_login(self)

        elif self.path == '/register':
            auth_handler.handle_register(self)
        
        elif self.path == '/filmes':
            user_data = self._get_user_data_from_token()
            if user_data: 
                filmes_handler.handle_create_filme(self, user_data) 
                send_error_response(self, 401, "Não autorizado. Token inválido ou ausente.")
        
        elif self.path == '/admin/filmes':
            user_data = self._get_user_data_from_token()
            if user_data and user_data['role'] == 'adm':
                handle_direct_create_filme(self, user_data)
            else:
                send_error_response(self, 403, "Acesso negado. Rota exclusiva para administradores.")


        else:
            send_error_response(self, 404, "Rota não encontrada.")
            
            
    def do_PUT(self):

        match_approve_add = re.match(r'/admin/aprovar/(\d+)', self.path)
        match_approve_edit = re.match(r'/admin/aprovar-edicao/(\d+)', self.path) 
        match_reject_edit = re.match(r'/admin/rejeitar-edicao/(\d+)', self.path) 
        match_edit_filme = re.match(r'/filmes/(\d+)', self.path)
        match_reject_add = re.match(r'/admin/rejeitar/(\d+)', self.path)
        match_admin_edit = re.match(r'/admin/filmes/(\d+)', self.path) 

        user_data = self._get_user_data_from_token()

        if match_approve_add:
            solicitacao_id = int(match_approve_add.group(1)) 
            if user_data and user_data['role'] == 'adm':
                admin_handler.handle_approve_filme(self, solicitacao_id) 
            else:
                send_error_response(self, 403, "Acesso negado. Rota exclusiva para administradores.")
            return

        elif match_approve_edit:
            solicitacao_id = int(match_approve_edit.group(1))
            if user_data and user_data['role'] == 'adm':
                admin_handler.handle_approve_edit(self, solicitacao_id) 
            else:
                send_error_response(self, 403, "Acesso negado. Rota exclusiva para administradores.")
            return

        elif match_reject_edit:
            solicitacao_id = int(match_reject_edit.group(1))
            if user_data and user_data['role'] == 'adm':
                admin_handler.handle_reject_edit(self, solicitacao_id)
            else:
                send_error_response(self, 403, "Acesso negado. Rota exclusiva para administradores.")
            return

        elif match_reject_add:
            solicitacao_id = int(match_reject_add.group(1))
            if user_data and user_data['role'] == 'adm':
                handle_reject_filme(self, solicitacao_id)
            else:
                send_error_response(self, 403, "Acesso negado. Rota exclusiva para administradores.")
            return

        elif match_admin_edit:
            filme_id = int(match_admin_edit.group(1))
            if user_data and user_data['role'] == 'adm':
                handle_direct_edit_filme(self, filme_id, user_data) 
            else:
                send_error_response(self, 403, "Acesso negado. Rota exclusiva para administradores.")
            return

        elif match_edit_filme:
            filme_id = int(match_edit_filme.group(1))
            if user_data: 
                filmes_handler.handle_edit_filme(self, filme_id, user_data)
            else:
                send_error_response(self, 401, "Não autorizado. Token inválido ou ausente.")
            return
            
        else:
            send_error_response(self, 404, "Rota não encontrada.")
            
    def do_DELETE(self):
        match = re.match(r'/filmes/(\d+)', self.path)
        if match:
            user_data = self._get_user_data_from_token()
            if user_data and user_data['role'] == 'adm': 
                try:
                    filme_id = int(match.group(1))
                    admin_handler.handle_delete_filme(self, filme_id) 
                except ValueError:
                    send_error_response(self, 400, "ID do filme inválido.")
            else:
                send_error_response(self, 403, "Acesso negado. Rota exclusiva para administradores.")
            return

        else:
            send_error_response(self, 404, "Rota não encontrada.")

def run(server_class=HTTPServer, handler_class=SimpleAPIHandler, port=8000):
    server_address = ('', port) 
    httpd = server_class(server_address, handler_class)
    print(f"Iniciando API em http://localhost:{port}/ ...")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor interrompido.")
        httpd.server_close()

if __name__ == '__main__':
    run()