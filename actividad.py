#actividad 1
print("\n Actividad 1")
n = float(input("Ingresa un número: "))
if n > 0:
    print("positivo")
elif n < 0:
    print("negativo")
else:
    print("cero")

#actividad 2
print("\n Actividad 2")
n = int(input("Ingresa un número entero: "))
if n % 2 == 0:
    print("par")
else:
    print("impar")

#actividad 3
print("\n Actividad 3")
a = float(input("Primer número: "))
b = float(input("Segundo número: "))
c = float(input("Tercer número: "))

mayor = a
if b > mayor:
    mayor = b
if c > mayor:
    mayor = c

print("Mayor:", mayor)

#actividad 4
print("\n Actividad 4")
a = float(input("a (no puede ser 0): "))
while a == 0:
    a = float(input("a no puede ser 0, ingrésalo de nuevo: "))
b = float(input("b: "))
c = float(input("c: "))
if a == 0:
    if b == 0:
        print("no válido")
    else:
        print("raíz:", -c/b)
else:
    d = b*b - 4*a*c
    if d > 0:
        r1 = (-b + d**0.5) / (2*a)
        r2 = (-b - d**0.5) / (2*a)
        print("raíces:", r1, r2)
    elif d == 0:
        r = -b / (2*a)
        print("raíz doble:", r)
    else:
        real = -b / (2*a)
        imag = (abs(d)**0.5) / (2*a)
        print("raices complejas:", f"{real}+{imag}j", f"{real}-{imag}j")

#actividad 5
print("\n Actividad 5")
n = float(input("Ingresa un número: "))
if (20 <= n <= 60) or (80 <= n <= 100):
    print("valor valido")
else:
    print("valor no valido")
