import lib
import matplotlib.pyplot as plt

# Crear un circuito de 2x3
cir = lib.circuit(rows=2, cols=3, seed=42)

# Dibujarlo
cir.draw()

# Guardarlo como imagen
plt.savefig('circuito_test.png', dpi=150, bbox_inches='tight')
print("✅ Imagen guardada como 'circuito_test.png'")

# Mostrar la imagen (esto abrirá una ventana)
plt.show()