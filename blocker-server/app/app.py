import torch
import json

import torch.nn as nn
import torch.nn.functional as F

from transformers import BertTokenizer, BertForSequenceClassification


device = torch.device('cpu')

class WebsiteClassifier(nn.Module):
    def __init__(self, ds):
        super().__init__()
        # title and url feature extractor BERTs
        self.title_model = BertForSequenceClassification.from_pretrained('prajjwal1/bert-tiny', num_labels=384).to(device, dtype=torch.float32)
        self.url_model = BertForSequenceClassification.from_pretrained('prajjwal1/bert-tiny', num_labels=384).to(device, dtype=torch.float32)
                
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
        ).to(device, dtype=torch.float32)
               
        self.optim = torch.optim.AdamW(self.parameters(), 1e-3)
        self.ds = ds
    
    def forward(self, title, url):
        title_output = self.title_model(**title).logits.to(device, dtype=torch.float32).squeeze()
        url_output = self.url_model(**url).logits.to(device, dtype=torch.float32).squeeze()
        concated = torch.concat((title_output, url_output), dim=0).to(device, dtype=torch.float32)
        output = self.classifier(concated).to(device, dtype=torch.float32)
        return output


model_file = '/opt/ml/model'
model = WebsiteClassifier()
model.load_state_dict(torch.load(model_file))

def get_top_categories(probabilities):

# things to do: get the categories list and match them to probabilities, send the top 3 as a request
# make a local API to test
# setup the queue service for the model
# deploy and test
# styles, stats, etc.

def lambda_handler(event, context):
    title = event['body']['title']
    url = event['body']['url']

    probabilities = model.forward(title, url)
    label = torch.argmax(probabilities).item()

    return {
        'statusCode': 200,
        'body': json.dumps(
            {
                "predicted_label": label,
            }
        )
    }
