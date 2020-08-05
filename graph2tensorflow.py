import json

def readInput(fileName):
    with open(fileName) as f:
        N = int(f.readline())
        layers = []
        for i in range(N): 
            layers.append(json.loads(f.readline()))

        M = int(f.readline())
        adj0 = [set() for _ in range(N)] 
        adj1 = [set() for _ in range(N)]
        for i in range(M):
            u, v = f.readline().split()
            u, v = int(u), int(v)
            adj0[u].add(v)
            adj1[v].add(u)

    return N, M, layers, adj0, adj1

def checkInputLayer(N, adj, layers):
    for index in range(N):
        if layers[index]["name"] != "Input" and len(adj[index]) == 0:
            return False
        if layers[index]["name"] == "Input" and len(adj[index]) != 0:
            return False
    return True

def visit(u, visiting, visited, adj, cnt, ans):
    visited[u] = True
    visiting[u] = True

    for v in adj[u]:
        if not visited[v]: 
            cnt = visit(v, visiting, visited, adj, cnt, ans)
            if cnt == -1:
                return -1
        elif visiting[v]:
            return -1

    cnt -= 1
    ans[cnt] = u
    visiting[u] = False
    return cnt

def topo(N, adj):
    visited = [False] * N
    visiting = [False] * N
    ans = [0] * N
    cnt = N

    for u in range(N):
        if not visited[u]:
            cnt = visit(u, visiting, visited, adj, cnt, ans)
            if cnt == -1: 
                return False, []
    
    return True, ans

def assignNameLayer(layers, adj):
    cntInput, cntOutput, cntHidden = 0, 0, 0
    for layer, adj in zip(layers, adj):
        if layer["name"] == "Input":
            layer["varName"] = "input" + str(cntInput)
            cntInput += 1
        elif len(adj) == 0:
            layer["varName"] = "output" + str(cntOutput)
            cntOutput += 1
        else:
            layer["varName"] = "hidden" + str(cntHidden)
            cntHidden += 1
    
    return cntInput, cntHidden, cntOutput

def getAttributeLayer(layer):
    attribute = ["{}={}".format(key, value) for key, value in layer.items() if key != "name" and key != "varName"]
    return ", ".join(attribute)

def computingLayer(layer, adj, layers):
    listNode = [layers[index]["varName"] for index in adj]
    return "({})".format(", ".join(listNode))

def declareLayer(layer):
    return "{} = keras.layer.{}({})".format(layer["varName"], layer["name"], getAttributeLayer(layer))

def declareModel(cntInput, cntOuput):
    inputs = ["input{}".format(i) for i in range(cntInput)]
    outputs = ["output{}".format(i) for i in range(cntOuput)]
    return "model = keras.Model(inputs=[{}], outputs=[{}])".format(", ".join(inputs), ", ".join(outputs))

def toTensorflowCode(N, layers, adj1, topoOrder, cntInput, cntOutput, style=1):
    if style == 1:
        for index in topoOrder:
            if layers[index]["name"] != "Input":
                print(declareLayer(layers[index]) + computingLayer(layers[index], adj1[index], layers))
            else:
                print(declareLayer(layers[index]))
        print(declareModel(cntInput, cntOutput))
    elif style == 2:
        print("Class MyModel(keras.Model):")

        print("\tdef __init__(self):")
        print("\t\tsuper(MyModel, self).__init__()")
        for index in range(N):
            print("\t\t" + declareLayer(layers[index]))

        print("\tdef call(self, inputs):")
        print("\t\t{} = inputs".format(", ".join(["input{}".format(i) for i in range(cntInput)])))
        for index in topoOrder:
            if layers[index]["name"] != "Input":
                layer = layers[index]
                print("\t\t{} = self.{}{}".format(layer["varName"], layer["varName"], computingLayer(layer, adj1[index], layers)))

        print("\t\treturn {}".format(", ".join(["output{}".format(i) for i in range(cntOutput)])))


def graph2tensorflow(fileName):
    N, M, layers, adj0, adj1 = readInput(fileName)

    DAG, topoOrder = topo(N, adj0)
    if not DAG:
        print("Đồ Thị Không Phải Là DAG")
        return

    if not checkInputLayer(N, adj1, layers):
        print("Layer xuất phát không phải là layer input hoặc layer input có đầu vào")
        return

    cntInput, cntHidden, cntOutput = assignNameLayer(layers, adj0)

    toTensorflowCode(N, layers, adj1, topoOrder, cntInput, cntOutput)
    print()
    toTensorflowCode(N, layers, adj1, topoOrder, cntInput, cntOutput, style=2)
    
        
if __name__ == "__main__":
    graph2tensorflow("test.txt")