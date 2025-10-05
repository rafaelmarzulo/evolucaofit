# 📝 Instruções para Adicionar a Logo

## Como adicionar sua logo EvolucaoFit.png

### Opção 1: Logo Principal PNG
1. Coloque o arquivo `EvolucaoFit.png` em:
   ```
   apps/frontend/public/EvolucaoFit.png
   ```

2. Edite o arquivo `src/components/Logo.tsx` e descomente as linhas:
   ```tsx
   // Remova o comentário dessas linhas:
   <Image
     src="/EvolucaoFit.png"
     alt="EvolucaoFit"
     width={width}
     height={height}
     priority
     className="object-contain"
   />
   ```

3. Comente ou remova o fallback com emoji:
   ```tsx
   // Comente estas linhas:
   {/* <div className="flex items-center space-x-2">
     <span className="text-3xl">💪</span>
     <span className="font-bold text-xl bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
       EvolucaoFit
     </span>
   </div> */}
   ```

### Opção 2: Favicon (ícone do navegador)
Adicione os seguintes arquivos em `apps/frontend/public/`:
- `favicon.ico` - Ícone 16x16 ou 32x32
- `apple-touch-icon.png` - Ícone 180x180 para iOS

### Opção 3: Gerar Favicons Automaticamente
Use um serviço online como:
- https://favicon.io/
- https://realfavicongenerator.net/

Faça upload da sua logo e baixe todos os ícones gerados.

## Tamanhos Recomendados
- **Logo Principal**: 240x80px (ou proporção similar)
- **Favicon**: 32x32px
- **Apple Touch Icon**: 180x180px
- **Android Chrome**: 192x192px e 512x512px

## Status Atual
✅ Tema escuro aplicado em todos os formulários (login, registro)
✅ Componente Logo criado e integrado
✅ Favicon configurado no layout
✅ Fallback com emoji funcionando

Quando adicionar a logo PNG, ela substituirá automaticamente o emoji! 🎨
