export interface AlgebraRule {name:string;formula:string;why:string;example:string;condition?:string;}
export const algebraRules:{id:string;title:string;rules:AlgebraRule[]}[]=[
  {id:'powers',title:'Potencias',rules:[
    {name:'Producto de la misma base',formula:'a^m a^n=a^{m+n}',why:'Conservá la base y sumá los exponentes.',example:'x^2x^3=x^5'},
    {name:'Cociente de la misma base',formula:'\\frac{a^m}{a^n}=a^{m-n}',condition:'a ≠ 0.',why:'Restá el exponente del denominador.',example:'\\frac{x^5}{x^2}=x^3'},
    {name:'Potencia de una potencia',formula:'(a^m)^n=a^{mn}',why:'Multiplicá los exponentes.',example:'(x^2)^3=x^6'},
    {name:'Potencia de un producto',formula:'(ab)^n=a^nb^n',why:'El exponente afecta a cada factor.',example:'(2x)^3=8x^3'},
    {name:'Potencia de un cociente',formula:'\\left(\\frac ab\\right)^n=\\frac{a^n}{b^n}',condition:'b ≠ 0; con exponente negativo, a ≠ 0 también.',why:'Elevá tanto numerador como denominador.',example:'\\left(\\frac{x}{2}\\right)^2=\\frac{x^2}{4}'},
    {name:'Exponente cero',formula:'a^0=1',condition:'a ≠ 0.',why:'Una base distinta de cero elevada a cero da uno.',example:'7^0=1'},
    {name:'Exponente negativo',formula:'a^{-n}=\\frac1{a^n}',condition:'a ≠ 0.',why:'Tomá el recíproco; no cambies el signo de la base.',example:'2^{-3}=\\frac18'},
    {name:'El signo y los paréntesis',formula:'-a^2=-(a^2),\\qquad(-a)^2=a^2',why:'Los paréntesis deciden si el signo se eleva.',example:'-3^2=-9,\\qquad(-3)^2=9'},
  ]},
  {id:'products',title:'Productos notables',rules:[
    {name:'Cuadrado de una suma',formula:'(a+b)^2=a^2+2ab+b^2',why:'Cuadrado del primero, doble producto y cuadrado del segundo. El término 2ab no desaparece.',example:'(x+3)^2=x^2+6x+9'},
    {name:'Cuadrado de una diferencia',formula:'(a-b)^2=a^2-2ab+b^2',why:'El doble producto tiene signo negativo; el último cuadrado es positivo.',example:'(2x-3)^2=4x^2-12x+9'},
    {name:'Suma por diferencia',formula:'(a+b)(a-b)=a^2-b^2',why:'Los términos cruzados se cancelan.',example:'(x+5)(x-5)=x^2-25'},
    {name:'Cubo de una suma',formula:'(a+b)^3=a^3+3a^2b+3ab^2+b^3',why:'Aparecen los coeficientes 1, 3, 3, 1.',example:'(x+2)^3=x^3+6x^2+12x+8'},
    {name:'Cubo de una diferencia',formula:'(a-b)^3=a^3-3a^2b+3ab^2-b^3',why:'Los signos alternan: +, −, +, −.',example:'(x-2)^3=x^3-6x^2+12x-8'},
    {name:'Distributividad',formula:'a(b+c)=ab+ac',why:'Multiplicá cada término del paréntesis.',example:'2x(x-3)=2x^2-6x'},
  ]},
  {id:'factors',title:'Factorización',rules:[
    {name:'Factor común',formula:'ab+ac=a(b+c)',why:'Sacá el factor que aparece en todos los términos.',example:'6x^3+9x^2=3x^2(2x+3)'},
    {name:'Agrupación',formula:'ax+ay+bx+by=(a+b)(x+y)',why:'Agrupá y extraé un factor común en cada grupo.',example:'x^2+3x+2x+6=(x+3)(x+2)'},
    {name:'Diferencia de cuadrados',formula:'a^2-b^2=(a-b)(a+b)',why:'Identificá las dos bases y escribí sus conjugados.',example:'x^2-9=(x-3)(x+3)'},
    {name:'Trinomio cuadrado perfecto',formula:'a^2\\pm2ab+b^2=(a\\pm b)^2',why:'Comprobá que el término central sea exactamente el doble producto.',example:'x^2+6x+9=(x+3)^2'},
    {name:'Trinomio con coeficiente principal uno',formula:'x^2+(r+s)x+rs=(x+r)(x+s)',why:'Buscá dos números con la suma y el producto indicados.',example:'x^2+5x+6=(x+2)(x+3)'},
    {name:'Diferencia de cubos',formula:'a^3-b^3=(a-b)(a^2+ab+b^2)',why:'Primer factor: diferencia de bases. Segundo: cuadrado, producto positivo y cuadrado.',example:'x^3-8=(x-2)(x^2+2x+4)'},
    {name:'Suma de cubos',formula:'a^3+b^3=(a+b)(a^2-ab+b^2)',why:'Primer factor: suma de bases. En el segundo, el producto es negativo.',example:'x^3+27=(x+3)(x^2-3x+9)'},
  ]},
  {id:'fractions',title:'Fracciones',rules:[
    {name:'Suma con denominador común',formula:'\\frac ab+\\frac cb=\\frac{a+c}{b}',condition:'b ≠ 0.',why:'Sumá los numeradores y conservá el denominador.',example:'\\frac{x}{3}+\\frac2{3}=\\frac{x+2}{3}'},
    {name:'Suma con denominadores distintos',formula:'\\frac ab+\\frac cd=\\frac{ad+bc}{bd}',condition:'b ≠ 0 y d ≠ 0.',why:'Construí un denominador común.',example:'\\frac12+\\frac13=\\frac56'},
    {name:'Multiplicar y dividir fracciones',formula:'\\frac ab\\frac cd=\\frac{ac}{bd},\\qquad\\frac ab\\div\\frac cd=\\frac{ad}{bc}',condition:'b y d distintos de cero; al dividir, c ≠ 0.',why:'Para dividir, multiplicá por el recíproco.',example:'\\frac23\\div\\frac45=\\frac56'},
    {name:'Cancelar factores, no sumandos',formula:'\\frac{a b}{a c}=\\frac bc',condition:'a ≠ 0 y c ≠ 0. Conservá las restricciones originales.',why:'Factorizá antes de cancelar. No podés tachar términos unidos por + o −.',example:'\\frac{x^2-1}{x-1}=x+1,\\quad x\\ne1'},
  ]},
  {id:'roots',title:'Raíces',rules:[
    {name:'Raíz de un producto',formula:'\\sqrt{ab}=\\sqrt a\\sqrt b',condition:'a ≥ 0 y b ≥ 0, trabajando en números reales.',why:'Separá factores cuando sus raíces reales existen.',example:'\\sqrt{12}=2\\sqrt3'},
    {name:'Raíz cuadrada de un cuadrado',formula:'\\sqrt{x^2}=|x|',why:'La raíz cuadrada principal nunca es negativa.',example:'\\sqrt{(-3)^2}=3'},
    {name:'Racionalizar con conjugados',formula:'(\\sqrt a+\\sqrt b)(\\sqrt a-\\sqrt b)=a-b',condition:'a y b no negativos; el denominador original no puede ser cero.',why:'Multiplicá numerador y denominador por el mismo conjugado.',example:'\\frac1{\\sqrt3+1}=\\frac{\\sqrt3-1}{2}'},
  ]},
  {id:'equations',title:'Ecuaciones',rules:[
    {name:'Ecuación lineal',formula:'ax+b=0\\quad\\Longrightarrow\\quad x=-\\frac ba',condition:'a ≠ 0.',why:'Hacé la misma operación en ambos lados para aislar x.',example:'2x-6=0\\quad\\Longrightarrow\\quad x=3'},
    {name:'Producto cero',formula:'AB=0\\quad\\Longleftrightarrow\\quad A=0\\;\\text{o}\\;B=0',why:'Factorizá y resolvé cada factor por separado.',example:'(x-2)(x+3)=0\\quad\\Longrightarrow\\quad x=2\\;\\text{o}\\;-3'},
    {name:'Fórmula cuadrática',formula:'x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}',condition:'a ≠ 0. Si Δ = b² − 4ac < 0, no hay raíces reales.',why:'Escribí primero ax² + bx + c = 0 y conservá los signos de a, b y c.',example:'x^2-2x-3=0\\quad\\Longrightarrow\\quad x=-1\\;\\text{o}\\;3'},
    {name:'Verificar candidatos',formula:'\\sqrt{x+2}=x\\;\\Longrightarrow\\;x+2=x^2',why:'Elevar al cuadrado puede agregar soluciones. Revisá cada candidato en la igualdad original y las restricciones del dominio.',example:'x=2\\;\\text{sirve};\\quad x=-1\\;\\text{no sirve}'},
  ]},
];
