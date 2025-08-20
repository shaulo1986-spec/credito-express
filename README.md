# Crédito Express – Deploy listo (Vercel + GitHub)

## Usar en local
```bash
npm install
npm run dev
```
- Logo: reemplaza `public/logo.png` por tu logo real (mismo nombre).
- Entra con **Mraljebros2012**.

## Build
```bash
npm run build
```

## Deploy gratis con Vercel
1) Sube a GitHub:
```bash
git init
git add .
git commit -m "Crédito Express"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/credito-express.git
git push -u origin main
```
2) En https://vercel.com/new → Importa el repo.
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
3) Deploy y listo ✅
