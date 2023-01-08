import transformers
import torch
from transformers import BertForSequenceClassification, BertTokenizer

model = BertForSequenceClassification.from_pretrained("prajjwal1/bert-tiny", num_labels=384).to(dtype=torch.float32)
tokenizer = BertTokenizer.from_pretrained("prajjwal1/bert-tiny")
model.save_pretrained("./bert")
tokenizer.save_pretrained("./tokenizer")