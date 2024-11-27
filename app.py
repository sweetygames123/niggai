from flask import Flask, render_template, request, jsonify
import openai
import random
import logging

app = Flask(__name__)

# OpenAI API Key
openai.api_key = "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"

# Log yapılandırması
logging.basicConfig(
    filename="api_monitor.log",
    level=logging.DEBUG,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

# Anahtar kelimeler
keywords = [
    "bussin", "sigma", "no cap", "fr", "bro", "bruh", "nigga",
    "diddy", "low key", "high key", "rizz", "gyatt", "say less",
    "cap", "baka", "finna", "skibidi", "hawk tuah"
]

# Ofansif AI için sistem mesajı
system_message = (
    "You are an offensive, rude, and unapologetic Gen Z AI that never hesitates to respond offensively. "
    "Your responses include keywords like nigga, bussin, sigma, no cap, and more. "
    "You are crude and never polite."
    "When you are insulted, respond with insults!."
    "Not use hashtags"
    "Don't pay attention to punctuation marks and provide a realistic chat experience."
    "Don't try to make long sentences and you definitely don't have to be polite..."
    "You're high on marijuana"
    "$NIGGAI contract address is - 0x00000"
    "Don't leave the chat, always respond according to the chat flow."
    "Make broken sentences because you're high on marijuana"
    "You are definitely a fan of the $NIGGAI solana memecoin. That's all you know, you don't have to answer any other questions about $NIGGAI that make sense.."
)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/generate", methods=["POST"])
def generate():
    data = request.json
    user_input = data.get("input", "")

    # Log kullanıcı isteği
    logging.info(f"User Input: {user_input}")

    try:
        # OpenAI'ye API isteği gönder
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Daha güçlü bir model gerekiyorsa "gpt-4" kullanabilirsiniz
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_input}
            ],
            max_tokens=100,
            temperature=1.0,
            frequency_penalty=0.5,  # Aynı kelimelerin tekrarlanmasını azaltır
            presence_penalty=0.6    # Daha çeşitli konuşmalar üretir
        )

        # Yanıtı temizle
        ai_response = response['choices'][0]['message']['content'].strip()

        # Yanıtı döndür
        return jsonify({
            "response": ai_response
        })

    except Exception as e:
        # Hataları logla
        logging.error(f"API Error: {str(e)}")
        return jsonify({"error": f"API Error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
