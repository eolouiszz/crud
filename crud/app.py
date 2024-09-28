from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

def init_db():
    with sqlite3.connect('data.db') as conn:
        # Cria a tabela se não existir, com a coluna categoria sendo única
        conn.execute('CREATE TABLE IF NOT EXISTS categoria (id INTEGER PRIMARY KEY, categoria TEXT UNIQUE)')
        conn.commit()

@app.route('/')
def index():
    return render_template('index.html')

# POST e PUT para inserir ou atualizar a categoria
@app.route('/api/categoria', methods=['PUT', 'POST'])
def enviar():
    data = request.get_json()
    categoria = data.get('categoria')

    if not categoria:
        return jsonify({'error': 'Categoria é obrigatória!'}), 400

    # Conecta ao banco de dados
    with sqlite3.connect('data.db') as conn:
        cursor = conn.cursor()
        
        # Verifica se a categoria já existe
        cursor.execute('SELECT id FROM categoria WHERE categoria = ?', (categoria,))
        row = cursor.fetchone()

        if row:
            # Se existir, faz o UPDATE
            cursor.execute('UPDATE categoria SET categoria = ? WHERE id = ?', (categoria, row[0]))
            message = 'Categoria atualizada com sucesso!'
        else:
            # Se não existir, faz o INSERT
            cursor.execute('INSERT INTO categoria (categoria) VALUES (?)', (categoria,))
            message = 'Categoria inserida com sucesso!'
        
        conn.commit()

    return jsonify({'message': message}), 200

# GET para listar todas as categorias
@app.route('/api/categoria', methods=['GET'])
def ver_categorias():
    with sqlite3.connect('data.db') as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM categoria')
        categorias = cursor.fetchall()
    
    # Converte para uma lista de dicionários para facilitar o retorno
    result = [{'id': row[0], 'categoria': row[1]} for row in categorias]
    return jsonify(result), 200

# DELETE para remover uma categoria
@app.route('/api/categoria', methods=['DELETE'])
def deletar_categoria():
    data = request.get_json()
    categoria = data.get('categoria')

    if not categoria:
        return jsonify({'error': 'Categoria é obrigatória!'}), 400

    with sqlite3.connect('data.db') as conn:
        cursor = conn.cursor()
        # Verifica se a categoria existe
        cursor.execute('SELECT id FROM categoria WHERE categoria = ?', (categoria,))
        row = cursor.fetchone()

        if row:
            # Se existir, deleta a categoria
            cursor.execute('DELETE FROM categoria WHERE id = ?', (row[0],))
            conn.commit()
            return jsonify({'message': 'Categoria deletada com sucesso!'}), 200
        else:
            return jsonify({'error': 'Categoria não encontrada!'}), 404

if __name__ == '__main__':
    init_db()  # Inicializa o banco de dados na primeira execução
    app.run(debug=True)
