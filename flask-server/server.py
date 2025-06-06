from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# In-memory user database
users = {}
orders = []

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if email in users:
        return jsonify({"message": "User already exists"}), 400

    users[email] = {
        "email": email,
        "password": password,
        "name": data.get("name", "User")
    }
    return jsonify({"message": "Registration successful!", "user": users[email]}), 200


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = users.get(email)
    if not user:
        return jsonify({"message": "User not found"}), 404

    if user["password"] != password:
        return jsonify({"message": "Incorrect password"}), 401

    return jsonify({"message": "Login successful!", "user": user}), 200



@app.route("/")
def home():
    return jsonify({"message": "Welcome to the Home Page!"})


# Product:
# id : INT NOT NULL AUTO INCREMENT PRIMARY KEY
# name : VARCHAR(255)
# price : DOUBLE
# description : VARCHAR(255)
# picture_url : VARCHAR(255)

@app.route("/products", methods=["GET"])
def products():
    return [
        {   
            "id" : 1,
            "name" : "LG Smart TV",
            "price" : 299.99,
            "description" : "55 Inch, HDR colours, HDPI resolution",
            "picture_url" : "https://www.lg.com/content/dam/channel/wcms/au/images/tvs/50ut8050psb_aau_ehap_au_c/gallery/UT80_65_%2055_%2050__RIGHT-1600.jpg/_jcr_content/renditions/thum-1600x1062.jpeg"
        }
    ]


@app.route("/orders", methods=["POST"])
def place_order():
    order = request.get_json()
    orders.append(order)
    return jsonify({"message": "Order received", "orderId": len(orders)}), 201
    

@app.route("/orders", methods=["GET"])
def get_orders():
    return jsonify(orders)



if __name__ == "__main__":
    app.run(port=5000, debug=True)
