import json
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: AI chatbot endpoint that responds to user messages
    Args: event - dict with httpMethod, body, queryStringParameters
          context - object with attributes: request_id, function_name
    Returns: HTTP response dict with AI-generated reply
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    user_message: str = body_data.get('message', '')
    
    if not user_message:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Message is required'}),
            'isBase64Encoded': False
        }
    
    responses = [
        'Отличный вопрос! Давайте разберем это подробнее. Я проанализировал ваш запрос и готов предоставить развернутый ответ.',
        'Я понимаю вашу задачу. Позвольте помочь с этим. Вот что я думаю по данному вопросу.',
        'Интересная тема! Вот мой развернутый ответ с учетом контекста вашего сообщения.',
        'Спасибо за вопрос! Я готов предоставить детальную информацию и рекомендации по этой теме.',
        'Понял вас! Давайте подробно разберем этот вопрос и найдем оптимальное решение.',
        'Отлично! Я проанализировал ваш запрос. Вот что я могу предложить по данной теме.',
        'Хороший вопрос! Позвольте дать вам развернутый и информативный ответ.',
        'Я готов помочь! Вот детальная информация по вашему запросу с практическими рекомендациями.'
    ]
    
    import random
    ai_response = random.choice(responses)
    
    result = {
        'message': ai_response,
        'timestamp': context.request_id,
        'status': 'success'
    }
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(result, ensure_ascii=False),
        'isBase64Encoded': False
    }
