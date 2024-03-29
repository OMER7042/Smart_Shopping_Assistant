from flask import Flask, jsonify, render_template, request, redirect, url_for
import os
from config import SQLITE_DATABASE_URI
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_smorest import Api, Blueprint, abort

app = Flask(__name__)
app.secret_key = os.urandom(24)

app.config['SQLALCHEMY_DATABASE_URI'] = SQLITE_DATABASE_URI
db = SQLAlchemy()
db.init_app(app)
migrate = Migrate(app, db)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String(100), nullable=False)
    brand_name = db.Column(db.String(100), nullable=False)
    vendor = db.Column(db.String(100), nullable=False,default = "No Vendor Data")
    price = db.Column(db.Float, default=0.0)
    in_list = db.Column(db.Boolean, default=False)
    

with app.app_context():
    db.create_all()

@app.route('/')
def index():
    result = db.session.execute(db.select(Product).order_by(Product.id)).scalars()
    products = [{'id': row.id, 'product_name': row.product_name, 'brand_name': row.brand_name, 'price': row.price if row.price is not None else '', 'vendor': row.vendor} for row in result]
    #products = Product.query.all()
    return render_template('index.html', products=products)

@app.route('/product/list')
def product_list():
    result = db.session.execute(db.select(Product).order_by(Product.id)).scalars()
    products = [{'id': row.id, 'product_name': row.product_name, 'brand_name': row.brand_name, 'price': row.price if row.price is not None else '', 'vendor': row.vendor} for row in result]
    return render_template('index.html', products=products)

@app.route('/product/add', methods=['GET', 'POST'])
def product_add():
    if request.method == 'POST':
        product = Product(
            product_name=request.form["product_name"],
            brand_name=request.form["brand_name"],
            vendor=request.form["vendor"],
            price=request.form["price"]
        )
        db.session.add(product)
        db.session.commit()
        return redirect(url_for('index'))
    return render_template('product.html')

@app.route("/product/<int:id>")
def product_detail(id):
    result = db.session.execute(db.select(Product).where(Product.id == id)).fetchone()
    product = [{'id': row.id, 'product_name': row.product_name, 'brand_name': row.brand_name, 'price': row.price if row.price is not None else '', 'vendor': row.vendor} for row in result]
    return product


@app.route("/product/<int:id>/delete", methods=["GET", "POST"])
def product_delete(id):
    product = db.get_or_404(Product, id)

    if request.method == "POST":
        db.session.delete(product)
        db.session.commit()
        return redirect(url_for("product_list"))

    return render_template("user/delete.html", product=product)

@app.route('/shopping_list/add/<int:product_id>', methods=['POST'])
def update_in_list(product_id):
    try:
        # Update in_list parameter for all products with the received product_id
        db.session.execute(
            Product.__table__.update()
            .where(Product.id == product_id)
            .values(in_list=True)
        )
        db.session.commit()
        return jsonify({'message': 'In_list parameter updated successfully for products with ID {}'.format(product_id)})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update in_list parameter for products with ID {}: {}'.format(product_id, str(e))}), 500

@app.route('/shopping_list/view', methods=['GET'])
def get_products_in_list():
    try:
        # Query products where in_list is true
        products = db.session.query(Product).filter(Product.in_list == True).all()

        # Convert products to a list of dictionaries
        products_list = [
            {'id': product.id, 'product_name': product.product_name, 'brand_name': product.brand_name, 'price': product.price, 'vendor': product.vendor}
            for product in products
        ]

        return jsonify({'products': products_list})
    except Exception as e:
        return jsonify({'error': 'Failed to fetch products with in_list=True: {}'.format(str(e))}), 500
    
@app.route('/shopping_list/delete/<int:product_id>', methods=['POST'])
def remove_from_list(product_id):
    try:
        # Update in_list parameter to false for the specified product_id
        db.session.execute(
            Product.__table__.update()
            .where(Product.id == product_id)
            .values(in_list=False)
        )
        db.session.commit()
        return jsonify({'message': 'Product with ID {} removed from the shopping list'.format(product_id)})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to remove product with ID {} from the shopping list: {}'.format(product_id, str(e))}), 500



if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
