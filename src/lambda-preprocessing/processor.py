import os
import io
import boto3
import json
import csv
#from sklearn.feature_extraction.text import TfidfVectorizer
#from sklearn.feature_extraction.text import CountVectorizer
#from sklearn.feature_extraction.text import TfidfTransformer

# grab environment variables
ENDPOINT_NAME = os.environ['ENDPOINT_NAME']
runtime= boto3.client('runtime.sagemaker')

def lambda_handler(event, context):
    
    # Parse JSON data
    print("Received event: " + json.dumps(event, indent=2))
    data = json.loads(json.dumps(event))
    url = data['url']
    title = data['title']
    text = data['text']
    total = title + text
    
    # Create dict of training vocab
    vocab = json.loads(getVocab())
    
    # TODO: Transform data using vectorizer
    # transformer = TfidfTransformer()
    # loaded_vec = CountVectorizer(decode_error="replace", vocabulary=vocab)
    # tfidf = transformer.fit_transform(loaded_vec.fit_transform(total))
    
    # TODO: Convert transformed data into csv
    
    # Invoke model on transformed data
    # response = runtime.invoke_endpoint(EndpointName=ENDPOINT_NAME,
    #                                   ContentType='text/csv',
    #                                   Body=payload)
                                       
    # TODO: Return result from model
    print(response)
    result = json.loads(response['Body'].read().decode())
    print(result)
    pred = int(result['predictions'][0]['predicted_label'])
    return pred
    
def getVocab():
    client = boto3.client("s3")
    result = client.get_object(Bucket="fakenewsdata", Key="sagemaker/DEMO-xgboost-regression/vocab/vocab.json")
    return result["Body"].read().decode()