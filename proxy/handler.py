import sys
sys.path.insert(0, "package/")

import json
import logging
# import datetime as dt
# import newrelic.agent
from schema import schema

logger = logging.getLogger()
logger.setLevel(logging.INFO)


# @newrelic.agent.lambda_handler()
def handler(event, context):
    # newrelic.agent.initialize()
    # newrelic.agent.record_custom_event('export call', {
    #     'time': dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f"),
    # })

    # Deserialising resquests data.
    query = json.loads(event["body"])["query"]
    logger.info(f"q: {query}")

    try:
        result = schema.execute(query)
        if result.data is None:
            logger.error("Invalid query")
            logger.error(result.errors)
            return {
                "statusCode": 400,
                "body": "No data found. Make sure your query contains valid attributes.",
                "headers": {
                    "Content-Type": "application/json",
                }
            }

        if result.data['company'] is None:
            logger.error("Invalid parameters")
            logger.error(result.errors)
            return {
                "statusCode": 400,
                "body": ("No data found. Make sure your query parameters are correct.\n"
                         "Dates are formatted as YYYY-MM-DD.")
            }
        # newrelic.agent.record_custom_event('GraphQL success', {
        #     'time': dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f"),
        # })
        logger.info("graphql query success")
        return {
            "statusCode": 200,
            "body": json.dumps(result.data),
            "headers": {
                "Content-Type": "application/json",
            },
        }
    except Exception:
        logger.error("schema does not execute")
        # newrelic.agent.record_custom_event('GraphQL failed', {
        #     'time': dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f"),
        #     'invalid query': query
        # })
        return {
            "statusCode": 400,
            "body": "Invalid query. Check the format of your query.",
            "headers": {
                "Content-Type": "application/json",
            },
        }

# def read_company(company):
#     with open(f"code/graphql_export/stock_data/{company}_ohlc.json") as file:
#         json_object = json.load(file)
#     return json_object
