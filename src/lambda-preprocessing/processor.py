import os
import io
import boto3
import json
import csv
import numpy as np

# Lets try some stuff out
import sklearn
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer

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
    total = title + ' ' + text
    total = [total]
    
    # Create dict of training vocab
    vocab = json.loads(getVocab())
    
    # TODO: Transform data using vectorizer
    transformer = TfidfTransformer()
    loaded_vec = CountVectorizer(decode_error="replace", vocabulary=vocab)
    print("Type of loaded_vec {}".format(type(loaded_vec)))
    #print("Type of loaded_vec.fit_transform(total): {}".format(type(loaded_vec.fit_transform(total))))
    tfidf = transformer.fit_transform(loaded_vec.transform(total))
    
    # TODO: Convert transformed data into csv
    tfidf = tfidf.toarray()
    print("tfidf shape: {}".format(tfidf.shape))
    payload = np2csv(tfidf)

    # Invoke model on transformed data
    response = runtime.invoke_endpoint(EndpointName=ENDPOINT_NAME,
                                       ContentType='text/csv',
                                       Body=payload)
                                       
    # TODO: Return result from model
    print(response)
    result = json.loads(response['Body'].read().decode())
    #x = { 'result' : str(result)}
    #y = json.dumps(x)
    print("Result:")
    print(result)
    print(type(result))
    #pred = int(result['predictions'][0]['predicted_label'])
    return ((1-result)*10)
    
def getVocab():
    client = boto3.client("s3")
    result = client.get_object(Bucket="fakenewsdata", Key="sagemaker/DEMO-xgboost-regression/vocab/vocab.json")
    return result["Body"].read().decode()

def np2csv(arr):
    csv = io.BytesIO()
    np.savetxt(csv, arr, delimiter=',', fmt='%g')
    return csv.getvalue().decode().rstrip()