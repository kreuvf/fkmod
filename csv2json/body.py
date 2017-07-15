# -*- coding: utf-8 -*-

import csv
import json

#open needed files and copy their content into lists
with open('../data/mp/stats/body.txt', 'r') as file:
    reader = csv.reader(file, delimiter=',')
    body = list(reader)[1:]
    
with open('../data/mp/stats/bodypropulsionimd.txt', 'r') as file:
    reader = csv.reader(file, delimiter=',')
    bodyimd = list(reader)
    
with open('../data/mp/stats/bodyAddInf.txt', 'r') as file:
    reader = csv.reader(file, delimiter=',')
    addInf = list(reader)[1:]

with open('../data/mp/messages/strings/names.txt', 'r') as file:
    namesFile = list(file)
    
#create list with name tuples from names.txt
names = []
comment = False
for line in namesFile:
    #skip comments
    if comment:
        if "*/" in line:
            comment = False
        continue
    elif "//" in line:
        continue
    elif "/*" in line:
        comment = True
        if "*/" in line:
            comment = False
        continue
    split = line.split()
    #skip empty lines
    if not len(split):
        continue
    n1 = split[0].replace('"', '')
    n2 = split[1]
    for s in split[2:]:
        n2 += ' ' + s
    n2 = n2.replace('"', '')
    names.append((n1, n2))

# Build dictionary for JSON
# Assignment of index to variable
# 0 -> id
# 1 -> unused/superfluous
# 2 -> size
# 3 -> buildPower
# 4 -> buildPoints
# 5 -> weight
# 6 -> bodyPoints
# 7 -> model
# 8 -> unused/superfluous
# 9 -> weaponSlots
# 10 -> powerOutput
# 11 -> armourKinetic
# 12 -> armoutHeat
# 13 -> unused/superfluous
# 14 -> unused/superfluous
# 15 -> unused/superfluous
# 16 -> unused/superfluous
# 17 -> unused/superfluous
# 18 -> unused/superfluous
# 19 -> unused/superfluous
# 20 -> unused/superfluous
# 21 -> unused/superfluous
# 22 -> unused/superfluous
# 23 -> unused/superfluous
# 24 -> designable
obj = dict()        
for line in body:
    id = line[0]    
    att = dict()
    att['armourHeat'] = int(line[12])
    att['armourKinetic']=int(line[11])
    att['buildPoints']=int(line[4])
    att['buildPower']=int(line[3])
    att['designable']=int(line[24])
    att['hitpoints']=int(line[6])
    att['id']=line[0]
    att['model']=line[7]
    att['powerOutput']=int(line[10])
    att['size']=line[2]
    att['weaponSlots']=int(line[9])
    att['weight']=int(line[5])
    
    probModels = dict()
    for lineimd in bodyimd:
        if id == lineimd[0]:
            prop = lineimd[1]
            l = lineimd[2]
            r = lineimd[3]
            if r == '0':
                
                probModels[prop] = dict(left=l)
            else:
                if prop == "V-Tol":
                    if line[23] != '0':
                        probModels[prop] = dict(left=l, right=r, still=line[23])
                    else:
                        probModels[prop] = dict(left=l, right=r)
                else:
                    probModels[prop] = dict(left=l, right=r)
            
    if probModels:
        att['propulsionExtraModels'] = probModels
        
    for lineAddInf in addInf:
        if id == lineAddInf[0]:
            if lineAddInf[1] != '0':
                att['class'] = lineAddInf[1]
            if lineAddInf[2] != '0':
                att['droidType'] = lineAddInf[2]
                
    for name in names:
        if id == name[0]:
            att['name'] = name[1]
            
    obj[id] = att
#print (json.dumps(obj, sort_keys=True, indent=4))
with open('../jsondata/mp/stats/body.json', 'w') as f:
    f.write(json.dumps(obj, sort_keys=True, indent=4))