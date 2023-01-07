import torch
import pandas as pd
import json
import csv
import torch.nn as nn
import torch.nn.functional as F

from transformers import BertTokenizer, BertForSequenceClassification

device = torch.device('cpu')

# SQS
import boto3
sqs = boto3.client('sqs')


class WebsiteClassifier(nn.Module):
    def __init__(self):
        super().__init__()
        # title and url feature extractor BERTs
        self.title_model = BertForSequenceClassification.from_pretrained('prajjwal1/bert-tiny', num_labels=384).to(dtype=torch.float32)
        self.url_model = BertForSequenceClassification.from_pretrained('prajjwal1/bert-tiny', num_labels=384).to(dtype=torch.float32)
                
        # classifier network
        self.classifier = nn.Sequential(
            nn.Linear(768, 650),
            nn.LeakyReLU(),
            nn.LayerNorm(650),
            nn.Linear(650, 600),
            nn.LeakyReLU(),
            nn.LayerNorm(600),
            nn.Linear(600, 588),
            nn.Softmax()
        ).to(dtype=torch.float32)
               
        self.optim = torch.optim.AdamW(self.parameters(), 1e-3)
    
    def forward(self, title, url):
        print(title)
        title_output = self.title_model(**title).logits.to(dtype=torch.float32).squeeze()
        url_output = self.url_model(**url).logits.to(dtype=torch.float32).squeeze()
        concated = torch.cat((title_output, url_output), dim=0).to(dtype=torch.float32)
        output = self.classifier(concated).to(dtype=torch.float32)
        return output


model_file = './model/model.pt'
tokenizer = BertTokenizer.from_pretrained('prajjwal1/bert-tiny')
model = WebsiteClassifier()
model.load_state_dict(torch.load(model_file, map_location=torch.device('cpu')))

cats_file = pd.read_csv("./model/categories.csv")
categories = list(csv.reader(cats_file, delimiter=","))
categories = list(cats_file["0"])

def get_top_categories(probabilities):
    values,top3 = torch.topk(probabilities, 3)
    top_cats = []
    for idx in top3:
        top_cats.append(categories[idx])
    return top_cats

def website_inference(event, context):
    title = event['body']['Title']
    url = event['body']['URL']

    title_embed = tokenizer(title, return_tensors='pt')
    url_embed = tokenizer(url, return_tensors='pt')

    probabilities = model.forward(title_embed, url_embed)
    label = get_top_categories(probabilities)

    return {
        'statusCode': 200,
        'body': json.dumps(
            {
                "predicted_label": label,
            }
        )
    }

# things to do: get the categories list and match them to probabilities, send the top 3 as a request
# make a local API to test
# setup the queue service for the model
# research lambda authorizer
# research storing model params in S3 - done
# deploy and test
# styles, stats, etc.