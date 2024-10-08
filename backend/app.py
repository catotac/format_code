from flask import Flask, request, jsonify
import autopep8
import black
import yapf
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/format', methods=['POST'])
def format_code():
    data = request.get_json()
    python_code = data.get('code', '')

    # Check for syntax validity before formatting
    if not is_valid_syntax(python_code):
        return jsonify({'error': 'Invalid Python syntax'}), 400

    # Step 1: Format the code using autopep8
    formatted_code = autopep8.fix_code(python_code)

    # Step 2: Apply Black formatting (handle possible errors)
    try:
        formatted_code = format_with_black(formatted_code)
    except Exception as e:
        print(f"Black formatting failed: {e}")

    # Step 3: Apply YAPF formatting (handle possible errors)
    try:
        formatted_code = format_with_yapf(formatted_code)
    except Exception as e:
        print(f"YAPF formatting failed: {e}")
        return jsonify({'error': f"YAPF formatting failed: {e}"}), 500

    return jsonify({'formatted_code': formatted_code})


def format_with_black(code):
    """Formats code with Black"""
    mode = black.FileMode()
    try:
        formatted_code = black.format_file_contents(code, fast=False, mode=mode)
    except black.NothingChanged:
        formatted_code = code
    return formatted_code


def format_with_yapf(code):
    """Formats code with YAPF"""
    formatted_code, _ = yapf.yapf_api.FormatCode(code)
    return formatted_code


def is_valid_syntax(code):
    """Checks if the Python code is syntactically valid"""
    try:
        compile(code, '<string>', 'exec')
        return True
    except SyntaxError as e:
        print(f"Syntax Error: {e}")
        return False


if __name__ == '__main__':
    app.run(debug=True)
