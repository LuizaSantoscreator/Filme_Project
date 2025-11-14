import json
import datetime

def send_response_base(handler_instance, status_code, content_type='text/plain'):
    handler_instance.send_response(status_code)
    handler_instance.send_header('Content-type', content_type)
    handler_instance.send_header('Access-Control-Allow-Origin', '*')
    handler_instance.end_headers()

def send_error_response(handler_instance, status_code, message):
    send_response_base(handler_instance, status_code, 'application/json')
    error_payload = {"erro": message}
    handler_instance.wfile.write(json.dumps(error_payload).encode('utf-8'))

def parse_json_body(handler_instance):
    try:
        content_length = int(handler_instance.headers['Content-Length'])
        if content_length == 0:
            return None
        body = handler_instance.rfile.read(content_length)
        return json.loads(body.decode('utf-8'))
    except (json.JSONDecodeError, TypeError, KeyError):
        return None

class CustomJSONEncoder(json.JSONEncoder):

    def default(self, obj):
        if isinstance(obj, (datetime.datetime, datetime.date)):
            return obj.isoformat()
        return super().default(obj)


def send_json_response(handler_instance, status_code, payload):
    send_response_base(handler_instance, status_code, 'application/json')
    
    json_bytes = json.dumps(payload, cls=CustomJSONEncoder).encode('utf-8')
    
    handler_instance.wfile.write(json_bytes)