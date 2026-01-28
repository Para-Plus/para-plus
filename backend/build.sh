#!/usr/bin/env bash
# Script de build pour Render.com

set -o errexit  # Arrêter en cas d'erreur

echo "🔧 Installation des dépendances..."
pip install --upgrade pip
pip install -r requirements.txt

echo "📦 Collecte des fichiers statiques..."
python manage.py collectstatic --no-input

echo "✅ Build terminé avec succès!"
