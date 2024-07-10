import json
import os
import openai

# 
__import__('pysqlite3')
import sys
sys.modules['sqlite3'] = sys.modules.pop('pysqlite3')

from decimal import Decimal
from llamaindex_utils import llamaindex_initialize, llamaindex_create_index, llamaindex_query

version = '0.0.1-beta-1'

openai.api_key = os.environ["OPENAI_API_KEY"]

def decimal_to_int(obj):
    if isinstance(obj, Decimal):
        return int(obj)

def lambda_handler(event, context):
    print(version)
    user = event['requestContext']['authorizer']['claims']['cognito:username']
    print(user)

    body = json.loads(event['body'])

    llamaindex_initialize()
    loaded_index = llamaindex_create_index()

    message = llamaindex_query(body['question'], loaded_index)
    print(['message.response',  message.response])

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": message.response,
        }, default=decimal_to_int, ensure_ascii=False),
    }

