import json
import datetime

# Configura os cabeçalhos básicos da resposta (tipo de conteúdo, CORS)
def send_response_base(handler_instance, status_code, content_type='text/plain'):
    handler_instance.send_response(status_code)
    handler_instance.send_header('Content-type', content_type)
    # Permito que qualquer origem acesse minha API (CORS)
    handler_instance.send_header('Access-Control-Allow-Origin', '*')
    # Não fecho o header aqui ainda, pra poder adicionar o tamanho do conteúdo depois

# Função pronta para enviar um erro (ex: 404, 500)
def send_error_response(handler_instance, status_code, message):
    error_payload = {"erro": message}
    json_bytes = json.dumps(error_payload).encode('utf-8')
    
    send_response_base(handler_instance, status_code, 'application/json')
    # Aviso o tamanho da resposta para o navegador não se perder
    handler_instance.send_header('Content-Length', str(len(json_bytes)))
    handler_instance.end_headers()
    
    handler_instance.wfile.write(json_bytes)

# Lê o corpo da requisição e transforma de JSON para dicionário Python
def parse_json_body(handler_instance):
    try:
        content_length_header = handler_instance.headers.get('Content-Length')
        if not content_length_header:
            return None
            
        content_length = int(content_length_header)
        if content_length == 0:
            return None
            
        body = handler_instance.rfile.read(content_length)
        return json.loads(body.decode('utf-8'))
    except (json.JSONDecodeError, TypeError, KeyError, ValueError):
        return None

# Classe especial para ajudar a converter datas em texto JSON
class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (datetime.datetime, datetime.date)):
            return obj.isoformat()
        return super().default(obj)

# Função pronta para enviar uma resposta de sucesso com dados JSON
def send_json_response(handler_instance, status_code, payload):
    json_bytes = json.dumps(payload, cls=CustomJSONEncoder).encode('utf-8')
    
    send_response_base(handler_instance, status_code, 'application/json')
    # Aviso o tamanho da resposta
    handler_instance.send_header('Content-Length', str(len(json_bytes)))
    handler_instance.end_headers()
    
    handler_instance.wfile.write(json_bytes)