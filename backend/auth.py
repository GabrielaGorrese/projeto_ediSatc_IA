import hashlib
import secrets


def gerar_hash(senha):
    sal = secrets.token_hex(
        16)
    embaralhada = hashlib.pbkdf2_hmac(
        "sha256", senha.encode(), sal.encode(), 100_000
    ).hex()
    return f"{sal}${embaralhada}"


def verificar_senha(senha_digitada, hash_salvo):
    sal, embaralhada_salva = hash_salvo.split("$")
    embaralhada_agora = hashlib.pbkdf2_hmac(
        "sha256", senha_digitada.encode(), sal.encode(), 100_000
    ).hex()
    return secrets.compare_digest(embaralhada_agora, embaralhada_salva)
