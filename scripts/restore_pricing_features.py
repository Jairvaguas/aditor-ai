import os
import re

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    filepath = os.path.join(base_dir, 'src', 'components', 'DynamicPricingForm.tsx')
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_list_html = """            <ul className="space-y-4 mb-8 text-gray-300">
                <li className="flex items-center">
                    <svg className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Auditorías ilimitadas en tu cuenta publicitaria</span>
                </li>
                <li className="flex items-center">
                    <svg className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Cuentas publicitarias adicionales a $15 USD/mes c/u</span>
                </li>
                <li className="flex items-center">
                    <svg className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Recomendaciones de IA avanzadas</span>
                </li>
                <li className="flex items-center">
                    <svg className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Auditoría semanal automática por email</span>
                </li>
                <li className="flex items-center">
                    <svg className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Soporte prioritario</span>
                </li>
            </ul>"""

    # Buscar el patron de la etiqueta ul completa
    pattern = r'<ul className="space-y-4 mb-8 text-gray-300">[\s\S]*?</ul>'
    
    if re.search(pattern, content):
        content = re.sub(pattern, new_list_html.strip(), content)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"[{filepath}] Lista restaurada exitosamente.")
    else:
        print(f"[{filepath}] No se encontro el bloque UL esperado.")

if __name__ == "__main__":
    main()
