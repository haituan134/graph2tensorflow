import json

with open('data.json') as json_file:
    data = json.load(json_file)

fix_data = {}
fix_data['layers'] = data['layers']
fix_data['attributes'] = {}

fix_data['attributes']['activation'] = []
for k in data['attribute']['activation']:
    fix_data['attributes']['activation'].append({"name": k, "value":k})

fix_data['attributes']['regularizer'] = []
for k in data['attribute']['regularizer']:
    fix_data['attributes']['regularizer'].append({"name": k['class_name'], "value":k})

fix_data['attributes']['initializer'] = []
for k in data['attribute']['initializer']:
    fix_data['attributes']['initializer'].append({"name": k['class_name'], "value":k})

fix_data['attributes']['constraint'] = []
for k in data['attribute']['constraint']:
    fix_data['attributes']['constraint'].append({"name": k['class_name'], "value":k})

fix_data['attributes']['dtype'] = []
for k in data['attribute']['dtype']:
    fix_data['attributes']['dtype'].append({"name": k, "value":k})

with open('fix_data.json', 'w') as wjson:
    json.dump(fix_data, wjson)