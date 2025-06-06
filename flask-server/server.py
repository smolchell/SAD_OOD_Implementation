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
json_format = jsonify({"message": 'login to view products'})

if 'loggedin' in  session:
    dbconn = cnntDB()
    cursor = dbconn.cursor()
    cursor.execute('SELECT * FROM inventory')
    
    columns = [column[0] for column in cursor.description]
    data = [dict(zip(columns, row)) for row in cursor.fetchall()]
    json_format = json.dumps(data, indent=4)
    cursor.close()
return json_format

@app.route("/order", methods=["GET", "POST"])
def order():
msg = ''

if 'loggedin' in  session:
    if 'customer' in  session['access']:
        dbconn = cnntDB()
        cursor = dbconn.cursor()
        customerID = session.get('id')
        itemsOrdered = 
        shipping =
        paymentOpt =
        total =
        
        if request.method == 'POST':
            cursor.execute('INSERT INTO orders VALUES \
            (NULL, %s, %s, %s, %s, %s)', (customerID, itemsOrdered, shipping, paymentOpt, total))
            dbconn.commit()
        else if request.method == 'GET':
            cursor.execute('SELECT * FROM orders WHERE customerID = %s', customerID)
            columns = [column[0] for column in cursor.description]
            data = [dict(zip(columns, row)) for row in cursor.fetchall()]
            json_format = json.dumps(data, indent=4)
            return json_format
        ##end if

        cursor.close()
return jsonify({"message": mssg})

@app.route("/addProduct", methods=["POST"])
def addProduct():
msg = ''

if 'loggedin' in  session:
    if 'staff' in  session['access']:
        dbconn = cnntDB()
        cursor = dbconn.cursor()
        name = 
        price = 
        description =
        quantity =
        imageURL =
        
        cursor.execute('INSERT INTO inventory \
        (NULL, %s, %s, %s, %s, %s)', (name, price, description, quantity, imageURL))
        dbconn.commit()
        
        mssg = f'new product {name} added'
        cursor.close()
return jsonify({"message": mssg})

@app.route("/updateProduct", methods=["POST"])
def updateProduct():
msg = ''

if 'loggedin' in  session:
    if 'staff' in  session['access']:
        dbconn = cnntDB()
        cursor = dbconn.cursor()
        productID = 
        name = 
        price = 
        description =
        quantity =
        imageURL =
        
        cursor.execute('UPDATE inventory \
        SET name = %s, price = %s, description = %s, quantity = %s, imageURL = %s \
        WHERE id = %d', (name, price, description, quantity, imageURL, productID))
        dbconn.commit()
        
        mssg = f'update to product {productID} successful'
        
        cursor.close()
return jsonify({"message": mssg})

@app.route("/deleteProduct", methods=["POST"])
def deleteProduct():
msg = ''

if 'loggedin' in  session:
    if 'staff' in  session['access']:
        dbconn = cnntDB()
        cursor = dbconn.cursor()
        productID = 
        
        cursor.execute('DELETE FROM inventory \
        WHERE id = %d', productID)
        dbconn.commit()
        
        mssg = f'deletion of product {productID} successful'
        
        cursor.close()
return jsonify({"message": mssg})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
