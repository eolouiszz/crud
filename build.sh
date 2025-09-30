```sh
#!/bin/sh

echo "[INFO] Iniciando build e execução do servidor Python..."

# 1. Cria/ativa ambiente virtual
if [ ! -d "venv" ]; then
    echo "[INFO] Criando ambiente virtual..."
    python3 -m venv venv
fi

. venv/bin/activate

# 2. Instala dependências (se existir requirements.txt)
if [ -f "requirements.txt" ]; then
    echo "[INFO] Instalando dependências..."
    pip install -r requirements.txt
else
    echo "[WARN] Nenhum requirements.txt encontrado, pulando instalação..."
fi

# 3. Sobe o servidor
echo "[INFO] Executando servidor..."
python server.py
```
