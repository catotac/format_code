from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import autopep8
import black
import yapf

app = FastAPI()

# Request body structure using Pydantic
class CodeInput(BaseModel):
    code: str

@app.post("/format")
async def format_code(input: CodeInput):
    python_code = input.code

    # Check for syntax validity before formatting
    if not is_valid_syntax(python_code):
        raise HTTPException(status_code=400, detail="Syntax Error: Check for indentation or syntax issues")

    original_code = python_code  # Store original code in case of failure

    # Step 1: Format the code using autopep8
    try:
        python_code = autopep8.fix_code(python_code)
    except Exception as e:
        print(f"autopep8 failed: {e}")
        return {"formatted_code": original_code}  # Return original code if any error occurs

    # Step 2: Apply Black formatting (handle possible errors)
    try:
        python_code = format_with_black(python_code)
    except Exception as e:
        print(f"Black formatting failed: {e}")
        return {"formatted_code": original_code}  # Return original code if any error occurs

    # Step 3: Apply YAPF formatting (handle possible errors)
    try:
        python_code = format_with_yapf(python_code)
    except Exception as e:
        print(f"YAPF formatting failed: {e}")
        return {"formatted_code": original_code}  # Return original code if any error occurs

    return {"formatted_code": python_code}  # Return formatted code if successful


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
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)