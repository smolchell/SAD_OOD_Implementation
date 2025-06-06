from flask import Flask, request, jsonify, redirect, url_for, session, render_template
from flask_cors import CORS
import re
import pymysql

app = Flask(__name__)
CORS(app)

# In-memory user database
users = {}

@app.route("/register", methods=["POST"])
def register():
    msg = ''
    code = ''
    data = request.get_json()
    email = data.get("email")
    
    dbconn = cnntDB()
    cursor = dbconn.cursor()
    cursor.execute('SELECT * FROM AWE_staff WHERE email = % s \
        AND password = % s', (email, password, ))
    emailSearch = cursor.fetchone()
    
    if emailSearch:
        msg = "User already exists"
        code = 400
    else:
        fname = data.get("first_name")
        lname = data.get("last_name")
        dob = data.get("dob")
        password = data.get("password")
        cursor.execute('INSERT INTO customers VALUES \
        (NULL, %s, %s, %s, %s, %s)', (fname, lname, email, password, dob))
        dbconn.commit()
        msg = Registration successful
        code = 200
    
    cursor.close()
    return jsonify({"message": mssg}), code

@app.route("/login", methods=["POST"])
def login():
    msg = ''
    code = ''
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    
    if email != "" and password != "":
        dbconn = cnntDB()
        cursor = dbconn.cursor()
        cursor.execute('SELECT * FROM AWE_staff WHERE email = % s \
            AND password = % s', (email, password, ))
        account = cursor.fetchone()
        if account:
            session['loggedin'] = True
            session['id'] = account['id']
            session['username'] = account['email']
            session['access'] = 'customer'
            msg = 'Logged in successfully !'
            code = 200
        else:
            cursor.execute('SELECT * FROM customers WHERE email = % s \
            AND password = % s', (email, password, ))
            account = cursor.fetchone()
            if account:
                session['loggedin'] = True
                session['id'] = account['id']
                session['username'] = account['email']
                session['access'] = 'staff'
                msg = 'Logged in successfully !'
                code = 200
            else:
                msg = 'Incorrect email / password !'
                code = 400
        cursor.close()
    return  jsonify({"message": mssg}), code

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
    dbconn = cnntDB()
    cursor = dbconn.cursor()
    cursor.execute('SELECT * FROM inventory')
    
    columns = [column[0] for column in cursor.description]
    data = [dict(zip(columns, row)) for row in cursor.fetchall()]
    json_format = json.dumps(data, indent=4)
    cursor.close()
return json_format

if __name__ == "__main__":
    app.run(port=5000, debug=True)
