import networkx as nx
import matplotlib.pyplot as plt
import random
import numpy as np
from scipy.optimize import fsolve
import math

def most_significant_digit(num):
    exp = math.floor(math.log10(abs(num)))
    cifra = int(abs(num) / 10**exp)
    return -exp

msd = [(0, ' '),
       (3, 'm-'),
       (6, 'micro-'),
       (9, 'n-')]

def format_with_prefix(val):
    exp = most_significant_digit(val)
    
    for threshold, prefix in msd:
        if exp <= threshold:
            break
    
    scale = 10 ** threshold
    scaled_val = val * scale
    
    text = f"{scaled_val:g} {prefix}".strip()
    return text


def element_values(lb, ub):
    lb_exp = int(np.floor(np.log10(lb)))
    ub_exp = int(np.floor(np.log10(ub)))

    values = []
    for exp in range(lb_exp, ub_exp + 1):
        base = 10 ** exp
        for i in range(1, 10):
            val = i * base
            if lb <= val <= ub:
                values.append(val)
    return values


passive = ['capacitor',
           'inductor',
           'resistor',
           'shortcircuit',
           'opencircuit']
active = ['v_source',
          'c_source']
limits = {'capacitor':  element_values(1e-9, 1e-3),
          'inductor':   element_values(1e-4, 1e-3),
          'resistor':   element_values(1e-2, 1e+2),
          'v_source':   element_values(1e+2, 1e+4),
          'c_source':   element_values(1e-1, 1e+2)}




class circuit():
    def __init__(self, rows, cols, seed=None):
        if seed is not None:
            random.seed(seed)
        self.G = nx.DiGraph()
        self.nodes = [f"N{idx}{jdx}" for idx in range(rows) for jdx in range(cols)]
        self.G.add_nodes_from(self.nodes)

        for idx in range(rows):
            for jdx in range(cols - 1):
                n1 = f"N{idx}{jdx}"
                n2 = f"N{idx}{jdx + 1}"
                el = random.choice(passive)     
                if el == 'resistor':    
                    val = random.choice(limits[el])    
                    imp = val       
                    string_val = format_with_prefix(val) + 'Omega'
                elif el == 'inductor':
                    val = random.choice(limits[el])
                    imp = complex(0, 2*np.pi*50*val) 
                    string_val = format_with_prefix(val) + 'H'
                elif el == 'capacitor':  
                    val = random.choice(limits[el])
                    imp = complex(0, -1/(2*np.pi*50*val))  
                    string_val = format_with_prefix(val) + 'F'
                else:
                    imp = None
                    val = None
                    string_val = None
                self.G.add_edge(n1, n2, element=el, value=val, impedance=imp, string=string_val)

        for jdx in range(cols):
            for idx in range(rows - 1):
                n1 = f"N{idx}{jdx}"
                n2 = f"N{idx + 1}{jdx}"
                el = random.choice(passive)    
                if el == 'resistor':    
                    val = random.choice(limits[el])    
                    imp = val           
                    string_val = format_with_prefix(val) + 'Omega'
                elif el == 'inductor':
                    val = random.choice(limits[el])
                    imp = complex(0, 2*np.pi*50*val) 
                    string_val = format_with_prefix(val) + 'H'
                elif el == 'capacitor':  
                    val = random.choice(limits[el])
                    imp = complex(0, -1/(2*np.pi*50*val))  
                    string_val = format_with_prefix(val) + 'F'
                else:
                    imp = None
                    val = None
                    string_val = None
                self.G.add_edge(n1, n2, element=el, value=val, impedance=imp, string=string_val)

        sources = int(np.max([np.floor((2*rows*cols - rows - cols)/5), 1]))
        self.edges = list(self.G.edges(data=True))
        edges_source = random.sample(self.edges, sources)
        for e in edges_source:
            self.G[e[0]][e[1]]["element"] = random.choice(active)
            self.G[e[0]][e[1]]["value"] = random.choice(limits[self.G[e[0]][e[1]]["element"]])
            self.G[e[0]][e[1]]["impedance"] = None
            self.G[e[0]][e[1]]["str_value"] = f'{self.G[e[0]][e[1]]["value"]} V' if self.G[e[0]][e[1]]["element"] == 'v_source' else f'{self.G[e[0]][e[1]]["value"]} A'
        self.edges = list(self.G.edges(data=True))
        
            
        
    def draw(self):
        # Crear posiciones en cuadrícula ordenada
        pos = {}
        
        for node in self.nodes:
            # Extraer índices del nombre del nodo (ej: "N12" -> fila=1, col=2)
            idx = int(node[1])  # fila
            jdx = int(node[2])  # columna
            # Posicionar en cuadrícula: x = columna, y = fila invertida (para que se vea bien)
            pos[node] = (jdx, -idx)
        
        # Crear etiquetas para las aristas con el tipo de componente y su valor
        edge_labels = {}
        for e in self.edges:
            element = self.G[e[0]][e[1]]['element']
            string_val = self.G[e[0]][e[1]].get('string')
            
            if string_val:
                edge_labels[(e[0], e[1])] = f"{element}\n{string_val}"
            else:
                edge_labels[(e[0], e[1])] = element

        # Determinar filas y columnas para el título
        rows = max([int(node[1]) for node in self.nodes]) + 1
        cols = max([int(node[2]) for node in self.nodes]) + 1

        plt.figure(figsize=(12, 8))
        
        # Dibujar nodos
        nx.draw_networkx_nodes(
            self.G, pos,
            node_color='lightblue',
            node_size=1000,
            edgecolors='black',
            linewidths=2
        )
        
        # Dibujar etiquetas de nodos
        nx.draw_networkx_labels(
            self.G, pos,
            font_size=10,
            font_weight='bold'
        )
        
        # Dibujar aristas
        nx.draw_networkx_edges(
            self.G, pos,
            arrows=True,
            arrowstyle='-|>',
            arrowsize=20,
            edge_color='gray',
            width=2,
            connectionstyle='arc3,rad=0.1'
        )
        
        # Dibujar etiquetas de componentes
        nx.draw_networkx_edge_labels(
            self.G, pos,
            edge_labels=edge_labels,
            font_color='darkred',
            font_size=8,
            bbox=dict(boxstyle='round,pad=0.3', facecolor='white', edgecolor='gray', alpha=0.8)
        )
        
        plt.title(f'Circuito {rows}x{cols}', fontsize=14, fontweight='bold')
        plt.axis('equal')
        plt.grid(True, alpha=0.3, linestyle='--')
        plt.tight_layout()
    
    

    def solve(self):
        self.n = len(self.nodes)
        self.x = np.ones(self.n*2)
        sol = fsolve(self.iterate, self.x)
        return sol
        
    def iterate(self, x):
        self.set_voltages(x)
        self.compute_currents()
        res = self.compute_res()
        return res
        
    def set_voltages(self, x):
        idx = 0
        for node in self.nodes:
            self.G.nodes[node]["voltage"] = complex(x[0], x[1])
            idx += 2
        
    def compute_currents(self):
        for e in self.edges:
            if (self.G[e[0]][e[1]]["element"] == 'capacitor') or (self.G[e[0]][e[1]]["element"] == 'inductor') or (self.G[e[0]][e[1]]["element"] == 'resistor'):
                self.G[e[0]][e[1]]["current"] = (self.G.nodes[e[0]]["voltage"] - self.G.nodes[e[1]]["voltage"])/self.G[e[0]][e[1]]["impedance"]
            if self.G[e[0]][e[1]]["element"] == 'c_source':
                self.G[e[0]][e[1]]["current"] = self.G[e[0]][e[1]]["value"]        
        
        self.exclude = []
        for e in self.edges:
            if self.G[e[0]][e[1]]["element"] == 'v_source':
                node = e[1]
                self.exclude.append(node)
                edges = list(self.G.in_edges(node)) 
                total = 0
                try:
                    total += self.G[edges[0]][edges[1]]["current"]
                except:
                    pass
                edges = list(self.G.out_edges(node))
                try:
                    total -= self.G[edges[0]][edges[1]]["current"]
                except:
                    pass
                self.G[e[0]][e[1]]["current"] = total
        
    def compute_res(self):
        residuals = []
        for node in self.nodes:
            if node not in self.exclude:
                edges_in = list(self.G.in_edges(node)) 
                edges_out = list(self.G.out_edges(node))
                res = 0
                for e in edges_in:
                    res += self.G[e[0]][e[1]]["current"] 
                for e in edges_out:
                    res -= self.G[e[0]][e[1]]["current"] 
                residuals.append(np.real(res))
                residuals.append(np.imag(res))
        for e in self.edges:
            if self.G[e[0]][e[1]]["element"] == 'v_source':
                res = self.G.nodes[e[0]]["voltage"] - self.G.nodes[e[1]]["voltage"] - self.G[e[0]][e[1]]["value"]
                residuals.append(np.real(res))
                residuals.append(np.imag(res))
        return residuals
        
        
        
        
        
        
        


