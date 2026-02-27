import os
import re

def insert_css(globals_css_path):
    css_to_add = """
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-on-scroll {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.animate-on-scroll.animate-in {
  opacity: 1;
  transform: translateY(0);
}
"""
    with open(globals_css_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if "fadeSlideUp" not in content and "animate-on-scroll" not in content:
        with open(globals_css_path, 'a', encoding='utf-8') as f:
            f.write(css_to_add)
        print("CSS classes agregadas con éxito a globals.css")

def write_component(component_path):
    content = """'use client';

import { useEffect } from 'react';

export default function ScrollAnimations() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.15 });

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
"""
    if not os.path.exists(component_path):
        with open(component_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Componente ScrollAnimations.tsx creado con éxito")

def update_page_tsx(page_tsx_path):
    with open(page_tsx_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False

    # 1. Imports and component injection
    if "import ScrollAnimations" not in content:
        content = content.replace(
            'import Footer from "@/components/Footer";',
            'import Footer from "@/components/Footer";\nimport ScrollAnimations from "@/components/ScrollAnimations";'
        )
        content = content.replace(
            '{/* 1. Navbar Fija */}',
            '<ScrollAnimations />\n      {/* 1. Navbar Fija */}'
        )
        modified = True

    # 2. Hero Section
    h1_orig = '<h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight">'
    h1_new = '<h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight" style={{ animation: \'fadeSlideUp 0.8s ease forwards\', opacity: 0, animationDelay: \'0ms\' }}>'
    if h1_orig in content:
        content = content.replace(h1_orig, h1_new)
        modified = True

    p_orig = '<p className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed max-w-xl">'
    p_new = '<p className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed max-w-xl" style={{ animation: \'fadeSlideUp 0.8s ease forwards\', opacity: 0, animationDelay: \'150ms\' }}>'
    if p_orig in content:
        content = content.replace(p_orig, p_new)
        modified = True

    cta_orig = '<div className="flex justify-start">'
    cta_new = '<div className="flex justify-start" style={{ animation: \'fadeSlideUp 0.8s ease forwards\', opacity: 0, animationDelay: \'300ms\' }}>'
    if cta_orig in content:
        content = content.replace(cta_orig, cta_new)
        modified = True

    card_orig = '<div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200 w-full max-w-lg mx-auto lg:mr-0 lg:ml-auto">'
    card_new = '<div className="relative w-full max-w-lg mx-auto lg:mr-0 lg:ml-auto" style={{ animation: \'fadeSlideUp 0.8s ease forwards\', opacity: 0, animationDelay: \'450ms\' }}>'
    if card_orig in content:
        content = content.replace(card_orig, card_new)
        modified = True

    # 3. Resto de las secciones
    sec_como = '<section id="como-funciona" className="py-24 bg-[#080D18] border-y border-white/5 w-full">'
    if sec_como in content:
        content = content.replace(sec_como, '<section id="como-funciona" className="py-24 bg-[#080D18] border-y border-white/5 w-full animate-on-scroll">')
        modified = True

    sec_precios = '<section id="precios" className="py-24 bg-[#080D18] border-y border-white/5 relative overflow-hidden w-full">'
    if sec_precios in content:
        content = content.replace(sec_precios, '<section id="precios" className="py-24 bg-[#080D18] border-y border-white/5 relative overflow-hidden w-full animate-on-scroll">')
        modified = True

    sec_cta = '<section id="cta" className="relative py-24 bg-[#080D18] border-y border-white/5 w-full overflow-hidden text-center">'
    if sec_cta in content:
        content = content.replace(sec_cta, '<section id="cta" className="relative py-24 bg-[#080D18] border-y border-white/5 w-full overflow-hidden text-center animate-on-scroll">')
        modified = True

    # 4. Features cascade
    feature_card_orig = '<div className="bg-slate-900 rounded-2xl p-8 border border-slate-700 shadow-xl flex flex-col items-center text-center">'
    
    # We will replace them sequentially 0, 100, 200
    parts = content.split(feature_card_orig)
    if len(parts) == 4: # Means there were 3 occurrences
        new_content = parts[0]
        for i in range(1, 4):
            delay = (i-1) * 100
            repl = f'<div className="bg-slate-900 rounded-2xl p-8 border border-slate-700 shadow-xl flex flex-col items-center text-center animate-on-scroll" style={{{{ transitionDelay: \'{delay}ms\' }}}}>'
            new_content += repl + parts[i]
        content = new_content
        modified = True

    # 5. FAQs
    details_orig = '<details key={num} className="group bg-slate-900 rounded-2xl border border-slate-700 shadow-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">'
    details_new = '<details key={num} className="group bg-slate-900 rounded-2xl border border-slate-700 shadow-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden animate-on-scroll" style={{ transitionDelay: `${num * 100}ms` }}>'
    if details_orig in content:
        content = content.replace(details_orig, details_new)
        modified = True

    if modified:
        with open(page_tsx_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Modificaciones realizadas a src/app/page.tsx")

if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    css_path = os.path.join(base_dir, 'src', 'app', 'globals.css')
    tsx_comp_path = os.path.join(base_dir, 'src', 'components', 'ScrollAnimations.tsx')
    page_tsx_path = os.path.join(base_dir, 'src', 'app', 'page.tsx')
    
    insert_css(css_path)
    write_component(tsx_comp_path)
    update_page_tsx(page_tsx_path)
