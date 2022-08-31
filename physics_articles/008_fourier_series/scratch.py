import sympy
x, y0 = sympy.symbols("x y0")
a, b, n = sympy.symbols("a b n")
pi = sympy.pi
# a, b = sympy.symbols("a b")
f1 = (y0/a)*x
f2 = (y0/(-1+a))*x - (y0/(-1+a))
sympy.init_printing(use_unicode=False, wrap_line=False, no_global=True)
ar1 = sympy.integrate(f1, (x, 0, a))
ar2 = sympy.integrate(f2, (x, a, 1))
an1 = sympy.integrate(f1*sympy.cos(n*pi*x), (x, 0, a))
an2 = sympy.integrate(f2*sympy.cos(n*pi*x), (x, a, 1))
bn1 = sympy.integrate(f1*sympy.sin(n*pi*x), (x, 0, a))
bn2 = sympy.integrate(f2*sympy.sin(n*pi*x), (x, a, 1))
print [f1,f2]
print ar1+ar2
print sympy.simplify(ar1+ar2)
print an1
print an2
an = sympy.simplify(an1+an2)
print an
bn = sympy.simplify(bn1+bn2)
print bn
print an.subs(a, 0)
print an.subs(a, 1)
print an.subs(a, .5)
print bn.subs(a, .5)
