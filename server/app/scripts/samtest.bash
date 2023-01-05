rm -rf .aws-sam
sam build
sam validate
sam local invoke InferenceFunction --event events/event.json