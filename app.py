from flask import Flask, request, jsonify, render_template
import sqlite3

app = Flask(__name__)

# Inicializa o banco de dados
def init_db():
    with sqlite3.connect('db.sqlite3') as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL
            )
        ''')
        conn.commit()

init_db()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/categories', methods=['POST'])
def create_category():
    data = request.get_json()
    name = data.get('name')
    if not name:
        return jsonify({'error': 'Nome da categoria é obrigatório.'}), 400

    with sqlite3.connect('db.sqlite3') as conn:
        cursor = conn.cursor()
        cursor.execute('INSERT INTO categories (name) VALUES (?)', (name,))
        conn.commit()
        return jsonify({'message': 'Categoria criada com sucesso!', 'name': name}), 201

@app.route('/api/categories', methods=['GET'])
def get_categories():
    with sqlite3.connect('db.sqlite3') as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT id, name FROM categories')
        categories = [{'id': row[0], 'name': row[1]} for row in cursor.fetchall()]
    return jsonify(categories), 200

@app.route('/api/categories/<int:category_id>', methods=['PUT'])
def update_category(category_id):
    try:
        data = request.get_json(force=True)
    except Exception as e:
        return jsonify({'error': 'Falha ao ler JSON da requisição.', 'details': str(e)}), 400

    new_name = data.get('name') if data else None
    if not new_name:
        return jsonify({'error': 'Nome novo é obrigatório.'}), 400

    with sqlite3.connect('db.sqlite3') as conn:
        cursor = conn.cursor()
        cursor.execute('UPDATE categories SET name = ? WHERE id = ?', (new_name, category_id))
        conn.commit()
        if cursor.rowcount == 0:
            return jsonify({'error': 'Categoria não encontrada.'}), 404

    return jsonify({'message': 'Categoria atualizada com sucesso!', 'name': new_name}), 200


@app.route('/api/categories/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    with sqlite3.connect('db.sqlite3') as conn:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM categories WHERE id = ?', (category_id,))
        conn.commit()
        if cursor.rowcount == 0:
            return jsonify({'error': 'Categoria não encontrada.'}), 404
    return jsonify({'message': 'Categoria deletada com sucesso!'}), 200

if __name__ == '__main__':
    app.run(debug=True)
